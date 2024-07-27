import db from '@repo/db/client';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from 'next/server';
import { number } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    let { projectID } = body;
    projectID=Number(projectID)

    const project = await db.project.findFirst({
      where: {
        id: projectID
      }
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    const newMessage = await db.message.create({
      data: {
        userId: project.userId,
        description: `Your project with name ${project.name} was changed by Admin`,
        createdAt: new Date()
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message created successfully',
        data: newMessage
      },
      { status: 201 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating message",error
        
      },
      { status: 500 }
    );
  }
}
