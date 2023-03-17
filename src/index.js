import app from './app.js';
import 'dotenv/config';

const port = process.env.PORT || 1000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
