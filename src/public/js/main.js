async function enviarAPI(api, payload) {
    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

function construirTabla(IdContenedor, data, opciones = {}) {
    const contenedor = document.getElementById(IdContenedor);

    if (!data || data.length === 0) {
        contenedor.innerHTML = '<p>No hay información para mostrar</p>';
        return;
    }

    // Get the actual data keys
    const dataKeys = Object.keys(data[0]);

    // Get display headers (can be different from data keys)
    const encabezados = opciones.headers || dataKeys;

    // Map headers to data keys (if custom headers provided, use data keys for access)
    const keys = opciones.headers ? dataKeys : encabezados;

    const claseTabla = opciones.claseTabla || 'data-tabla';

    let html = `<table class="${claseTabla}" id="${claseTabla}"><thead><tr>`;

    // Display the headers (custom or default)
    encabezados.forEach(encabezado => {
        html += `<th>${encabezado}</th>`;
    });

    html += '</tr></thead><tbody>';

    data.forEach(fila => {
        html += '<tr>';
        // Use the actual data keys to access values
        keys.forEach(key => {
            html += `<td>${fila[key] !== undefined ? fila[key] : ''}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    contenedor.innerHTML = html;
}

function estiloTabla() {
    const style = document.createElement('style');
    style.textContent = `
            table {
  width: 100%;
  border-collapse: collapse;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Header Styles */
thead {
  background-color: #2c3e50;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

thead th {
  padding: 12px 16px;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #1a252f;
}

/* Body Styles */
tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

tbody tr:hover {
  background-color: #e3f2fd;
}

tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

/* Footer Styles */
tfoot {
  background-color: #ecf0f1;
  font-weight: 600;
  border-top: 2px solid #bdc3c7;
}

tfoot td,
tfoot th {
  padding: 12px 16px;
}

tfoot th {
  text-align: left;
  color: #2c3e50;
}

/* Alignment helpers for numeric/action columns */
td:last-child,
th:last-child {
  text-align: center;
}

/* Number columns (add class="number" to td/th) */
.number {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* Status badges (add class="status" to td) */
.status {
  text-align: center;
}

/* Empty state */
tbody tr.empty td {
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
}
        `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
    const seleccionCrear = document.querySelector('div.crear-seleccion select');
    const formCrearProductos = document.querySelector('div.crear-datos form.form-crear-productos');
    const formCrearClientes = document.querySelector('div.crear-datos form.form-crear-clientes');
    const formCrearVentas = document.querySelector('div.crear-datos form.form-crear-ventas');
    const seleccionModificar = document.querySelector('div.modificar-seleccion select');
    const subseleccionModificar = document.querySelector('div.modificar-sub-seleccion select');
    const seleccionBusqueda = document.querySelector('#buscar-opciones');
    const subSeleccionBusqueda = document.querySelector('#buscar-sub-opciones');
    const barraBuscar = document.getElementById('buscar-barra');

    seleccionBusqueda.addEventListener('change', (e) => {
        switch (e.target.value) {
            case "productos":
                subSeleccionBusqueda.innerHTML = '<option value="placeholder">-</option>';

                const idProducto = document.createElement('option');
                idProducto.value = "id-producto";
                idProducto.text = "ID Producto";
                const nombreModelo = document.createElement('option');
                nombreModelo.value = "nombre-modelo";
                nombreModelo.text = "Nombre Modelo";
                const marca = document.createElement('option');
                marca.value = "marca";
                marca.text = "Marca";

                subSeleccionBusqueda.appendChild(idProducto);
                subSeleccionBusqueda.appendChild(nombreModelo);
                subSeleccionBusqueda.appendChild(marca);
                break;
            case "clientes":
                subSeleccionBusqueda.innerHTML = '<option value="placeholder">-</option>';

                const idCliente = document.createElement('option');
                idCliente.value = "id-cliente";
                idCliente.text = "ID Cliente";
                const nombre = document.createElement('option');
                nombre.value = "nombre-cliente";
                nombre.text = "Nombre";
                const apellido = document.createElement('option');
                apellido.value = "apellido-cliente";
                apellido.text = "Apellido";
                const correoElectronico = document.createElement('option');
                correoElectronico.value = "correo-cliente";
                correoElectronico.text = "Correo electrónico";
                const telefono = document.createElement('option');
                telefono.value = "telefono-cliente";
                telefono.text = "Teléfono";

                subSeleccionBusqueda.appendChild(idCliente);
                subSeleccionBusqueda.appendChild(nombre);
                subSeleccionBusqueda.appendChild(apellido);
                subSeleccionBusqueda.appendChild(correoElectronico);
                subSeleccionBusqueda.appendChild(telefono);
                break;
            case "ventas":
                subSeleccionBusqueda.innerHTML = '<option value="placeholder">-</option>';

                const idVenta = document.createElement('option');
                idVenta.value = "id-venta";
                idVenta.text = "ID Venta";
                const idClienteVenta = document.createElement('option');
                idClienteVenta.value = "id-cliente-venta";
                idClienteVenta.text = "ID Cliente";
                const idProductoVenta = document.createElement('option');
                idProductoVenta.value = "id-producto-venta";
                idProductoVenta.text = "ID Producto";

                subSeleccionBusqueda.appendChild(idVenta);
                subSeleccionBusqueda.appendChild(idClienteVenta);
                subSeleccionBusqueda.appendChild(idProductoVenta);
                break;
        }
    })

    seleccionCrear.addEventListener("change", (event) => {
        switch (event.target.value) {
            case "productos":
                formCrearProductos.style.display = "flex";
                formCrearProductos.style.flexWrap = "wrap";
                formCrearProductos.style.justifyContent = "center";
                formCrearClientes.style.display = "none";
                formCrearVentas.style.display = "none";

                const btnCrearProducto = document.querySelector('div.form-crear-productos input[type=submit]');
                const modeloProducto = document.getElementById('modelo');
                const marcaProducto = document.getElementById('marca');
                const costoProducto = document.getElementById('costo');
                const precioProducto = document.getElementById('precio');
                const cantidadProducto = document.getElementById('cantidad-stock');
                const fechaProducto = document.getElementById('fecha-disponible');
                btnCrearProducto.addEventListener("click", (event) => {
                    event.preventDefault();
                    enviarAPI('/api/nuevoProducto', {
                        "nombreModelo": modeloProducto.value.trim(),
                        "marca": marcaProducto.value.trim(),
                        "costo": parseInt(costoProducto.value.trim()),
                        "precio": parseInt(precioProducto.value.trim()),
                        "cantidadEnStock": parseInt(cantidadProducto.value.trim()),
                        "fechaDisponible": fechaProducto.value.trim(),
                    }).then(response => {
                        const resultadoCrear = document.getElementById('resultados-crear');
                        if (response.success === true) {
                            resultadoCrear.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                            resultadoCrear.innerHTML += `<p><strong>ID del nuevo producto:</strong> ${response.data[0].IDProducto}</p>`;
                        } else {
                            resultadoCrear.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                        }
                    });
                })
                break;
            case "clientes":
                formCrearClientes.style.display = "flex";
                formCrearClientes.style.flexWrap = "wrap";
                formCrearClientes.style.justifyContent = "center";
                formCrearProductos.style.display = "none";
                formCrearVentas.style.display = "none";

                const btnCrearCliente = document.querySelector('div.form-crear-clientes input[type=submit]');
                const nombreCliente = document.getElementById('nombre-cliente');
                const apellidoCliente = document.getElementById('apellido-cliente');
                const correoCliente = document.getElementById('correo-cliente');
                const telefonoCliente = document.getElementById('telefono-cliente');

                btnCrearCliente.addEventListener("click", (event) => {
                    event.preventDefault();
                    enviarAPI('/api/nuevoCliente', {
                        "nombre": nombreCliente.value.trim(),
                        "apellido": apellidoCliente.value.trim(),
                        "correoElectronico": correoCliente.value.trim(),
                        "telefono": telefonoCliente.value.trim()
                    }).then(response => {
                        const resultadoCrear = document.getElementById('resultados-crear');
                        if (response.success === true) {
                            resultadoCrear.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                            resultadoCrear.innerHTML += `<p><strong>ID del nuevo cliente:</strong> ${response.data.IDCliente}</p>`;
                        } else {
                            resultadoCrear.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                        }
                    });
                })
                break;
            case "ventas":
                formCrearVentas.style.display = "flex";
                formCrearVentas.style.flexWrap = "wrap";
                formCrearVentas.style.justifyContent = "center";
                formCrearProductos.style.display = "none";
                formCrearClientes.style.display = "none";

                const btnCrearVenta = document.querySelector('div.form-crear-ventas input[type=submit]');
                const idClienteVenta = document.getElementById('id-cliente-venta');
                const divForm = document.querySelector('form.form-crear-ventas');
                const idProductoVenta = document.getElementById('id-producto');
                const cantidadVenta = document.getElementById('cantidad-venta');

                divForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    // Collect all products
                    const detalles = [];
                    const productoSets = document.querySelectorAll('.producto-set');

                    productoSets.forEach((set) => {
                        const productoId = set.querySelector('[id^="id-producto-"]').value;
                        const cantidad = set.querySelector('[id^="cantidad-venta-"]').value;

                        detalles.push({
                            idProducto: parseInt(productoId),
                            cantidad: parseInt(cantidad)
                        });
                    });

                    detalles.push({
                        idProducto: parseInt(idProductoVenta.value.trim()),
                        cantidad: parseInt(cantidadVenta.value.trim())
                    })

                    // Collect other form data if needed
                    const formData = {
                        idCliente: parseInt(idClienteVenta.value.trim()),
                        detalles: detalles
                    };

                    console.log('Data to send:', formData);

                    // Call your API
                    try {
                        const response = await fetch('/api/nuevaVenta', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formData)
                        });

                        const result = await response.json();
                        console.log('Success:', result);

                        // Handle success (show message, redirect, etc.)

                    } catch (error) {
                        console.error('Error:', error);
                        // Handle error
                    }
                });
                break;
            default:
                formCrearProductos.style.display = "none";
                formCrearClientes.style.display = "none";
                formCrearVentas.style.display = "none";
                break;
        }
    });

    seleccionModificar.addEventListener("change", (event) => {
        switch (event.target.value) {
            case "productos":
                subseleccionModificar.innerHTML = "";

                const modelo = document.createElement("option");
                modelo.value = "modelo";
                modelo.text = "Modelo";
                const marca = document.createElement("option");
                marca.value = "marca";
                marca.text = "Marca";
                const costo = document.createElement("option");
                costo.value = "costo";
                costo.text = "Costo";
                const precio = document.createElement("option");
                precio.value = "precio";
                precio.text = "Precio";
                const cantidadEnStock = document.createElement("option");
                cantidadEnStock.value = "cantidad-en-stock";
                cantidadEnStock.text = "Cantidad En Stock";
                const fechaDisponible = document.createElement("option");
                fechaDisponible.value = "fecha-disponible";
                fechaDisponible.text = "Fecha Disponible";

                subseleccionModificar.appendChild(modelo);
                subseleccionModificar.appendChild(marca);
                subseleccionModificar.appendChild(costo);
                subseleccionModificar.appendChild(precio);
                subseleccionModificar.appendChild(cantidadEnStock);
                subseleccionModificar.appendChild(fechaDisponible);
                break;
            case "clientes":
                subseleccionModificar.innerHTML = "";

                const nombre = document.createElement("option");
                nombre.value = "nombre";
                nombre.text = "Nombre";
                const apellido = document.createElement("option");
                apellido.value = "apellido";
                apellido.text = "Apellido";
                const correoElectronico = document.createElement("option");
                correoElectronico.value = "correo-electronico";
                correoElectronico.text = "Correo Electronico";
                const telefono = document.createElement("option");
                telefono.value = "telefono";
                telefono.text = "Teléfono";

                subseleccionModificar.appendChild(nombre);
                subseleccionModificar.appendChild(apellido);
                subseleccionModificar.appendChild(correoElectronico);
                subseleccionModificar.appendChild(telefono);
                break;
            case "ventas":
                subseleccionModificar.innerHTML = "";

                const idCliente = document.createElement("option");
                idCliente.value = "id-cliente";
                idCliente.text = "ID Cliente";
                const fechaVenta = document.createElement("option");
                fechaVenta.value = "fecha-venta";
                fechaVenta.text = "Fecha Venta";

                subseleccionModificar.appendChild(idCliente);
                subseleccionModificar.appendChild(fechaVenta);
                break;
            case "detalle-ventas":
                subseleccionModificar.innerHTML = "";

                const idProductoVenta = document.createElement("option");
                idProductoVenta.value = "id-producto-venta";
                idProductoVenta.text = "ID Producto";
                const cantidadVenta = document.createElement("option");
                cantidadVenta.value = "cantidad-venta";
                cantidadVenta.text = "Cantidad";

                subseleccionModificar.appendChild(idProductoVenta);
                subseleccionModificar.appendChild(cantidadVenta);
                break;
            default:
                subseleccionModificar.innerHTML = "";
                break;
        }
    });

    // Busqueda de datos: manejo de boton de buscar
    const botonBusqueda = document.querySelector('section.busqueda-datos div.buscar-barra button[type="submit"]');

    botonBusqueda.addEventListener("click", (e) => {
        e.preventDefault();

        switch (seleccionBusqueda.value) {
            case "productos":
                if (subSeleccionBusqueda.value === "id-producto") {
                    enviarAPI('/api/buscarProductos', {
                        "idProducto": parseInt(barraBuscar.value.trim()),
                        "nombreModelo": null,
                        "marca": null
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-productos',
                            headers: ['ID Producto', 'Nombre Modelo', 'Marca', 'Costo', 'Precio', 'Cantidad En Stock', 'Fecha Disponible']
                        });
                        estiloTabla();
                    });
                } else if (subSeleccionBusqueda.value === "marca") {
                    enviarAPI('/api/buscarProductos', {
                        "idProducto": null,
                        "nombreModelo": null,
                        "marca": barraBuscar.value.trim()
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-productos',
                            headers: ['ID Producto', 'Nombre Modelo', 'Marca', 'Costo', 'Precio', 'Cantidad En Stock', 'Fecha Disponible']
                        });
                        estiloTabla();
                    });
                } else if (subSeleccionBusqueda.value === "nombre-modelo") {
                    enviarAPI('/api/buscarProductos', {
                        "idProducto": null,
                        "nombreModelo": barraBuscar.value.trim(),
                        "marca": null
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-productos',
                            headers: ['ID Producto', 'Nombre Modelo', 'Marca', 'Costo', 'Precio', 'Cantidad En Stock', 'Fecha Disponible']
                        });
                        estiloTabla();
                    });
                } else {
                    fetch('/api/buscarTodosLosProductos').then(response => response.json()).then(data => {
                        construirTabla('resultados-busqueda', data.data, {
                            claseTabla: 'resultados-tabla-productos',
                            headers: ['ID Producto', 'Nombre Modelo', 'Marca', 'Costo', 'Precio', 'Cantidad En Stock', 'Fecha Disponible']
                        });
                        estiloTabla();
                    });
                }
                break;
            case "clientes":
                if (subSeleccionBusqueda.value === "id-cliente") {
                    enviarAPI('/api/buscarClientes', {
                        "idCliente": parseInt(barraBuscar.value.trim()),
                        "nombre": null,
                        "apellido": null,
                        "correoElectronico": null,
                        "telefono": null
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-clientes',
                            headers: ['ID Cliente', 'Nombre', 'Apellido', 'Correo Electrónico', 'Teléfono']
                        });
                        estiloTabla();
                    });
                } else if (subSeleccionBusqueda.value === "nombre-cliente") {
                    enviarAPI('/api/buscarClientes', {
                        "idCliente": null,
                        "nombre": barraBuscar.value.trim(),
                        "apellido": null,
                        "correoElectronico": null,
                        "telefono": null
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-clientes',
                            headers: ['ID Cliente', 'Nombre', 'Apellido', 'Correo Electrónico', 'Teléfono']
                        });
                        estiloTabla();
                    });
                } else if (subSeleccionBusqueda.value === "correo-cliente") {
                    enviarAPI('/api/buscarClientes', {
                        "idCliente": null,
                        "nombre": null,
                        "apellido": null,
                        "correoElectronico": barraBuscar.value.trim(),
                        "telefono": null
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-clientes',
                            headers: ['ID Cliente', 'Nombre', 'Apellido', 'Correo Electrónico', 'Teléfono']
                        });
                        estiloTabla();
                    });
                } else if (subSeleccionBusqueda.value === "apellido-cliente") {
                    enviarAPI('/api/buscarClientes', {
                        "idCliente": null,
                        "nombre": null,
                        "apellido": barraBuscar.value.trim(),
                        "correoElectronico": null,
                        "telefono": null
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-clientes',
                            headers: ['ID Cliente', 'Nombre', 'Apellido', 'Correo Electrónico', 'Teléfono']
                        });
                        estiloTabla();
                    });
                } else if (subSeleccionBusqueda.value === "telefono-cliente") {
                    enviarAPI('/api/buscarClientes', {
                        "idCliente": null,
                        "nombre": null,
                        "apellido": null,
                        "correoElectronico": null,
                        "telefono": barraBuscar.value.trim()
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-clientes',
                            headers: ['ID Cliente', 'Nombre', 'Apellido', 'Correo Electrónico', 'Teléfono']
                        });
                        estiloTabla();
                    });
                } else {
                    fetch('/api/buscarTodosLosClientes').then(response => response.json()).then(data => {
                        construirTabla('resultados-busqueda', data.data, {
                            claseTabla: 'resultados-tabla-clientes',
                            headers: ['ID Cliente', 'Nombre', 'Apellido', 'Correo Electrónico', 'Teléfono']
                        });
                        estiloTabla();
                    });
                }
                break;
            case "ventas":
                if (subSeleccionBusqueda.value === "id-venta") {
                    enviarAPI('/api/buscarVentas', {
                        "idVenta": parseInt(barraBuscar.value.trim()),
                        "idCliente": null,
                        "fechaVenta": null,
                        "totalVenta": null,
                        "idProducto": null
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-ventas',
                            headers: ['ID Venta', 'ID Cliente', 'Nombre Cliente', 'Fecha Venta', 'ID Detalle de Venta', 'ID Producto', 'Nombre Producto', 'Cantidad', 'Precio Unidad', 'Total Venta']
                        });
                        estiloTabla();
                    });
                } else if (subSeleccionBusqueda.value === "id-cliente-venta") {
                    enviarAPI('/api/buscarVentas', {
                        "idVenta": null,
                        "idCliente": parseInt(barraBuscar.value.trim()),
                        "fechaVenta": null,
                        "totalVenta": null,
                        "idProducto": null
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-ventas',
                            headers: ['ID Venta', 'ID Cliente', 'Nombre Cliente', 'Fecha Venta', 'ID Detalle de Venta', 'ID Producto', 'Nombre Producto', 'Cantidad', 'Precio Unidad', 'Total Venta']
                        });
                        estiloTabla();
                    });
                } else if (subSeleccionBusqueda.value === "id-producto-venta") {
                    enviarAPI('/api/buscarVentas', {
                        "idVenta": null,
                        "idCliente": null,
                        "fechaVenta": null,
                        "totalVenta": null,
                        "idProducto": parseInt(barraBuscar.value.trim())
                    }).then(response => {
                        construirTabla('resultados-busqueda', response.data, {
                            claseTabla: 'resultados-tabla-ventas',
                            headers: ['ID Venta', 'ID Cliente', 'Nombre Cliente', 'Fecha Venta', 'ID Detalle de Venta', 'ID Producto', 'Nombre Producto', 'Cantidad', 'Precio Unidad', 'Total Venta']
                        });
                        estiloTabla();
                    });
                } else {
                    fetch('/api/buscarTodasLasVentas').then(response => response.json()).then(data => {
                        construirTabla('resultados-busqueda', data.data, {
                            claseTabla: 'resultados-tabla-ventas',
                            headers: ['ID Venta', 'ID Cliente', 'Nombre Cliente', 'Fecha Venta', 'ID Detalle de Venta', 'ID Producto', 'Nombre Producto', 'Cantidad', 'Precio Unidad', 'Total Venta']
                        });
                        estiloTabla();
                    });
                }
                break;
            default:
                const contenedor = document.getElementById('resultados-busqueda');
                contenedor.innerHTML = '<p>Favor seleccionar una de las opciones de la lista desplegable.</p>';
        }
    });

    // Crear nuevas entradas
    let productosCounter = 0;

    const crearVentasProductos = document.querySelector('div.form-crear-ventas-productos');
    crearVentasProductos.addEventListener('click', (e) => {
        const addButton = e.target.closest('div.anadir-mas-productos button');
        if (!addButton) return;

        e.preventDefault();
        productosCounter++;

        const divProductosVentas = document.querySelector('div.form-crear-ventas-productos');
        divProductosVentas.insertAdjacentHTML('beforeend', `
        <div class="producto-set" data-producto-id="${productosCounter}">
            <div class="form-crear-ventas">
                <label for="id-producto-${productosCounter}">ID Producto: </label>
                <input type="number" name="id-producto-${productosCounter}" id="id-producto-${productosCounter}" required />
            </div>
            <div class="form-crear-ventas">
                <label for="cantidad-venta-${productosCounter}">Cantidad: </label>
                <input type="number" name="cantidad-venta" id="cantidad-venta-${productosCounter}" required />
            </div>
            <div class="producto-actions">
                <button class="btn-remove" type="button">
                    <svg fill="red" viewBox="0 0 42 42" style="width: 20px; height: 20px;">
                        <path d="M14,14 L28,28 M28,14 L14,28" stroke="red" stroke-width="3"></path>
                    </svg>
                </button>
            </div>
            <div class="anadir-mas-productos">
                <button name="add-${productosCounter}" type="button">
                    <svg fill="black" viewBox="0 0 42 42" style="width: 20px; height: 20px;">
                        <path d="M19,8 L23,8 L23,19 L34,19 L34,23 L23,23 L23,34 L19,34 L19,23 L8,23 L8,19 L19,19 Z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `);

        addButton.style.display = 'none';
    });

// Remove products
    crearVentasProductos.addEventListener('click', (e) => {
        const removeButton = e.target.closest('.btn-remove');
        if (!removeButton) return;

        e.preventDefault();

        const productoSet = removeButton.closest('.producto-set');
        if (productoSet) {
            const previousSet = productoSet.previousElementSibling;
            productoSet.remove();

            // Show the add button of the last remaining set
            const allSets = document.querySelectorAll('.producto-set');
            if (allSets.length > 0) {
                const lastSet = allSets[allSets.length - 1];
                const lastAddButton = lastSet.querySelector('.anadir-mas-productos button');
                if (lastAddButton) {
                    lastAddButton.style.display = '';
                }
            } else {
                // If no sets left, show the original add button
                const originalButton = document.querySelector('div.anadir-mas-productos button');
                if (originalButton) {
                    originalButton.style.display = '';
                }
            }
        }
    });

    // Modificar
    const idModificar = document.getElementById('form-modificar-id');
    const valorModificar = document.getElementById('form-modificar');
    const botonModificar = document.querySelector('div.form-modificar input[type="submit"]');

    botonModificar.addEventListener('click', (e) => {
        e.preventDefault();

        // Productos
        if (seleccionModificar.value === "productos" && subseleccionModificar.value === "modelo") {
            fetch(`api/modificarProducto/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreModelo: valorModificar.value.trim(),
                    marca: null,
                    costo: null,
                    precio: null,
                    cantidadEnStock: null,
                    fechaDisponible: null
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "productos" && subseleccionModificar.value === "marca") {
            fetch(`api/modificarProducto/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreModelo: null,
                    marca: valorModificar.value.trim(),
                    costo: null,
                    precio: null,
                    cantidadEnStock: null,
                    fechaDisponible: null
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "productos" && subseleccionModificar.value === "costo") {
            fetch(`api/modificarProducto/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreModelo: null,
                    marca: null,
                    costo: parseInt(valorModificar.value.trim()),
                    precio: null,
                    cantidadEnStock: null,
                    fechaDisponible: null
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "productos" && subseleccionModificar.value === "precio") {
            fetch(`api/modificarProducto/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreModelo: null,
                    marca: null,
                    costo: null,
                    precio: parseInt(valorModificar.value.trim()),
                    cantidadEnStock: null,
                    fechaDisponible: null
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "productos" && subseleccionModificar.value === "cantidad-en-stock") {
            fetch(`api/modificarProducto/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreModelo: null,
                    marca: null,
                    costo: null,
                    precio: null,
                    cantidadEnStock: parseInt(valorModificar.value.trim()),
                    fechaDisponible: null
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "productos" && subseleccionModificar.value === "fecha-disponible") {
            fetch(`api/modificarProducto/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreModelo: null,
                    marca: null,
                    costo: null,
                    precio: null,
                    cantidadEnStock: null,
                    fechaDisponible: valorModificar.value.trim()
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "productos" && subseleccionModificar.value === "placeholder") {
            const resultadoModificar = document.getElementById('resultados-modificar');
            resultadoModificar.innerHTML = `<p>Favor seleccionar al menos un elementos de las dos listas desplegables.</p>`;
        }

        // Clientes
        if (seleccionModificar.value === "clientes" && subseleccionModificar.value === "nombre") {
            fetch(`/api/modificarCliente/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: valorModificar.value.trim(),
                    apellido: null,
                    correoElectronico: null,
                    telefono: null
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "clientes" && subseleccionModificar.value === "apellido") {
            fetch(`/api/modificarCliente/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: null,
                    apellido: valorModificar.value.trim(),
                    correoElectronico: null,
                    telefono: null
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "clientes" && subseleccionModificar.value === "correo-electronico") {
            fetch(`/api/modificarCliente/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: null,
                    apellido: null,
                    correoElectronico: valorModificar.value.trim(),
                    telefono: null
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "clientes" && subseleccionModificar.value === "telefono") {
            fetch(`/api/modificarCliente/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: null,
                    apellido: null,
                    correoElectronico: null,
                    telefono: valorModificar.value.trim()
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "clientes" && subseleccionModificar.value === "placeholder") {
            const resultadoModificar = document.getElementById('resultados-modificar');
            resultadoModificar.innerHTML = `<p>Favor seleccionar al menos un elementos de las dos listas desplegables.</p>`;
        }

        // Ventas
        if (seleccionModificar.value === "ventas" && subseleccionModificar.value === "id-cliente") {
            fetch(`/api/modificarVenta/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idCliente: parseInt(valorModificar.value.trim()),
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "ventas" && subseleccionModificar.value === "fecha-venta") {
            fetch(`/api/modificarVentaCabecera/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fechaVenta: valorModificar.value.trim(),
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        }

        // Detalle Ventas
        if (seleccionModificar.value === "detalle-ventas" && subseleccionModificar.value === "id-producto-venta") {
            fetch(`/api/modificarDetalleVenta/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idProducto: parseInt(valorModificar.value.trim()),
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        } else if (seleccionModificar.value === "detalle-ventas" && subseleccionModificar.value === "cantidad-venta") {
            fetch(`/api/modificarDetalleVenta/${idModificar.value.trim()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cantidad: parseInt(valorModificar.value.trim()),
                })
            }).then(res => res.json().then(response => {
                const resultadoModificar = document.getElementById('resultados-modificar');
                if (response.success === true) {
                    resultadoModificar.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                } else {
                    resultadoModificar.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                }
            }));
        }
    });

    // Eliminar datos
    const eliminarSelect = document.getElementById('eliminar-opciones');
    const idValorEliminar = document.getElementById('form-eliminar');
    const eliminarBoton = document.querySelector('div.form-eliminar input[type="submit"]');
    const eliminarPreview = document.getElementById('eliminar-preview');
    const eliminarResultado = document.getElementById('resultados-eliminar');

    idValorEliminar.addEventListener('input', e => {
        if (eliminarSelect.value === "productos") {
            enviarAPI('/api/buscarProductos', {
                idProducto: parseInt(idValorEliminar.value.trim())
            }).then(response => {
                construirTabla('eliminar-preview', response.data, {
                    claseTabla: 'preview-tabla-productos',
                    headers: ['ID Producto', 'Nombre Modelo', 'Marca', 'Costo', 'Precio', 'Cantidad En Stock', 'Fecha Disponible']
                }); 
                estiloTabla();
            });
        } else if (eliminarSelect.value === "clientes") {
            enviarAPI('/api/buscarClientes', {
                idCliente: parseInt(idValorEliminar.value.trim())
            }).then(response => {
                construirTabla('eliminar-preview', response.data, {
                    claseTabla: 'preview-tabla-clientes',
                    headers: ['ID Cliente', 'Nombre', 'Apellido', 'Correo Electrónico', 'Teléfono']
                });
                estiloTabla();
            });
        } else if (eliminarSelect.value === "ventas") {
            enviarAPI('/api/buscarVentas', {
                idVenta: parseInt(idValorEliminar.value.trim())
            }).then(response => {
                construirTabla('eliminar-preview', response.data, {
                    claseTabla: 'preview-tabla-clientes',
                    headers: ['ID Venta', 'ID Cliente', 'Nombre Cliente', 'Fecha Venta', 'ID Detalle de Venta', 'ID Producto', 'Nombre Producto', 'Cantidad', 'Precio Unidad', 'Total Venta']
                });
                estiloTabla();
            });
        }
    });

    eliminarBoton.addEventListener('click', e => {
        e.preventDefault();
        const confirmacion = confirm(`¿Está seguro que quiere eliminar estos datos?`);

        if (confirmacion) {
            switch (eliminarSelect.value) {
                case "productos":
                    fetch(`/api/eliminarProducto/${idValorEliminar.value.trim()}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                    }}).then(res => res.json().then(response => {
                        if (response.success === true) {
                            eliminarResultado.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                        } else {
                            eliminarResultado.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                        }
                    }));
                    break;
                    case "clientes":
                        fetch(`/api/eliminarCliente/${idValorEliminar.value.trim()}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                    }}).then(res => res.json().then(response => {
                        if (response.success === true) {
                            eliminarResultado.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                        } else {
                            eliminarResultado.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                        }
                    }));
                        break;
                        case "ventas":
                            fetch(`/api/eliminarVenta/${idValorEliminar.value.trim()}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                    }}).then(res => res.json().then(response => {
                        if (response.success === true) {
                            eliminarResultado.innerHTML = `<p style="color: darkgreen">${response.message}</p>`;
                        } else {
                            eliminarResultado.innerHTML = `<p style="color: darkred"><strong>Error:</strong> ${response.message}</p>`;
                        }
                    }));
            }
            
        }
    })
});
