// server.js
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'UapaSmartphones',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

// Main route - serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes using stored procedures

// Get all users (assumes stored procedure: sp_get_all_users)
app.post('/api/buscarProductos', async (req, res) => {
    try {
        const { idProducto, nombreModelo, marca } = req.body;
        const [rows] = await pool.query('CALL spBusquedaProductos(?, ?, ?)', [idProducto || null, nombreModelo || null, marca || null]);
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Get user by ID (assumes stored procedure: sp_get_user_by_id)
app.get('/api/buscarTodosLosProductos', async (req, res) => {
    try {
        const [rows] = await pool.query('CALL spBusquedaTodosLosProductos()');
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Create new user (assumes stored procedure: sp_create_user)
app.post('/api/buscarClientes', async (req, res) => {
    try {
        const { idCliente, nombre, apellido, correoElectronico, telefono } = req.body;
        const [rows] = await pool.query('CALL spBusquedaClientes(?, ?, ?, ?, ?)', [idCliente, nombre, apellido, correoElectronico, telefono]);
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Update user (assumes stored procedure: sp_update_user)
app.get('/api/buscarTodosLosClientes', async (req, res) => {
    try {
        const [rows] = await pool.query('CALL spBusquedaTodosLosClientes()');
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Delete user (assumes stored procedure: sp_delete_user)
app.post('/api/buscarVentas', async (req, res) => {
    try {
        const { idVenta, idCliente, fechaVenta, totalVenta, idProducto } = req.body;
        const [rows] = await pool.query('CALL spBusquedaVentas(?, ?, ?, ?, ?)', [idVenta, idCliente, fechaVenta, totalVenta, idProducto]);
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Search users (assumes stored procedure: sp_search_users)
app.get('/api/buscarTodasLasVentas', async (req, res) => {
    try {
        const [rows] = await pool.query('CALL spBusquedaTodosLasVentas()');
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

app.post('/api/nuevoProducto', async (req, res) => {
    try {
        const { nombreModelo, marca, costo, precio, cantidadEnStock, fechaDisponible } = req.body;

        if (!nombreModelo || !marca || costo === undefined || precio === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Campos requeridos faltantes'
            });
        }

        if (isNaN(costo) || isNaN(precio) || costo < 0 || precio < 0) {
            return res.status(400).json({
                success: false,
                message: 'Costo y precio deben ser números positivos'
            });
        }

        if (cantidadEnStock !== undefined && (isNaN(cantidadEnStock) || cantidadEnStock < 0)) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad en stock debe ser un número positivo'
            });
        }

        const [rows] = await pool.query('CALL spInsertarProducto(?, ?, ?, ?, ?, ?)', [nombreModelo, marca, costo, precio, cantidadEnStock || 0, fechaDisponible || null]);

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
});

app.put('/api/modificarProducto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreModelo, marca, costo, precio, cantidadEnStock, fechaDisponible } = req.body;

        // Validar que el ID sea válido
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }

        // Validar valores numéricos si se proporcionan
        if (costo !== undefined && (isNaN(costo) || costo < 0)) {
            return res.status(400).json({
                success: false,
                message: 'El costo debe ser un número positivo'
            });
        }

        if (precio !== undefined && (isNaN(precio) || precio < 0)) {
            return res.status(400).json({
                success: false,
                message: 'El precio debe ser un número positivo'
            });
        }

        const [rows] = await pool.query(
            'CALL spModificarProducto(?, ?, ?, ?, ?, ?, ?)',
            [
                id,
                nombreModelo || null,
                marca || null,
                costo || null,
                precio || null,
                cantidadEnStock || null,
                fechaDisponible || null
            ]
        );

        if (rows[0][0].FilasAfectadas === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: rows[0][0]
        });
    } catch (error) {
        console.error('Error al modificar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al modificar producto',
            error: error.message
        });
    }
});

app.delete('/api/eliminarProducto/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }

        const [rows] = await pool.query('CALL spEliminarProducto(?)', [id]);

        if (rows[0][0].FilasAfectadas === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente',
            data: rows[0][0]
        });
    } catch (error) {
        // Manejar errores de foreign key
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'No se puede eliminar el producto porque tiene ventas asociadas'
            });
        }

        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto',
            error: error.message
        });
    }
});

app.post('/api/nuevaVenta', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { idCliente, detalles } = req.body;

        // Validaciones básicas
        if (!idCliente) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'ID de cliente es requerido'
            });
        }

        if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Debe incluir al menos un producto en la venta'
            });
        }

        // Verificar que el cliente existe
        const [clienteExiste] = await connection.query(
            'SELECT IDCliente FROM Clientes WHERE IDCliente = ?',
            [idCliente]
        );

        if (clienteExiste.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        // Validar y obtener precios de productos
        let totalVenta = 0;
        const detallesConPrecio = [];

        for (const detalle of detalles) {
            // Validar que tenga IDProducto y cantidad
            if (!detalle.idProducto || !detalle.cantidad) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Cada detalle debe incluir idProducto y cantidad'
                });
            }

            // Validar que la cantidad sea positiva
            if (detalle.cantidad <= 0) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'La cantidad debe ser mayor a 0'
                });
            }

            // Obtener el producto con su precio y stock
            const [producto] = await connection.query(
                'SELECT IDProducto, NombreModelo, Precio, CantidadEnStock FROM Productos WHERE IDProducto = ?',
                [detalle.idProducto]
            );

            if (producto.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    message: `Producto con ID ${detalle.idProducto} no encontrado`
                });
            }

            // Verificar stock disponible
            if (producto[0].CantidadEnStock < detalle.cantidad) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para el producto "${producto[0].NombreModelo}". Disponible: ${producto[0].CantidadEnStock}, Solicitado: ${detalle.cantidad}`
                });
            }

            // Usar el precio del producto
            const precioUnidad = producto[0].Precio;
            const subtotal = detalle.cantidad * precioUnidad;
            totalVenta += subtotal;

            detallesConPrecio.push({
                idProducto: detalle.idProducto,
                nombreModelo: producto[0].NombreModelo,
                cantidad: detalle.cantidad,
                precioUnidad: precioUnidad,
                subtotal: subtotal
            });
        }

        // Insertar venta
        const [ventaResult] = await connection.query(
            'CALL spInsertarVenta(?, ?)',
            [idCliente, totalVenta]
        );
        const idVenta = ventaResult[0][0].IDVenta;

        // Insertar detalles
        for (const detalle of detallesConPrecio) {
            await connection.query(
                'CALL spInsertarDetalleVenta(?, ?, ?, ?)',
                [idVenta, detalle.idProducto, detalle.cantidad, detalle.precioUnidad]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Venta registrada exitosamente',
            data: {
                idVenta,
                idCliente,
                totalVenta,
                detalles: detallesConPrecio
            }
        });

    } catch (error) {
        await connection.rollback();

        console.error('Error al registrar venta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar venta',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

app.put('/api/modificarVenta/:id', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const { idCliente, fechaVenta, detalles } = req.body;

        // Validar ID
        if (!id || isNaN(id)) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'ID de venta inválido'
            });
        }

        // Verificar que la venta existe
        const [ventaExiste] = await connection.query(
            'SELECT IDVenta FROM Ventas WHERE IDVenta = ?',
            [id]
        );

        if (ventaExiste.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        // Si se proporcionan nuevos detalles, recalcular el total
        let totalVenta = null;

        if (detalles && Array.isArray(detalles) && detalles.length > 0) {
            // Eliminar detalles antiguos (esto restaurará el stock automáticamente)
            await connection.query(
                'DELETE FROM DetalleVentas WHERE IDVenta = ?',
                [id]
            );

            // Calcular nuevo total e insertar nuevos detalles
            totalVenta = 0;
            for (const detalle of detalles) {
                if (!detalle.idProducto || !detalle.cantidad || !detalle.precioUnidad) {
                    await connection.rollback();
                    return res.status(400).json({
                        success: false,
                        message: 'Datos de detalle incompletos'
                    });
                }

                totalVenta += detalle.cantidad * detalle.precioUnidad;

                await connection.query(
                    'CALL spInsertarDetalleVenta(?, ?, ?, ?)',
                    [id, detalle.idProducto, detalle.cantidad, detalle.precioUnidad]
                );
            }
        }

        // Actualizar cabecera de venta
        await connection.query(
            'CALL spModificarVenta(?, ?, ?, ?)',
            [id, idCliente || null, fechaVenta || null, totalVenta]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Venta modificada exitosamente',
            data: { idVenta: id, totalVenta }
        });

    } catch (error) {
        await connection.rollback();

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        if (error.message.includes('stock')) {
            return res.status(400).json({
                success: false,
                message: 'Stock insuficiente para completar la modificación'
            });
        }

        console.error('Error al modificar venta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al modificar venta',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

app.put('/api/modificarVentaCabecera/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { idCliente, fechaVenta, totalVenta } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de venta inválido'
            });
        }

        const [rows] = await pool.query(
            'CALL spModificarVenta(?, ?, ?, ?)',
            [id, idCliente || null, fechaVenta || null, totalVenta || null]
        );

        if (rows[0][0].FilasAfectadas === 0) {
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Cabecera de venta actualizada exitosamente',
            data: rows[0][0]
        });

    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        console.error('Error al modificar cabecera de venta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al modificar cabecera de venta',
            error: error.message
        });
    }
});

// Modificar un detalle específico de una venta
app.put('/api/modificarDetalleVenta/:idDetalle', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { idDetalle } = req.params;
        const { idVenta, idProducto, cantidad } = req.body;

        // Validar ID del detalle
        if (!idDetalle || isNaN(idDetalle)) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'ID de detalle inválido'
            });
        }

        // Verificar que el detalle existe
        const [detalleExiste] = await connection.query(
            'SELECT IDDetalleVentas, IDVenta, IDProducto, Cantidad FROM DetalleVentas WHERE IDDetalleVentas = ?',
            [idDetalle]
        );

        if (detalleExiste.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Detalle de venta no encontrado'
            });
        }

        const idVentaActual = detalleExiste[0].IDVenta;

        // Validar idVenta si se proporciona (debe coincidir con el actual)
        if (idVenta !== undefined && idVenta !== null && idVenta !== idVentaActual) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'No se puede cambiar el detalle a otra venta'
            });
        }

        // Validar cantidad si se proporciona
        if (cantidad !== undefined && cantidad !== null) {
            if (isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'La cantidad debe ser un número entero positivo'
                });
            }
        }

        // Determinar valores a usar
        let precioUnidad = null;
        let idProductoFinal = idProducto !== undefined && idProducto !== null ? idProducto : detalleExiste[0].IDProducto;
        let cantidadFinal = cantidad !== undefined && cantidad !== null ? cantidad : detalleExiste[0].Cantidad;

        // Obtener información del producto (actual o nuevo)
        const [producto] = await connection.query(
            'SELECT IDProducto, NombreModelo, Precio, CantidadEnStock FROM Productos WHERE IDProducto = ?',
            [idProductoFinal]
        );

        if (producto.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: `Producto con ID ${idProductoFinal} no encontrado`
            });
        }

        // Siempre usar el precio actual del producto
        precioUnidad = producto[0].Precio;

        // Verificar stock disponible
        if (producto[0].CantidadEnStock < cantidadFinal) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: `Stock insuficiente para el producto "${producto[0].NombreModelo}". Disponible: ${producto[0].CantidadEnStock}, Solicitado: ${cantidadFinal}`
            });
        }

        // Modificar el detalle
        await connection.query(
            'CALL spModificarDetalleVenta(?, ?, ?, ?, ?)',
            [idDetalle, null, idProducto || null, cantidad || null, precioUnidad]
        );

        // Recalcular el total de la venta
        const [detalles] = await connection.query(`
            SELECT SUM(Cantidad * PrecioUnidad) as NuevoTotal
            FROM DetalleVentas
            WHERE IDVenta = ?
        `, [idVentaActual]);

        const nuevoTotal = detalles[0].NuevoTotal || 0;

        await connection.query(
            'UPDATE Ventas SET TotalVenta = ? WHERE IDVenta = ?',
            [nuevoTotal, idVentaActual]
        );

        // Obtener información actualizada del detalle
        const [detalleActualizado] = await connection.query(`
            SELECT
                dv.IDDetalleVentas,
                dv.IDVenta,
                dv.IDProducto,
                p.NombreModelo,
                dv.Cantidad,
                dv.PrecioUnidad,
                (dv.Cantidad * dv.PrecioUnidad) as Subtotal
            FROM DetalleVentas dv
                     INNER JOIN Productos p ON dv.IDProducto = p.IDProducto
            WHERE dv.IDDetalleVentas = ?
        `, [idDetalle]);

        await connection.commit();

        res.json({
            success: true,
            message: 'Detalle de venta modificado exitosamente',
            data: {
                detalle: detalleActualizado[0],
                nuevoTotalVenta: nuevoTotal
            }
        });

    } catch (error) {
        await connection.rollback();

        if (error.message.includes('stock')) {
            return res.status(400).json({
                success: false,
                message: 'Stock insuficiente para completar la modificación'
            });
        }

        console.error('Error al modificar detalle de venta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al modificar detalle de venta',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

app.delete('/api/eliminarVenta/:id', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params;

        if (!id || isNaN(id)) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'ID de venta inválido'
            });
        }

        // Verificar que la venta existe
        const [ventaExiste] = await connection.query(
            'SELECT IDVenta FROM Ventas WHERE IDVenta = ?',
            [id]
        );

        if (ventaExiste.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        // Eliminar venta (el SP también elimina los detalles y restaura el stock)
        await connection.query('CALL spEliminarVenta(?)', [id]);

        await connection.commit();

        res.json({
            success: true,
            message: 'Venta eliminada exitosamente'
        });

    } catch (error) {
        await connection.rollback();

        console.error('Error al eliminar venta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar venta',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

app.delete('/api/eliminarDetalleVenta/:id', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params;

        if (!id || isNaN(id)) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'ID de detalle inválido'
            });
        }

        // Obtener IDVenta antes de eliminar para recalcular el total
        const [detalle] = await connection.query(
            'SELECT IDVenta FROM DetalleVentas WHERE IDDetalleVentas = ?',
            [id]
        );

        if (detalle.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Detalle de venta no encontrado'
            });
        }

        const idVenta = detalle[0].IDVenta;

        // Eliminar el detalle (el SP restaura el stock automáticamente)
        await connection.query('CALL spEliminarDetalleVenta(?)', [id]);

        // Recalcular el total de la venta
        const [nuevoTotal] = await connection.query(`
            SELECT COALESCE(SUM(Cantidad * PrecioUnidad), 0) as NuevoTotal
            FROM DetalleVentas
            WHERE IDVenta = ?
        `, [idVenta]);

        await connection.query(
            'UPDATE Ventas SET TotalVenta = ? WHERE IDVenta = ?',
            [nuevoTotal[0].NuevoTotal, idVenta]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Detalle de venta eliminado exitosamente',
            data: { nuevoTotal: nuevoTotal[0].NuevoTotal }
        });

    } catch (error) {
        await connection.rollback();

        console.error('Error al eliminar detalle de venta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar detalle de venta',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

app.post('/api/nuevoCliente', async (req, res) => {
    try {
        const { nombre, apellido, correoElectronico, telefono } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y apellido son requeridos'
            });
        }

        // Validar longitud de campos
        if (nombre.length > 50 || apellido.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y apellido no pueden exceder 50 caracteres'
            });
        }

        if (correoElectronico && correoElectronico.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico no puede exceder 100 caracteres'
            });
        }

        if (telefono && telefono.length > 20) {
            return res.status(400).json({
                success: false,
                message: 'El teléfono no puede exceder 20 caracteres'
            });
        }

        // Validar formato de correo si se proporciona
        if (correoElectronico) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correoElectronico)) {
                return res.status(400).json({
                    success: false,
                    message: 'Formato de correo electrónico inválido'
                });
            }
        }

        const [rows] = await pool.query(
            'CALL spInsertarCliente(?, ?, ?, ?)',
            [nombre, apellido, correoElectronico || null, telefono || null]
        );

        res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            data: rows[0][0]
        });

    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear cliente',
            error: error.message
        });
    }
});

app.put('/api/modificarCliente/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correoElectronico, telefono } = req.body;

        // Validar ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de cliente inválido'
            });
        }

        // Validar longitud de campos si se proporcionan
        if (nombre && nombre.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'El nombre no puede exceder 50 caracteres'
            });
        }

        if (apellido && apellido.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'El apellido no puede exceder 50 caracteres'
            });
        }

        if (correoElectronico && correoElectronico.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico no puede exceder 100 caracteres'
            });
        }

        if (telefono && telefono.length > 20) {
            return res.status(400).json({
                success: false,
                message: 'El teléfono no puede exceder 20 caracteres'
            });
        }

        // Validar formato de correo si se proporciona
        if (correoElectronico) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correoElectronico)) {
                return res.status(400).json({
                    success: false,
                    message: 'Formato de correo electrónico inválido'
                });
            }
        }

        const [rows] = await pool.query(
            'CALL spModificarCliente(?, ?, ?, ?, ?)',
            [
                id,
                nombre || null,
                apellido || null,
                correoElectronico || null,
                telefono || null
            ]
        );

        if (rows[0][0].FilasAfectadas === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Cliente actualizado exitosamente',
            data: rows[0][0]
        });

    } catch (error) {
        console.error('Error al modificar cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error al modificar cliente',
            error: error.message
        });
    }
});

app.delete('/api/eliminarCliente/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de cliente inválido'
            });
        }

        // Verificar si el cliente tiene ventas asociadas
        const [ventas] = await pool.query(
            'SELECT COUNT(*) as cantidadVentas FROM Ventas WHERE IDCliente = ?',
            [id]
        );

        if (ventas[0].cantidadVentas > 0) {
            return res.status(409).json({
                success: false,
                message: `No se puede eliminar el cliente porque tiene ${ventas[0].cantidadVentas} venta(s) asociada(s)`,
                data: { cantidadVentas: ventas[0].cantidadVentas }
            });
        }

        const [rows] = await pool.query('CALL spEliminarCliente(?)', [id]);

        if (rows[0][0].FilasAfectadas === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Cliente eliminado exitosamente',
            data: rows[0][0]
        });

    } catch (error) {
        // Manejar errores de foreign key
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'No se puede eliminar el cliente porque tiene ventas asociadas'
            });
        }

        console.error('Error al eliminar cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar cliente',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    pool.end()
        .then(() => {
            console.log('Database pool closed');
            process.exit(0);
        })
        .catch(err => {
            console.error('Error closing database pool:', err);
            process.exit(1);
        });
});