export const payment={
    tags: ["Payment"],
    description: "Buyer payment method",
    security: [
      {
        bearerAuth: [],
      },
    ],
    // expected responses
    responses: {
      // response code
      201: {
        description: "Payments goes successfully", // response desc
      },
      // response code
      500: {
        description: "Server error", // response desc
      },
    },
  }