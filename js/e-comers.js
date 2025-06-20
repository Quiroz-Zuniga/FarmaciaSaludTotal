
let productos = [];
fetch('http://localhost:3000/api/productos')
  .then(res => res.json())
  .then(data => {
productos = data.map(p => ({
  id: `producto-${p.id_producto}`,
  titulo: p.nombre,
  imagen: p.imagen,
  categoria: {
    nombre: p.categoria_nombre,
    id: p.categoria_nombre.toLowerCase() 
  },
  precio: p.precio,
  stock: p.stock,
  id_marca: p.id_marca,
  id_proveedor: p.id_proveedor
}));
;
    cargarProductos(productos);
  });
// function seleccionarImagen(nombreProducto) {
//   const nombre = nombreProducto.toLowerCase();
//   if (nombre.includes("acetaminofen")) return "/public/images/e-commers/Acetaminofen.png";
//   return "/public/images/e-commers/default.png";
// }

const contenedorProductos = document.querySelector("#contenedor-producto");
const botoncategoria = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector(".titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";
    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("productos");
        div.innerHTML = `
        <img src="${producto.imagen}" class="producto-imagen" alt="${producto.titulo}">
        <div class="productos-detalles">
            <h3 class="producto-titulo">${producto.titulo}</h3>
            <p class="producto-precio"> ${producto.precio}</p>
            <button class="producto-agregar" id="${producto.id}">Agregar</button>
        </div>
      `
      contenedorProductos.append(div);
    })  
    actualizarBotonesAgregar();
};

// cargarProductos(productos);

botoncategoria.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botoncategoria.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active")
         if (e.currentTarget.id != "todos") {
            const productosBoton = productos.filter(productos => productos.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productosBoton[0]?.categoria.nombre || "Productos";

            cargarProductos(productosBoton);
         } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
         }
    })
})

function actualizarBotonesAgregar (){
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    })
}

// let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

function agregarAlCarrito(e) {
  const idBoton = e.currentTarget.id;
  const productosAgregado = productos.find(productos => productos.id === idBoton);

  let carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

  if (carrito.some(producto => producto.id === idBoton)) {
    const index = carrito.findIndex(producto => producto.id === idBoton);
    carrito[index].cantidad++;
  } else {
    const productoParaCarrito = {
      id: productosAgregado.id,
      titulo: productosAgregado.titulo,
      imagen: productosAgregado.imagen,
      precio: productosAgregado.precio,
      cantidad: 1
    };
    carrito.push(productoParaCarrito);
  }

  localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));
  actualizarNumerito();
}


function actualizarNumerito() {
  const carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
  const nuevoNumerito = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  numerito.innerHTML = nuevoNumerito;
}
