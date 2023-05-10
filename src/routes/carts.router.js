import { Router } from 'express';
import CartManager from '../models/CartManager.js';

const cartsRouter = Router();
const cartManager = new CartManager();

cartsRouter.post('/', async (req, res) => {
  try {
    let nuevoCarrito = await cartManager.createCart();
    res.status(201).send({ carritos: nuevoCarrito });
  } catch (err) {
    res.status(400).send({ err });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
    try{
        let productosDelCarrito = await cartManager.getCartProducts(parseInt(req.params.cid))
        res.send( productosDelCarrito );
    }catch (err){
        res.status(400).send({ err });
    }
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
      let productoAgregado = await cartManager.addProductCart(parseInt(req.params.cid), parseInt(req.params.pid));
      res.status(201).send({ nuevoProducto: productoAgregado });
    } catch (err) {
      res.status(400).send({ err });
    }
  });



export { cartsRouter };