#!/bin/bash

##############################################################################
# Script de Verificación Post-Instalación
# Verifica que todo esté funcionando correctamente después del despliegue
##############################################################################

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║     Verificación Post-Instalación - UAPA Smartphones   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

ERRORS=0

# 1. Verificar servicios
echo -e "${CYAN}🔍 Verificando servicios...${NC}"
echo "────────────────────────────────────────────────────────"

check_service() {
    if systemctl is-active --quiet "$1"; then
        echo -e "  $2: ${GREEN}✅ Activo${NC}"
        return 0
    else
        echo -e "  $2: ${RED}❌ Inactivo${NC}"
        ((ERRORS++))
        return 1
    fi
}

check_service "mysql" "MySQL"
check_service "nginx" "Nginx"
check_service "uapa-smartphones" "API Node.js"

# 2. Verificar puertos
echo -e "\n${CYAN}🔍 Verificando puertos...${NC}"
echo "────────────────────────────────────────────────────────"

check_port() {
    if netstat -tuln 2>/dev/null | grep -q ":$1 " || ss -tuln 2>/dev/null | grep -q ":$1 "; then
        echo -e "  Puerto $1: ${GREEN}✅ Escuchando${NC}"
        return 0
    else
        echo -e "  Puerto $1: ${RED}❌ No escuchando${NC}"
        ((ERRORS++))
        return 1
    fi
}

check_port "80"
check_port "3000"
check_port "3306"

# 3. Verificar archivos críticos
echo -e "\n${CYAN}🔍 Verificando archivos...${NC}"
echo "────────────────────────────────────────────────────────"

check_file() {
    if [ -f "$1" ]; then
        echo -e "  $2: ${GREEN}✅ Existe${NC}"
        return 0
    else
        echo -e "  $2: ${RED}❌ No encontrado${NC}"
        ((ERRORS++))
        return 1
    fi
}

check_file "/var/www/uapa-smartphones/.env" ".env"
check_file "/var/www/uapa-smartphones/src/server.js" "server.js"
check_file "/var/www/uapa-smartphones/src/public/index.html" "index.html"
check_file "/etc/nginx/sites-enabled/uapa-smartphones" "Nginx config"
check_file "/etc/systemd/system/uapa-smartphones.service" "Systemd service"

# 4. Verificar base de datos
echo -e "\n${CYAN}🔍 Verificando base de datos...${NC}"
echo "────────────────────────────────────────────────────────"

cd /var/www/uapa-smartphones 2>/dev/null || {
    echo -e "  ${RED}❌ No se pudo acceder al directorio de la app${NC}"
    ((ERRORS++))
}

if [ -f ".env" ]; then
    source .env 2>/dev/null || true
    
    DB_CHECK=$(mysql -h "${DB_HOST:-127.0.0.1}" -u "${DB_USER:-root}" -p"${DB_PASSWORD}" -e "USE ${DB_NAME:-UapaSmartphones}; SELECT COUNT(*) FROM productos;" 2>/dev/null | tail -n 1)
    
    if [ -n "$DB_CHECK" ]; then
        echo -e "  Conexión a BD: ${GREEN}✅ OK${NC}"
        echo -e "  Productos en BD: ${GREEN}$DB_CHECK${NC}"
    else
        echo -e "  Conexión a BD: ${RED}❌ Error${NC}"
        ((ERRORS++))
    fi
else
    echo -e "  ${YELLOW}⚠️  No se encontró .env, omitiendo verificación de BD${NC}"
fi

# 5. Verificar endpoints de la API
echo -e "\n${CYAN}🔍 Verificando endpoints de la API...${NC}"
echo "────────────────────────────────────────────────────────"

check_endpoint() {
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$1" 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "  $2: ${GREEN}✅ HTTP $HTTP_CODE${NC}"
        return 0
    else
        echo -e "  $2: ${RED}❌ HTTP ${HTTP_CODE:-000}${NC}"
        ((ERRORS++))
        return 1
    fi
}

LOCAL_IP=$(hostname -I | awk '{print $1}')

