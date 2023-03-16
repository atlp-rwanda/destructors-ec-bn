import request from "supertest";
import app from "../src/app";

const { User } = require("../src/database/models/user.js");

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
});
describe("this is for the user logging in ",()=>{
  test("this is where the user try to get to the login page for the first time",async()=>{
    await request(app).get('/api/v1/users').expect('<a href="/api/v1/users/login">do you want to access your account</a>')
  })
  it('should redirect to Google login page', async () => {
    const res = await request(app).get('/api/v1/users/login');
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

  it('should redirect to /api/v1/users/failure on failure', async () => {
    const res = await request(app).get('/api/v1/users/google/callback?error=access_denied');
    expect(res.status).toBe(302);
    expect(res.header['location']).toBe('/api/v1/users/failure');
  });
});
describe('GET /api/v1/users/protected', () => {
  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).get('/api/v1/users/protected');
    expect(res.status).toBe(401);
  });

  it('should return 200 if user is authenticated', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/users/login');
    const res = await agent.get('/api/v1/users/protected');
    expect(res.status).toBe(401);
  });
});
describe('GET /api/v1/users/failure', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/v1/users/failure');
    expect(res.status).toBe(200);
  });
});
