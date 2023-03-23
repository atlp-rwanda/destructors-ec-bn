import { createProduct } from './documents/product.docs';
import { resetEmail, ResetPassword, signUp, loginUser, userProfile ,logoutUser,updateUserStatus,assignUserRole} from "./docs-data"
import "dotenv/config";

export const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Destructors APIs Document',
    description:
      'This a simple api for mastering about back-end which will do an ecommerce server',
    termsOfService: '',
    contact: {
      name: 'Destructors',
      email: 'desstructors@gmail.com',
      url: '',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`, // url
      description: 'Local server', //
    },
    {
      url: 'https://destructors-ec-bn.onrender.com/', // url
      description: 'Hosted version', // name
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
  paths: {
    '/api/v1/users/signup': {
      post: signUp,
    },
    '/api/v1/users/login': {
      post: loginUser,
    },
    "/api/v1/users/reset-password":{
      "post": resetEmail
    },
    "/api/v1/users/reset-password/{token}":{
      "patch": ResetPassword
    },    
    '/api/v1/products': {
      post: createProduct,
    },
    "/api/v1/users/profile":{
      "put": userProfile
    },
    '/api/v1/users/logout': {
      post: logoutUser,
    },
    "/api/v1/users/{id}/status":{
      patch: updateUserStatus
    },
    "/api/v1/users/{id}/roles":{
     patch: assignUserRole
  }
  },
};