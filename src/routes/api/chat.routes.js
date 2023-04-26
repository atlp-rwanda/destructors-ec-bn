import express from 'express';
import path from 'path';

const route = express.Router();

route.get('/:id', (req, res) => {
  const filePath = path.join(__dirname, '../../public', 'index.html');
  res.sendFile(filePath);
});

route.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

export default route;
