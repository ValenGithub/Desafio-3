import { productModel } from '../dao/models/productModel.js';

class ProductService {
	constructor(io) {
		this.model = productModel;
		this.io = io;
	}

	async obtenerProductos() {
		return await this.model.find();
	}

	async agregarProducto(product) {
		if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock ) {
			throw new Error('Faltan campos');
		}
		return await this.model.create(product);
	}

    async obtenerProductoById(prodId) {
		return await this.model.findById(prodId);
	  }

	async actualizarProducto(pid, product) {
		if (!pid) {
			throw new Error('Ingrese el id del producto a actualizar');
		}
		return await this.model.updateOne({ _id: pid }, product);
	}

	async eliminarProducto(pid) {
        if (!pid) {
			throw new Error('Ingrese el id del producto a eliminar');
		}
		return this.model.deleteOne({ _id: pid });
	}
}

const productService = new ProductService();
export default productService;