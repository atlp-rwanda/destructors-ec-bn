export const payment={
    tags: ["Payment"],
    description: "user profile editing",
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        // content-type
        "application/json": {
          schema: {
            type: "object",
            properties: {
              number: {
                type: "number", 
                description: "card number",
                example: "4242424242424242",
              },
              exp_month: {
                type: "integer",
                description: "expiration month",
                example: "12",
              },
              exp_year: {
               type: "integer",
               description: "expiration year",
               example: "22",
              },
               cvc: {
                type: "integer",
                description: "CVC", // desc
                example: "123",
               },
              },
          },
        },
      },
    },
    // expected responses
    responses: {
      // response code
      200: {
        description: "user profile updated successfully", // response desc
      },
      // response code
      403: {
        description: "Server error", // response desc
      },
    },
  }