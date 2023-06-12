// importamos el paquete express
import express from 'express';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { messageRouter } from './routes/chat.router.js';
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import productService from './dao/product.service.js';
import MessageService from './dao/message.service.js';
import mongoose from 'mongoose';
import CartService from './dao/cart.service.js';

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

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chat', messageRouter);

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

    socket.on('agregarProducto', async ({ cartId, productId }) => {
      try {
        const carrito = await CartService.obtenerCarritoById(cartId);
        const producto = await productService.obtenerProductoById(productId);

        const productoExistente = carrito.products.find(item => item.product.toString() === productId);
  
        if (productoExistente) {
          productoExistente.quantity += 1;
        } else {
          carrito.products.push({
            product: producto._id,
            quantity: 1
          });
        }
  
        await carrito.save();
  
        socket.emit('carritoActualizado', carrito);
      } catch (err) {
        console.log(err);
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


