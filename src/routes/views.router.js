import Router from "express";
import productService from "../dao/product.service.js";
import CartService from "../dao/cart.service.js";
import { isAuth, isGuest } from '../middlewares/auth.js';

const viewsRouter = Router();

// viewsRouter.get("/", async (req, res) => {
//   const products = await productService.obtenerProductos();
//   res.render("index",  { renderProdList: products } );
// });

viewsRouter.get("/products", async (req, res) => {
  const { limit, page, sort, query } = req.query;
	const data = await productService.obtenerProductosPaginados(
		limit,
		page,
		sort,
    query
	);

  console.log(data)
	res.render('products', data);
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productService.obtenerProductos();
  res.render('realTimeProducts', { renderProdList: products });
});

viewsRouter.get('/chat', async (req, res) => {
	res.render('chat');
});

viewsRouter.get('/carts/:cid', async (req, res) => {
  const renderCart = await CartService.obtenerCarritoById(req.params.cid);
  console.log('Datos del carrito:', renderCart);
	res.render('cart', { renderCart });
});

viewsRouter.get('/',async (req, res) => {
	const { user } = req.session;
	console.log(user)
	delete user.password;
	try{
		res.render('index', {user});
	}catch(err){
		res.status(500).send(err)
	}	
});


viewsRouter.get('/register',(req, res) => {
	res.render('register', {
		title: 'Registrar Nuevo Usuario',
	});
});

viewsRouter.get('/login',(req, res) => {
	res.render('login', {
		title: 'Inicio de Sesión',
	});
});


export default viewsRouter;
