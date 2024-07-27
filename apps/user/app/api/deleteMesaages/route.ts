// pages/api/user/messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import db from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req:Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success:false,
          message:"Not Authorized"
        },
        {status:400}
        )
    }

    const userId = Number(session?.user?.id);
    const body=await req.json();
    let {messageId}=body
    messageId=Number(messageId)
    const message = await db.message.findFirst({
        where: { id: messageId, userId },
      });

      if (!message) {
        return NextResponse.json(
            {
              success:false,
              message:"message not found"
            },
            {status:404}
            )
      }

      await db.message.delete({
        where: { id: messageId },
      });

    return NextResponse.json(
      {
        success:true,
      },
      {status:200}
      )
  } catch (error) {
    console.error('Error deleting messages:', error);
    return NextResponse.json(
      {
        success:false,
        message:"Error deleting messages"
      },
      {status:500}
      )
  }
};
