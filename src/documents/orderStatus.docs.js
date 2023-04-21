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
      $ref: '#/components/responses/Unauthorized',
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
      $ref: '#/components/responses/ServerError',
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
