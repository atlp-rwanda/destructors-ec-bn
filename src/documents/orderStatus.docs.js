export const orderStatus = {
  tags: ['buyer order status'],
  description: 'Get the status of a buyer order',
  operationId: 'getOrderStatus',
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'Order ID',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
        example: 'd6c01870-10ab-11ec-82a8-0242ac130003',
      },
    },
  ],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              orderStatus: {
                type: 'string',
                description: 'The status of the order',
                example: 'pending',
              },
            },
            required: ['orderStatus'],
          },
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                example: 'Unauthorized',
              },
            },
            required: ['error'],
          },
        },
      },
    },
    404: {
      description: 'The specified order does not exist',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                example: 'Order not found',
              },
            },
            required: ['error'],
          },
        },
      },
    },
    500: {
      description: 'Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                example: 'Server Error',
              },
            },
            required: ['error'],
          },
        },
      },
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
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Unauthorized',
                },
              },
              required: ['error'],
            },
          },
        },
      },
      ServerError: {
        description: 'Server Error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Server Error',
                },
              },
              required: ['error'],
            },
          },
        },
      },
    },
  },
};

export const getOrders = {
  summary: 'Get orders for a user',
  tags: ['buyer order status'],
  description:
    'Returns orders placed by a user, or all orders if user is an admin',
  responses: {
    200: {
      description: 'List of orders',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              Orders: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                    },
                    // Add other properties here
                  },
                },
              },
            },
          },
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                example: 'Unauthorized',
              },
            },
            required: ['error'],
          },
        },
      },
    },
    404: {
      description: 'No orders found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
            },
          },
        },
      },
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
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Unauthorized',
                },
              },
              required: ['error'],
            },
          },
        },
      },
      ServerError: {
        description: 'Server Error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Server Error',
                },
              },
              required: ['error'],
            },
          },
        },
      },
    },
  },
};
