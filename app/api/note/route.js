import { PrismaClient } from '@prisma/client';
import { Expo } from 'expo-server-sdk';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { title, body, data } = await req.json();

    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'Title and body are required' }), { status: 400 });
    }

    const tokens = await prisma.pushToken.findMany();
    console.log("📥 All Tokens from DB:", tokens);

    const expo = new Expo();
    const messages = [];

    for (let tokenObj of tokens) {
      const token = tokenObj.token;
      if (!Expo.isExpoPushToken(token)) continue;

      messages.push({
        to: token,
        sound: 'default',
        title,
        body,
        data: data || {},
      });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    // ✅ Log which tokens were successful or failed
    tickets.forEach((ticket, index) => {
      const relatedToken = messages[index]?.to;
      if (ticket.status === 'ok') {
        console.log(`✅ Notification sent successfully to ${relatedToken}`);
      } else {
        console.log(`❌ Failed to send to ${relatedToken}`, ticket.details || ticket.message);
      }
    });

    return new Response(JSON.stringify({ success: true, tickets }), { status: 200 });
  } catch (err) {
    console.error('Error sending notifications:', err);
    return new Response(JSON.stringify({ error: 'Failed to send notifications' }), { status: 500 });
  }
}
