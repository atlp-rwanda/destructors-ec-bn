import request from "supertest";
import app from "../src/app";
import "../src/services/googleAuth";
import models from "../src/database/models/index"

const { User } = require("../src/database/models");

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
    const res = await request(app).post("/api/v1/users/login").send({
      email: "test@user.com",
      password: "@Password12",
    });
    expect(res.statusCode).toBe(401);
  });
  test("It should not login with invalid password", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "testemail1234@gmail.com",
      password: "@Password12",
    });
    expect(res.statusCode).toBe(401);
  });
  test("It should login with valid email and password", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: `testemail1234@gmail.com`,
      password: "testpass2345",
    });
    expect(res.statusCode).toBe(200);
  });
});
describe("this is for the user logging in ", () => {
  test("this is where the user try to get to the login page for the first time", async () => {
    await request(app)
      .get("/api/v1/users/auth")
      .expect(
        '<a href="/api/v1/users/login/google">do you want to access your account</a>'
      );
  });
  it("should redirect to Google login page", async () => {
    const res = await request(app).get("/api/v1/users/login/google");
    expect(res.status).toBe(302);
    expect(res.header["location"]).toContain(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
  });
});
describe("GET /api/v1/users/google/callback", () => {
  it("should redirect to /api/v1/users/protected on success", async () => {
    const res = await request(app).get("/api/v1/users/google/callback");
    expect(res.status).toBe(302);
    expect(res.header["location"]).toBe(
      "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fv1%2Fusers%2Fgoogle%2Fcallback&client_id=314235844636-883r065qgdf7aglpqgndd8sg6fu6t9hj.apps.googleusercontent.com"
    );
  });
});


describe("Testing the reset message via email", () => {
  let token = "";
  test("It should return 404 for bad request if the user is not registered", async () => {
    const response = await request(app).post("/api/v1/users/reset-password").send({
      email: "duEmil@gail.com"
    });
    expect(response.statusCode).toBe(404);
  });
  test("Get a status of 201", async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      firstname: "mfirstname",
      lastname: "msecondname",
      email: `tstmail1234@gmail.com`,
      password: "testpass2345",
    });
    token = await response.body.token;
    expect(response.statusCode).toBe(201);
  });
  test("Get a status of 200 if  user is registered", async () => {
    const response = await request(app).post("/api/v1/users/reset-password").send({

      email: `tstmail1234@gmail.com`,
    });

    expect(response.statusCode).toBe(200);
  });

  test("Get a status of 404 if  user is not registered", async () => {
    const response = await request(app).post("/api/v1/users/reset-password").send({

      email: `tstmail@gmail.com`,
    });

    expect(response.statusCode).toBe(404);
  });

  test("Get a status of 400 if  user email is invalid", async () => {
    const response = await request(app).post("/api/v1/users/reset-password").send({

      email: `tstmail1234`,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Get a status of 200 when the password is successfully changed", async () => {
    const newUser = await models.ResetPassword.create({
      email: "katros@gamil.com",
      token: token
    });
    const response = await request(app).patch(`/api/v1/users/reset-password/${token}`).send({
      password: "katros23",
      confirmPassword: "katros23"
    });
    
    expect(response.statusCode).toBe(200);
  });

  test("Get a status of 400 when the token provided has expired", async () => {

    const newUser = await models.ResetPassword.create({
      email: "katros@gamil.com",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoia2F0cm9zMjUwQGdtYWlsLmNvbSIsImlhdCI6MTY3OTM5MDQwOCwiZXhwIjoxNjc5MzkwNDY4fQ.80S2mmY768UpVKBjgjFiMl0wmsunsMujlypCV50guSY"
    });

    const response = await request(app).patch(`/api/v1/users/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoia2F0cm9zMjUwQGdtYWlsLmNvbSIsImlhdCI6MTY3OTM5MDQwOCwiZXhwIjoxNjc5MzkwNDY4fQ.80S2mmY768UpVKBjgjFiMl0wmsunsMujlypCV50guSY`).send({

      password: "katros23",
      confirmPassword: "katros23"

    });
    
    expect(response.statusCode).toBe(400);
  });

  test("Get a status of 400 when confirm password not equal to password", async () => {
    const response = await request(app).patch(`/api/v1/users/reset-password/${token}`).send({

      password: "katros23",
      confirmPassword: "katros3"

    });
    
    expect(response.statusCode).toBe(400);
  });

  test("Get a status of 400 when password does not meet validation rules", async () => {
    const response = await request(app).patch(`/api/v1/users/reset-password/${token}`).send({

      password: "katr",
      

    });
    
    expect(response.statusCode).toBe(400);
  });
});
