export const createProduct = {
  tags: ['Products'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  summary: 'Creating product',
  requestBody: {
    required: true,
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Product name',
              required: true,
            },
            price: {
              type: 'number',
              description: 'Price of product',
            },
            quantity: {
              type: 'number',
              description: 'quantity of product',
            },
            categoryId: {
              type: 'string',
              description: 'Product category',
            },
            expiryDate: {
              type: 'string',
              format: 'date',
              description: 'Expired date of product',
              default: '2023-04-29',
            },
            bonus: {
              type: 'number',
              description: 'Bonus for a product',
            },
            image: {
              type: 'array',
              items: {
                minItems: 2,
                type: 'file',
              },
            },
          },
        },
      },
    },
  },
  consumes: ['application/json'],
  responses: {
    // response code
    201: {
      description: 'product created successfully', // response desc
    },
    // response code
    500: {
      description: 'Server error', // response desc
    },
  },
};
