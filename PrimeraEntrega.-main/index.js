const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Middlewares
app.use(bodyParser.json());

// Routes
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Function to save products to file
function saveProducts(products) {
  fs.writeFileSync('./data/productos.json', JSON.stringify(products));
}

// Function to load products from file
function loadProducts() {
  try {
    const data = fs.readFileSync('./data/productos.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Function to save cart to file
function saveCart(cart) {
  fs.writeFileSync('./data/carrito.json', JSON.stringify(cart));
}

// Function to load cart from file
function loadCart() {
  try {
    const data = fs.readFileSync('./data/carrito.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return { items: [] };
  }
}