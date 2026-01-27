import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as webpush from 'web-push';
import { ConfigService } from '@nestjs/config';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly configService: ConfigService,
  ) {
    this.initializeWebPush();
  }

  private initializeWebPush() {
    const vapidPublicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const vapidSubject = this.configService.get<string>('VAPID_SUBJECT') || 'mailto:admin@petly.com';

    if (!vapidPublicKey || !vapidPrivateKey) {
      this.logger.warn('VAPID keys not configured. Push notifications will not work.');
      return;
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    this.logger.log('Web Push initialized successfully');
  }

  async sendToUser(userId: number, payload: PushNotificationPayload): Promise<void> {
    try {
      const devices = await this.dbService.userDevice.findMany({
        where: { userId },
      });

      if (!devices || devices.length === 0) {
        this.logger.log(`No devices found for user ${userId}`);
        return;
      }

      const notificationPayload = JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
        badge: payload.badge || '/icons/icon-72x72.png',
        data: payload.data,
        tag: payload.tag,
        requireInteraction: payload.requireInteraction || false,
      });

      const sendPromises = devices.map(async (device) => {
        try {
          // Parse the subscription from the token field
          const subscription = JSON.parse(device.token);
          await webpush.sendNotification(subscription, notificationPayload);
          this.logger.log(`Notification sent to device ${device.id} for user ${userId}`);
        } catch (error) {
          this.logger.error(`Failed to send notification to device ${device.id}:`, error);
          
          // If the subscription is invalid or expired, remove the device
          if (error.statusCode === 410 || error.statusCode === 404) {
            await this.dbService.userDevice.delete({ where: { id: device.id } });
            this.logger.log(`Removed invalid device ${device.id}`);
          }
        }
      });

      await Promise.allSettled(sendPromises);
    } catch (error) {
      this.logger.error(`Error sending notification to user ${userId}:`, error);
    }
  }

  async sendToMultipleUsers(userIds: number[], payload: PushNotificationPayload): Promise<void> {
    const sendPromises = userIds.map((userId) => this.sendToUser(userId, payload));
    await Promise.allSettled(sendPromises);
  }

  async sendToUsersInRadius(
    lat: number,
    long: number,
    radiusKm: number,
    payload: PushNotificationPayload,
    excludeUserId?: number,
  ): Promise<void> {
    try {
      // Get all users with their locations
      const users = await this.dbService.user.findMany({
        select: {
          id: true,
          lat: true,
          long: true,
        },
      });

      // Filter users within radius using Haversine formula
      const usersInRadius = users.filter((user) => {
        if (excludeUserId && user.id === excludeUserId) {
          return false;
        }

        const distance = this.calculateDistance(lat, long, user.lat, user.long);
        return distance <= radiusKm;
      });

      this.logger.log(
        `Found ${usersInRadius.length} users within ${radiusKm}km of (${lat}, ${long})`,
      );

      const userIds = usersInRadius.map((user) => user.id);
      await this.sendToMultipleUsers(userIds, payload);
    } catch (error) {
      this.logger.error('Error sending notifications to users in radius:', error);
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
