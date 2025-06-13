// cojoemos los productos desde el localstorage

let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");


if (productosEnCarrito ){

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    productosEnCarrito.forEach(productos => {
        const div = document.createElement("div");
        div.classList.add("carrito-producto");
        div.innerHTML = `
                  <img src="${productos.imagen}" class="producto-imagen" alt="${productos.titulo}">
                        <div class="carrito-producto-titulo">
                            <small>Título</small>
                            <h3>${productos.titulo}</h3>
                        </div>
                        <div class="carrito-producto-cantidad">
                            <small>Cantida</small>
                            <p>${productos.cantida}</p>
                        </div>
                        <div class="carrito-producto-precio">
                            <small>Precio</small>
                            <p>${productos.precio}</p>
                        </div>
                        <div class="carrito-producto-subtotal">
                            <p>${productos.precio * productos.cantida}</p>
                        </div>
                        <button class="carrito-producto-eliminar" id="${productos.id}"><i class="bi bi-trash"></i></button>
                    </div>
        `;
        contenedorCarritoProductos.append(div);
    })

}else {
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
}
