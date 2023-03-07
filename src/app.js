import express from 'express';
const app = express();
app.get('/', (req, res) => {
  res.send('Hello, There! this is Destructors ecommerce team project.');
});

export default app;
