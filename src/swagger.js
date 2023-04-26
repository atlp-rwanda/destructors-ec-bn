import {
  createProduct,
  retrieveAllProducts,
  retrieveProduct,
  updateProductAvailability,
  updateProduct,
  deleteProduct,
  ratingAndFeedback,
} from './documents/product.docs';
import { getCart, addCart, clearCart } from './documents/cart.docs';
import { payment } from './documents/payments.docs';
import { orderStatus } from './documents/orderStatus.docs';
import {
  MarkNotificationRead,
  MarkAllNotificationRead,
} from './documents/notifications';
import {
  createProdWish,
  getProductWishes,
  getWishesPerProduct,
} from './documents/wishlist.docs';
import {
  resetEmail,
  ResetPassword,
  signUp,
  loginUser,
  userProfile,
  logoutUser,
  updateUserStatus,
  assignUserRole,
  userUpdatePassword,
  verifyOTP,
  searchProducts,
  verifyEmail,
  getUserProfile,
  changeSaleStatu,
  getSellerStats,
} from './docs-data';
import 'dotenv/config';

export const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Destructors APIs Document',
    description:
      'This a simple api for mastering about back-end which will do an ecommerce server',
    termsOfService: '',
    contact: {
      name: 'Destructors',
      email: 'desstructors@gmail.com',
      url: '',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`, // url
      description: 'Local server', //
    },
    {
      url: 'https://destructors-ec-bn.onrender.com/', // url
      description: 'Hosted version', // name
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
  paths: {
    '/api/v1/users/signup': {
      post: signUp,
    },
    '/api/v1/users/login': {
      post: loginUser,
    },
    '/api/v1/users/reset-password': {
      post: resetEmail,
    },
    '/api/v1/users/reset-password/{token}': {
      patch: ResetPassword,
    },
    '/api/v1/products': {
      post: createProduct,
    },
    '/api/v1/products?page={page}&size={size}': {
      get: retrieveAllProducts,
    },
    '/api/v1/products/{id}': {
      get: retrieveProduct,
      patch: updateProduct,
      delete: deleteProduct,
    },
    '/api/v1/users/profile': {
      put: userProfile,
      get: getUserProfile,
    },
    '/api/v1/users/logout': {
      post: logoutUser,
    },
    '/api/v1/users/{id}/status': {
      patch: updateUserStatus,
    },
    '/api/v1/users/{id}/roles': {
      patch: assignUserRole,
    },
    '/api/v1/users/update-password': {
      patch: userUpdatePassword,
    },
    '/api/v1/users/{id}/roles': {
      patch: assignUserRole,
    },
    '/api/v1/users/login/validate/{token}': {
      post: verifyOTP,
    },
    '/api/v1/carts': {
      post: addCart,
      get: getCart,
      put: clearCart,
    },
    '/api/v1/products/search': {
      get: searchProducts,
    },
    '/api/v1/product-wishes': {
      post: createProdWish,
      get: getProductWishes,
    },
    '/api/v1/products/{id}/product-wishes': {
      get: getWishesPerProduct,
    },
    '/api/v1/products/{id}/availability': {
      patch: updateProductAvailability,
    },
    '/api/v1/users/verify-email?t={token}': {
      get: verifyEmail,
    },
    '/api/v1/pay': {
      post: payment,
    },
    '/api/v1/stats': {
      get: getSellerStats,
    },
    '/api/v1/products/{id}/reviews': {
      post: ratingAndFeedback,
    },
    '/api/v1/sales/{id}/status': {
      patch: changeSaleStatu,
    },
    '/api/v1/orders/{id}/status': {
      get: orderStatus,
    },
    '/api/v1/notifications/{id}': {
      patch: MarkNotificationRead,
    },
    '/api/v1/notifications': {
      patch: MarkAllNotificationRead,
    },
  },
};
