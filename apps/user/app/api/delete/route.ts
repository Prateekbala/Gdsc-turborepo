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
    let {projectId}=body
    projectId=Number(projectId)
    const project = await db.project.findFirst({
        where: { id: projectId, userId },
      });

      if (!project) {
        return NextResponse.json(
            {
              success:false,
              message:"Project not found"
            },
            {status:404}
            )
      }

      await db.project.delete({
        where: { id: projectId },
      });

    return NextResponse.json(
      {
        success:true,
      },
      {status:200}
      )
  } catch (error) {
    console.error('Error deleting projects:', error);
    return NextResponse.json(
      {
        success:false,
        message:"Error deleting projects"
      },
      {status:500}
      )
  }
};
