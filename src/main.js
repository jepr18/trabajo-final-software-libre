document.addEventListener('DOMContentLoaded', () => {
  const seleccionCrear = document.querySelector('div.crear-seleccion select');
  const formCrearProductos = document.querySelector('div.crear-datos form.form-crear-productos');
  const formCrearClientes = document.querySelector('div.crear-datos form.form-crear-clientes');
  const formCrearVentas = document.querySelector('div.crear-datos form.form-crear-ventas');
  const seleccionModificar = document.querySelector('div.modificar-seleccion select');
  const subseleccionModificar = document.querySelector('div.modificar-sub-seleccion select');

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
  })
});
