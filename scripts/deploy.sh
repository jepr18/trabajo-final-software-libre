#!/bin/bash

################################################################################
# Script de Despliegue - UAPA Smartphones API
# Proyecto Final - Software Libre
#
# Este script automatiza el despliegue de la aplicación en un servidor 
# GNU/Linux con NGINX y MySQL
################################################################################

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables
APP_NAME="uapa-smartphones"
APP_DIR="/var/www/uapa-smartphones"
NODE_VERSION="18"

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║        SCRIPT DE DESPLIEGUE - UAPA Smartphones         ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Función para imprimir mensajes
print_message() {
    echo -e "${2}${1}${NC}"
}

# Función para verificar errores
check_error() {
    if [ $? -ne 0 ]; then
        print_message "❌ Error: $1" "$RED"
        exit 1
    fi
}

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    print_message "⚠️  Este script debe ejecutarse como root (usa sudo)" "$YELLOW"
    exit 1
fi

# 1. Actualizar sistema
print_message "\n📦 Actualizando sistema..." "$BLUE"
apt update && apt upgrade -y
check_error "Falló la actualización del sistema"
print_message "✅ Sistema actualizado\n" "$GREEN"

# 2. Instalar Node.js
print_message "📦 Instalando Node.js ${NODE_VERSION}..." "$BLUE"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs
    check_error "Falló la instalación de Node.js"
fi
print_message "✅ Node.js $(node --version) instalado\n" "$GREEN"

# 3. Instalar MySQL
print_message "📦 Instalando MySQL Server..." "$BLUE"
if ! command -v mysql &> /dev/null; then
    apt install -y mysql-server
    check_error "Falló la instalación de MySQL"
    systemctl start mysql
    systemctl enable mysql
fi
print_message "✅ MySQL instalado\n" "$GREEN"

# 4. Instalar NGINX
print_message "📦 Instalando NGINX..." "$BLUE"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    check_error "Falló la instalación de NGINX"
    systemctl start nginx
    systemctl enable nginx
fi
print_message "✅ NGINX instalado\n" "$GREEN"

# 5. Crear directorio de aplicación
print_message "📁 Configurando directorio de aplicación..." "$BLUE"
mkdir -p $APP_DIR
cd $APP_DIR
print_message "✅ Directorio creado: $APP_DIR\n" "$GREEN"

# 6. Clonar o copiar aplicación
print_message "📥 Desplegando aplicación..." "$BLUE"
if [ -d ".git" ]; then
    git pull
else
    print_message "⚠️  Copia los archivos de la aplicación a $APP_DIR" "$YELLOW"
    print_message "   Presiona Enter cuando hayas copiado los archivos..." "$YELLOW"
    read
fi

# 7. Instalar dependencias de Node.js
print_message "📦 Instalando dependencias de Node.js..." "$BLUE"
npm install
check_error "Falló la instalación de dependencias"
print_message "✅ Dependencias instaladas\n" "$GREEN"

# 8. Configurar variables de entorno
print_message "⚙️  Configurando variables de entorno..." "$BLUE"
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_message "⚠️  Edita el archivo .env con tus credenciales de MySQL" "$YELLOW"
    print_message "   Presiona Enter cuando hayas editado .env..." "$YELLOW"
    read
fi
print_message "✅ Variables de entorno configuradas\n" "$GREEN"

# 9. Configurar MySQL
print_message "🔧 Configurando base de datos..." "$BLUE"
print_message "⚠️  Ejecutando script de inicialización de BD..." "$YELLOW"
npm run setup:db
check_error "Falló la configuración de la base de datos"
print_message "✅ Base de datos configurada\n" "$GREEN"

# 10. Configurar NGINX
print_message "🔧 Configurando NGINX..." "$BLUE"
cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Habilitar sitio
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t
check_error "Error en la configuración de NGINX"

systemctl restart nginx
print_message "✅ NGINX configurado\n" "$GREEN"

# 11. Configurar systemd service
print_message "🔧 Configurando servicio systemd..." "$BLUE"
cat > /etc/systemd/system/$APP_NAME.service << EOF
[Unit]
Description=UAPA Smartphones API
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node $APP_DIR/src/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=$APP_NAME
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable $APP_NAME
systemctl start $APP_NAME
check_error "Falló el inicio del servicio"
print_message "✅ Servicio configurado e iniciado\n" "$GREEN"

# 12. Configurar firewall
print_message "🔥 Configurando firewall..." "$BLUE"
if command -v ufw &> /dev/null; then
    ufw allow 'Nginx Full'
    ufw allow OpenSSH
    ufw --force enable
    print_message "✅ Firewall configurado\n" "$GREEN"
fi

# Resumen final
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║           ✅  DESPLIEGUE COMPLETADO  ✅                ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

print_message "🎉 La aplicación ha sido desplegada exitosamente!" "$GREEN"
print_message "\n📊 Estado de los servicios:" "$CYAN"
echo "────────────────────────────────────────────────────────"

systemctl is-active --quiet mysql && echo -e "  MySQL:      ${GREEN}✅ Activo${NC}" || echo -e "  MySQL:      ${RED}❌ Inactivo${NC}"
systemctl is-active --quiet nginx && echo -e "  NGINX:      ${GREEN}✅ Activo${NC}" || echo -e "  NGINX:      ${RED}❌ Inactivo${NC}"
systemctl is-active --quiet $APP_NAME && echo -e "  API:        ${GREEN}✅ Activo${NC}" || echo -e "  API:        ${RED}❌ Inactivo${NC}"

print_message "\n🌐 Acceso a la aplicación:" "$CYAN"
echo "────────────────────────────────────────────────────────"
print_message "  URL: http://$(hostname -I | awk '{print $1}')" "$CYAN"
print_message "  Puerto: 80 (HTTP)" "$CYAN"

print_message "\n📝 Comandos útiles:" "$CYAN"
echo "────────────────────────────────────────────────────────"
echo "  Ver logs:           journalctl -u $APP_NAME -f"
echo "  Reiniciar servicio: systemctl restart $APP_NAME"
echo "  Estado servicio:    systemctl status $APP_NAME"
echo "  Detener servicio:   systemctl stop $APP_NAME"
echo ""

print_message "✨ ¡Despliegue completado exitosamente!" "$GREEN"

