const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 8000;

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bhavya27465@',
  database: 'seller_appointment',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Create MySQL table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255) NOT NULL
  )
`;
db.query(createTableQuery, (err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL table created');
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Handle GET request for root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle GET request to retrieve products
app.get('/products', (req, res) => {
  const selectQuery = 'SELECT * FROM products';

  db.query(selectQuery, (err, results) => {
    if (err) {
      throw err;
    }

    res.json(results);
  });
});

// Handle POST request to add a product
app.post('/products', express.json(), (req, res) => {
  const { productName, price, category } = req.body;
  const insertQuery = 'INSERT INTO products (productName, price, category) VALUES (?, ?, ?)';
  const values = [productName, price, category];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      throw err;
    }

    const product = {
      id: result.insertId,
      productName,
      price,
      category,
    };

    res.json(product);
  });
});

// Handle DELETE request to delete a product
// Handle DELETE request to delete a product
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  const deleteQuery = 'DELETE FROM products WHERE id = ?';

  db.query(deleteQuery, [productId], (err) => {
    if (err) {
      throw err;
    }

    res.sendStatus(200);
  });
});

// Handle PUT request to update a product
app.put('/products/:id', express.json(), (req, res) => {
  const productId = req.params.id;
  const { productName, price, category } = req.body;
  const updateQuery = 'UPDATE products SET productName = ?, price = ?, category = ? WHERE id = ?';
  const values = [productName, price, category, productId];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      throw err;
    }

    res.json(result);
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});