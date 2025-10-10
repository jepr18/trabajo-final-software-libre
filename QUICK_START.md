# 🚀 Guía de Inicio Rápido - UAPA Smartphones

Esta guía te ayudará a poner en marcha la aplicación en menos de 5 minutos.

## ⚡ Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone https://github.com/jepr18/trabajo-final-software-libre.git
cd trabajo-final-software-libre
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de MySQL (opcional si usas los valores por defecto).

### 4. Inicializar Base de Datos
```bash
npm run setup:db
```

### 5. Verificar Configuración
```bash
npm run check
```

### 6. Iniciar la Aplicación
```bash
npm start
```

🎉 **¡Listo!** Abre tu navegador en: http://localhost:3000

---

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor en modo producción |
| `npm run dev` | Inicia el servidor en modo desarrollo (auto-reload) |
| `npm test` | Ejecuta todas las pruebas con cobertura |
| `npm run test:functional` | Ejecuta solo pruebas funcionales |
| `npm run test:performance` | Ejecuta pruebas de rendimiento |
| `npm run setup:db` | Inicializa la base de datos |
| `npm run check` | Verifica que todo esté configurado |

---

## ⚙️ Configuración Mínima

### Requisitos Previos
- ✅ Node.js v18+ instalado
- ✅ MySQL 8.0+ instalado y ejecutándose
- ✅ Puerto 3000 disponible

### Variables de Entorno Esenciales
```env
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=UapaSmartphones
PORT=3000
```

---

## 🧪 Ejecutar Pruebas

### Antes de Ejecutar las Pruebas
1. Asegúrate de que el servidor esté ejecutándose:
   ```bash
   npm start
   ```

2. En otra terminal, ejecuta las pruebas:
   ```bash
   npm test
   ```

### Pruebas de Rendimiento
```bash
npm run test:performance
```

Esto generará un informe en: `tests/performance-report.json`

---

## 🐛 Solución de Problemas Comunes

### Error: "ECONNREFUSED"
**Problema**: MySQL no está ejecutándose  
**Solución**: 
```bash
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
```

### Error: "Access denied for user"
**Problema**: Credenciales incorrectas  
**Solución**: Verifica tu archivo `.env` y asegúrate de que las credenciales sean correctas

### Error: "Port 3000 already in use"
**Problema**: El puerto está ocupado  
**Solución**: 
```bash
# Cambia el puerto en .env
PORT=3001
```

### Error: "Database does not exist"
**Problema**: La base de datos no está creada  
**Solución**: 
```bash
npm run setup:db
```

---

## 📚 Siguientes Pasos

1. 📖 Lee el [README completo](README.md) para documentación detallada
2. 🧪 Ejecuta las pruebas para verificar que todo funciona
3. 🌐 Consulta la [documentación de la API](README.md#-api-endpoints)
4. 🚀 Aprende sobre [despliegue en producción](README.md#-despliegue)

---

## 💡 Consejos

- Usa `npm run dev` durante el desarrollo para auto-reload
- Ejecuta `npm run check` antes de hacer commits
- Revisa los logs si algo no funciona como esperado
- Consulta el README para información más detallada

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas, verifica:
1. ✅ Node.js y MySQL están instalados correctamente
2. ✅ Las credenciales en `.env` son correctas
3. ✅ El puerto 3000 está disponible
4. ✅ La base de datos fue inicializada con `npm run setup:db`

---

<div align="center">

**¡Feliz desarrollo! 🎉**

[← Volver al README](README.md)

</div>

