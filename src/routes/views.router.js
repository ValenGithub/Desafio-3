import Router from "express";
import ProductManager from "../models/ProductManager.js";

const viewsRouter = Router();
const productManager = new ProductManager("./products.json");

viewsRouter.get("/", async (req, res) => {
  const renderProdList = await productManager.getProducts();
  console.log(renderProdList)
  res.render("index", { renderProdList });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const renderProdList = await productManager.getProducts();
    res.render("realTimeProducts", { renderProdList });
  });

export default viewsRouter;
