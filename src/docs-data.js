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



export const userProfile={
  tags: ["User Authentication"],
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
            gender: {
              type: "string", 
              description: "gender",
              example: "male",
             },
             DOB: {
              type: "date",
              description: "DOB",
              example: "10.10.2020",
             },
             prefferedCurrency: {
              type: "string",
              description: "prefferedCurrency",
              example: "RWF",
             },
             prefferedLanguage: {
              type: "string",
              description: "prefferedLanguage", // desc
              example: "@Qwert123",
             },
              street: {
                type: "string",
                description: "prefferedCurrency",
                example: "KG08ave",
                },
              province: {
                type: "string",
                example: "Kigali City",
                },
              district: {
                type: "string",
                description: "prefferedCurrency",
                example: "Nyarugenge",
                },
                phoneNo: {
                type: "number",
                description: "prefferedCurrency",
                example: "07851234567",
                },
                email: {
                type: "string",
                description: "prefferedCurrency",
                example: "user@email.com",
                },
            },
        },
      },
    },
  },
  // expected responses
  responses: {
    // response code
    202: {
      description: "user profile updated successfully", // response desc
    },
    // response code
    217: {
      description: "Server error", // response desc
    },
  },
}

export const getUserProfile = {
  tags: ["User Authentication"],
  description: "Get a user profile",
  security: [
    {
      bearerAuth: [],
    },
  ],
  // expected responses
  responses: {
    // response code
    200: {
      description: "user profile fetched", // response desc
    },
    // response code
    401: {
      description: "Server error", // response desc
    },
  },
}

export const logoutUser = {
  tags: [" User Logout"],
  description: "user logout",
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
   
    200: {
      description: "You have logged out successfully",
    },
    
    500: {
      description: "Server error", 
    },
  },
}
export const verifyOTP = {
  tags: ["User Authentication"],
  description: "Validates OTP and logs in user",
  operationId: "verifyOTP",
  parameters: [
    {
      name: "token",
      in: "path",
      description: "Authentication token",
      required: true,
      schema: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9vgfgfg",
      },
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            otp: {
              type: "string",
              description: "One time password",
              example: "123459",
            },
          },
          required: ["email","otp"],
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
                example: "Logged in successfully",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Invalid OTP",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Invalid OTP",
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


export const updateUserStatus = {
  tags: ["Admin disable/re-enable an account"],
  description: "Update a user's status",
  operationId: "updateUserStatus",
  parameters: [
    {
    name: 'id',
    in: 'path',
    description: 'user id',
    required: true
    }
  ],
  responses: {
    200: {
      description: "User status updated successfully",
    },
    400: {
      description: "Invalid request data",
    },
    404: {
      description: "User not found",
    },
    500: {
      description: "Server error",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};





export const assignUserRole = {
  tags: ["Admin set roles"],
  description: "Assign a role to a user",
  operationId: "assignUserRole",
  parameters: [
    {
    name: 'id',
    in: 'path',
    description: 'user id',
    required: true
    }
  ],
  requestBody: {
    description: "User data",
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            newRole: {
              type: "string",
              description: "User role",
              example: "admin",
            },
          },
          required: ["email", "newRole"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "User role assigned successfully",
    },
    400: {
      description: "Invalid request data",
    },
    404: {
      description: "User not found",
    },
    500: {
      description: "Server error",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export const userUpdatePassword = {
  tags: ['User Authentication'],
  description: "Updates a user's password",
  operationId: 'updatePassword',
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            currentPassword: {
              type: 'string',
              description: "User's current password",
              example: 'oldpassword123',
            },
            newPassword: {
              type: 'string',
              description:
                "User's new password, password must include one number, small letters, characters, and capital letters",
              example: 'newPassword123',
            },
            confirmPassword: {
              type: 'string',
              description: "Re-enter user's new password",
              example: 'newPassword123',
            },
          },
          required: ['currentPassword', 'newPassword', 'confirmPassword'],
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password updated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Password updated successfully',
              },
            },
          },
        },
      },
    },
    401: {
      description: 'Current password is incorrect',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Current password is incorrect',
              },
            },
          },
        },
      },
    },
    500: {
      description: 'Server error',
    },
  },
};


export const searchProducts = {
  tags: ["search product"],
  description: "Search for products by name, price range, category, or best before date",
  operationId: "searchProducts",
  parameters: [
    {
      name: 'name',
      in: 'query',
      description: 'Search products by name',
      schema: {
        type: 'string',
      },
    },
    {
      name: 'minPrice',
      in: 'query',
      description: 'Search products with a price greater than or equal to this value',
      schema: {
        type: 'number',
      },
    },
    {
      name: 'maxPrice',
      in: 'query',
      description: 'Search products with a price less than or equal to this value',
      schema: {
        type: 'number',
      },
    },
    {
      name: 'categoryId',
      in: 'query',
      description: 'Search products by category ID',
      schema: {
        type: 'string',
      },
    },
    {
      name: 'bestBefore',
      in: 'query',
      description: 'Search products with an expiry date before this date',
      schema: {
        type: 'string',
        format: 'date',
      },
    },
  ],
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              products: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: "Invalid request data",
    },
    404: {
      description: "Product not found",
    },
    500: {
      description: "Server error",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
          price: {
            type: "number",
          },
          quantity: {
            type: "integer",
          },
          isAvailable: {
            type: "boolean",
          },
          categoryId: {
            type: "integer",
          },
          sellerId: {
            type: "integer",
          },
          bonus: {
            type: "number",
          },
          images: {
            type: "array",
            items: {
              type: "string",
            },
          },
          expiryDate: {
            type: "string",
            format: "date",
          },
          isExpired: {
            type: "boolean",
          },
        },
      },
    },
  },
};


export const verifyEmail = {
  tags: ["User Authentication"],
  description: "Verify the user's email",
  operationId: "verifyEmail",
  parameters: [
    {
      name: "t",
      in: "query",
      description: "Token sent to the user's email",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Email verified successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Email verified",
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
    419: {
      description: "Token has expired",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Token has expired",
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

export const changeSaleStatu = {
  tags: ["seller update status"],
  description: "update status for a sale",
  operationId: "updatestatus",
  parameters: [
    {
    name: 'id',
    in: 'path',
    description: 'sale id',
    required: true
    }
  ],
  requestBody: {
    description: "sale data",
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            newStatus: {
              type: "string",
              description: "sale status",
              example: "rejected",
            },
          },
          required: [ "newstatus"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "sale status assigned successfully",
    },
    400: {
      description: "Invalid request data",
    },
    404: {
      description: "sale not found",
    },
    500: {
      description: "Server error",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};


export const getSellerStats = {
  tags: ["Seller Stats"],
  description: "Returns the statistics for a seller",
  operationId: "getSellerStats",
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  requestBody: {
    content: {
      "application/json": {},
    },
  },
  responses: {
    200: {
      description: "Successful operation",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                year: {
                  type: "string",
                  example: "2023",
                },
                month: {
                  type: "string",
                  example: "March",
                },
                productsSold: {
                  type: "integer",
                  example: 20,
                },
                productsSoldRevenue: {
                  type: "number",
                  format: "float",
                  example: 200.5,
                },
                expiredProducts: {
                  type: "integer",
                  example: 5,
                },
                lostProductsRevenue: {
                  type: "number",
                  format: "float",
                  example: 50.25,
                },
                wishedProducts: {
                  type: "integer",
                  example: 50,
                },
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized User",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Unauthorized User",
              },
            },
          },
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Internal server error",
              },
            },
          },
        },
      },
    },
  },
};

