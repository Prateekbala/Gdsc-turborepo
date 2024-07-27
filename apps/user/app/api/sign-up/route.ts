import  bcrypt  from 'bcrypt';
import db from "@repo/db/client"
import {sendEmail} from "../../../mail/mailer"
import { NextResponse } from 'next/server';
export async function POST(req:Request){
  console.log("came to /api/sign-up");
    const body=await req.json();
    const {email,password,name}=body
    
    try {
      const existingUser=await db.user.findFirst({
        where:{
          email:email,
        }
      });

      const verifyTokenEncoded = (await bcrypt.hash(email,10)).toString();
      const hashedPassword=await bcrypt.hash(password,10);
      console.log(verifyTokenEncoded);
      if(existingUser)
        {
          if(existingUser.isverified)
          {
            return NextResponse.json(
                {
                  success:false,
                  message:"User Already Exists from this Email"
                },
                {status:400}
                )
          }
          else{
            await db.user.update({
              where:{email:email},
              data:{
                name:name,
                password: hashedPassword,
                verifyToken: verifyTokenEncoded,
                verifyTokenExpiry: new Date(Date.now() + 3600000),
                createdAt: new Date()
              }
            });
          }
        }
        
      else{
        const newUser= await db.user.create({
          data:{
            name:name,
            email:email,
            password:hashedPassword,
            isverified:false,
            verifyToken:verifyTokenEncoded,
            verifyTokenExpiry:new Date(Date.now()+3600000),
            createdAt: new Date(Date.now())
          }
        });
      }
      console.log("Error is in sing-up /api 1:")
    
      try {
       const response= await sendEmail({email,verifyTokenEncoded});
       console.log("send-email response :",response)

      } catch (error) {
        console.log("send-email error :",error)
        return Response.json(
              {
                success: false,
              },
              { status: 500 }
            );
      }
        return NextResponse.json({
          success: true,
          message: 'User registered successfully. Please verify your account.',
        }, { status: 201 });
        
     } catch (error) 
    {
      console.error('Error registering user:', error);
      return NextResponse.json(
        {
          success: false,
          message: "Error registering user:",
        },
        { status: 500 })
    }
    

    
}
