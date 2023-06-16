const socket = io();

function render(data) {
  const productList = document.getElementById("productList");

  const newList = data.map((prod) => {
    return `<li class="productTitle">${prod.title} 
      <ul class="productDesc">
        <li>Descripción: ${prod.description}</li>
        <li>Precio: ${prod.price}</li>
        <li>Stock: ${prod.stock}</li>
        <li>Código: ${prod.code}</li>
        <li>Imagen: ${prod.thumbnail}</li>
      </ul>
    </li>`;
  });

  productList.innerHTML = newList; // Gabriel saco el metodo join q habia despues de newlist
}

socket.on("productList", async (data) => {    //saco el consolelog de data arriba de render
  render(data);
});

socket.on("updatedProducts", (data) => {
  render(data);
});

socket.on('cartId', (cartId) => {
  // Guardar el ID del carrito en el Local Storage
  localStorage.setItem('cartId', cartId);
  socket.emit('cartIdMostrar', cartId);
  console.log(cartId);
});

const cartId = localStorage.getItem('cartId');


// Obtener todos los botones "agregar al carrito"
const agregarProductoBotones = document.querySelectorAll('.btn-add-to-cart');
agregarProductoBotones.forEach((boton) => {
  boton.addEventListener('click', (e) => {
    const productId = e.target.dataset.productId;

    // Enviar el ID del carrito y el ID del producto al servidor a través de Socket.IO
    socket.emit('agregarProducto', { cartId, productId });
  });
});

socket.on('Cartproducts', (data) => {
  const bodyElement = document.getElementById("bodyproducts");
  const products = data.products;
  let html = '';

  products.forEach((item) => {
    const product = item.product;
    // Construir el HTML para cada producto
    const productHtml = `
      <div class="product">
        <h2>${product.title}</h2>
        <p>Description: ${product.description}</p>
        <p>Price: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Category: ${product.category}</p>
      </div>
    `;

    // Agregar el HTML del producto al HTML acumulativo
    html += productHtml;
  });

  // Insertar el HTML acumulativo en el elemento <body>
  bodyElement.innerHTML = html;
});
  