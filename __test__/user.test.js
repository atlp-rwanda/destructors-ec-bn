import request from "supertest";
import app from "../src/app";
const { User } = require("../src/database/models/user.js");
import "../src/services/googleAuth"
jest.setTimeout(30000);
describe("Testing registration User", () => {
  let token = "";
  test("It should return 400 for bad request", async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      email: "dummyEmail@gmail.com",
      password: "dummpassword435",
    });
    expect(response.statusCode).toBe(400);
  });
  test("Get a status of 200", async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      firstname: "myfirstname",
      lastname: "mysecondname",
      email: `testemail1234@gmail.com`,
      password: "testpass2345",
    });
    token = await response.body.token;
    expect(response.statusCode).toBe(201);
  });
  test("It should not login with invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/users/login")
      .send({
        email:"test@user.com",
        password:"@Password12"
      })
    expect(res.statusCode).toBe(401);
  });
  test("It should not login with invalid password", async () => {
    const res = await request(app)
      .post("/api/v1/users/login")
      .send({
        email:"testemail1234@gmail.com",
        password:"@Password12"
      })
    expect(res.statusCode).toBe(401);
  });
  test("It should login with valid email and password", async () => {
    const res = await request(app)
      .post("/api/v1/users/login")
      .send({
        email: `testemail1234@gmail.com`,
        password: "testpass2345",
      })
    expect(res.statusCode).toBe(200);
  });
});
describe("this is for the user logging in ",()=>{
  test("this is where the user try to get to the login page for the first time",async()=>{
    await request(app).get('/api/v1/users/auth').expect('<a href="/api/v1/users/login/google">do you want to access your account</a>')
  })
  it('should redirect to Google login page', async () => {
    const res = await request(app).get('/api/v1/users/login/google');
    expect(res.status).toBe(302);
    expect(res.header['location']).toContain('https://accounts.google.com/o/oauth2/v2/auth');
  });
})
describe('GET /api/v1/users/google/callback', () => {
  it('should redirect to /api/v1/users/protected on success', async () => {
    const res = await request(app).get('/api/v1/users/google/callback');
    expect(res.status).toBe(302);
    expect(res.header['location']).toBe('https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fv1%2Fusers%2Fgoogle%2Fcallback&client_id=314235844636-883r065qgdf7aglpqgndd8sg6fu6t9hj.apps.googleusercontent.com');
  });
});




