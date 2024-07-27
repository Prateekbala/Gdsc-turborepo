import { NextResponse } from 'next/server';
import db from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Authorized"
        },
        { status: 401 }
      );
    }
    
    const users = await db.user.findMany({
      select: { id: true, name: true, email: true },
    });
    
    return NextResponse.json(
      {
        success: true,
        users
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}