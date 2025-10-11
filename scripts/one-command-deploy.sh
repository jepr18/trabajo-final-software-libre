#!/bin/bash

################################################################################
# Script de Limpieza + Despliegue Completo
# Ejecuta limpieza, clonado y despliegue en un solo comando
################################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "========================================================"
echo "  Limpieza y Despliegue Automatico - UAPA Smartphones"
echo "========================================================"
echo -e "${NC}\n"

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Este script debe ejecutarse como root (usa sudo)${NC}"
    exit 1
fi

# FASE 1: LIMPIEZA
echo -e "${YELLOW}=== FASE 1: LIMPIEZA ===${NC}\n"

echo "Deteniendo servicios..."
systemctl stop uapa-smartphones 2>/dev/null || true
systemctl disable uapa-smartphones 2>/dev/null || true

echo "Eliminando archivos..."
rm -rf /var/www/uapa-smartphones
rm -rf /home/*/trabajo-final-software-libre

echo "Eliminando configuraciones..."
rm -f /etc/systemd/system/uapa-smartphones.service
rm -f /etc/nginx/sites-enabled/uapa-smartphones
rm -f /etc/nginx/sites-available/uapa-smartphones

echo "Recargando servicios..."
systemctl daemon-reload
systemctl reload nginx 2>/dev/null || true

echo "Limpiando MySQL..."
mysql -e "DROP DATABASE IF EXISTS UapaSmartphones; DROP USER IF EXISTS 'admin'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null || true

echo -e "${GREEN}Limpieza completada!${NC}\n"

# FASE 2: CLONADO
echo -e "${YELLOW}=== FASE 2: CLONADO ===${NC}\n"

cd /tmp
rm -rf trabajo-final-software-libre 2>/dev/null || true

echo "Clonando repositorio..."
git clone -b integracion-server-aplicacion https://github.com/Pav-gm/trabajo-final-software-libre.git
cd trabajo-final-software-libre

echo "Verificando version..."
git log --oneline -1

echo -e "${GREEN}Repositorio clonado!${NC}\n"

# FASE 3: DESPLIEGUE
echo -e "${YELLOW}=== FASE 3: DESPLIEGUE ===${NC}\n"

bash scripts/deploy.sh

echo ""
echo -e "${GREEN}========================================================"
echo "  PROCESO COMPLETADO!"
echo "========================================================${NC}"
echo ""

