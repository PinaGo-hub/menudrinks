let carrito = [];

// Cargar carrito desde localStorage
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
  actualizarCarrito();
}

// Lista de productos con categorías
const productos = [
  { id: 1, nombre: "Drink Limon", precio: 100, imagen: "img/drink5.png", categoria: "Bebida" },
  { id: 2, nombre: "Drink Piña", precio: 100, imagen: "img/drink4.png", categoria: "Bebida" },
  { id: 3, nombre: "Drink Maracuya", precio: 100, imagen: "img/drink3.png", categoria: "Bebida" },
  { id: 4, nombre: "Drink Fresa", precio: 100, imagen: "img/drink2.png", categoria: "Bebida" },
  { id: 5, nombre: "Drink Mora", precio: 100, imagen: "img/drink1.png", categoria: "Bebida" },
  { id: 6, nombre: "Granizado Mora", precio: 120, imagen: "img/granizado1.png", categoria: "Granizado" },
  { id: 7, nombre: "Granizado Fresa", precio: 120, imagen: "img/granizado2.png", categoria: "Granizado" },
  { id: 8, nombre: "Granizado Limon", precio: 150, imagen: "img/granizado3.png", categoria: "Granizado" },
  { id: 9, nombre: "Frappe Caramelo", precio: 150, imagen: "img/frappe1.png", categoria: "Frappe" },
  { id: 9, nombre: "Frappe De Dulce", precio: 150, imagen: "img/frappe2.png", categoria: "Frappe" },
];

// Renderizar productos por categoría
function renderProductos() {
  const categorias = {
    "Bebida": document.getElementById("bebidas-container"),
    "Granizado": document.getElementById("granizados-container"),
    "Frappe": document.getElementById("frappes-container"),
    "Granitas": document.getElementById("Granitas-container"),
  };

  // limpiar contenedores antes de cargar
  Object.values(categorias).forEach(c => c.innerHTML = "");

  productos.forEach((producto) => {
    const col = document.createElement("div");
    col.className = "col s6 m4";
    col.setAttribute("data-aos", "fade-up");
    col.innerHTML = `
      <div class="card hoverable" style="border-radius:10px; height:auto;">
        <div class="card-image">
          <img src="${producto.imagen}" style="height:auto; object-fit:cover; border-radius:10px 10px 0 0;">
        </div>
        <div class="card-content center-align" style="padding:10px;">
          <span class="card-title" style="font-size:18px;">${producto.nombre}</span>
          <p style="margin:5px 0;">L.${producto.precio}</p>
        </div>
        <div class="card-action center teal orange" style="border-radius:0 0 10px 10px;">
          <a href="#!" class="white-text" onclick="abrirPersonalizar(${producto.id})">
            Personalizar & Agregar
          </a>
        </div>
      </div>
    `;
    categorias[producto.categoria].appendChild(col);
  });
}

let productoSeleccionado = null;

function abrirPersonalizar(id) {
  productoSeleccionado = productos.find((p) => p.id === id);
  document.getElementById("modal-titulo").innerText = `Personalizar: ${productoSeleccionado.nombre}`;
  
  document.getElementById("cantidad").value = 1;
  document.querySelectorAll('input[name="tamano"]').forEach(i => i.checked = false);

  M.Modal.getInstance(document.getElementById("personalizarModal")).open();
}

function confirmarPersonalizacion() {
  const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
  const tamano = document.querySelector('input[name="tamano"]:checked')?.value;

  if (!tamano) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Debes seleccionar un tamaño",
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
    return;
  }

  let precioFinal = productoSeleccionado.precio;
  if (tamano === "Grande") {
    precioFinal += 20; // 🔥 Suplemento por tamaño grande
  }

  carrito.push({
    ...productoSeleccionado,
    tamano: tamano,
    cantidad: cantidad,
    precio: precioFinal
  });

  actualizarCarrito();
  M.Modal.getInstance(document.getElementById("personalizarModal")).close();

  Swal.fire({
    icon: "success",
    title: "¡Agregado!",
    text: `${productoSeleccionado.nombre} (${tamano}) x${cantidad}`,
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
    background: "#28a745",
    color: "white",
  });
}

function actualizarCarrito() {
  const cont = document.getElementById("carrito-items");
  cont.innerHTML = "";
  let total = 0;

  carrito.forEach((item, i) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    cont.innerHTML += `
      <div class="carrito-item">
        <img src="${item.imagen}" alt="${item.nombre}">
        <div style="flex:1">
          <strong>${item.nombre}</strong><br>
          <span>Tamaño: ${item.tamano}</span><br>
          <span>Cant: ${item.cantidad} | L.${item.precio} c/u</span><br>
          <b>Subtotal: L.${subtotal}</b>
        </div>
        <button onclick="eliminarDelCarrito(${i})">×</button>
      </div>
    `;
  });

  document.getElementById("cartTotal").innerText = `Total: L.${total}`;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarDelCarrito(i) {
  carrito.splice(i, 1);
  actualizarCarrito();
}

function cotizarWhatsApp() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "Agrega productos antes de cotizar",
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
    return;
  }

  let mensaje = " *Pedido desde la Tienda Online*%0A%0A";
  let total = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `-> ${item.nombre} (${item.tamano}) x${item.cantidad}%0A`;
    mensaje += `-> Subtotal: L.${subtotal}%0A%0A`;
  });

  mensaje += `--------------------%0A`;
  mensaje += `-> *TOTAL: L.${total}*%0A%0A`;
  mensaje += `-> Enviado desde mi carrito en la Tienda Online`;

  const numero = "50498174113";
  const url = `https://wa.me/${numero}?text=${mensaje}`;
  window.open(url, "_blank");
}

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", function () {
  M.Modal.init(document.querySelectorAll(".modal"));
  AOS.init({ duration: 1000, once: true });
  renderProductos(); // 🚀 Renderizamos productos agrupados
});

