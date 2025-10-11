# 🚀 Guía de Despliegue - UAPA Smartphones

Esta guía te permitirá desplegar la aplicación desde cero en una VM Linux de forma **limpia y automatizada**.

---

## 📋 Requisitos Previos

- **VM Linux** (Ubuntu 20.04+ o Debian 11+)
- **Acceso root** (sudo)
- **Conexión a Internet**
- **2GB RAM mínimo**
- **10GB espacio en disco**

---

## 🎯 Despliegue Rápido (Método Recomendado)

### 1️⃣ Clonar el Repositorio

```bash
cd ~
git clone https://github.com/jepr18/trabajo-final-software-libre
cd trabajo-final-software-libre
```

### 2️⃣ Ejecutar el Script de Despliegue

```bash
sudo chmod +x scripts/deploy.sh
sudo ./scripts/deploy.sh
```

El script instalará y configurará automáticamente:
- ✅ Node.js 18
- ✅ MySQL Server
- ✅ Nginx
- ✅ Dependencias npm
- ✅ Base de datos
- ✅ Servicio systemd
- ✅ Firewall

### 3️⃣ Verificar el Despliegue

```bash
sudo chmod +x scripts/post-install-verify.sh
sudo ./scripts/post-install-verify.sh
```

### 4️⃣ Acceder a la Aplicación

Desde tu PC, abre el navegador:
```
http://IP_DE_TU_VM
```

**Para obtener la IP de tu VM:**
```bash
hostname -I | awk '{print $1}'
```

---

## 🧹 Limpiar Instalación Previa

Si ya tienes una instalación y quieres empezar de cero:

```bash
sudo chmod +x scripts/remove-deployment.sh
sudo ./scripts/remove-deployment.sh
```

Este script eliminará:
- ❌ Servicio systemd
- ❌ Configuración de Nginx
- ❌ Archivos de la aplicación
- ❌ Base de datos (opcional)

---

## 🔧 Configuración Manual (Opcional)

Si prefieres configurar manualmente:

### 1. Instalar Dependencias del Sistema

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs

# Instalar MySQL
sudo apt install -y mysql-server

# Instalar Nginx
sudo apt install -y nginx
```

### 2. Clonar y Configurar la Aplicación

```bash
# Crear directorio
sudo mkdir -p /var/www/uapa-smartphones
sudo chown $USER:$USER /var/www/uapa-smartphones

# Clonar repositorio
cd /var/www/uapa-smartphones
git clone https://github.com/jepr18/trabajo-final-software-libre .

# Instalar dependencias
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar plantilla
cp .env.production .env

# Editar configuración
nano .env
```

**Contenido del `.env`:**
```env
PORT=3000
NODE_ENV=production

# ⚠️ IMPORTANTE: Usar 127.0.0.1 (NO localhost)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=UapaSmartphones

APP_NAME=UAPA Smartphones API
APP_VERSION=1.0.0
CORS_ORIGIN=*
LOG_LEVEL=info
```

### 4. Configurar MySQL

```bash
# Configurar contraseña de root
sudo mysql

# En el prompt de MySQL:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_password_segura';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Inicializar base de datos
npm run setup:db
```

### 5. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/uapa-smartphones
```

**Contenido:**
```nginx
server {
    listen 80;
    server_name _;

    root /var/www/uapa-smartphones/src/public;
    index index.html;

    # API (IMPORTANTE: usar 127.0.0.1, NO localhost)
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/uapa-smartphones /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 6. Configurar Servicio Systemd

```bash
sudo nano /etc/systemd/system/uapa-smartphones.service
```

**Contenido:**
```ini
[Unit]
Description=UAPA Smartphones API
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/uapa-smartphones
ExecStart=/usr/bin/node /var/www/uapa-smartphones/src/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=uapa-smartphones
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar e iniciar servicio
sudo systemctl daemon-reload
sudo systemctl enable uapa-smartphones
sudo systemctl start uapa-smartphones
```

### 7. Configurar Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 📊 Verificación y Monitoreo

### Verificar Estado de Servicios

```bash
# Estado de la API
sudo systemctl status uapa-smartphones

# Estado de Nginx
sudo systemctl status nginx

# Estado de MySQL
sudo systemctl status mysql
```

### Ver Logs

```bash
# Logs de la API (en tiempo real)
sudo journalctl -u uapa-smartphones -f

# Últimas 50 líneas
sudo journalctl -u uapa-smartphones -n 50

# Logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Verificar Puertos

```bash
# Puertos escuchando
sudo netstat -tulpn | grep -E ':(80|3000|3306)'

# O con ss
sudo ss -tulpn | grep -E ':(80|3000|3306)'
```

### Probar Endpoints

```bash
# Desde la VM
curl http://127.0.0.1/api/buscarTodosLosProductos

# Desde tu PC
curl http://IP_DE_TU_VM/api/buscarTodosLosProductos
```

---

## 🔧 Comandos Útiles

### Gestión del Servicio

