# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a UAPA Smartphones! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Guía de Estilo](#guía-de-estilo)
- [Pruebas](#pruebas)

---

## Código de Conducta

Este proyecto sigue principios de respeto, colaboración y profesionalismo. Se espera que todos los contribuidores:

- Sean respetuosos con otros contribuidores
- Acepten críticas constructivas
- Se enfoquen en lo que es mejor para la comunidad
- Muestren empatía hacia otros miembros de la comunidad

---

## Cómo Contribuir

### 🐛 Reportar Bugs

Si encuentras un bug:

1. Verifica que no esté ya reportado en los [Issues](https://github.com/jepr18/trabajo-final-software-libre/issues)
2. Crea un nuevo issue con:
   - Título descriptivo
   - Pasos para reproducir el problema
   - Comportamiento esperado vs actual
   - Screenshots (si aplica)
   - Información del sistema (OS, Node.js, MySQL version)

### 💡 Proponer Nuevas Características

Para proponer una nueva característica:

1. Abre un issue con el tag `feature request`
2. Describe claramente:
   - El problema que resuelve
   - La solución propuesta
   - Alternativas consideradas
   - Impacto en la aplicación existente

### 🔧 Contribuir Código

1. Fork el repositorio
2. Crea una rama desde `main`:
   ```bash
   git checkout -b feature/tu-caracteristica
   # o
   git checkout -b fix/tu-bugfix
   ```

3. Realiza tus cambios siguiendo la [Guía de Estilo](#guía-de-estilo)

4. Escribe o actualiza pruebas si es necesario

5. Asegúrate de que todas las pruebas pasen:
   ```bash
   npm test
   ```

6. Commit tus cambios:
   ```bash
   git commit -m "feat: descripción clara del cambio"
   ```

7. Push a tu fork:
   ```bash
   git push origin feature/tu-caracteristica
   ```

8. Abre un Pull Request

---

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Node.js v18+
- MySQL 8.0+
- Git

### Pasos de Configuración

```bash
# 1. Fork y clonar el repositorio
git clone https://github.com/TU_USUARIO/trabajo-final-software-libre.git
cd trabajo-final-software-libre

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# 4. Inicializar base de datos
npm run setup:db

# 5. Verificar configuración
npm run check

# 6. Iniciar en modo desarrollo
npm run dev
```

### Estructura de Ramas

- `main`: Rama principal con código estable
- `feature/*`: Nuevas características
- `fix/*`: Corrección de bugs
- `docs/*`: Actualizaciones de documentación
- `test/*`: Mejoras en pruebas

---

## Proceso de Pull Request

### Antes de Crear un PR

- [ ] Todas las pruebas pasan (`npm test`)
- [ ] El código sigue la guía de estilo
- [ ] La documentación está actualizada
- [ ] Los commits tienen mensajes descriptivos
- [ ] No hay conflictos con `main`

### Checklist del Pull Request

Al crear un PR, incluye:

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva característica (cambio que añade funcionalidad)
- [ ] Breaking change (fix o feature que causa que funcionalidad existente no funcione)
- [ ] Documentación

## ¿Cómo se ha Probado?
Describe las pruebas realizadas

## Checklist
- [ ] Mi código sigue el estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado áreas complejas
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He añadido pruebas que prueban que mi fix/feature funciona
- [ ] Las pruebas unitarias pasan localmente
```

---

## Guía de Estilo

### JavaScript

#### Nombres de Variables
```javascript
// ✅ Bien - camelCase
const userName = 'John';
const isValid = true;

// ❌ Mal
const user_name = 'John';
const IsValid = true;
```

#### Nombres de Funciones
```javascript
// ✅ Bien - Verbos descriptivos
function getUserById(id) { }
function calculateTotal() { }

// ❌ Mal
function user(id) { }
function total() { }
```

#### Nombres de Clases
```javascript
// ✅ Bien - PascalCase
class UserController { }
class DatabaseManager { }

// ❌ Mal
class userController { }
class database_manager { }
```

#### Constantes
```javascript
// ✅ Bien - UPPER_SNAKE_CASE
const MAX_CONNECTIONS = 10;
const API_BASE_URL = 'http://api.example.com';

// ❌ Mal
const maxConnections = 10;
```

### Formato de Código

- **Indentación**: 4 espacios
- **Punto y coma**: Siempre usar
- **Comillas**: Single quotes `'` para strings
- **Llaves**: En la misma línea (K&R style)

```javascript
// ✅ Bien
function example() {
    if (condition) {
        return true;
    }
    return false;
}

// ❌ Mal
function example() 
{
    if (condition) 
    {
        return true
    }
    return false
}
```

### Comentarios

```javascript
// ✅ Bien - Comentarios útiles
// Calcular el descuento basado en la cantidad de productos
const discount = calculateDiscount(quantity);

// Validar formato de email antes de guardar
if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
}

// ❌ Mal - Comentarios obvios
// Incrementar i
i++;

// Declarar variable
const x = 5;
```

### Mensajes de Commit

Sigue el formato de [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos:
# feat:     Nueva característica
# fix:      Corrección de bug
# docs:     Solo documentación
# style:    Cambios que no afectan el significado del código
# refactor: Refactorización sin cambiar funcionalidad
# test:     Añadir o corregir pruebas
# chore:    Cambios en el proceso de build o herramientas

# Ejemplos:
git commit -m "feat: agregar endpoint para exportar reportes"
git commit -m "fix: corregir cálculo de totales en ventas"
git commit -m "docs: actualizar guía de instalación"
git commit -m "test: añadir pruebas para módulo de clientes"
```

---

## Pruebas

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Solo pruebas funcionales
npm run test:functional

# Pruebas de rendimiento
npm run test:performance

# Con cobertura
npm test -- --coverage
```

### Escribir Pruebas

Todas las nuevas características deben incluir pruebas:

```javascript
// tests/example.test.js
describe('Módulo de Usuarios', () => {
    test('Debe crear un nuevo usuario', async () => {
        const response = await request(BASE_URL)
            .post('/api/nuevoCliente')
            .send({
                nombre: 'Test',
                apellido: 'User',
                correoElectronico: 'test@example.com'
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });
});
```

### Cobertura de Código

Mantener una cobertura mínima del 70%:

```bash
npm test -- --coverage
```

---

## 📝 Documentación

Si tus cambios afectan la documentación:

- Actualiza el README.md
- Actualiza la documentación de la API
- Actualiza los comentarios en el código
- Actualiza QUICK_START.md si es necesario

---

## 🎉 Reconocimiento

Todos los contribuidores serán agregados a la lista de colaboradores del proyecto.

---

## ❓ ¿Preguntas?

Si tienes preguntas sobre cómo contribuir:

1. Revisa los [Issues existentes](https://github.com/jepr18/trabajo-final-software-libre/issues)
2. Revisa la [documentación](README.md)
3. Abre un nuevo issue con tu pregunta

---

<div align="center">

**¡Gracias por contribuir! 🎉**

[← Volver al README](README.md)

</div>

