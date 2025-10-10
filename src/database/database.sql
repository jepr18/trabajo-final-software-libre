CREATE DATABASE IF NOT EXISTS UapaSmartphones;

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS Productos (
    IDProducto INT PRIMARY KEY AUTO_INCREMENT,
    NombreModelo NVARCHAR(100) NOT NULL,
    Marca NVARCHAR(50) NOT NULL,
    Costo DECIMAL(9,2) NOT NULL,
    Precio DECIMAL(9,2) NOT NULL,
    CantidadEnStock INT NOT NULL DEFAULT 0,
    FechaDisponible DATE
);

CREATE TABLE IF NOT EXISTS Clientes (
    IDCliente INT PRIMARY KEY AUTO_INCREMENT,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL,
    CorreoElectrionico NVARCHAR(100),
    Telefono NVARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Ventas (
    IDVenta INT PRIMARY KEY AUTO_INCREMENT,
    IDCliente INT NOT NULL,
    FechaVenta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TotalVenta DECIMAL(9,2) NOT NULL,
    FOREIGN KEY (IDCliente) REFERENCES Clientes(IDCliente)
);

CREATE TABLE IF NOT EXISTS DetalleVentas (
    IDDetalleVentas INT PRIMARY KEY AUTO_INCREMENT,
    IDVenta INT NOT NULL,
    IDProducto INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnidad DECIMAL(9,2) NOT NULL,
    FOREIGN KEY (IDVenta) REFERENCES Ventas(IDVenta),
    FOREIGN KEY (IDProducto) REFERENCES Productos(IDProducto)
);

INSERT INTO Productos (NombreModelo, Marca, Costo, Precio, CantidadEnStock, FechaDisponible) VALUES
('iPhone 15 Pro', 'Apple', 850.00, 1299.00, 15, '2024-09-20'),
('Galaxy S24 Ultra', 'Samsung', 780.00, 1199.00, 20, '2024-08-15'),
('MacBook Air M3', 'Apple', 950.00, 1399.00, 8, '2024-03-10'),
('iPad Pro 12.9"', 'Apple', 680.00, 1099.00, 12, '2024-05-22'),
('AirPods Pro 2', 'Apple', 150.00, 249.00, 45, '2024-01-15'),
('Galaxy Buds Pro', 'Samsung', 120.00, 199.00, 30, '2024-02-28'),
('Dell XPS 15', 'Dell', 1200.00, 1799.00, 6, '2024-04-05'),
('ThinkPad X1 Carbon', 'Lenovo', 1100.00, 1699.00, 10, '2024-06-12'),
('PlayStation 5', 'Sony', 380.00, 499.00, 25, '2024-01-01'),
('Xbox Series X', 'Microsoft', 370.00, 499.00, 18, '2024-01-01'),
('Nintendo Switch OLED', 'Nintendo', 250.00, 349.00, 35, '2023-10-15'),
('Apple Watch Ultra 2', 'Apple', 520.00, 799.00, 14, '2024-09-20'),
('Samsung TV 55" QLED', 'Samsung', 650.00, 999.00, 7, '2024-03-18'),
('Sony WH-1000XM5', 'Sony', 220.00, 399.00, 22, '2024-05-30'),
('Logitech MX Master 3S', 'Logitech', 60.00, 99.00, 50, '2024-02-01'),
('Magic Keyboard', 'Apple', 80.00, 149.00, 28, '2024-01-10'),
('GoPro Hero 12', 'GoPro', 280.00, 449.00, 16, '2024-07-08'),
('DJI Mini 4 Pro', 'DJI', 480.00, 759.00, 9, '2024-08-25'),
('Kindle Paperwhite', 'Amazon', 90.00, 149.00, 40, '2023-11-20'),
('Echo Dot 5ta Gen', 'Amazon', 30.00, 49.00, 60, '2023-12-05');

INSERT INTO Clientes (Nombre, Apellido, CorreoElectrionico, Telefono) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '809-555-0101'),
('María', 'García', 'maria.garcia@email.com', '809-555-0102'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '809-555-0103'),
('Ana', 'Martínez', 'ana.martinez@email.com', '809-555-0104'),
('Luis', 'Hernández', 'luis.hernandez@email.com', '809-555-0105'),
('Carmen', 'López', 'carmen.lopez@email.com', '809-555-0106'),
('Pedro', 'González', 'pedro.gonzalez@email.com', '809-555-0107'),
('Laura', 'Sánchez', 'laura.sanchez@email.com', '809-555-0108'),
('Miguel', 'Ramírez', 'miguel.ramirez@email.com', '809-555-0109'),
('Isabel', 'Torres', 'isabel.torres@email.com', '809-555-0110'),
('Roberto', 'Flores', 'roberto.flores@email.com', '809-555-0111'),
('Patricia', 'Rivera', 'patricia.rivera@email.com', '809-555-0112'),
('Jorge', 'Gómez', 'jorge.gomez@email.com', '809-555-0113'),
('Sofía', 'Díaz', 'sofia.diaz@email.com', '809-555-0114'),
('Fernando', 'Morales', 'fernando.morales@email.com', '809-555-0115');

