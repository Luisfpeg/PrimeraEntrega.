const express = require('express');
const router = express.Router();
const ejs = require('ejs');

// Configurar el motor de plantillas EJS
router.set('view engine', 'ejs');
router.set('views', path.join(__dirname, 'views'));

// Cart data
let cart = {
  items: []
};

// Get cart contents
router.get('/', (req, res) => {
  res.json(cart);
});

// Add item to cart
router.post('/', (req, res) => {
  const newItem = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };
  cart.items.push(newItem);
  res.json(cart);
});

// Create new cart
router.post('/new', (req, res) => {
  const newCart = {
    id: Math.floor(Math.random() * 1000), // Autogenerated id
    products: []
  };
  cart = newCart;
  res.json(newCart);
});

// Get cart contents by id
router.get('/:cid', (req, res) => {
  res.render('cart', { cart: cart }); // Renderizar la plantilla "cart.ejs" y pasar los datos del carrito
});
module.exports = router;