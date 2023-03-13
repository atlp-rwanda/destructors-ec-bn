import { signUp } from "./docs-data"
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
        // license: {
        //     name: 'Apache 2.0',
        //     url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        // },
    },
    servers: [
        {
          url: "http://localhost:3000", // url
          description: "Local server", // 
        },
        {
            url: "http://localhost:3000", // url
            description: "Hosted version", // name
          },
      ],
      tags: [
        {
            name: 'user'
        }
    ],
    paths: {
        "/api/v1/users/signup":{
            "post": signUp
        }


    }
}