INSERT INTO Ventas (IDCliente, FechaVenta, TotalVenta) VALUES
(1, '2024-09-25 10:30:00', 1548.00),
(2, '2024-09-26 14:15:00', 1399.00),
(3, '2024-09-27 09:45:00', 2497.00),
(4, '2024-09-28 16:20:00', 698.00),
(5, '2024-09-29 11:00:00', 499.00),
(6, '2024-09-30 13:30:00', 1998.00),
(7, '2024-10-01 10:00:00', 849.00),
(1, '2024-10-01 15:45:00', 799.00),
(8, '2024-10-02 12:30:00', 2248.00),
(9, '2024-10-02 17:00:00', 499.00),
(10, '2024-10-03 09:15:00', 1448.00),
(11, '2024-10-03 14:00:00', 598.00),
(3, '2024-10-04 11:30:00', 759.00),
(12, '2024-10-04 16:45:00', 999.00),
(13, '2024-10-05 10:20:00', 1298.00);

INSERT INTO DetalleVentas (IDVenta, IDProducto, Cantidad, PrecioUnidad) VALUES
(1, 1, 1, 1299.00),
(1, 5, 1, 249.00),
(2, 3, 1, 1399.00),
(3, 2, 1, 1199.00),
(3, 6, 1, 199.00),
(3, 15, 1, 99.00),
(4, 9, 1, 499.00),
(4, 6, 1, 199.00),
(5, 10, 1, 499.00),
(6, 13, 1, 999.00),
(6, 14, 1, 399.00),
(6, 20, 12, 49.00),
(7, 11, 1, 349.00),
(7, 17, 1, 449.00),
(8, 12, 1, 799.00),
(9, 7, 1, 1799.00),
(9, 15, 1, 99.00),
(9, 11, 1, 349.00),
(10, 10, 1, 499.00),
(11, 4, 1, 1099.00),
(11, 16, 1, 149.00),
(11, 19, 1, 149.00),
(12, 14, 1, 399.00),
(12, 6, 1, 199.00),
(13, 18, 1, 759.00),
(14, 13, 1, 999.00),
(15, 1, 1, 1299.00);

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spBusquedaProductos (
    IN p_idProducto INT,
    IN p_nombreModelo NVARCHAR(100),
    IN p_marca NVARCHAR(50)
)
BEGIN
    SELECT * FROM Productos
        WHERE
            (p_idProducto IS NULL OR IDProducto = p_idProducto) AND
            (p_nombreModelo IS NULL OR NombreModelo COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', p_nombreModelo, '%')) AND
            (p_marca IS NULL OR Marca = p_marca);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spBusquedaClientes (
    IN p_idCliente INT,
    IN p_nombre NVARCHAR(100),
    IN p_apellido NVARCHAR(50),
    IN p_correoElectronico VARCHAR(100),
    IN p_telefono VARCHAR(20)
)
BEGIN
    SELECT * FROM Clientes
        WHERE
            (p_idCliente IS NULL OR IDCliente = p_idCliente) AND
            (p_nombre IS NULL OR Nombre COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', p_nombre, '%')) AND
            (p_apellido IS NULL OR Apellido COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', p_apellido, '%')) AND
            (p_correoElectronico IS NULL OR CorreoElectrionico COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', p_correoElectronico, '%')) AND
            (p_telefono IS NULL OR Telefono = p_telefono);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spBusquedaVentas (
    IN p_idVenta INT,
    IN p_idCliente NVARCHAR(100),
    IN p_fechaVenta NVARCHAR(50),
    IN p_totalVenta VARCHAR(100),
    IN p_idProducto VARCHAR(20)
)
BEGIN
    SELECT Ventas.IDVenta, Ventas.IDCliente, CONCAT(Nombre, ' ', Apellido) AS NombreCliente, FechaVenta, DV.IDDetalleVentas, DV.IDProducto, P.NombreModelo, Cantidad, PrecioUnidad, TotalVenta FROM Ventas
             LEFT JOIN DetalleVentas DV on Ventas.IDVenta = DV.IDVenta
            LEFT JOIN Clientes C on Ventas.IDCliente = C.IDCliente
            LEFT JOIN Productos P on DV.IDProducto = P.IDProducto
        WHERE
            (p_idVenta IS NULL OR Ventas.IDVenta = p_idVenta) AND
            (p_idCliente IS NULL OR Ventas.IDCliente = p_idCliente) AND
            (p_fechaVenta IS NULL OR FechaVenta = p_fechaVenta) AND
            (p_totalVenta IS NULL OR TotalVenta = p_totalVenta) AND
            (p_idProducto IS NULL OR DV.IDProducto = p_idProducto);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spBusquedaTodosLosProductos()
BEGIN
    SELECT * FROM Productos
    ORDER BY IDProducto;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spBusquedaProductosPorId (
    IN p_idProducto INT
)
BEGIN
    SELECT * FROM Productos
        WHERE
            (p_idProducto IS NULL OR IDProducto = p_idProducto);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spBusquedaTodosLosClientes()
BEGIN
    SELECT * FROM Clientes
    ORDER BY IDCliente;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spBusquedaTodosLasVentas()
BEGIN
    SELECT Ventas.IDVenta, Ventas.IDCliente, CONCAT(Nombre, ' ', Apellido) AS NombreCliente, FechaVenta, DV.IDProducto, P.NombreModelo, Cantidad, PrecioUnidad, TotalVenta FROM Ventas
             LEFT JOIN DetalleVentas DV on Ventas.IDVenta = DV.IDVenta
            LEFT JOIN Clientes C on Ventas.IDCliente = C.IDCliente
            LEFT JOIN Productos P on DV.IDProducto = P.IDProducto
    ORDER BY Ventas.IDVenta;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spInsertarProducto (
    IN p_nombreModelo NVARCHAR(100),
    IN p_marca NVARCHAR(50),
    IN p_costo DECIMAL(9,2),
    IN p_precio DECIMAL(9,2),
    IN p_cantidadEnStock INT,
    IN p_fechaDisponible DATE
)
BEGIN
    INSERT INTO Productos (NombreModelo, Marca, Costo, Precio, CantidadEnStock, FechaDisponible)
    VALUES (p_nombreModelo, p_marca, p_costo, p_precio, p_cantidadEnStock, p_fechaDisponible);

    SELECT LAST_INSERT_ID() AS IDProducto;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spModificarProducto (
    IN p_idProducto INT,
    IN p_nombreModelo NVARCHAR(100),
    IN p_marca NVARCHAR(50),
    IN p_costo DECIMAL(9,2),
    IN p_precio DECIMAL(9,2),
    IN p_cantidadEnStock INT,
    IN p_fechaDisponible DATE
)
BEGIN
    UPDATE Productos
    SET
        NombreModelo = COALESCE(p_nombreModelo, NombreModelo),
        Marca = COALESCE(p_marca, Marca),
        Costo = COALESCE(p_costo, Costo),
        Precio = COALESCE(p_precio, Precio),
        CantidadEnStock = COALESCE(p_cantidadEnStock, CantidadEnStock),
        FechaDisponible = COALESCE(p_fechaDisponible, FechaDisponible)
    WHERE IDProducto = p_idProducto;

    SELECT ROW_COUNT() AS FilasAfectadas;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spEliminarProducto (
    IN p_idProducto INT
)
BEGIN
    DELETE FROM Productos
    WHERE IDProducto = p_idProducto;

    SELECT ROW_COUNT() AS FilasAfectadas;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spInsertarCliente (
    IN p_nombre NVARCHAR(50),
    IN p_apellido NVARCHAR(50),
    IN p_correoElectronico NVARCHAR(100),
    IN p_telefono NVARCHAR(20)
)
BEGIN
    INSERT INTO Clientes (Nombre, Apellido, CorreoElectrionico, Telefono)
    VALUES (p_nombre, p_apellido, p_correoElectronico, p_telefono);

    SELECT LAST_INSERT_ID() AS IDCliente;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spModificarCliente (
    IN p_idCliente INT,
    IN p_nombre NVARCHAR(50),
    IN p_apellido NVARCHAR(50),
    IN p_correoElectronico NVARCHAR(100),
    IN p_telefono NVARCHAR(20)
)
BEGIN
    UPDATE Clientes
    SET
        Nombre = COALESCE(p_nombre, Nombre),
        Apellido = COALESCE(p_apellido, Apellido),
        CorreoElectrionico = COALESCE(p_correoElectronico, CorreoElectrionico),
        Telefono = COALESCE(p_telefono, Telefono)
    WHERE IDCliente = p_idCliente;

    SELECT ROW_COUNT() AS FilasAfectadas;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spEliminarCliente (
    IN p_idCliente INT
)
BEGIN
    DELETE FROM Clientes
    WHERE IDCliente = p_idCliente;

    SELECT ROW_COUNT() AS FilasAfectadas;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spInsertarVenta (
    IN p_idCliente INT,
    IN p_totalVenta DECIMAL(9,2)
)
BEGIN
    INSERT INTO Ventas (IDCliente, TotalVenta)
    VALUES (p_idCliente, p_totalVenta);

    SELECT LAST_INSERT_ID() AS IDVenta;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spModificarVenta (
    IN p_idVenta INT,
    IN p_idCliente INT,
    IN p_fechaVenta DATETIME,
    IN p_totalVenta DECIMAL(9,2)
)
BEGIN
    UPDATE Ventas
    SET
        IDCliente = COALESCE(p_idCliente, IDCliente),
        FechaVenta = COALESCE(p_fechaVenta, FechaVenta),
        TotalVenta = COALESCE(p_totalVenta, TotalVenta)
    WHERE IDVenta = p_idVenta;

    SELECT ROW_COUNT() AS FilasAfectadas;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spEliminarVenta (
    IN p_idVenta INT
)
BEGIN
    -- Primero eliminar los detalles
    DELETE FROM DetalleVentas
    WHERE IDVenta = p_idVenta;

    -- Luego eliminar la venta
    DELETE FROM Ventas
    WHERE IDVenta = p_idVenta;

    SELECT ROW_COUNT() AS FilasAfectadas;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spInsertarDetalleVenta (
    IN p_idVenta INT,
    IN p_idProducto INT,
    IN p_cantidad INT,
    IN p_precioUnidad DECIMAL(9,2)
)
BEGIN
    INSERT INTO DetalleVentas (IDVenta, IDProducto, Cantidad, PrecioUnidad)
    VALUES (p_idVenta, p_idProducto, p_cantidad, p_precioUnidad);

    -- Actualizar el stock del producto
    UPDATE Productos
    SET CantidadEnStock = CantidadEnStock - p_cantidad
    WHERE IDProducto = p_idProducto;

    SELECT LAST_INSERT_ID() AS IDDetalleVentas;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spModificarDetalleVenta (
    IN p_idDetalleVentas INT,
    IN p_idVenta INT,
    IN p_idProducto INT,
    IN p_cantidad INT,
    IN p_precioUnidad DECIMAL(9,2)
)
BEGIN
    DECLARE v_cantidadAnterior INT;
    DECLARE v_idProductoAnterior INT;
    DECLARE v_idProductoNuevo INT;
    DECLARE v_cantidadNueva INT;

    -- Obtener valores actuales
    SELECT Cantidad, IDProducto INTO v_cantidadAnterior, v_idProductoAnterior
    FROM DetalleVentas
    WHERE IDDetalleVentas = p_idDetalleVentas;

    -- Determinar el producto y cantidad final
    SET v_idProductoNuevo = COALESCE(p_idProducto, v_idProductoAnterior);
    SET v_cantidadNueva = COALESCE(p_cantidad, v_cantidadAnterior);

    -- Si cambió el producto o la cantidad, ajustar el stock
    IF v_idProductoNuevo != v_idProductoAnterior OR v_cantidadNueva != v_cantidadAnterior THEN
        -- Restaurar stock del producto anterior
        UPDATE Productos
        SET CantidadEnStock = CantidadEnStock + v_cantidadAnterior
        WHERE IDProducto = v_idProductoAnterior;

        -- Descontar stock del producto nuevo
        UPDATE Productos
        SET CantidadEnStock = CantidadEnStock - v_cantidadNueva
        WHERE IDProducto = v_idProductoNuevo;
    END IF;

    -- Actualizar el detalle
    UPDATE DetalleVentas
    SET
        IDVenta = COALESCE(p_idVenta, IDVenta),
        IDProducto = v_idProductoNuevo,
        Cantidad = v_cantidadNueva,
        PrecioUnidad = COALESCE(p_precioUnidad, PrecioUnidad)
    WHERE IDDetalleVentas = p_idDetalleVentas;

    SELECT ROW_COUNT() AS FilasAfectadas;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS spEliminarDetalleVenta (
    IN p_idDetalleVentas INT
)
BEGIN
    -- Obtener información del detalle para restaurar el stock
    DECLARE v_cantidad INT;
    DECLARE v_idProducto INT;

    SELECT Cantidad, IDProducto INTO v_cantidad, v_idProducto
    FROM DetalleVentas
    WHERE IDDetalleVentas = p_idDetalleVentas;

    -- Restaurar el stock
    UPDATE Productos
    SET CantidadEnStock = CantidadEnStock + v_cantidad
    WHERE IDProducto = v_idProducto;

    -- Eliminar el detalle
    DELETE FROM DetalleVentas
    WHERE IDDetalleVentas = p_idDetalleVentas;

    SELECT ROW_COUNT() AS FilasAfectadas;
END //
DELIMITER ;