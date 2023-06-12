import { cartModel } from '../dao/models/cartModel.js';
import productService from './product.service.js';

class cartService {
	constructor() {
		this.model = cartModel;
	}

	async agregarCarrito(cart) {
		cart.products = [];
		return await this.model.create(cart);
	}

	async obtenerCarritos() {
		return await this.model.find().lean();
	}

	async obtenerCarritoById(cartId){
		return await this.model.findById(cartId).populate('products.product').lean();
	}

	// async agregarProductoCarrito(cartId, prodId) {
	// 	const carrito = await this.model.findOne({ _id: cartId });
	// 	const producto = await productService.obtenerProductoById(prodId);
	  		
	// 	const productoExistente = carrito.products.find(
	// 	  (item) => item.product.toString() === prodId
	// 	);
	  
	// 	if (productoExistente) {
	// 	  productoExistente.quantity += 1;
	// 	} else {
	// 	  carrito.products.push({
	// 		product: producto._id,
	// 		quantity: 1
	// 	  });
	// 	}
	  
	// 	return await carrito.save();
	// }
	async agregarProductoCarrito(prodId) {
		const carrito = JSON.parse(localStorage.getItem('carrito')) || { products: [] };
		const producto = await productService.obtenerProductoById(prodId);
	  
		const productoExistente = carrito.products.find(
		  (item) => item.product.toString() === prodId
		);
	  
		if (productoExistente) {
		  productoExistente.quantity += 1;
		} else {
		  carrito.products.push({
			product: producto._id,
			quantity: 1
		  });
		}
	  
		localStorage.setItem('carrito', JSON.stringify(carrito));
	  
		return carrito;
	  }

	async vaciarCarrito(cartId) {
		const carrito = await this.model.findOne({ _id: cartId });
		
		carrito.products = [];
		
		return await carrito.save();
	}

	async eliminarProductoDeCarrito(cartId, prodId) {
		const carrito = await this.model.findOne({ _id: cartId });
  
		// Buscar el producto en el arreglo de productos del carrito
		const producto = carrito.products.find(
		  (item) => item.product.toString() === prodId
		);
		
		if (producto) {
		  // Si se encuentra el producto, restar la cantidad en 1
		  if (producto.quantity > 1) {
			producto.quantity -= 1;
		  } else {
			// Si la cantidad es 1, eliminar el producto del arreglo
			carrito.products = carrito.products.filter(
			  (item) => item.product.toString() !== prodId
			);
		  }
		  return await carrito.save();
		}
		return carrito;
		
	}

	async actualizarCantidadProductoCarrito(cartId, prodId, newQuantity) {
		const carrito = await this.model.findOne({ _id: cartId });
		
		// Buscar el producto en el arreglo de productos del carrito
		const producto = carrito.products.find(
		  (item) => item.product.toString() === prodId
		);
		
		if (producto) {
		  // Actualizar la cantidad del producto
		  producto.quantity = newQuantity;
		  return await carrito.save();
		} else {
		  // Si no se encuentra el producto, no se realiza ninguna acción
		  return carrito;
		}
	}

	async actualizarArrayCarrito(cartId, nuevosProductos) {
		const carrito = await this.model.findOne({ _id: cartId });
	  
		nuevosProductos.forEach(async (nuevoProducto) => {
		  const { product, quantity } = nuevoProducto;
		  const productoExistente = carrito.products.find(
			(item) => item.product.toString() === product
		  );
	  
		  if (productoExistente) {
			productoExistente.quantity += quantity;
		  } else {
			carrito.products.push({
			  product: product,
			  quantity: quantity
			});
		  }
		});
	  
		await carrito.save();
		return carrito;
	}
}

const CartService = new cartService();
export default CartService;