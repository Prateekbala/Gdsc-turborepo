// pages/api/user/projects.ts
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
    let {projectID}=body
    projectID=Number(projectID)
    console.log(projectID);
    if (isNaN(projectID) || isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project ID or user ID"
        },
        { status: 400 }
      );
    }
    const project = await db.project.findFirst({
      where: {
        id: projectID,
        userId: userId,
      },
    });
    if(!project){
      return NextResponse.json(
        {
          success:false,
          message:"Error fetching indiviual project projects"
        },
        {status:500}
        )
    }

    return NextResponse.json(
      {
        success:true,
        project
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
