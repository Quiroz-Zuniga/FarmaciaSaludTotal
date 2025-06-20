 const carruselContenedor = document.querySelector('.carrusel_contenedor');
  const items = document.querySelectorAll('.carrusel-item');
  const anterior = document.querySelector('.antes');
  const siguiente = document.querySelector('.sigue');
  let index = 0;
  const totalItems = items.length;

  function mostrarItem(i) {
    const offset = -i * 100;
    carruselContenedor.style.transform = `translateX(${offset}%)`;
  }

  function avanzar() {
    index = (index + 1) % totalItems;
    mostrarItem(index);
  }

  function retroceder() {
    index = (index - 1 + totalItems) % totalItems;
    mostrarItem(index);
  }

  siguiente.addEventListener('click', avanzar);
  anterior.addEventListener('click', retroceder);

  // Automático cada 2 segundos
  setInterval(avanzar, 2000);