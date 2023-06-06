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

  