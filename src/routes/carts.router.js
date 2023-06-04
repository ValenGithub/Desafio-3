import { Router } from 'express';
import cartService from '../dao/cart.service.js';

const cartsRouter = Router();
//const cartManager = new CartManager();

// cartsRouter.post('/', async (req, res) => {
//   try {
//     let nuevoCarrito = await cartManager.createCart();
//     res.status(201).send({ carritos: nuevoCarrito });
//   } catch (err) {
//     res.status(400).send({ err });
//   }
// });

// cartsRouter.get('/:cid', async (req, res) => {
//     try{
//         let productosDelCarrito = await cartManager.getCartProducts(parseInt(req.params.cid))
//         res.send( productosDelCarrito );
//     }catch (err){
//         res.status(400).send({ err });
//     }
// })

// cartsRouter.post('/:cid/product/:pid', async (req, res) => {
//     try {
//       let productoAgregado = await cartManager.addProductCart(parseInt(req.params.cid), parseInt(req.params.pid));
//       res.status(201).send({ nuevoProducto: productoAgregado });
//     } catch (err) {
//       res.status(400).send({ err });
//     }
//   });

cartsRouter.post('/', async (req, res) => {
	const carrito = req.body;
	try {
		const nuevoCarrito = await cartService.agregarCarrito(carrito);
		res.status(201).send({ carritos: nuevoCarrito });
	} catch (err) {
		res.status(500).send({ err });
	}
});

cartsRouter.get('/', async (req, res) => {
	try {
		const carritos = await cartService.obtenerCarritos();
		res.send(carritos);
	} catch (err) {
		res.status(500).send({ err });
	}
});


cartsRouter.post('/:cid/product/:pid', async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	try {
		const productAdded = await cartService.agregarProductoCarrito(
			cartId,
			productId
		);
		res.send(productAdded);
	} catch (err) {
		res.status(500).send({ err });
	}
});

cartsRouter.delete('/:cartId', async (req, res) => {
	const cartId = req.params.cartId;
	try {
	  await cartService.eliminarCarrito(cartId);
	  res.sendStatus(204); 
	} catch (err) {
	  res.status(500).send({ err });
	}
  });

export { cartsRouter };