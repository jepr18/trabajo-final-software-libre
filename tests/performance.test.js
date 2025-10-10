/**
 * Pruebas de Rendimiento - UAPA Smartphones API
 * Proyecto Final - Software Libre
 * 
 * Este archivo contiene pruebas de rendimiento para medir tiempos de respuesta
 * Requisito: RA10 - Prueba de Rendimiento (Simple)
 */

const axios = require('axios');

// URL base de la aplicación
const BASE_URL = 'http://localhost:3000';

// Configuración de pruebas
const NUM_REQUESTS = 50; // Número de requests por endpoint
const CONCURRENT_USERS = 5; // Usuarios concurrentes

// ============================================================================
// UTILIDADES PARA MEDICIÓN
// ============================================================================

class PerformanceMetrics {
    constructor(name) {
        this.name = name;
        this.times = [];
        this.errors = 0;
    }

    addTime(time) {
        this.times.push(time);
    }

    addError() {
        this.errors++;
    }

    getStats() {
        if (this.times.length === 0) {
            return {
                name: this.name,
                avgTime: 0,
                minTime: 0,
                maxTime: 0,
                successRate: 0,
                totalRequests: 0,
                errors: this.errors
            };
        }

        const sorted = [...this.times].sort((a, b) => a - b);
        const sum = sorted.reduce((a, b) => a + b, 0);
        
        return {
            name: this.name,
            avgTime: (sum / sorted.length).toFixed(2),
            minTime: sorted[0].toFixed(2),
            maxTime: sorted[sorted.length - 1].toFixed(2),
            medianTime: sorted[Math.floor(sorted.length / 2)].toFixed(2),
            p95Time: sorted[Math.floor(sorted.length * 0.95)].toFixed(2),
            successRate: ((sorted.length / (sorted.length + this.errors)) * 100).toFixed(2),
            totalRequests: sorted.length + this.errors,
            errors: this.errors
        };
    }

    printStats() {
        const stats = this.getStats();
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📊 ${stats.name}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`Total Requests:    ${stats.totalRequests}`);
        console.log(`Exitosas:          ${stats.totalRequests - stats.errors}`);
        console.log(`Errores:           ${stats.errors}`);
        console.log(`Tasa de Éxito:     ${stats.successRate}%`);
        console.log(`────────────────────────────────────────`);
        console.log(`Tiempo Promedio:   ${stats.avgTime} ms`);
        console.log(`Tiempo Mínimo:     ${stats.minTime} ms`);
        console.log(`Tiempo Máximo:     ${stats.maxTime} ms`);
        console.log(`Tiempo Mediano:    ${stats.medianTime} ms`);
        console.log(`Percentil 95:      ${stats.p95Time} ms`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        
        return stats;
    }
}

// ============================================================================
// FUNCIONES DE PRUEBA
// ============================================================================

async function testEndpoint(url, method = 'GET', data = null, name = 'Endpoint Test') {
    const metrics = new PerformanceMetrics(name);
    
    console.log(`\n🔄 Ejecutando ${NUM_REQUESTS} requests a: ${name}`);
    
    for (let i = 0; i < NUM_REQUESTS; i++) {
        const startTime = Date.now();
        
        try {
            if (method === 'GET') {
                await axios.get(url, { timeout: 30000 });
            } else if (method === 'POST') {
                await axios.post(url, data, { 
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000 
                });
            }
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            metrics.addTime(responseTime);
            
            // Progress indicator
            if ((i + 1) % 10 === 0) {
                process.stdout.write(`\r   Progreso: ${i + 1}/${NUM_REQUESTS}`);
            }
        } catch (error) {
            metrics.addError();
        }
    }
    
    process.stdout.write(`\r   Progreso: ${NUM_REQUESTS}/${NUM_REQUESTS} ✓\n`);
    return metrics;
}

async function testConcurrentRequests(url, method = 'GET', data = null, name = 'Concurrent Test') {
    console.log(`\n🔄 Ejecutando prueba de concurrencia: ${name}`);
    console.log(`   ${CONCURRENT_USERS} usuarios simultáneos, ${NUM_REQUESTS} requests por usuario`);
    
    const promises = [];
    
    for (let i = 0; i < CONCURRENT_USERS; i++) {
        promises.push(testEndpoint(url, method, data, `Usuario ${i + 1}`));
    }
    
    const results = await Promise.all(promises);
    
    // Combinar resultados
    const combinedMetrics = new PerformanceMetrics(name);
    results.forEach(result => {
        result.times.forEach(time => combinedMetrics.addTime(time));
        combinedMetrics.errors += result.errors;
    });
    
    return combinedMetrics;
}

// ============================================================================
// SUITE DE PRUEBAS DE RENDIMIENTO
// ============================================================================

