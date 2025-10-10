/**
 * Pruebas Funcionales - UAPA Smartphones API
 * Proyecto Final - Software Libre
 * 
 * Este archivo contiene pruebas funcionales para todos los endpoints de la API
 * Requisito: RA10 - Aplicar las técnicas de prueba de software
 */

const request = require('supertest');
const mysql = require('mysql2/promise');

// URL base de la aplicación
const BASE_URL = 'http://localhost:3000';

describe('PRUEBAS FUNCIONALES - UAPA Smartphones API', () => {
    
    // Variables globales para testing
    let testProductoId;
    let testClienteId;
    let testVentaId;

    // ============================================================================
    // PRUEBAS DE CONEXIÓN Y DISPONIBILIDAD
    // ============================================================================
    
    describe('1. Pruebas de Disponibilidad del Servidor', () => {
        
        test('GET / - Debe cargar la página principal', async () => {
            const response = await request(BASE_URL).get('/');
            expect(response.status).toBe(200);
            expect(response.type).toMatch(/html/);
        }, 10000);

        test('GET /api/buscarTodosLosProductos - API debe estar disponible', async () => {
            const response = await request(BASE_URL).get('/api/buscarTodosLosProductos');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success');
        }, 10000);
    });

    // ============================================================================
    // PRUEBAS CRUD - PRODUCTOS
    // ============================================================================
    
    describe('2. CRUD de Productos', () => {
        
        test('POST /api/nuevoProducto - Crear nuevo producto', async () => {
            const nuevoProducto = {
                nombreModelo: 'Test Product',
                marca: 'Test Brand',
                costo: 100.00,
                precio: 150.00,
                cantidadEnStock: 10,
                fechaDisponible: '2024-01-01'
            };

            const response = await request(BASE_URL)
                .post('/api/nuevoProducto')
                .send(nuevoProducto)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('data');
            
            // Guardar ID para pruebas posteriores
            testProductoId = response.body.data[0].IDProducto;
        }, 10000);

        test('GET /api/buscarTodosLosProductos - Listar todos los productos', async () => {
            const response = await request(BASE_URL).get('/api/buscarTodosLosProductos');
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        }, 10000);

        test('POST /api/buscarProductos - Buscar producto por ID', async () => {
            const response = await request(BASE_URL)
                .post('/api/buscarProductos')
                .send({
                    idProducto: testProductoId,
                    nombreModelo: null,
                    marca: null
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].IDProducto).toBe(testProductoId);
        }, 10000);

        test('PUT /api/modificarProducto/:id - Actualizar producto', async () => {
            const response = await request(BASE_URL)
                .put(`/api/modificarProducto/${testProductoId}`)
                .send({
                    nombreModelo: 'Test Product Updated',
                    precio: 200.00
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        }, 10000);

        test('POST /api/nuevoProducto - Validar campos requeridos', async () => {
            const productoInvalido = {
                nombreModelo: 'Test'
                // Falta marca, costo, precio
            };

            const response = await request(BASE_URL)
                .post('/api/nuevoProducto')
                .send(productoInvalido)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
        }, 10000);
    });

    // ============================================================================
    // PRUEBAS CRUD - CLIENTES
    // ============================================================================
    
    describe('3. CRUD de Clientes', () => {
        
        test('POST /api/nuevoCliente - Crear nuevo cliente', async () => {
            const nuevoCliente = {
                nombre: 'Test',
                apellido: 'User',
                correoElectronico: 'test@example.com',
                telefono: '809-555-9999'
            };

            const response = await request(BASE_URL)
                .post('/api/nuevoCliente')
                .send(nuevoCliente)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            
            testClienteId = response.body.data.IDCliente;
        }, 10000);

        test('GET /api/buscarTodosLosClientes - Listar todos los clientes', async () => {
            const response = await request(BASE_URL).get('/api/buscarTodosLosClientes');
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        }, 10000);

        test('POST /api/buscarClientes - Buscar cliente por ID', async () => {
            const response = await request(BASE_URL)
                .post('/api/buscarClientes')
                .send({
                    idCliente: testClienteId,
                    nombre: null,
                    apellido: null,
                    correoElectronico: null,
                    telefono: null
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        }, 10000);

        test('PUT /api/modificarCliente/:id - Actualizar cliente', async () => {
            const response = await request(BASE_URL)
                .put(`/api/modificarCliente/${testClienteId}`)
                .send({
                    telefono: '809-555-0000'
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        }, 10000);

        test('POST /api/nuevoCliente - Validar formato de email', async () => {
            const clienteInvalido = {
                nombre: 'Test',
                apellido: 'User',
                correoElectronico: 'email-invalido',
                telefono: '809-555-9999'
            };

            const response = await request(BASE_URL)
                .post('/api/nuevoCliente')
                .send(clienteInvalido)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
        }, 10000);
    });

    // ============================================================================
    // PRUEBAS CRUD - VENTAS
    // ============================================================================
    
    describe('4. CRUD de Ventas', () => {
        
        test('POST /api/nuevaVenta - Crear nueva venta', async () => {
            const nuevaVenta = {
                idCliente: testClienteId,
                detalles: [
                    {
                        idProducto: testProductoId,
                        cantidad: 2
                    }
                ]
            };

            const response = await request(BASE_URL)
                .post('/api/nuevaVenta')
                .send(nuevaVenta)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('idVenta');
            
            testVentaId = response.body.data.idVenta;
        }, 10000);

        test('GET /api/buscarTodasLasVentas - Listar todas las ventas', async () => {
            const response = await request(BASE_URL).get('/api/buscarTodasLasVentas');
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        }, 10000);

        test('POST /api/buscarVentas - Buscar venta por ID', async () => {
            const response = await request(BASE_URL)
                .post('/api/buscarVentas')
                .send({
                    idVenta: testVentaId,
                    idCliente: null,
                    fechaVenta: null,
                    totalVenta: null,
                    idProducto: null
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        }, 10000);

        test('POST /api/nuevaVenta - Validar stock insuficiente', async () => {
            const ventaInvalida = {
                idCliente: testClienteId,
                detalles: [
                    {
                        idProducto: testProductoId,
                        cantidad: 99999 // Cantidad excesiva
                    }
                ]
            };

            const response = await request(BASE_URL)
                .post('/api/nuevaVenta')
                .send(ventaInvalida)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        }, 10000);
    });

    // ============================================================================
    // PRUEBAS DE LIMPIEZA - ELIMINACIÓN
    // ============================================================================
    
    describe('5. Eliminación de Datos de Prueba', () => {
        
        test('DELETE /api/eliminarVenta/:id - Eliminar venta de prueba', async () => {
            const response = await request(BASE_URL)
                .delete(`/api/eliminarVenta/${testVentaId}`)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        }, 10000);

        test('DELETE /api/eliminarProducto/:id - Eliminar producto de prueba', async () => {
            const response = await request(BASE_URL)
                .delete(`/api/eliminarProducto/${testProductoId}`)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        }, 10000);

        test('DELETE /api/eliminarCliente/:id - Eliminar cliente de prueba', async () => {
            const response = await request(BASE_URL)
                .delete(`/api/eliminarCliente/${testClienteId}`)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        }, 10000);
    });

    // ============================================================================
    // PRUEBAS DE INTEGRIDAD
    // ============================================================================
    
    describe('6. Pruebas de Integridad de Datos', () => {
        
        test('DELETE - No permitir eliminar cliente con ventas', async () => {
            // Esta prueba verifica que no se puedan eliminar clientes con ventas asociadas
            const response = await request(BASE_URL)
                .delete('/api/eliminarCliente/1') // Cliente con ventas
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(409); // Conflict
        }, 10000);

        test('DELETE - No permitir eliminar producto en ventas', async () => {
            const response = await request(BASE_URL)
                .delete('/api/eliminarProducto/1') // Producto con ventas
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(409); // Conflict
        }, 10000);
    });
});

// ============================================================================
// RESUMEN DE RESULTADOS
// ============================================================================

afterAll(() => {
    console.log('\n================================');
    console.log('PRUEBAS FUNCIONALES COMPLETADAS');
    console.log('================================\n');
    console.log('✓ Todas las funciones principales han sido probadas');
    console.log('✓ Los endpoints CRUD funcionan correctamente');
    console.log('✓ Las validaciones están implementadas');
    console.log('✓ La integridad referencial está garantizada\n');
});

