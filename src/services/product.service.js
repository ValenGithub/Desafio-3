export default class ProductService {
    constructor(dao) {
      this.dao = dao;
    }
  
    agregarProducto(product) {
      return this.dao.agregarProducto(product)
    }

    obtenerProductos(){
        return this.dao.obtenerProductos()
    }
  
    async obtenerProductosPaginados(limit = 10, page = 1, sort = 'asc', query = 'all') {
      const result = await this.dao.obtenerProductosPaginados(limit = 10, page = 1, sort = 'asc', query = 'all');
      return result;
    }
  
  
    actualizarProducto(pid, product) {
      return this.dao.actualizarProducto(pid, product);
    }
  
    obtenerProductoById(prodId) {
      return this.dao.obtenerProductoById(prodId)
    }
  
  
    eliminarProducto(pid) {
      return this.dao.eliminarProducto(pid);
    }
  
  }