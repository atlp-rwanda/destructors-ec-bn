import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send(
    'Hello, There! Welcome, this is Destructors ecommerce team project.'
  );
});

export default router;
