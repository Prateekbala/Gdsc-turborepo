import nodemailer from "nodemailer"

export const sendEmail=async ({ email, verifyTokenEncoded }: { email: string; verifyTokenEncoded: string})=>{

   try {
     var transport = nodemailer.createTransport({
         host: "sandbox.smtp.mailtrap.io",
         port: 2525,
         auth: {
           user:process.env.MAIL_USER,
           pass: process.env.MAIL_PASS
         }
       });
       const mailOptions={
        from:'pratik125@gmail.com',
        to :email,
        subject:"Verify Your Email",
        html:`<p>Click <a href="${process.env.domain}/verifyemail?email=${encodeURIComponent(email)}&vtoken=${verifyTokenEncoded}">here</a>to verify your Email</p>`
       }
       const response=await transport.sendMail(mailOptions)
       return response
   } 
   catch (error:any) {
    throw new Error(error.message)
   }

}