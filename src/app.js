// importamos el paquete express
import express from 'express';
import ProductManager from './models/ProductManager.js';

// Creamos la aplicación
const app = express();
const productManager = new ProductManager("./products.json");

app.use(express.json());
// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));


app.get('/api/products', async ( req, res) => {
	const limit = req.query.limit; // obtener el query param limit
	let products = await productManager.getProducts();
	//res.send({ products }); // obtener los productos desde ProductManager
  
	if (limit && !isNaN(limit)) { // verificar si se paso un limite por parametro
    	res.send({ productos: products.slice(0, parseInt(limit)) }); // devolver solo los productos correspondientes al limit
	} else {
    	res.send({ productos: products }); // devolver todos los productos si no se proporciono el limit
  	}
});

app.get('/api/products/:pid', async (req, res) => {
	try {
		let productoSolicitado = await productManager.getProductById(parseInt(req.params.pid))
		res.send({ producto: productoSolicitado });
	} catch (err) {
		res.status(400).send({ err });
	}
});
 

app.listen(8080, () => {
	console.log('escucho el 8080');
});


