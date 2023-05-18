// import { Router } from 'express';
// import ProductManager from '../models/ProductManager.js';
// import { Server } from "socket.io";

// const productsRouter = Router();
// const productManager = new ProductManager("./products.json");


// productsRouter.get('/', async ( req, res) => {
// 	const limit = req.query.limit; // obtener el query param limit
// 	let products = await productManager.getProducts();
// 	//res.send({ products }); // obtener los productos desde ProductManager
  
// 	if (limit && !isNaN(limit)) { // verificar si se paso un limite por parametro
//     	res.send({ productos: products.slice(0, parseInt(limit)) }); // devolver solo los productos correspondientes al limit
// 	} else {
//     	res.send({ productos: products }); // devolver todos los productos si no se proporciono el limit
//   	}
// });

// productsRouter.get('/:pid', async (req, res) => {
// 	try {
// 		let productoSolicitado = await productManager.getProductById(parseInt(req.params.pid))
// 		res.send({ producto: productoSolicitado });
// 	} catch (err) {
// 		res.status(400).send({ err });
// 	}
// });

// productsRouter.post('/' , async (req, res) => {
// 	let { producto } = req.body;
   
//     const camposRequeridos = {
//         title: true,
//         description: true,
//         price: true, 
//         thumbnail: true,
//         code: true,
//         stock: true
//       };
    
//       for (const campo of Object.keys(camposRequeridos)) {
//         if (!producto.hasOwnProperty(campo)) {
//           return res.status(400).send(`El campo '${campo}' es requerido`);
//         }
//       }
    
//     try{
        
// 	    await productManager.addProduct(producto)
// 	    res.status(201).send({ producto: producto });
//     }catch(err) {
// 		res.status(400).send({ err });

//     }
    
// });

// productsRouter.put('/:pid', async (req, res) => {
// 	const id = parseInt(req.params.pid);
// 	let { producto } = req.body;
// 	try {
// 		let anterior = await productManager.getProductById(id);
// 		await productManager.updateProduct(id, producto);
// 		res.send({ anterior, productoActualizado: producto });
// 	} catch (err) {
// 		res.status(400).send({ err });
// 	}
// });

// productsRouter.delete('/:pid', (req, res) => {
// 	const id = parseInt(req.params.pid);
// 	try {
// 		productManager.deleteProduct(id);
// 		res.send();
// 	} catch (err) {
// 		res.status(400).send({ err });
// 	}
// });

// export { productsRouter };

import { Router } from 'express';
import ProductManager from '../models/ProductManager.js';
import { Server } from "socket.io";

const productsRouter = Router();
const productManager = new ProductManager("./products.json");

// Configuración de Socket.IO
const server = new Server();
const io = server.io;

productsRouter.get('/', async (req, res) => {
  const limit = req.query.limit;
  let products = await productManager.getProducts();

  if (limit && !isNaN(limit)) {
    res.send({ productos: products.slice(0, parseInt(limit)) });
  } else {
    res.send({ productos: products });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    let productoSolicitado = await productManager.getProductById(parseInt(req.params.pid));
    res.send({ producto: productoSolicitado });
  } catch (err) {
    res.status(400).send({ err });
  }
});

productsRouter.post('/', async (req, res) => {
    let { producto } = req.body;
  
    const camposRequeridos = {
        title: true,
        description: true,
        price: true,
        thumbnail: true,
        code: true,
        stock: true
    };
  
    const camposFaltantes = [];
  
    for (const campo of Object.keys(camposRequeridos)) {
        if (!producto.hasOwnProperty(campo)) {
            camposFaltantes.push(campo);
        }
    }
  
    if (camposFaltantes.length > 0) {
        return res.status(400).send(`Los siguientes campos son requeridos: ${camposFaltantes.join(', ')}`);
    }
  
    try {
        await req.productManager.addProduct(producto);
        req.io.emit("updatedProducts", await req.productManager.getProducts()); // Emitir el evento a través de req.io
        res.status(201).send({ producto: producto });
    } catch (err) {
        res.status(400).send({ err });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    let { producto } = req.body;
    try {
        let anterior = await req.productManager.getProductById(id);
        await req.productManager.updateProduct(id, producto);
        req.io.emit("updatedProducts", await req.productManager.getProducts()); // Emitir el evento a través de req.io
        res.send({ anterior, productoActualizado: producto });
    } catch (err) {
        res.status(400).send({ err });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
  
    try {
        await req.productManager.deleteProduct(id);
        req.io.emit("updatedProducts", await req.productManager.getProducts()); // Emitir el evento a través de req.io
        res.send();
    } catch (err) {
        res.status(400).send({ err });
    }
});

export { productsRouter };