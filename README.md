# 📱 UAPA Smartphones - Sistema de Gestión

## 🎯 Proyecto Final - Software Libre

Sistema CRUD completo para la gestión de productos, clientes y ventas de smartphones, desarrollado como proyecto final de la asignatura de Software Libre.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Pruebas](#-pruebas)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 📖 Descripción

UAPA Smartphones es una aplicación web completa que permite gestionar un inventario de productos electrónicos (smartphones y accesorios), administrar clientes y procesar ventas. El sistema incluye:

- **Backend**: API RESTful desarrollada en Node.js con Express
- **Frontend**: Interfaz web interactiva con HTML, CSS y JavaScript vanilla
- **Base de Datos**: MySQL con stored procedures
- **Características**: CRUD completo, gestión de inventario, control de ventas

### 🎓 Resultados de Aprendizaje (RA)

Este proyecto cumple con los siguientes resultados de aprendizaje:

- **RA8**: Utiliza el diseño y codificación para el desarrollo de proyectos con software libre
- **RA9**: Emplea diferentes tipos de diseño para la creación de proyectos con software libre
- **RA10**: Aplica las técnicas de prueba de software en la evaluación de proyectos con software libre

---

## ✨ Características

### 🛍️ Gestión de Productos
- ✅ Crear nuevos productos
- ✅ Listar todos los productos
- ✅ Buscar productos por ID, nombre o marca
- ✅ Actualizar información de productos
- ✅ Eliminar productos
- ✅ Control de inventario (stock)

### 👥 Gestión de Clientes
- ✅ Registrar nuevos clientes
- ✅ Listar todos los clientes
- ✅ Buscar clientes por diversos criterios
- ✅ Actualizar datos de clientes
- ✅ Eliminar clientes
- ✅ Validación de datos (email, teléfono)

### 💰 Gestión de Ventas
- ✅ Registrar ventas con múltiples productos
- ✅ Calcular totales automáticamente
- ✅ Control de stock en tiempo real
- ✅ Historial de ventas por cliente
- ✅ Modificar ventas existentes
- ✅ Eliminar ventas y restaurar inventario

### 🔒 Características Técnicas
- ✅ API RESTful con endpoints documentados
- ✅ Stored Procedures para operaciones de BD
- ✅ Validaciones de negocio
- ✅ Manejo de transacciones
- ✅ Control de integridad referencial
- ✅ Pruebas funcionales y de rendimiento

---

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js** (v18+) - Entorno de ejecución
- **Express** (v5.1.0) - Framework web
- **MySQL2** (v3.6.5) - Cliente MySQL con soporte para Promises
- **dotenv** (v17.2.3) - Gestión de variables de entorno
- **CORS** (v2.8.5) - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos
- **JavaScript (ES6+)** - Lógica del cliente
- **Fetch API** - Comunicación con el backend

### Base de Datos
- **MySQL** (v8.0+) - Sistema de gestión de base de datos
- **Stored Procedures** - Lógica de negocio en BD

### Testing
- **Jest** (v29.7.0) - Framework de pruebas
- **Supertest** (v6.3.3) - Pruebas HTTP
- **Axios** (v1.6.0) - Cliente HTTP para pruebas de rendimiento

### Infraestructura
- **NGINX** - Servidor web y proxy inverso
- **systemd** - Gestión de servicios
- **GNU/Linux** - Sistema operativo servidor

---

## 💻 Requisitos del Sistema

### Desarrollo Local

#### Requisitos Mínimos
- **Sistema Operativo**: Windows 10+, macOS 10.15+, o Linux (Ubuntu 20.04+)
- **Node.js**: v18.0.0 o superior
- **MySQL**: v8.0 o superior
- **RAM**: 2 GB mínimo
- **Espacio en Disco**: 500 MB

#### Software Necesario
```bash
# Node.js y npm
node --version  # v18.0.0+
npm --version   # v9.0.0+

# MySQL
mysql --version # v8.0+
```

### Producción (Servidor GNU/Linux)

#### Requisitos Mínimos
- **Sistema Operativo**: Ubuntu 20.04 LTS o superior / Debian 11+
- **CPU**: 1 core (2 cores recomendado)
- **RAM**: 1 GB mínimo (2 GB recomendado)
- **Espacio en Disco**: 10 GB
- **Red**: Conexión a internet estable

#### Software de Servidor
- Node.js v18+
- MySQL Server 8.0+
- NGINX 1.18+
- systemd

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/jepr18/trabajo-final-software-libre.git
cd trabajo-final-software-libre
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos

#### Opción A: Configuración Automática

```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales de MySQL
nano .env

# Ejecutar script de inicialización
npm run setup:db
```

#### Opción B: Configuración Manual

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar el script SQL
mysql -u root -p < src/database/database.sql
```

### 4. Iniciar la Aplicación

#### Modo Desarrollo
```bash
npm run dev
```

#### Modo Producción
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=UapaSmartphones
DB_PORT=3306

# Application Configuration
APP_NAME=UAPA Smartphones API
APP_VERSION=1.0.0

# CORS Configuration
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
```

### Configuración de MySQL

Si prefieres usar credenciales diferentes, edita el archivo `.env` y luego ejecuta:

```bash
mysql -u root -p

CREATE USER 'tu_usuario'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON UapaSmartphones.* TO 'tu_usuario'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📖 Uso

### Interfaz Web

1. Abre tu navegador y visita: `http://localhost:3000`

2. **Búsqueda de Datos**:
   - Selecciona la categoría (Productos, Clientes, Ventas)
   - Elige el criterio de búsqueda
   - Ingresa el término y haz clic en "Buscar"

3. **Inserción de Datos**:
   - Selecciona la categoría a crear
   - Completa el formulario
   - Haz clic en el botón de inserción

4. **Modificación de Datos**:
   - Selecciona la categoría y campo a modificar
   - Ingresa el ID y el nuevo valor
   - Haz clic en "Modificar valores"

5. **Eliminación de Datos**:
   - Selecciona la categoría
   - Ingresa el ID del registro
   - Confirma la eliminación

### API REST

Puedes usar la API directamente con herramientas como Postman, cURL o cualquier cliente HTTP.

#### Ejemplo con cURL:

```bash
# Listar todos los productos
curl http://localhost:3000/api/buscarTodosLosProductos

# Crear un nuevo producto
curl -X POST http://localhost:3000/api/nuevoProducto \
  -H "Content-Type: application/json" \
  -d '{
    "nombreModelo": "iPhone 15",
    "marca": "Apple",
    "costo": 800,
    "precio": 1200,
    "cantidadEnStock": 10
  }'
```

---

## 🔌 API Endpoints

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/buscarTodosLosProductos` | Listar todos los productos |
| POST | `/api/buscarProductos` | Buscar productos por criterios |
| POST | `/api/nuevoProducto` | Crear nuevo producto |
| PUT | `/api/modificarProducto/:id` | Actualizar producto |
| DELETE | `/api/eliminarProducto/:id` | Eliminar producto |

### Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/buscarTodosLosClientes` | Listar todos los clientes |
| POST | `/api/buscarClientes` | Buscar clientes por criterios |
| POST | `/api/nuevoCliente` | Crear nuevo cliente |
| PUT | `/api/modificarCliente/:id` | Actualizar cliente |
| DELETE | `/api/eliminarCliente/:id` | Eliminar cliente |

### Ventas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/buscarTodasLasVentas` | Listar todas las ventas |
| POST | `/api/buscarVentas` | Buscar ventas por criterios |
| POST | `/api/nuevaVenta` | Crear nueva venta |
| PUT | `/api/modificarVenta/:id` | Actualizar venta |
| DELETE | `/api/eliminarVenta/:id` | Eliminar venta |

### Documentación Detallada de Endpoints

#### POST /api/nuevoProducto

**Request Body:**
```json
{
  "nombreModelo": "iPhone 15 Pro",
  "marca": "Apple",
  "costo": 850.00,
  "precio": 1299.00,
  "cantidadEnStock": 15,
  "fechaDisponible": "2024-09-20"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": [
    {
      "IDProducto": 21
    }
  ]
}
```

#### POST /api/nuevaVenta

**Request Body:**
```json
{
  "idCliente": 1,
  "detalles": [
    {
      "idProducto": 1,
      "cantidad": 2
    },
    {
      "idProducto": 5,
      "cantidad": 1
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Venta registrada exitosamente",
  "data": {
    "idVenta": 16,
    "idCliente": 1,
    "totalVenta": 2847.00,
    "detalles": [...]
  }
}
```

---

## 🧪 Pruebas

### Pruebas Funcionales

Las pruebas funcionales verifican que todos los endpoints de la API funcionen correctamente.

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar solo pruebas funcionales
npm run test:functional

# Ejecutar con cobertura de código
npm test -- --coverage
```

**Requisitos para las pruebas:**
- El servidor debe estar ejecutándose (`npm start`)
- La base de datos debe estar configurada
- Puerto 3000 disponible

### Pruebas de Rendimiento

Las pruebas de rendimiento miden los tiempos de respuesta y la capacidad de carga del sistema.

```bash
# Ejecutar pruebas de rendimiento
npm run test:performance
```

**Métricas evaluadas:**
- ⏱️ Tiempo de respuesta promedio
- 📊 Tiempo mínimo y máximo
- 📈 Percentil 95
- ✅ Tasa de éxito
- 🔄 Pruebas de concurrencia

**Resultados esperados:**
- Tiempo promedio < 300ms (Bueno)
- Tiempo promedio < 100ms (Excelente)
- Tasa de éxito > 99%

### Informe de Pruebas

Después de ejecutar las pruebas de rendimiento, se genera un informe en:
```
tests/performance-report.json
```

---

## 🌐 Despliegue

### Despliegue en Servidor GNU/Linux

#### Despliegue Automático

```bash
# Copiar el script al servidor
scp scripts/deploy.sh usuario@servidor:/tmp/

# Conectar al servidor
ssh usuario@servidor

# Ejecutar el script de despliegue
sudo bash /tmp/deploy.sh
```

El script automáticamente:
- ✅ Instala Node.js
- ✅ Instala MySQL
- ✅ Instala NGINX
- ✅ Configura la aplicación
- ✅ Crea el servicio systemd
- ✅ Configura el firewall

#### Despliegue Manual

##### 1. Instalar Dependencias del Sistema

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar MySQL
sudo apt install -y mysql-server

# Instalar NGINX
sudo apt install -y nginx
```

##### 2. Configurar la Aplicación

```bash
# Clonar repositorio
cd /var/www
sudo git clone https://github.com/jepr18/trabajo-final-software-libre.git uapa-smartphones
cd uapa-smartphones

# Instalar dependencias
sudo npm install

# Configurar variables de entorno
sudo cp .env.example .env
sudo nano .env

# Inicializar base de datos
sudo npm run setup:db
```

##### 3. Configurar NGINX

```bash
# Copiar configuración
sudo cp scripts/nginx.conf /etc/nginx/sites-available/uapa-smartphones

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/uapa-smartphones /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar NGINX
sudo systemctl restart nginx
```

##### 4. Configurar Servicio Systemd

```bash
# Crear archivo de servicio
sudo nano /etc/systemd/system/uapa-smartphones.service
```

Contenido del archivo:
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

Habilitar e iniciar el servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl enable uapa-smartphones
sudo systemctl start uapa-smartphones
```

##### 5. Verificar Despliegue

```bash
# Verificar estado de servicios
sudo systemctl status mysql
sudo systemctl status nginx
sudo systemctl status uapa-smartphones

# Ver logs
sudo journalctl -u uapa-smartphones -f
```

### Comandos Útiles

```bash
# Reiniciar aplicación
sudo systemctl restart uapa-smartphones

# Ver logs en tiempo real
sudo journalctl -u uapa-smartphones -f

# Ver últimos 100 logs
sudo journalctl -u uapa-smartphones -n 100

# Reiniciar NGINX
sudo systemctl restart nginx

# Verificar puertos en uso
sudo netstat -tlnp | grep -E '(3000|80)'
```

---

## 📁 Estructura del Proyecto

```
trabajo-final-software-libre/
├── src/
│   ├── server.js                 # Servidor principal Node.js
│   ├── app.py                    # Servidor alternativo Python/Flask
│   ├── database/
│   │   └── database.sql          # Script de base de datos
│   └── public/
│       ├── index.html            # Página principal
│       ├── css/
│       │   └── style.css         # Estilos
│       └── js/
│           └── main.js           # Lógica del cliente
├── tests/
│   ├── functional.test.js        # Pruebas funcionales
│   ├── performance.test.js       # Pruebas de rendimiento
│   └── performance-report.json   # Informe de rendimiento
├── scripts/
│   ├── setup-database.js         # Script de inicialización de BD
│   ├── deploy.sh                 # Script de despliegue automático
│   └── nginx.conf                # Configuración de NGINX
├── public/                       # Recursos públicos
│   ├── background.svg
│   ├── javascript.svg
│   └── fonts/
├── .env                          # Variables de entorno (no versionado)
├── .env.example                  # Plantilla de variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── .prettierrc                   # Configuración de Prettier
├── package.json                  # Dependencias y scripts
├── package-lock.json             # Lock de dependencias
└── README.md                     # Este archivo
```

### Descripción de Directorios

- **`src/`**: Código fuente de la aplicación
  - `server.js`: API REST con Express
  - `app.py`: Alternativa en Python/Flask
  - `database/`: Scripts SQL
  - `public/`: Frontend (HTML, CSS, JS)

- **`tests/`**: Suite de pruebas
  - Pruebas funcionales (Jest + Supertest)
  - Pruebas de rendimiento personalizadas
  - Informes de pruebas

- **`scripts/`**: Scripts de automatización
  - Inicialización de base de datos
  - Despliegue automático
  - Configuraciones de servidor

- **`public/`**: Recursos estáticos
  - Imágenes, íconos
  - Fuentes

---

## 👥 Contribución

### Cómo Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- Usa nombres descriptivos para variables y funciones
- Comenta código complejo
- Sigue las convenciones de JavaScript ES6+
- Ejecuta las pruebas antes de hacer commit

---

## 📝 Licencia

Este proyecto está bajo la Licencia ISC - ve el archivo [LICENSE](LICENSE) para más detalles.

---

## 📧 Contacto

**Equipo de Desarrollo**  
Universidad Abierta Para Adultos (UAPA)  
Proyecto Final - Software Libre

---

## 🙏 Agradecimientos

- Universidad Abierta Para Adultos (UAPA)
- Profesor de Software Libre
- Comunidad de código abierto
- Todos los contribuidores del proyecto

---

## 📚 Referencias

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [NGINX Documentation](https://nginx.org/en/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

---

## 🔄 Historial de Versiones

### v1.0.0 (2024-10-10)
- ✅ Release inicial
- ✅ CRUD completo de Productos, Clientes y Ventas
- ✅ API REST funcional
- ✅ Pruebas funcionales y de rendimiento
- ✅ Scripts de despliegue automático
- ✅ Documentación completa

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

Made with ❤️ by UAPA Students

</div>
