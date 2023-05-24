const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar motor de plantillas Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Ruta principal
app.get('/', (req, res) => {
  res.render('home');
});

// Ruta para la vista en tiempo real de productos
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// Configurar servidor estático para archivos públicos
app.use(express.static('public'));

// Configurar WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Cargar productos y enviar al cliente
  const products = loadProducts();
  socket.emit('products', products);

  // Crear un nuevo producto
  socket.on('createProduct', (newProduct) => {
    const products = loadProducts();
    products.push(newProduct);
    saveProducts(products);
    io.emit('products', products);
  });

  // Eliminar un producto
  socket.on('deleteProduct', (productId) => {
    const products = loadProducts();
    const updatedProducts = products.filter((product) => product.id !== productId);
    saveProducts(updatedProducts);
    io.emit('products', updatedProducts);
  });
});

// Función para guardar productos en un archivo
function saveProducts(products) {
  fs.writeFileSync('./data/productos.json', JSON.stringify(products));
}

// Función para cargar productos desde un archivo
function loadProducts() {
  try {
    const data = fs.readFileSync('./data/productos.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});