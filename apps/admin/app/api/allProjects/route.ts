
import { NextResponse } from 'next/server';
import db from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: Request) {
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

    const body = await req.json();
    const { userID } = body;

    if (!userID || isNaN(Number(userID))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid userID"
        },
        { status: 400 }
      );
    }

    const projects = await db.project.findMany({
      where: { userId: Number(userID) },
    });

    return NextResponse.json(
      {
        success:true,
        projects
      },
      {status:200}
      )
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        success:false,
        message:"Error fetching projects"
      },
      {status:500}
      )
  }
};