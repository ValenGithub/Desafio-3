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

	async agregarProductoCarrito(cartId, prodId) {
		const carrito = await this.model.findOne({ _id: cartId });
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
	  
		return await carrito.save();
	  }

	async eliminarCarrito(cartId) {
		return await this.model.findByIdAndDelete(cartId);
	  }
}

const CartService = new cartService();
export default CartService;