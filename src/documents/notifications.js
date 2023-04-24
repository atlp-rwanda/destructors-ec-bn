export const MarkNotificationRead = {
    tags: ['Mark notifications'],
    description: 'mark notification as read',
    operationId: 'Notification',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'notification  Id',
        required: true,
      },
    ],
    // expected responses
    responses: {
      // response code
      200: {
        description: 'Notification marked  as read successfully', // response desc
      },
      // response code
      400: {
        description: 'eror servver', // response desc
      },
    },
  };

  export const MarkAllNotificationRead = {
    tags: ['Mark notifications'],
    description: 'mark nall notification as read',
    operationId: 'Notification',
    security: [
      {
        bearerAuth: [],
      },
    ],
    // expected responses
    responses: {
      // response code
      200: {
        description: ' marked  all  as read successfully', // response desc
      },
      // response code
      400: {
        description: 'eror servver', // response desc
      },
    },
  };