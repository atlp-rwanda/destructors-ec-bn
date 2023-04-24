export const addCategory = {
  tags: ['Categories'],
  summary: 'Create category',
  description: 'Creating a product category',
  parameters: [],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              required: true,
            },
          },
          example: {
            name: 'clothing',
          },
        },
      },
    },
  },
  consumes: ['application/json'],
  responses: {
    201: {
      description: 'category added successfull', // response desc
    },
    // response code
    500: {
      description: 'Server error', // response desc
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export const getCategory = {
  tags: ['Categories'],
  summary: 'Get categories',
  description: 'Listing categories',
  responses: {
    // response code
    200: {
      description: 'category succesfully retrieved', // response desc
    },
    // response code
    500: {
      description: 'Server error', // response desc
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};
