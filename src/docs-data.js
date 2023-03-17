export const signUp = {
  tags: ["User Authentication"],
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
              description:
                "password must include one number small letters and characters + capital letters", // desc
              example: "@Qwert123",
            },
          },
        },
      },
    },
  },
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
};
// expected responses

export const loginUser = {
  tags: ["User Authentication"],
  description: "Logs in a user",
  operationId: "loginUser",
  parameters: [],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "User email",
              example: "user@test.com",
            },
            password: {
              type: "string",
              description: "User password",
              example: "password123",
            },
          },
          required: ["email", "password"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful login",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Successful login",
              },
              user: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                    example: 1,
                  },
                  firstname: {
                    type: "string",
                    example: "John",
                  },
                  lastname: {
                    type: "string",
                    example: "Doe",
                  },
                  email: {
                    type: "string",
                    example: "user@test.com",
                  },
                  role: {
                    type: "string",
                    example: "admin",
                  },
                },
              },
              token: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Invalid email or password",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid email or password",
              },
            },
          },
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User not found",
              },
            },
          },
        },
      },
    },
    500: {
      description: "Server error",
    },
  },
};
export const resetEmail = {
  tags: ['Reset Password'],
  description: 'Reset user password',
  operationId: 'Reset password',
  parameters: [],
  requestBody: {
    content: {
      // content-type
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'User email',
              example: 'name@example.com',
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
      description: 'Email set successfully', // response desc
    },
    // response code
    400: {
      description: 'User not registered', // response desc
    },
  },
};  

  
export const ResetPassword = {
  tags: ['Reset Password'],
  description: 'Reset user password',
  operationId: 'Reset password',
  parameters: [
    {
    name: 'token',
    in: 'path',
    description: 'the sent token',
    required: true
    }
  ],
  requestBody: {
    content: {
      // content-type
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            password: {
              type: 'string',
              description: 'Enter New password, password must include one number small letters and characters + capital letters',
              example: 'maxmax250',
            },
            confirmPassword: {
              type: 'string',
              description: 're-enter your new password',
              example: 'maxmax250',
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
      description: 'Password reset successfully', // response desc
    },
    // response code
    400: {
      description: 'Bad request', // response desc
    },
  },
};


