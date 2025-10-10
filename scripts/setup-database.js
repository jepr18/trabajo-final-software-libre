/**
 * Script de Inicialización de Base de Datos
 * UAPA Smartphones - Proyecto Final Software Libre
 * 
 * Este script inicializa la base de datos MySQL con todas las tablas,
 * stored procedures y datos iniciales.
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración de colores para consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function setupDatabase() {
    log('\n╔════════════════════════════════════════════════════════╗', colors.cyan);
    log('║                                                        ║', colors.cyan);
    log('║        INICIALIZACIÓN DE BASE DE DATOS                ║', colors.cyan);
    log('║        UAPA Smartphones API                            ║', colors.cyan);
    log('║                                                        ║', colors.cyan);
    log('╚════════════════════════════════════════════════════════╝\n', colors.cyan);

    let connection;

    try {
        // Conexión inicial sin especificar base de datos
        log('📡 Conectando al servidor MySQL...', colors.blue);
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });
        log('✅ Conexión establecida\n', colors.green);

        // Leer el archivo SQL
        log('📄 Leyendo archivo de base de datos...', colors.blue);
        const sqlPath = path.join(__dirname, '..', 'src', 'database', 'database.sql');
        
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`Archivo no encontrado: ${sqlPath}`);
        }

        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        log('✅ Archivo cargado correctamente\n', colors.green);

        // Dividir el contenido en statements individuales
        log('🔧 Ejecutando script de base de datos...', colors.blue);
        log('   Este proceso puede tomar unos momentos...\n', colors.yellow);

        // Ejecutar el script completo (multipleStatements está habilitado)
        await connection.query(sqlContent);

        log('✅ Base de datos creada exitosamente', colors.green);
        log('✅ Tablas creadas', colors.green);
        log('✅ Stored Procedures creados', colors.green);
        log('✅ Datos iniciales insertados\n', colors.green);

        // Verificar la instalación
        log('🔍 Verificando instalación...', colors.blue);
        
        // Cambiar a la base de datos
        await connection.query(`USE ${process.env.DB_NAME || 'UapaSmartphones'}`);

        // Contar registros
        const [productos] = await connection.query('SELECT COUNT(*) as count FROM Productos');
        const [clientes] = await connection.query('SELECT COUNT(*) as count FROM Clientes');
        const [ventas] = await connection.query('SELECT COUNT(*) as count FROM Ventas');
        
        log(`\n📊 Estadísticas de la Base de Datos:`, colors.cyan);
        log(`   • Productos:  ${productos[0].count} registros`, colors.cyan);
        log(`   • Clientes:   ${clientes[0].count} registros`, colors.cyan);
        log(`   • Ventas:     ${ventas[0].count} registros`, colors.cyan);

        // Listar stored procedures
        const [procedures] = await connection.query(`
            SELECT ROUTINE_NAME 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_SCHEMA = '${process.env.DB_NAME || 'UapaSmartphones'}' 
            AND ROUTINE_TYPE = 'PROCEDURE'
        `);
        
        log(`   • Stored Procedures: ${procedures.length} creados\n`, colors.cyan);

        log('╔════════════════════════════════════════════════════════╗', colors.green);
        log('║                                                        ║', colors.green);
        log('║           ✅  INSTALACIÓN COMPLETADA  ✅               ║', colors.green);
        log('║                                                        ║', colors.green);
        log('╚════════════════════════════════════════════════════════╝\n', colors.green);

        log('🚀 La base de datos está lista para ser usada', colors.green);
        log('💡 Ejecuta "npm start" para iniciar el servidor\n', colors.yellow);

    } catch (error) {
        log('\n╔════════════════════════════════════════════════════════╗', colors.red);
        log('║                      ❌ ERROR                          ║', colors.red);
        log('╚════════════════════════════════════════════════════════╝\n', colors.red);
        
        log(`Error: ${error.message}`, colors.red);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            log('\n💡 Sugerencia: Verifica las credenciales de MySQL en el archivo .env', colors.yellow);
        } else if (error.code === 'ECONNREFUSED') {
            log('\n💡 Sugerencia: Asegúrate de que MySQL está ejecutándose', colors.yellow);
        }
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar el script
if (require.main === module) {
    setupDatabase()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error fatal:', error);
            process.exit(1);
        });
}

module.exports = { setupDatabase };

