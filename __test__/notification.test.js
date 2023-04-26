import request from 'supertest';
import app from '../src/app';
import {
  User,
  Mark_Notifications,
  Notifications,
} from '../src/database/models/';
import { generateToken } from '../src/utils/generateToken';

jest.setTimeout(50000);
describe('markNotificationsAsRead', () => {
  let notification;
  let user;
  let notificationReview;

  beforeEach(async () => {
    // Create a user and a notification for the test cases
    user = await User.create({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'testpassword',
    });
    notification = await Notifications.create({
      subject: 'product expiration',
      message: 'your product has expired',
      receiver: 'seller',
    });
    notificationReview = await Mark_Notifications.create({
      receiverId: user.id,
      is_read: false,
      notificationId: notification.id,
    });
  });
  it('should mark a notification as read and return 200 status code', async () => {
    const userToken = generateToken(user);

    const response = await request(app)
      .patch(`/api/v1/notifications/${notification.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
  });

  it('should return 404 status code if notification is not found', async () => {
    const userToken = generateToken(user);

    const response = await request(app)
      .patch('/api/v1/notifications/2b43a131-68cb-4052-8e97-b1bd95a04138')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
  });
  it('should return 200 status code if notification is marked all as read ', async () => {
    const userToken = generateToken(user);

    const response = await request(app)
      .patch('/api/v1/notifications')
      .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
  });
});
