export const createProdWish = {
    tags: ['Product Wishes'],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: 'Adding product to wishList',
    requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                  description: 'enter the productId for the product',
                  example: '1265316163fg13f31g3ft163',
                },
              },
            },
          },
        },
      },
    consumes: ['application/json'],
    responses: {
      400: {
        description: 'product not found!', 
      },
      200: {
        description: 'product unwished succefully!', 
      },
      201: {
        description: 'product wished succefully!', 
      },
      500: {
        description: 'internal server error!',
      },
    },
  };
  
  export const getProductWishes = {
    tags: ['Product Wishes'],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: 'Get product wishes',
    responses: {
      200: {
        description: 'Product wishes retrieved successfully',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Product wish ID',
                  },
                  productId: {
                    type: 'string',
                    description: 'Product ID',
                  },
                  userId: {
                    type: 'string',
                    description: 'User ID',
                  },
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
      500: {
        description: 'Internal server error',
      },
    },
  };

  export const getWishesPerProduct = {
    tags: ['Product Wishes'],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: 'Get wishes per product',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'ID of the product',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Product wishes per product retrieved successfully',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'string',
                    description: 'Product ID',
                  },
                  count: {
                    type: 'integer',
                    description: 'Count of product wishes',
                  },
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
      500: {
        description: 'Internal server error',
      },
    },
  };