const existingCartId = localStorage.getItem('cartId');

async function verifyCart() {
  if (existingCartId !== null) {
    console.log(existingCartId, "el cart creado anteriormentessssss");
  } else {
    try {
      const response = await fetch(`/api/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data)
      localStorage.setItem('cartId', data._id);

    } catch (error) {
      console.error("Error:", error);
    }
  }
}

verifyCart();




// // Obtener todos los botones "agregar al carrito"
// const agregarProductoBotones = document.querySelectorAll('.btn-add-to-cart');
// agregarProductoBotones.forEach((boton) => {
//   boton.addEventListener('click', (e) => {
//     const productId = e.target.dataset.productId;

//     // Enviar el ID del carrito y el ID del producto al servidor a través de Socket.IO
//     socket.emit('agregarProducto', { cartId, productId });
//   });
// });

// socket.on('Cartproducts', (data) => {
//   const bodyElement = document.getElementById("bodyproducts");
//   const products = data.products;
//   let html = '';

//   products.forEach((item) => {
//     const product = item.product;
//     // Construir el HTML para cada producto
//     const productHtml = `
//       <div class="product">
//         <h2>${product.title}</h2>
//         <p>Description: ${product.description}</p>
//         <p>Price: $${product.price}</p>
//         <p>Stock: ${product.stock}</p>
//         <p>Category: ${product.category}</p>
//       </div>
//     `;

//     // Agregar el HTML del producto al HTML acumulativo
//     html += productHtml;
//   });

//   // Insertar el HTML acumulativo en el elemento <body>
//   bodyElement.innerHTML = html;
// });
  