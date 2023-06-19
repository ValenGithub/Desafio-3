// importamos el paquete express
import express from 'express';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { messageRouter } from './routes/chat.router.js';
import { usersRouter } from './routes/user.router.js';
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import productService from './dao/product.service.js';
import MessageService from './dao/message.service.js';
import mongoose from 'mongoose';
import CartService from './dao/cart.service.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import userService from './dao/user.service.js';

const messages = [];
// Creamos la aplicación
const app = express();
//const productManager = new ProductManager("./products.json");

app.use(express.json());
// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine('handlebars', handlebars.engine());
app.set('views' , 'views/' );
app.set('view engine','handlebars');

app.use('/', viewsRouter);

app.use((req, res, next) => {
  req.productService = productService; // Pasamos el objeto productManager a cada solicitud
  req.io = io; // Pasamos el objeto io a cada solicitud
  next();
});


// Middleware cookies parser
//app.use(cookieParser());
app.use(cookieParser('B2zdY3B$pHmxW%'));

// Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl:
      'mongodb+srv://valentinomoreschi:vm1013@cluster0.zqlrbgb.mongodb.net/?retryWrites=true&w=majority',
			mongoOptions: {
				useNewUrlParser: true,
			},
			ttl: 6000,
		}),
		secret: 'B2zdY3B$pHmxW%',
		resave: true,
		saveUninitialized: true,
	})
);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chat', messageRouter);
app.use('/api/users', usersRouter);



mongoose.connect(
	'mongodb+srv://valentinomoreschi:vm1013@cluster0.zqlrbgb.mongodb.net/?retryWrites=true&w=majority'
);

const httpServer = app.listen(8080, () => {
  console.log("Listening in 8080"); //Check de que el servidor se encuentra funcionando en el puerto 8080.
});
const io = new Server(httpServer);
const messageService = new MessageService(io);
  
io.on("connection", async (socket) => {
  try {
    console.log("New client connected!");

    socket.emit("productList", await productService.obtenerProductos());
    socket.emit('messages', await messageService.obtenerMensajes());

    try {
      const cart = await CartService.agregarCarrito();
      socket.emit('cartId', cart._id)
    } catch (error) {
      console.log(error)
    }
  
    socket.on('agregarProducto', async ({ cartId, productId }) => {
      try {
        await CartService.agregarProductoCarrito(cartId,productId);
        let cart = await CartService.obtenerCarritoById(cartId);
        io.emit('Cartproducts', cart );
      } catch (error) {
        console.log(error)
      }
    }); 

    socket.on('message', async (message) => {
      console.log(message);
      const { user, msj } = message;
      await messageService.guardarMensaje(user, msj);
      const nuevosMensajes = await messageService.obtenerMensajes();
      socket.emit('messages', nuevosMensajes);
    });

    socket.on('sayhello', (data) => {
      socket.broadcast.emit('connected', data);
    });
  } catch (err) {
    console.log(err);
  }
});


