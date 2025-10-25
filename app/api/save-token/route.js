import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { token, guestId } = await req.json();

    if (!token || !guestId) {
      return new Response(JSON.stringify({ error: 'Missing token or guestId' }), { status: 400 });
    }

    // Check if token already exists for this guest
    const existing = await prisma.pushToken.findFirst({
      where: { guestId, token },
    });

    if (!existing) {
      await prisma.pushToken.create({
        data: { guestId, token },
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error saving token:', err);
    return new Response(JSON.stringify({ error: 'Failed to save token' }), { status: 500 });
  }
}
