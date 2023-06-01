const addCart = {
  tags: ['Cart'],
  summary: 'Add to cart',
  description: 'User can add a product to their cart',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              required: true,
            },
            productQuantity: {
              type: 'number',
              required: false,
            },
          },
          example: {
            productId: '6717e8c7-c058-4670-90c3-5c8953cc844a',
            productQuantity: 3,
          },
        },
      },
    },
  },
  consumes: ['application/json'],
  responses: {
    // response code
    201: {
      description: 'Product added to cart successfull', // response desc
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
const getCart = {
  tags: ['Cart'],
  summary: 'Get cart',
  description: 'Listing cart details (total & products in the cart)',
  responses: {
    200: {
      description: 'cart successfully retrieved',
    },

    500: {
      description: 'Server error', // r
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};
const clearCart = {
  tags: ['Cart'],
  summary: 'Clear cart',
  description: 'Remove all products from the cart and reset total to 0',
  responses: {
    200: {
      description: 'cart successfully cleared',
    },

    500: {
      description: 'Server error', // r
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};
const removeFromCart = {
  tags: ['Cart'],
  summary: 'Remove from cart',
  description: 'User can remove a product from their cart',
  parameters: [
    {
      name: 'productId',
      in: 'path',
      description: 'Product id',
      schema: {
        type: 'string',
        format: 'uuid',
      },
    },
  ],
  consumes: ['application/json'],
  responses: {
    200: {
      description: 'cart successfully cleared',
    },

    500: {
      description: 'Server error', // r
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export { addCart, getCart, clearCart, removeFromCart };
