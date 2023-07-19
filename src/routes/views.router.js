import Router from "express";
import productController from "../controllers/product.controller.js"
import cartController from "../controllers/cart.controller.js";
import { isAuth, isGuest } from '../middlewares/auth.js';

const viewsRouter = Router();

// viewsRouter.get("/", async (req, res) => {
//   const products = await productService.obtenerProductos();
//   res.render("index",  { renderProdList: products } );
// });

viewsRouter.get("/products", async (req, res) => {
  	const { limit, page, sort, query } = req.query;
	const data = await productController.obtenerProductosPaginados(
		limit,
		page,
		sort,
    query
	);

	res.render('products', data );
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productController.obtenerProductos();
  res.render('realTimeProducts', { renderProdList: products });
});

viewsRouter.get('/chat', async (req, res) => {
	res.render('chat');
});

viewsRouter.get('/carts/:cid', async (req, res) => {
  const renderCart = await cartController.obtenerCarritoById(req.params.cid);
  console.log('Datos del carrito:', renderCart);
	res.render('cart', { renderCart });
});




viewsRouter.get('/register', (req, res) => {
	res.render('register', {
		title: 'Registrar Nuevo Usuario',
	});
});

viewsRouter.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
		// Si ya hay una sesión activa, redirigir al usuario a su perfil
		return res.redirect('/');
	}

	res.render('login', {
		title: 'Inicio de Sesión',
	});
});

viewsRouter.get('/', isAuth, (req, res) => {
	const user = { ...req.session.user };
	delete user.password;
	if (!req.isAuthenticated()) {
		// Si ya hay una sesión activa, redirigir al usuario a su perfil
		return res.redirect('/login');
	}
	try{
		res.render('index', {user});
	}catch(err){
		res.status(500).send(err)
	}	
});

viewsRouter.get('/admin', (req, res) => {
	const user = { ...req.session.user };
	delete user.password;

	if (req.user.role === "admin") {
		// El usuario tiene el rol de "admin"
		// Realiza alguna acción para un usuario administrador
		res.render('admin', {user});
	  } else {
		// El usuario no tiene el rol de "admin"
		// Realiza alguna acción para un usuario no administrador
		res.redirect('/')
	  }
});

viewsRouter.get('/current', isAuth, (req, res) => {
	const user = { ...req.session.user };
	delete user.password;
	if (!req.isAuthenticated()) {
		// Si ya hay una sesión activa, redirigir al usuario a otra página, como su perfil
		return res.redirect('/login');
	}
	try{
		res.render('index', {user});
	}catch(err){
		res.status(500).send(err)
	}	
});

export default viewsRouter;
