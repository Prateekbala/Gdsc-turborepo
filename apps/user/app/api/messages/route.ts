// pages/api/messages.ts
import { NextResponse } from 'next/server';
import db from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Authorized"
        },
        { status: 401 }
      );
    }

    const userId = Number(session?.user?.id);
    const messages = await db.message.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        messages
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Messages:', error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching Messages"
      },
      { status: 500 }
    );
  }
}