check_endpoint "http://127.0.0.1/api/buscarTodosLosProductos" "GET /api/buscarTodosLosProductos"
check_endpoint "http://127.0.0.1/api/buscarTodosLosClientes" "GET /api/buscarTodosLosClientes"
check_endpoint "http://127.0.0.1/" "GET / (Frontend)"

# 6. Verificar configuración de Nginx
echo -e "\n${CYAN}🔍 Verificando configuración de Nginx...${NC}"
echo "────────────────────────────────────────────────────────"

if nginx -t 2>&1 | grep -q "successful"; then
    echo -e "  Sintaxis Nginx: ${GREEN}✅ OK${NC}"
else
    echo -e "  Sintaxis Nginx: ${RED}❌ Error${NC}"
    ((ERRORS++))
fi

# Verificar que usa 127.0.0.1 (IPv4) y no localhost
if grep -q "proxy_pass http://127.0.0.1:3000" /etc/nginx/sites-available/uapa-smartphones 2>/dev/null; then
    echo -e "  proxy_pass IPv4: ${GREEN}✅ Correcto (127.0.0.1)${NC}"
else
    echo -e "  proxy_pass IPv4: ${YELLOW}⚠️  Usa 'localhost' (recomendado cambiar a 127.0.0.1)${NC}"
fi

# 7. Verificar variables de entorno
echo -e "\n${CYAN}🔍 Verificando variables de entorno...${NC}"
echo "────────────────────────────────────────────────────────"

if [ -f "/var/www/uapa-smartphones/.env" ]; then
    source /var/www/uapa-smartphones/.env 2>/dev/null || true
    
    [ -n "$DB_HOST" ] && echo -e "  DB_HOST: ${GREEN}$DB_HOST${NC}" || echo -e "  DB_HOST: ${RED}❌ No definido${NC}"
    [ -n "$DB_USER" ] && echo -e "  DB_USER: ${GREEN}$DB_USER${NC}" || echo -e "  DB_USER: ${RED}❌ No definido${NC}"
    [ -n "$DB_NAME" ] && echo -e "  DB_NAME: ${GREEN}$DB_NAME${NC}" || echo -e "  DB_NAME: ${RED}❌ No definido${NC}"
    
    if [ "$DB_HOST" = "127.0.0.1" ]; then
        echo -e "  Conexión IPv4: ${GREEN}✅ Forzada${NC}"
    elif [ "$DB_HOST" = "localhost" ]; then
        echo -e "  Conexión IPv4: ${YELLOW}⚠️  Usa 'localhost' (puede causar problemas IPv6)${NC}"
    fi
fi

# Resumen final
echo -e "\n${CYAN}═══════════════════════════════════════════════════════${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║                                                        ║"
    echo "║         ✅  TODO FUNCIONANDO CORRECTAMENTE  ✅         ║"
    echo "║                                                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    echo -e "${GREEN}🎉 La aplicación está lista para usar${NC}\n"
    echo -e "${CYAN}🌐 Accede desde tu navegador:${NC}"
    echo -e "   http://$LOCAL_IP"
    echo ""
    echo -e "${CYAN}📝 Comandos útiles:${NC}"
    echo "   Ver logs:     sudo journalctl -u uapa-smartphones -f"
    echo "   Reiniciar:    sudo systemctl restart uapa-smartphones"
    echo "   Estado:       sudo systemctl status uapa-smartphones"
    echo ""
else
    echo -e "${RED}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║                                                        ║"
    echo "║        ⚠️  SE ENCONTRARON $ERRORS ERRORES  ⚠️               ║"
    echo "║                                                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    echo -e "${YELLOW}🔧 Acciones sugeridas:${NC}"
    echo "   1. Revisa los logs: sudo journalctl -u uapa-smartphones -n 50"
    echo "   2. Verifica .env: cat /var/www/uapa-smartphones/.env"
    echo "   3. Reinicia servicios: sudo systemctl restart uapa-smartphones nginx"
    echo ""
fi

exit $ERRORS

