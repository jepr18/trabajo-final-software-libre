#!/bin/bash

##############################################################################
# Script de Limpieza Completa del Despliegue
# Elimina TODO lo relacionado con uapa-smartphones para empezar de cero
##############################################################################

set -e

echo "=========================================="
echo "🧹 Limpieza Completa de UAPA Smartphones"
echo "=========================================="
echo ""
echo "⚠️  ADVERTENCIA: Esto eliminará:"
echo "   - Servicio systemd"
echo "   - Configuración de Nginx"
echo "   - Archivos de la aplicación"
echo "   - Base de datos MySQL (opcional)"
echo ""
read -p "¿Deseas continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelado por el usuario"
    exit 1
fi

echo ""
read -p "¿Eliminar también la base de datos MySQL? (y/N): " -n 1 -r
echo
DROP_DB=$REPLY

# 1. Detener y deshabilitar el servicio systemd
echo "🛑 Deteniendo servicio uapa-smartphones..."
if systemctl is-active --quiet uapa-smartphones; then
    sudo systemctl stop uapa-smartphones
    echo "   ✓ Servicio detenido"
fi

if systemctl is-enabled --quiet uapa-smartphones 2>/dev/null; then
    sudo systemctl disable uapa-smartphones
    echo "   ✓ Servicio deshabilitado"
fi

if [ -f /etc/systemd/system/uapa-smartphones.service ]; then
    sudo rm /etc/systemd/system/uapa-smartphones.service
    echo "   ✓ Archivo de servicio eliminado"
fi

sudo systemctl daemon-reload
echo "   ✓ Systemd recargado"

# 2. Eliminar configuración de Nginx
echo ""
echo "🌐 Eliminando configuración de Nginx..."
if [ -L /etc/nginx/sites-enabled/uapa-smartphones ]; then
    sudo rm /etc/nginx/sites-enabled/uapa-smartphones
    echo "   ✓ Enlace simbólico eliminado"
fi

if [ -f /etc/nginx/sites-available/uapa-smartphones ]; then
    sudo rm /etc/nginx/sites-available/uapa-smartphones
    echo "   ✓ Configuración eliminada"
fi

sudo systemctl reload nginx
echo "   ✓ Nginx recargado"

# 3. Eliminar archivos de la aplicación
echo ""
echo "📁 Eliminando archivos de la aplicación..."
if [ -d /var/www/uapa-smartphones ]; then
    sudo rm -rf /var/www/uapa-smartphones
    echo "   ✓ Directorio /var/www/uapa-smartphones eliminado"
fi

# 4. Eliminar base de datos (opcional)
if [[ $DROP_DB =~ ^[Yy]$ ]]; then
    echo ""
    echo "🗄️  Eliminando base de datos..."
    read -sp "Contraseña de MySQL root: " MYSQL_ROOT_PASSWORD
    echo
    
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<EOF 2>/dev/null || echo "   ⚠️  Error al eliminar BD (puede no existir)"
DROP DATABASE IF EXISTS UapaSmartphones;
DROP USER IF EXISTS 'admin'@'localhost';
FLUSH PRIVILEGES;
EOF
    echo "   ✓ Base de datos y usuario eliminados"
fi

# 5. Limpiar reglas de firewall (opcional)
echo ""
read -p "¿Cerrar puertos del firewall (80, 3000)? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔥 Cerrando puertos..."
    sudo ufw delete allow 80/tcp 2>/dev/null || echo "   ⚠️  Puerto 80 no estaba abierto"
    sudo ufw delete allow 3000/tcp 2>/dev/null || echo "   ⚠️  Puerto 3000 no estaba abierto"
    echo "   ✓ Puertos cerrados"
fi

echo ""
echo "=========================================="
echo "✅ Limpieza completa finalizada"
echo "=========================================="
echo ""
echo "Ahora puedes volver a desplegar con:"
echo "  git clone https://github.com/jepr18/trabajo-final-software-libre"
echo "  cd trabajo-final-software-libre"
echo "  sudo chmod +x scripts/deploy.sh"
echo "  sudo ./scripts/deploy.sh"
echo ""

