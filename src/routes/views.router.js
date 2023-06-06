import Router from "express";
import productService from "../dao/product.service.js";

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  const renderProdList = await productService.obtenerProductos();
  res.render("index", { renderProdList });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const renderProdList = await productService.obtenerProductos();
    res.render("realTimeProducts", { renderProdList });
});

viewsRouter.get('/chat', async (req, res) => {
	res.render('chat');
});

export default viewsRouter;
