document.addEventListener("DOMContentLoaded", () =>{
let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector(".carrito-acciones-vaciar");
const botonComprar = document.querySelector(".carrito-acciones-comprar");
const totalElemento = document.querySelector("#total");

actualizarCarrito();

botonVaciar.addEventListener("click", vaciarCarrito);
botonComprar.addEventListener("click", comprarCarrito);

function actualizarCarrito() {
    productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    contenedorCarritoProductos.innerHTML = "";

    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${(producto.precio * producto.cantidad).toFixed(2)}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash3-fill"></i></button>
            `;
            contenedorCarritoProductos.append(div);
        });

        actualizarTotal();
        actualizarBotonesEliminar();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    totalElemento.textContent = `$${totalCalculado.toFixed(2)}`;
}

function vaciarCarrito() {
    localStorage.removeItem("productos-en-carrito");
    actualizarCarrito();
}

function comprarCarrito() {
    

  const productosFormateados = productosEnCarrito.map(p => ({
    id_producto: parseInt(p.id.replace("producto-", "")),
    cantidad: p.cantidad,
    precio: p.precio
    
  }));

  const datosCompra = {
    productos: productosFormateados,
    total: productosFormateados.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
    direccion: "Calle Cliente 123", // futuro: input dinámico
    id_cliente: 1 // ⚠️ valor fijo temporal (hasta que integres login)
  };

  fetch('http://localhost:3000/api/comprar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosCompra)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.removeItem("productos-en-carrito");
      actualizarCarrito();

      contenedorCarritoVacio.classList.add("disabled");
      contenedorCarritoProductos.classList.add("disabled");
      contenedorCarritoAcciones.classList.add("disabled");
      contenedorCarritoComprado.classList.remove("disabled");

     window.open(`/pages/factura.html?id_venta=${data.id_venta}`, "_blank");

    }
  });
}


function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const id = e.currentTarget.id;
            productosEnCarrito = productosEnCarrito.filter(prod => prod.id !== id);
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            actualizarCarrito();
        });
    });
}
});