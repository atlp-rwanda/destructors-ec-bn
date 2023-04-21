import app from './app.js';
import 'dotenv/config';
import { initializeChat } from './services/chat.service.js';

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const io = initializeChat(server);
export default io;
