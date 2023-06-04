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
    productList.innerHTML = newList.join("");
  }
  
  socket.on("productList", async (data) =>{
    console.log(data);
    render(data);
  })
  
  socket.on("updatedProducts", (data) => {
    render(data);
  });

  function enviarEmail() {
    const email = document.getElementById('emailInput').value;
    if (email.trim() === '') {
      Swal.fire('Error', 'Debe ingresar un email válido', 'error');
      return;
    }
  
    socket.emit('email', email);
  
    Swal.fire('¡Email guardado!', 'Su email ha sido guardado exitosamente', 'success');
  }