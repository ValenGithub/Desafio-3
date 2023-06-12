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
    //productList.getElementById('productList').innerHTML = newList;
    productList.innerHTML = newList
  }
  
  socket.on("productList", async (data) =>{
    console.log(data);
    render(data);
  })
  
  socket.on("updatedProducts", (data) => {
    render(data);
  });

  socket.on('cartId', (cartId) => {
    // Guardar el ID del carrito en el Local Storage
    localStorage.setItem('cartId', cartId);
  });

  const cartId = localStorage.getItem('cartId');

// Obtener todos los botones "agregar al carrito"
const agregarProductoBotones = document.querySelectorAll('.btn-add-to-cart');
agregarProductoBotones.forEach((boton) => {
  boton.addEventListener('click', () => {
    const productId = boton.dataset.productId;

    // Enviar el ID del carrito y el ID del producto al servidor a través de Socket.IO
    socket.emit('agregarProducto', { cartId, productId });
  });
});
  