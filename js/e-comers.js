
const productos = [
    // Skincare
    {
        id: "skincare-1",
        titulo: "Crema Hidratante Facial",
        imagen: "/public/images/e-commers/carebe.png",
        categoria: {
            nombre: "Skincare",
            id: "skincare"
        },
        precio: 250.00,
        stock: 50,
        id_marca: 1,
        id_proveedor: 1
    },
    {
        id: "skincare-2",
        titulo: "Crema Tópica Betader",
        imagen: "/public/images/e-commers/Betaderm.png",
        categoria: {
            nombre: "Skincare",
            id: "skincare"
        },
        precio: 180.00,
        stock: 40,
        id_marca: 2,
        id_proveedor: 2
    },

    // Medicamentos
    {
        id: "medicamento-1",
        titulo: "Acetaminofen 500mg",
        imagen: "/public/images/e-commers/Acetaminofen.png",
        categoria: {
            nombre: "Medicamentos",
            id: "medicamentos"
        },
        precio: 147.25,
        stock: 100,
        id_marca: 1,
        id_proveedor: 1
    },
    {
        id: "medicamento-2",
        titulo: "Aliviol 500mg",
        imagen: "/public/images/e-commers/Aliviol.png",
        categoria: {
            nombre: "Medicamentos",
            id: "medicamentos"
        },
        precio: 209.10,
        stock: 50,
        id_marca: 2,
        id_proveedor: 2
    },

    // Vitaminas
    {
        id: "vitamina-1",
        titulo: "Sukrol 1000mg",
        imagen: "/public/images/e-commers/Sukrol.png",
        categoria: {
            nombre: "Vitaminas",
            id: "vitaminas"
        },
        precio: 450.00,
        stock: 80,
        id_marca: 1,
        id_proveedor: 1
    },
    {
        id: "vitamina-2",
        titulo: "Sukrol Mujer 1000mg",
        imagen: "/public/images/e-commers/Sukrol Mujer.png",
        categoria: {
            nombre: "Vitaminas",
            id: "vitaminas"
        },
        precio: 520.50,
        stock: 60,
        id_marca: 2,
        id_proveedor: 2
    }
];

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

cargarProductos(productos);

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

let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productosAgregado = productos.find(productos => productos.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)){
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantida++;
    }else{
        // Crear una copia limpia con los campos que el carrito necesita:
        const productoParaCarrito = {
            id: productosAgregado.id,
            titulo: productosAgregado.titulo,
            imagen: productosAgregado.imagen,
            precio: productosAgregado.precio,
            cantida: 1
        };

        productosEnCarrito.push(productoParaCarrito);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito(){
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantida, 0);
    numerito.innerHTML = nuevoNumerito;
};