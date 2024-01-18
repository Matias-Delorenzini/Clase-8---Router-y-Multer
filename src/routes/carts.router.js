// Importamos las dependencias y la clase cartmanager
import express from 'express';
const router = express.Router();
import CartManager from '../classes/CartManager.js';
const cartManager = new CartManager();

// Endpoint que añade un cart
router.post('/', async (req, res) => {
    const resp = await cartManager.addCart();
    res.status(200).send({ msg: resp });
});

// Endpoint que muestra un cart
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    res.status(200).send(cart.data);
});

// Endpoint que añade un producto a un cart
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const resp = await cartManager.addProductToCart(cid, pid);
    res.status(200).send({ msg: resp });
});

// Exportamos
export default router;
