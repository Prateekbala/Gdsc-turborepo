import db from '@repo/db/client';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }


  const body = await req.json();
  let { name, description, GitHub, TechStack, Hostedlink, imageLink, projectID } = body;
  projectID=Number(projectID)

  try {
    const updateData: any = {
      name,
      description,
      GitHub ,
      TechStack,
      Hostedlink,
      updatedAt: new Date(),
    };

    if (imageLink) {
      updateData.imageLink = imageLink;
    }

    console.log("Update Data:", updateData);

    const updatedProject = await db.project.update({
      where: {
        id: projectID,
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject,
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Error updating project",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}