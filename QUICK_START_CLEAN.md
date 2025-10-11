# 🚀 Inicio Rápido - Despliegue Limpio

## ¿Quieres empezar de cero?

Esta guía te muestra cómo **limpiar completamente** una instalación previa y **redesplegar desde cero** de forma automatizada.

---

## 🧹 Paso 1: Limpiar Instalación Anterior

```bash
# Accede a tu VM Linux
ssh usuario@IP_DE_TU_VM

# Ve al directorio del proyecto (si existe)
cd trabajo-final-software-libre 2>/dev/null || cd ~

# Si tienes el script de limpieza, ejecútalo:
sudo chmod +x scripts/remove-deployment.sh
sudo ./scripts/remove-deployment.sh
```

**¿No tienes el script de limpieza?** Descárgalo:

```bash
cd ~
wget https://raw.githubusercontent.com/jepr18/trabajo-final-software-libre/main/scripts/remove-deployment.sh
sudo chmod +x remove-deployment.sh
sudo ./remove-deployment.sh
```

---

## 🎯 Paso 2: Despliegue Automatizado

```bash
# 1. Clonar repositorio fresco
cd ~
rm -rf trabajo-final-software-libre  # Eliminar clon anterior
git clone https://github.com/jepr18/trabajo-final-software-libre
cd trabajo-final-software-libre

# 2. Ejecutar script de despliegue
sudo chmod +x scripts/deploy.sh
sudo ./scripts/deploy.sh
```

**El script te pedirá:**
- Contraseña de MySQL root
- Confirmar algunas configuraciones

**Duración estimada:** 5-10 minutos

---

## ✅ Paso 3: Verificar Instalación

```bash
sudo chmod +x scripts/post-install-verify.sh
sudo ./scripts/post-install-verify.sh
```

Si todo está ✅, la aplicación ya está funcionando.

---

## 🌐 Paso 4: Acceder desde tu PC

### Opción A: Modo Bridge (Recomendado)

1. **Obtén la IP de tu VM:**
   ```bash
   hostname -I | awk '{print $1}'
   ```

2. **Abre en tu navegador (desde tu PC):**
   ```
   http://IP_DE_LA_VM
   ```

### Opción B: Modo NAT con Port Forwarding

1. **En VirtualBox/VMware:**
   - Configuración → Red → Avanzado → Reenvío de puertos
   - Agregar regla: Host `8080` → Guest `80`

2. **Abre en tu navegador (desde tu PC):**
   ```
   http://localhost:8080
   ```

---

## 📋 Checklist de 3 Pasos

- [ ] **Limpieza completa** con `remove-deployment.sh`
- [ ] **Despliegue automatizado** con `deploy.sh`
- [ ] **Verificación exitosa** con `post-install-verify.sh`

---

## 🔧 Comandos Útiles Post-Instalación

```bash
# Ver logs en tiempo real
sudo journalctl -u uapa-smartphones -f

# Reiniciar la aplicación
sudo systemctl restart uapa-smartphones

# Ver estado de servicios
sudo systemctl status uapa-smartphones nginx mysql

# Verificar puertos
sudo netstat -tulpn | grep -E ':(80|3000|3306)'
```

---

## 🐛 ¿Algo salió mal?

### Frontend no se conecta a la API

```bash
# En la VM, corregir URLs del frontend
sudo sed -i 's|http://localhost:3000||g' /var/www/uapa-smartphones/src/public/js/main.js

# Romper caché del navegador
sudo sed -i 's|/js/main.js"|/js/main.js?v=999"|' /var/www/uapa-smartphones/src/public/index.html

# Recargar Nginx
sudo systemctl reload nginx

# En tu PC, hacer hard refresh: Ctrl+Shift+R
```

### Error de conexión a MySQL

```bash
# Verificar que .env usa 127.0.0.1 (NO localhost)
cat /var/www/uapa-smartphones/.env | grep DB_HOST

# Si dice "localhost", cambiar a:
sudo sed -i 's/DB_HOST=localhost/DB_HOST=127.0.0.1/' /var/www/uapa-smartphones/.env

# Reiniciar
sudo systemctl restart uapa-smartphones
```

### Nginx no arranca

```bash
# Verificar configuración
sudo nginx -t

# Ver errores
sudo journalctl -u nginx -n 50

# Reiniciar
sudo systemctl restart nginx
```

---

## 📚 Documentación Completa

Para más detalles, consulta:
- `DEPLOYMENT.md` - Guía completa de despliegue
- `README.md` - Documentación del proyecto
- `PROYECTO_FINAL.md` - Requisitos académicos

---

## 🎓 Resumen del Flujo Ideal

```
┌─────────────────────────────────────────────────┐
│  1. LIMPIAR (si hay instalación previa)         │
│     sudo ./scripts/remove-deployment.sh          │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  2. CLONAR REPOSITORIO                           │
│     git clone https://github.com/...            │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  3. DESPLEGAR AUTOMÁTICAMENTE                    │
│     sudo ./scripts/deploy.sh                     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  4. VERIFICAR                                    │
│     sudo ./scripts/post-install-verify.sh        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  5. ACCEDER DESDE EL NAVEGADOR                   │
│     http://IP_DE_LA_VM                           │
└─────────────────────────────────────────────────┘
```

**Tiempo total:** ~10-15 minutos ⚡

---

**¡Listo para usar! 🎉**

La aplicación estará corriendo automáticamente cada vez que enciendas tu VM.

