import { signUp,  loginUser} from "./docs-data.js"

export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'Destructors APIs Document',
        description: 'This a simple api for mastering about back-end which will do an ecommerce server',
        termsOfService: '',
        contact: {
            name: 'Destructors',
            email: 'desstructors@gmail.com',
            url: ''
        },
    },
    servers: [
        {
          url: "http://localhost:3000", // url
          description: "Local server", //
        },
        {
            url: "https://destructors-ec-bn.onrender.com", // url
            description: "Hosted version",
          },
      ],
      paths: {
        "/api/v1/users/signup": {
          post: signUp,
        },
        "/api/v1/users/login": {
          post: loginUser,
        },
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "apiKey",
            name: "x-auth-token",
            scheme: "bearer",
            in: "header",
          },
        },
      },
}