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

# Detectar desde dónde se está ejecutando el script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Si el script se ejecuta desde un directorio clonado, copiar desde ahí
if [ -f "$PROJECT_ROOT/package.json" ] && [ -f "$PROJECT_ROOT/src/server.js" ]; then
    print_message "📦 Detectado proyecto en: $PROJECT_ROOT" "$CYAN"
    print_message "📥 Copiando archivos a $APP_DIR..." "$BLUE"
    
    # Crear directorio si no existe
    mkdir -p $APP_DIR
    
    # Copiar todos los archivos del proyecto
    cp -r "$PROJECT_ROOT"/* $APP_DIR/ 2>/dev/null || true
    cp -r "$PROJECT_ROOT"/.env.example $APP_DIR/ 2>/dev/null || true
    cp -r "$PROJECT_ROOT"/.gitignore $APP_DIR/ 2>/dev/null || true
    cp -r "$PROJECT_ROOT"/.git $APP_DIR/ 2>/dev/null || true
    
    print_message "✅ Archivos copiados correctamente" "$GREEN"
elif [ -d "$APP_DIR/.git" ]; then
    print_message "📥 Actualizando repositorio existente..." "$BLUE"
    cd $APP_DIR
    git pull
    print_message "✅ Repositorio actualizado" "$GREEN"
else
    print_message "⚠️  No se detectó un repositorio clonado" "$YELLOW"
    print_message "   Opciones:" "$YELLOW"
    echo "   1. Ejecuta este script desde el directorio del proyecto clonado"
    echo "   2. O clona manualmente en $APP_DIR:"
    echo "      git clone https://github.com/Pav-gm/trabajo-final-software-libre $APP_DIR"
    exit 1
fi

cd $APP_DIR
print_message "✅ Directorio configurado: $APP_DIR\n" "$GREEN"

# 7. Instalar dependencias de Node.js
print_message "📦 Instalando dependencias de Node.js..." "$BLUE"
npm install
check_error "Falló la instalación de dependencias"
print_message "✅ Dependencias instaladas\n" "$GREEN"

# 8. Configurar variables de entorno
print_message "⚙️  Configurando variables de entorno..." "$BLUE"

# Solicitar credenciales de MySQL
echo ""
print_message "📝 Configuración de MySQL:" "$CYAN"
read -p "   Usuario de MySQL (default: admin): " MYSQL_USER
MYSQL_USER=${MYSQL_USER:-admin}

read -sp "   Contraseña de MySQL: " MYSQL_PASSWORD
echo ""

if [ -z "$MYSQL_PASSWORD" ]; then
    print_message "❌ La contraseña no puede estar vacía" "$RED"
    exit 1
fi

# Crear .env con las credenciales proporcionadas
cat > .env << ENVEOF
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration (USAR 127.0.0.1 para forzar IPv4)
DB_HOST=127.0.0.1
DB_USER=$MYSQL_USER
DB_PASSWORD=$MYSQL_PASSWORD
DB_NAME=UapaSmartphones
DB_PORT=3306

# Application Configuration
APP_NAME=UAPA Smartphones API
APP_VERSION=1.0.0

# CORS Configuration
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
ENVEOF

print_message "✅ Variables de entorno configuradas\n" "$GREEN"

# 9. Configurar MySQL
print_message "🔧 Configurando base de datos..." "$BLUE"

# Verificar que MySQL está corriendo
if ! systemctl is-active --quiet mysql; then
    print_message "⚠️  MySQL no está corriendo, iniciándolo..." "$YELLOW"
    systemctl start mysql
    sleep 3
fi

print_message "✅ MySQL está corriendo" "$GREEN"

# Crear usuario MySQL si no existe (usando root con sudo)
print_message "👤 Verificando/creando usuario MySQL '$MYSQL_USER'..." "$BLUE"
sudo mysql -e "
CREATE USER IF NOT EXISTS '$MYSQL_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER'@'localhost';
FLUSH PRIVILEGES;
" 2>/dev/null || print_message "   ⚠️  Usuario ya existe o no se pudo crear (continuando...)" "$YELLOW"

# Verificar conexión con las credenciales proporcionadas
print_message "🔍 Verificando conexión a MySQL..." "$BLUE"
if mysql -h 127.0.0.1 -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1;" &>/dev/null; then
    print_message "✅ Conexión exitosa con MySQL" "$GREEN"
else
    print_message "❌ No se pudo conectar a MySQL con las credenciales proporcionadas" "$RED"
    print_message "   Usuario: $MYSQL_USER" "$YELLOW"
    print_message "   Host: 127.0.0.1" "$YELLOW"
    exit 1
fi

# Ejecutar SQL directamente (más confiable que npm run setup:db)
print_message "📊 Inicializando base de datos..." "$BLUE"
if [ -f "src/database/database.sql" ]; then
    # Ejecutar el SQL con el usuario configurado
    mysql -h 127.0.0.1 -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" < src/database/database.sql 2>&1 | tee /tmp/mysql-setup.log
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_message "✅ Base de datos inicializada correctamente" "$GREEN"
        
        # Verificar que se crearon los datos
        PRODUCT_COUNT=$(mysql -h 127.0.0.1 -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -sN -e "SELECT COUNT(*) FROM UapaSmartphones.productos;" 2>/dev/null || echo "0")
        CLIENT_COUNT=$(mysql -h 127.0.0.1 -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -sN -e "SELECT COUNT(*) FROM UapaSmartphones.clientes;" 2>/dev/null || echo "0")
        
        print_message "   📦 Productos insertados: $PRODUCT_COUNT" "$CYAN"
        print_message "   👥 Clientes insertados: $CLIENT_COUNT" "$CYAN"
        
        if [ "$PRODUCT_COUNT" -gt 0 ] && [ "$CLIENT_COUNT" -gt 0 ]; then
            print_message "✅ Datos de prueba cargados correctamente\n" "$GREEN"
        else
            print_message "⚠️  Base de datos creada pero sin datos de prueba" "$YELLOW"
            print_message "   Revisa /tmp/mysql-setup.log para más detalles\n" "$YELLOW"
        fi
    else
        print_message "❌ Error al inicializar la base de datos" "$RED"
        print_message "   Revisa /tmp/mysql-setup.log para más detalles" "$YELLOW"
        print_message "   O ejecuta manualmente: mysql -h 127.0.0.1 -u $MYSQL_USER -p < src/database/database.sql" "$YELLOW"
        exit 1
    fi
else
    print_message "❌ No se encontró src/database/database.sql" "$RED"
    exit 1
fi

# 10. Configurar NGINX (con corrección IPv4)
print_message "🔧 Configurando NGINX..." "$BLUE"
cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80;
    server_name _;

    # Ruta raíz de la aplicación
    root /var/www/uapa-smartphones/src/public;
    index index.html;

    # Proxy para la API (FORZAR IPv4 con 127.0.0.1)
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts aumentados
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Servir archivos estáticos directamente
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para recursos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1d;
        add_header Cache-Control "public, immutable";
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

