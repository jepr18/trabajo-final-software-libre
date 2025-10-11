# 📂 Scripts de Automatización

Esta carpeta contiene scripts para automatizar el despliegue, limpieza y verificación de la aplicación.

---

## 📜 Lista de Scripts

### 🚀 `deploy.sh` - Despliegue Automatizado

Despliega completamente la aplicación en un servidor Linux.

**Uso:**
```bash
sudo chmod +x scripts/deploy.sh
sudo ./scripts/deploy.sh
```

**Qué hace:**
- ✅ Instala Node.js, MySQL, Nginx
- ✅ Instala dependencias npm
- ✅ Configura variables de entorno
- ✅ Inicializa la base de datos
- ✅ Configura Nginx como proxy reverso
- ✅ Crea servicio systemd
- ✅ Configura firewall
- ✅ Verifica estado de servicios

**Correcciones aplicadas:**
- Usa `127.0.0.1` en lugar de `localhost` para forzar IPv4
- Configura timeouts en Nginx
- Crea .env con valores seguros por defecto
- Fallback a ejecución directa de SQL si npm falla

---

### 🧹 `remove-deployment.sh` - Limpieza Completa

Elimina completamente una instalación previa para empezar de cero.

**Uso:**
```bash
sudo chmod +x scripts/remove-deployment.sh
sudo ./scripts/remove-deployment.sh
```

**Qué elimina:**
- ❌ Servicio systemd
- ❌ Configuración de Nginx
- ❌ Archivos de `/var/www/uapa-smartphones`
- ❌ Base de datos (opcional)
- ❌ Reglas de firewall (opcional)

**⚠️ ADVERTENCIA:** Este script es DESTRUCTIVO. Úsalo solo si quieres empezar de cero.

---

### ✅ `post-install-verify.sh` - Verificación Post-Instalación

Verifica que todo esté funcionando correctamente después del despliegue.

**Uso:**
```bash
sudo chmod +x scripts/post-install-verify.sh
sudo ./scripts/post-install-verify.sh
```

**Qué verifica:**
- 🔍 Servicios (MySQL, Nginx, Node.js)
- 🔍 Puertos (80, 3000, 3306)
- 🔍 Archivos críticos
- 🔍 Conexión a base de datos
- 🔍 Endpoints de la API
- 🔍 Configuración de Nginx
- 🔍 Variables de entorno

**Salida:**
- Código de salida 0 si todo está OK
- Código > 0 si hay errores (número de errores encontrados)

---

### 🗄️ `setup-database.js` - Inicialización de Base de Datos

Script Node.js para inicializar la base de datos MySQL.

**Uso:**
```bash
npm run setup:db
```

**Qué hace:**
- ✅ Crea la base de datos `UapaSmartphones`
- ✅ Crea tablas (productos, clientes, ventas)
- ✅ Crea stored procedures
- ✅ Inserta datos de prueba
- ✅ Verifica la instalación

**Correcciones aplicadas:**
- Habilita `multipleStatements: true` para ejecutar múltiples queries
- Normaliza line endings del SQL
- Elimina comentarios problemáticos
- Verifica cantidad de registros insertados

---

### 🔍 `check-setup.js` - Verificación de Configuración

Verifica que el entorno esté correctamente configurado.

**Uso:**
```bash
npm run check
```

**Qué verifica:**
- ✅ Variables de entorno
- ✅ Conexión a MySQL
- ✅ Existencia de tablas
- ✅ Stored procedures
- ✅ Datos de prueba

---

### 🌐 `nginx.conf` - Configuración de Nginx

Template de configuración para Nginx.

**Ubicación final:** `/etc/nginx/sites-available/uapa-smartphones`

**Características:**
- Proxy reverso a `http://127.0.0.1:3000` (fuerza IPv4)
- Sirve archivos estáticos desde `/var/www/uapa-smartphones/src/public`
- Timeouts aumentados (60s)
- Cache para recursos estáticos (1 día)
- Headers de proxy correctos

---

## 🔄 Flujo de Uso Recomendado

### Primera Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/jepr18/trabajo-final-software-libre
cd trabajo-final-software-libre

# 2. Desplegar
sudo ./scripts/deploy.sh

# 3. Verificar
sudo ./scripts/post-install-verify.sh
```

### Limpieza y Re-instalación

```bash
# 1. Limpiar instalación anterior
sudo ./scripts/remove-deployment.sh

# 2. Redesplegar
sudo ./scripts/deploy.sh

# 3. Verificar
sudo ./scripts/post-install-verify.sh
```

### Actualizar Código

```bash
# 1. Actualizar repositorio
cd /var/www/uapa-smartphones
sudo git pull

# 2. Reinstalar dependencias
sudo npm install

# 3. Reiniciar servicio
sudo systemctl restart uapa-smartphones

# 4. Verificar
sudo ./scripts/post-install-verify.sh
```

---

## 🐛 Solución de Problemas

### Error: `Permission denied`

```bash
# Asegúrate de usar sudo
sudo ./scripts/deploy.sh
```

### Error: `command not found: mysql`

```bash
# Instala MySQL manualmente primero
sudo apt update
sudo apt install -y mysql-server
```

### Base de datos no se inicializa

```bash
# Ejecuta el SQL manualmente
mysql -u root -p < src/database/database.sql
```

### Nginx no arranca

```bash
# Verifica la configuración
sudo nginx -t

# Revisa los logs
sudo journalctl -u nginx -n 50
```

---

## 📝 Notas Importantes

### ⚠️ Sobre IPv4 vs IPv6

Todos los scripts usan **`127.0.0.1`** en lugar de **`localhost`** para evitar problemas cuando MySQL solo escucha en IPv4 pero el sistema intenta conectar por IPv6.

**Dónde se aplica:**
- `.env`: `DB_HOST=127.0.0.1`
- `nginx.conf`: `proxy_pass http://127.0.0.1:3000`
- `server.js`: Fallback a `127.0.0.1`

### 🔐 Sobre Seguridad

- El script de despliegue solicita la contraseña de MySQL interactivamente
- No se almacenan contraseñas en plain text en los scripts
- El `.env` debe tener permisos restrictivos (solo root/www-data)

### 🔄 Sobre Automatización

Los scripts están diseñados para ser:
- **Idempotentes**: Puedes ejecutarlos múltiples veces sin problemas
- **Defensivos**: Verifican condiciones antes de ejecutar acciones
- **Informativos**: Muestran progreso y mensajes claros

---

## 📚 Referencias

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Guía completa de despliegue
- [QUICK_START_CLEAN.md](../QUICK_START_CLEAN.md) - Inicio rápido limpio
- [README.md](../README.md) - Documentación principal

---

**¿Problemas?** Revisa los logs con:
```bash
sudo journalctl -u uapa-smartphones -n 100
```

