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
                break;
            case "clientes":
                formCrearClientes.style.display = "flex";
                formCrearClientes.style.flexWrap = "wrap";
                formCrearClientes.style.justifyContent = "center";
                formCrearProductos.style.display = "none";
                formCrearVentas.style.display = "none";
                break;
            case "ventas":
                formCrearVentas.style.display = "flex";
                formCrearVentas.style.flexWrap = "wrap";
                formCrearVentas.style.justifyContent = "center";
                formCrearProductos.style.display = "none";
                formCrearClientes.style.display = "none";
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
                const totalVenta = document.createElement("option");
                totalVenta.value = "total-venta";
                totalVenta.text = "Total Venta";
                const idProducto = document.createElement("option");
                idProducto.value = "id-producto";
                idProducto.text = "ID Producto";
                const cantidad = document.createElement("option");
                cantidad.value = "cantidad";
                cantidad.text = "Cantidad";
                const precioUnidad = document.createElement("option");
                precioUnidad.value = "precio-unidad";
                precioUnidad.text = "Precio Unidad";

                subseleccionModificar.appendChild(idCliente);
                subseleccionModificar.appendChild(fechaVenta);
                subseleccionModificar.appendChild(totalVenta);
                subseleccionModificar.appendChild(idProducto);
                subseleccionModificar.appendChild(cantidad);
                subseleccionModificar.appendChild(precioUnidad);
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
                    enviarAPI('http://localhost:3000/api/buscarProductos', {
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
                    enviarAPI('http://localhost:3000/api/buscarProductos', {
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
                    enviarAPI('http://localhost:3000/api/buscarProductos', {
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
                    fetch('http://localhost:3000/api/buscarTodosLosProductos').then(response => response.json()).then(data => {
                        construirTabla('resultados-busqueda', data.data, {
                            claseTabla: 'resultados-tabla-productos',
                            headers: ['ID Producto', 'Nombre Modelo', 'Marca', 'Costo', 'Precio', 'Cantidad En Stock', 'Fecha Disponible']
                        });
                        estiloTabla();
                    });
                }
                break;
        }
    })
});