```bash
# Iniciar
sudo systemctl start uapa-smartphones

# Detener
sudo systemctl stop uapa-smartphones

# Reiniciar (aplicar cambios)
sudo systemctl restart uapa-smartphones

# Ver estado
sudo systemctl status uapa-smartphones

# Habilitar auto-inicio
sudo systemctl enable uapa-smartphones

# Deshabilitar auto-inicio
sudo systemctl disable uapa-smartphones
```

### Reiniciar Todo

```bash
sudo systemctl restart uapa-smartphones nginx mysql
```

### Actualizar el Código

```bash
cd /var/www/uapa-smartphones
sudo git pull
sudo npm install
sudo systemctl restart uapa-smartphones
```

---

## 🐛 Solución de Problemas

### Error: `ECONNREFUSED ::1:3306`

**Causa:** Node.js intenta conectar por IPv6 pero MySQL solo escucha en IPv4.

**Solución:**
```bash
# En .env, usar 127.0.0.1 (NO localhost)
DB_HOST=127.0.0.1
```

### Error: `Access denied for user 'root'@'localhost'`

**Causa:** Contraseña incorrecta o usuario sin permisos.

**Solución:**
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'nueva_password';
GRANT ALL PRIVILEGES ON UapaSmartphones.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Actualizar .env
DB_PASSWORD=nueva_password
```

### Error: `504 Gateway Time-out` (Nginx)

**Causa:** Nginx intenta proxy_pass a localhost que resuelve a IPv6.

**Solución:**
```bash
# En /etc/nginx/sites-available/uapa-smartphones
# Cambiar:
proxy_pass http://localhost:3000;
# Por:
proxy_pass http://127.0.0.1:3000;

sudo nginx -t
sudo systemctl reload nginx
```

### Frontend no se conecta a la API

**Causa:** `main.js` tiene URLs absolutas con `http://localhost:3000`.

**Solución:**
```bash
# Eliminar localhost de las URLs
sudo sed -i 's|http://localhost:3000||g' /var/www/uapa-smartphones/src/public/js/main.js

# Romper caché del navegador
sudo sed -i 's|/js/main.js"|/js/main.js?v=2"|' /var/www/uapa-smartphones/src/public/index.html

# Recargar Nginx
sudo systemctl reload nginx

# En el navegador: Ctrl+Shift+R (hard refresh)
```

### La aplicación no inicia al reiniciar la VM

**Causa:** Servicio no está habilitado.

**Solución:**
```bash
sudo systemctl enable uapa-smartphones
sudo systemctl enable nginx
sudo systemctl enable mysql
```

---

## 🌐 Configuración de Red

### Modo Bridge (Recomendado)

1. En VirtualBox/VMware: Configurar adaptador en modo Bridge
2. La VM obtendrá IP de tu router (misma red que tu PC)
3. Acceder desde el PC: `http://IP_DE_LA_VM`

### Modo NAT con Port Forwarding

1. En VirtualBox: Configuración → Red → Avanzado → Reenvío de puertos
2. Agregar regla:
   - Host Port: `8080`
   - Guest Port: `80`
3. Acceder desde el PC: `http://localhost:8080`

---

## 📝 Checklist de Despliegue

- [ ] VM Linux instalada y actualizada
- [ ] Node.js 18+ instalado
- [ ] MySQL instalado y configurado
- [ ] Nginx instalado y configurado
- [ ] Repositorio clonado en `/var/www/uapa-smartphones`
- [ ] `npm install` ejecutado
- [ ] `.env` configurado con `DB_HOST=127.0.0.1`
- [ ] Base de datos inicializada (`npm run setup:db`)
- [ ] Nginx configurado con `proxy_pass http://127.0.0.1:3000`
- [ ] Servicio systemd creado y habilitado
- [ ] Firewall configurado (puerto 80 abierto)
- [ ] Red configurada (Bridge o Port Forwarding)
- [ ] Aplicación accesible desde el navegador
- [ ] Frontend se conecta correctamente a la API

---

## 🎓 Proyecto Final - Software Libre

Este despliegue cumple con los requisitos del Proyecto Final:

- ✅ **RA8**: Utiliza diseño y codificación con software libre (Node.js, MySQL, Nginx)
- ✅ **RA9**: Emplea patrones de diseño (MVC, API REST, arquitectura cliente-servidor)
- ✅ **RA10**: Aplica pruebas de software (funcionales y de rendimiento)

**Reutilización de infraestructura:**
- ✅ Servidor GNU/Linux (Práctica 1)
- ✅ SGBD MySQL (Práctica 2)
- ✅ Servidor Web Nginx (Práctica 3)

---

## 📚 Recursos Adicionales

- [Documentación de Node.js](https://nodejs.org/docs/)
- [Documentación de MySQL](https://dev.mysql.com/doc/)
- [Documentación de Nginx](https://nginx.org/en/docs/)
- [Systemd para principiantes](https://www.freedesktop.org/software/systemd/man/)

---

## 🤝 Soporte

Si encuentras problemas:

1. Revisa esta guía completa
2. Consulta la sección de "Solución de Problemas"
3. Ejecuta el script de verificación: `sudo ./scripts/post-install-verify.sh`
4. Revisa los logs: `sudo journalctl -u uapa-smartphones -n 100`

---

**¡Despliegue exitoso! 🎉**

