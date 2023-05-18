// importamos el paquete express
import express from 'express';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import ProductManager from './models/ProductManager.js';


// Creamos la aplicación
const app = express();
const productManager = new ProductManager("./products.json");

app.use(express.json());
// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine('handlebars', handlebars.engine());
app.set('views' , 'views/' );
app.set('view engine','handlebars');

app.use('/', viewsRouter);

app.use((req, res, next) => {
  req.productManager = productManager; // Pasamos el objeto productManager a cada solicitud
  req.io = io; // Pasamos el objeto io a cada solicitud
  next();
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const httpServer = app.listen(8080, () => {
  console.log("Listening in 8080"); //Check de que el servidor se encuentra funcionando en el puerto 8080.
});
const io = new Server(httpServer);
  
  io.on("connection", async (socket) => {
    try{
        console.log("Nuevo cliente conectado!");
        socket.emit("productList", await productManager.getProducts());
    }catch(err){
        console.log(err)
    }
    
  });


