export const signUp={
    tags: ["Todo CRUD operations"],
    description: "Signup a user",
    operationId: "signUpUser",
    parameters: [],
    requestBody: {
      content: {
        // content-type
        "application/json": {
          schema: {
            type: "object",
            properties: {
              firstname: {
                type: "string", 
                description: "user first name",
                example: "Iribagiza",
               },
               lastname: {
                type: "string",
                description: "User lastname",
                example: "Jeannette",
               },
               email: {
                type: "string",
                description: "User email",
                example: "iribagizajenny@test.com",
               },
               password: {
                type: "string",
                description: "password must include one number small letters and characters + capital letters", // desc
                example: "@Qwert123",
               },
            },
          },
        },
      },
    },
    // expected responses
    responses: {
      // response code
      201: {
        description: "Todo created successfully", // response desc
      },
      // response code
      500: {
        description: "Server error", // response desc
      },
    },
}