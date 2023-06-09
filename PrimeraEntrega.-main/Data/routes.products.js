const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

// Configurar el motor de plantillas EJS
router.set('view engine', 'ejs');
router.set('views', path.join(__dirname, 'views'));


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

// List all products
router.get('/', (req, res) => {
  const products = loadProducts();
  res.render('products', { products: products }); // Renderizar la plantilla "products.ejs" y pasar los datos de los productos
});


// Get product by id
router.get('/:pid', (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.id === parseInt(req.params.pid));
  if (!product) {
    res.status(404).send('Product not found');
  } else {
    res.json(product);
  }
});

// Add new product
router.post('/', (req, res) => {
  const products = loadProducts();
  const newProduct = {
    id: products.length + 1, // Autogenerated id
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: req.body.status,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.body.thumbnails
  };
  products.push(newProduct);
  saveProducts(products); // Save updated products to file
  res.json(newProduct);
});

// Update product by id
router.put('/:pid', (req, res) => {
  const products = loadProducts();
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.pid));
  if (productIndex === -1) {
    res.status(404).send('Product not found');
  } else {
    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      id: products[productIndex].id // Do not update id
    };
    products[productIndex] = updatedProduct;
    saveProducts(products); // Save updated products to file
    res.json(updatedProduct);
  }
});

// Delete product by id
router.delete('/:pid', (req, res) => {
  const products = loadProducts();
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.pid));
  if (productIndex === -1) {
    res.status(404).send('Product not found');
  } else {
    products.splice(productIndex, 1);
    saveProducts(products); // Save updated products to file
    res.status(204).send(); // No content
  }
});

module.exports = router;