async function runPerformanceTests() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║                                                        ║');
    console.log('║     PRUEBAS DE RENDIMIENTO - UAPA Smartphones API      ║');
    console.log('║                                                        ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('\n');
    
    const allMetrics = [];
    
    try {
        // Test 1: Página principal
        console.log('\n📋 PRUEBA 1: Carga de Página Principal');
        const homeMetrics = await testEndpoint(
            `${BASE_URL}/`,
            'GET',
            null,
            'GET / (Página Principal)'
        );
        allMetrics.push(homeMetrics.printStats());
        
        // Test 2: Listar todos los productos
        console.log('\n📋 PRUEBA 2: Listar Productos');
        const productsMetrics = await testEndpoint(
            `${BASE_URL}/api/buscarTodosLosProductos`,
            'GET',
            null,
            'GET /api/buscarTodosLosProductos'
        );
        allMetrics.push(productsMetrics.printStats());
        
        // Test 3: Buscar productos específicos
        console.log('\n📋 PRUEBA 3: Búsqueda de Productos');
        const searchMetrics = await testEndpoint(
            `${BASE_URL}/api/buscarProductos`,
            'POST',
            { idProducto: 1, nombreModelo: null, marca: null },
            'POST /api/buscarProductos'
        );
        allMetrics.push(searchMetrics.printStats());
        
        // Test 4: Listar clientes
        console.log('\n📋 PRUEBA 4: Listar Clientes');
        const clientsMetrics = await testEndpoint(
            `${BASE_URL}/api/buscarTodosLosClientes`,
            'GET',
            null,
            'GET /api/buscarTodosLosClientes'
        );
        allMetrics.push(clientsMetrics.printStats());
        
        // Test 5: Listar ventas
        console.log('\n📋 PRUEBA 5: Listar Ventas');
        const salesMetrics = await testEndpoint(
            `${BASE_URL}/api/buscarTodasLasVentas`,
            'GET',
            null,
            'GET /api/buscarTodasLasVentas'
        );
        allMetrics.push(salesMetrics.printStats());
        
        // Test 6: Prueba de carga con usuarios concurrentes
        console.log('\n📋 PRUEBA 6: Prueba de Carga con Usuarios Concurrentes');
        const concurrentMetrics = await testConcurrentRequests(
            `${BASE_URL}/api/buscarTodosLosProductos`,
            'GET',
            null,
            'Carga Concurrente - Productos'
        );
        allMetrics.push(concurrentMetrics.printStats());
        
        // Resumen general
        printSummary(allMetrics);
        
        // Generar reporte
        generateReport(allMetrics);
        
    } catch (error) {
        console.error('\n❌ Error durante las pruebas:', error.message);
        process.exit(1);
    }
}

// ============================================================================
// FUNCIONES DE REPORTE
// ============================================================================

function printSummary(metrics) {
    console.log('\n\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║                   RESUMEN GENERAL                      ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    const totalRequests = metrics.reduce((sum, m) => sum + m.totalRequests, 0);
    const totalErrors = metrics.reduce((sum, m) => sum + m.errors, 0);
    const avgResponseTime = (metrics.reduce((sum, m) => sum + parseFloat(m.avgTime), 0) / metrics.length).toFixed(2);
    
    console.log(`📊 Total de Requests:        ${totalRequests}`);
    console.log(`✅ Requests Exitosas:        ${totalRequests - totalErrors}`);
    console.log(`❌ Requests con Error:       ${totalErrors}`);
    console.log(`⏱️  Tiempo Promedio Global:  ${avgResponseTime} ms`);
    console.log(`📈 Tasa de Éxito Global:     ${(((totalRequests - totalErrors) / totalRequests) * 100).toFixed(2)}%`);
    
    // Análisis de rendimiento
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ANÁLISIS DE RENDIMIENTO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const avgTime = parseFloat(avgResponseTime);
    
    if (avgTime < 100) {
        console.log('✅ EXCELENTE: Tiempo de respuesta menor a 100ms');
    } else if (avgTime < 300) {
        console.log('✅ BUENO: Tiempo de respuesta menor a 300ms');
    } else if (avgTime < 1000) {
        console.log('⚠️  ACEPTABLE: Tiempo de respuesta menor a 1s');
    } else {
        console.log('❌ NECESITA OPTIMIZACIÓN: Tiempo de respuesta mayor a 1s');
    }
    
    console.log('\n');
}

function generateReport(metrics) {
    const fs = require('fs');
    const reportPath = './tests/performance-report.json';
    
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalTests: metrics.length,
            totalRequests: metrics.reduce((sum, m) => sum + m.totalRequests, 0),
            totalErrors: metrics.reduce((sum, m) => sum + m.errors, 0),
            avgResponseTime: (metrics.reduce((sum, m) => sum + parseFloat(m.avgTime), 0) / metrics.length).toFixed(2)
        },
        tests: metrics
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Reporte detallado guardado en: ${reportPath}\n`);
}

// ============================================================================
// EJECUCIÓN
// ============================================================================

if (require.main === module) {
    runPerformanceTests()
        .then(() => {
            console.log('✅ Pruebas de rendimiento completadas exitosamente\n');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error al ejecutar pruebas:', error);
            process.exit(1);
        });
}

module.exports = { runPerformanceTests, testEndpoint };

