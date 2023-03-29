import app from './app.js';
import 'dotenv/config';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});




// describe('User Authentication API', () => {
//   let token, userId;

//   test('should register a new user', async () => {
//     const userData = {
//       firstname: 'John',
//       lastname: 'Doe',
//       email: 'johndoe@gmail.com',
//       password: 'mypassword',
//     };
//     const response = await request(app)
//       .post('/api/v1/users/register')
//       .send(userData)
//       .expect(201);

//     expect(response.body).toHaveProperty('message', 'Successful registered. Please check your email for verification');
//     expect(response.body).toHaveProperty('user');
//     expect(response.body).toHaveProperty('token');
//     token = response.body.token;
//   });

//   test('should verify user email', async () => {
//     const response = await request(app)
//       .get(`/api/v1/users/verify-email?t=${token}`)
//       .expect(200);

//     expect(response.body).toHaveProperty('message', 'email verified');
//   });

//   test('should login an existing user', async () => {
//     const response = await request(app)
//       .post('/api/v1/users/login')
//       .send({
//         email: 'johndoe@gmail.com',
//         password: 'mypassword',
//       })
//       .expect(200);

//     expect(response.body).toHaveProperty('message', 'Successful login');
//     expect(response.body).toHaveProperty('user');
//     expect(response.body).toHaveProperty('token');
//     userId = response.body.user.id;
//   });
// });
