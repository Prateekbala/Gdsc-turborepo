
import db from '@repo/db/client';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from 'next/server';
export async function POST(req:Request){
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "unauthorized",
      },
      { status: 500 })
  }
  const userId = Number(session?.user?.id)
  console.log("usr Id is",userId);
    const body=await req.json();
    const { name, description, GitHub, TechStack, Hostedlink, imageLink } =body;
    console.log();
    
    try {
      const newProject = await db.project.create({
        data: {
          name,
          description,
          GitHub,
          TechStack,
          Hostedlink,
          imageLink,
          userId,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        },
      });
     
        return NextResponse.json({
          success: true,
          message: 'Project registered successfully',
        }, { status: 201 });
        
     } catch (error) 
    {
      console.log(error);
      return NextResponse.json(
        {
          success: false,
          message: "Error registering user:",error
        },
        { status: 500 })
    }
    
    
}
