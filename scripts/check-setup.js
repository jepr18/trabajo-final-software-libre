/**
 * Script de Verificación de Configuración
 * UAPA Smartphones - Proyecto Final Software Libre
 * 
 * Este script verifica que todo esté configurado correctamente
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function checkSetup() {
    log('\n╔════════════════════════════════════════════════════════╗', colors.cyan);
    log('║                                                        ║', colors.cyan);
    log('║          VERIFICACIÓN DE CONFIGURACIÓN                ║', colors.cyan);
    log('║          UAPA Smartphones API                          ║', colors.cyan);
    log('║                                                        ║', colors.cyan);
    log('╚════════════════════════════════════════════════════════╝\n', colors.cyan);

    let allOk = true;

    // 1. Verificar Node.js
    log('1️⃣  Verificando Node.js...', colors.cyan);
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion >= 18) {
        log(`   ✅ Node.js ${nodeVersion} instalado`, colors.green);
    } else {
        log(`   ❌ Node.js ${nodeVersion} - Se requiere v18+`, colors.red);
        allOk = false;
    }

    // 2. Verificar archivo .env
    log('\n2️⃣  Verificando archivo .env...', colors.cyan);
    if (fs.existsSync('.env')) {
        log('   ✅ Archivo .env encontrado', colors.green);
    } else {
        log('   ❌ Archivo .env no encontrado', colors.red);
        log('   💡 Ejecuta: cp .env.example .env', colors.yellow);
        allOk = false;
    }

    // 3. Verificar dependencias
    log('\n3️⃣  Verificando dependencias...', colors.cyan);
    if (fs.existsSync('node_modules')) {
        log('   ✅ Dependencias instaladas', colors.green);
    } else {
        log('   ❌ Dependencias no instaladas', colors.red);
        log('   💡 Ejecuta: npm install', colors.yellow);
        allOk = false;
    }

    // 4. Verificar estructura de directorios
    log('\n4️⃣  Verificando estructura de directorios...', colors.cyan);
    const requiredDirs = ['src', 'tests', 'scripts', 'src/public', 'src/database'];
    let dirsOk = true;
    requiredDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            log(`   ✅ ${dir}/`, colors.green);
        } else {
            log(`   ❌ ${dir}/ no encontrado`, colors.red);
            dirsOk = false;
        }
    });
    if (!dirsOk) allOk = false;

    // 5. Verificar archivos principales
    log('\n5️⃣  Verificando archivos principales...', colors.cyan);
    const requiredFiles = [
        'src/server.js',
        'src/public/index.html',
        'src/database/database.sql',
        'package.json',
        'README.md'
    ];
    let filesOk = true;
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            log(`   ✅ ${file}`, colors.green);
        } else {
            log(`   ❌ ${file} no encontrado`, colors.red);
            filesOk = false;
        }
    });
    if (!filesOk) allOk = false;

    // 6. Verificar conexión a MySQL
    log('\n6️⃣  Verificando conexión a MySQL...', colors.cyan);
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'admin',
            password: process.env.DB_PASSWORD || 'admin',
            port: process.env.DB_PORT || 3306
        });
        log('   ✅ Conexión a MySQL establecida', colors.green);

        // Verificar base de datos
        const [databases] = await connection.query('SHOW DATABASES LIKE ?', [process.env.DB_NAME || 'UapaSmartphones']);
        if (databases.length > 0) {
            log(`   ✅ Base de datos "${process.env.DB_NAME || 'UapaSmartphones'}" existe`, colors.green);
            
            // Verificar tablas
            await connection.query(`USE ${process.env.DB_NAME || 'UapaSmartphones'}`);
            const [tables] = await connection.query('SHOW TABLES');
            if (tables.length >= 4) {
                log(`   ✅ ${tables.length} tablas encontradas`, colors.green);
            } else {
                log(`   ⚠️  Solo ${tables.length} tablas encontradas`, colors.yellow);
                log('   💡 Ejecuta: npm run setup:db', colors.yellow);
            }
        } else {
            log(`   ❌ Base de datos "${process.env.DB_NAME || 'UapaSmartphones'}" no existe`, colors.red);
            log('   💡 Ejecuta: npm run setup:db', colors.yellow);
            allOk = false;
        }

        await connection.end();
    } catch (error) {
        log(`   ❌ Error de conexión: ${error.message}`, colors.red);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            log('   💡 Verifica las credenciales en .env', colors.yellow);
        } else if (error.code === 'ECONNREFUSED') {
            log('   💡 Asegúrate de que MySQL esté ejecutándose', colors.yellow);
        }
        allOk = false;
    }

    // 7. Verificar puerto disponible
    log('\n7️⃣  Verificando puerto...', colors.cyan);
    const port = process.env.PORT || 3000;
    const net = require('net');
    const server = net.createServer();
    
    await new Promise((resolve) => {
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                log(`   ⚠️  Puerto ${port} en uso`, colors.yellow);
                log('   💡 Detén el servidor actual o cambia PORT en .env', colors.yellow);
            }
            resolve();
        });
        server.once('listening', () => {
            log(`   ✅ Puerto ${port} disponible`, colors.green);
            server.close();
            resolve();
        });
        server.listen(port);
    });

    // Resumen
    log('\n╔════════════════════════════════════════════════════════╗', allOk ? colors.green : colors.yellow);
    log('║                      RESUMEN                           ║', allOk ? colors.green : colors.yellow);
    log('╚════════════════════════════════════════════════════════╝\n', allOk ? colors.green : colors.yellow);

    if (allOk) {
        log('✅ ¡Todo está configurado correctamente!', colors.green);
        log('🚀 Puedes iniciar la aplicación con: npm start\n', colors.cyan);
    } else {
        log('⚠️  Hay problemas de configuración', colors.yellow);
        log('💡 Revisa los errores anteriores y síguelas instrucciones\n', colors.yellow);
        process.exit(1);
    }
}

// Ejecutar verificación
if (require.main === module) {
    checkSetup()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Error fatal:', error);
            process.exit(1);
        });
}

module.exports = { checkSetup };

