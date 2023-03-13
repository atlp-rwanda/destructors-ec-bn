import app, { connectDB } from "./app";

import "dotenv/config";

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await connectDB();
import app from './app.js';
import 'dotenv/config';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
