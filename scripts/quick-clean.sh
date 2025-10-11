#!/bin/bash

################################################################################
# Script de Limpieza Rapida - UAPA Smartphones
# Limpia la aplicacion sin afectar el sistema base
################################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "========================================================"
echo "  Limpieza Rapida - UAPA Smartphones"
echo "========================================================"
echo -e "${NC}\n"

# 1. Detener servicios
echo -e "${YELLOW}1. Deteniendo servicios...${NC}"
sudo systemctl stop uapa-smartphones 2>/dev/null && echo "   Servicio detenido" || echo "   Servicio no existe"
sudo systemctl disable uapa-smartphones 2>/dev/null || true

# 2. Eliminar archivos
echo -e "${YELLOW}2. Eliminando archivos...${NC}"
sudo rm -rf /var/www/uapa-smartphones && echo "   /var/www/uapa-smartphones eliminado" || true
sudo rm -rf ~/trabajo-final-software-libre && echo "   ~/trabajo-final-software-libre eliminado" || true

# 3. Eliminar configuraciones
echo -e "${YELLOW}3. Eliminando configuraciones...${NC}"
sudo rm -f /etc/systemd/system/uapa-smartphones.service && echo "   Servicio systemd eliminado" || true
sudo rm -f /etc/nginx/sites-enabled/uapa-smartphones && echo "   Nginx sites-enabled eliminado" || true
sudo rm -f /etc/nginx/sites-available/uapa-smartphones && echo "   Nginx sites-available eliminado" || true

# 4. Recargar demonios
echo -e "${YELLOW}4. Recargando demonios...${NC}"
sudo systemctl daemon-reload
sudo systemctl reload nginx 2>/dev/null || true

# 5. Limpiar MySQL
echo -e "${YELLOW}5. Limpiando base de datos MySQL...${NC}"
sudo mysql -e "DROP DATABASE IF EXISTS UapaSmartphones; DROP USER IF EXISTS 'admin'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null && echo "   Base de datos limpiada" || echo "   No habia base de datos"

# Resumen
echo ""
echo -e "${GREEN}========================================================"
echo "  Limpieza completada!"
echo "========================================================${NC}"
echo ""
echo -e "${CYAN}Ahora puedes ejecutar:${NC}"
echo "  cd ~"
echo "  git clone -b integracion-server-aplicacion https://github.com/Pav-gm/trabajo-final-software-libre.git"
echo "  cd trabajo-final-software-libre"
echo "  sudo bash scripts/deploy.sh"
echo ""

