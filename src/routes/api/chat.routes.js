import express from 'express';
import path from 'path';

const route = express.Router();

route.get('/:id', (req, res) => {
  const filePath = path.join(__dirname, '../../public', 'index.html');
  res.sendFile(filePath);
});

route.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default route;
