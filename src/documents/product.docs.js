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
            description: {
              type: 'string',
              description: 'Product description',
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
export const retrieveProduct = {
  tags: ['Products'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'the product id',
      required: true,
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  summary: 'Retrieve product',
  responses: {
    // response code
    200: {
      description: 'Ok', // response desc
    },
    404: {
      description: 'Not Found', // response desc
    },
    500: {
      description: 'Server error', // response desc
    },
  },
};

export const retrieveAllProducts = {
  tags: ['Products'],
  operationId: 'Retrieve products',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'page',
      in: 'path',
      description: 'number of the page starting from 0',
    },
    {
      name: 'size',
      in: 'path',
      description: 'the limit of items to be displayed on a page',
    },
  ],
  summary: 'Retrieve list of products',
  responses: {
    // response code
    200: {
      description: 'Ok', // response desc
    },
    404: {
      description: 'Not Found', // response desc
    },
    500: {
      description: 'Server error', // response desc
    },
  },
};
export const updateProductAvailability = {
  tags: ['Products'],
  description: 'Product availability',
  operationId: 'Product',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'product Id',
      required: true,
    },
  ],
  // expected responses
  responses: {
    // response code
    200: {
      description: 'pruduct availability updated  successfully', // response desc
    },
    // response code
    400: {
      description: 'eror servver', // response desc
    },
  },
};
// delete product from thier seller's collectio
export const deleteProduct = {
  tags: ['Products'],
  description: 'delete product',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'the product id',
      required: true,
    },
  ],
  summary: 'deleting product',
  // expected responses
  responses: {
    // response code
    201: {
      description: 'product deleted successfully', // response desc
    },
    // response code
    401: {
      description: 'Server error', // response desc
    },
  },
};
// update product from thier collection
export const updateProduct = {
  tags: ['Products'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'product Id',
      required: true,
    },

  ],
  summary: 'Update product',
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
      description: 'product updateed successfully', // response desc
    },
    // response code
    500: {
      description: 'Server error', // response desc
    },
  },
};
// create product  review 
export const ratingAndFeedback = {
  tags: ['Product Review'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'the product id',
      required: true,
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  summary: 'review product',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            rating: {
              type: 'integer',
              description: 'rating of product',
              example:'4'
            },
            feedback: {
              type: 'string',
              description: 'feedback of product',
              example:'Good quality of product',
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
      description: 'product reviewed successfully', // response desc
    },
    // response code
    500: {
      description: 'Server error', // response desc
    },
  },
};
// get all reviews on product 
export const getReviews = {
  tags: ['Product Review'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'the product id',
      required: true,
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  summary: 'get all reviews product',
  responses: {
    201: {
      description: 'product reviewes fetched  successfully',
    },
  
    500: {
      description: 'Server error', 
    },
  },
};
export const retrieveProducts = {
  tags: ['Products'],
  operationId: 'Retrieve all products',
  parameters: [
    {
      name: 'page',
      in: 'path',
      description: 'number of the page starting from 0',
    },
    {
      name: 'size',
      in: 'path',
      description: 'the limit of items to be displayed on a page',
    },
  ],
  summary: 'Retrieve list of all products for all users',
  responses: {
    // response code
    200: {
      description: 'Ok', // response desc
    },
    500: {
      description: 'Server error', // response desc
    },
  },
};


export const path = {};
