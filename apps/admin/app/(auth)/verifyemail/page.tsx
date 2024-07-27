'use client';
import React from 'react'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { verifySchema } from '../../../schemas/verifySchema'


import { Button } from "../../../@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../@/components/ui/form"
import { Input } from "../../../@/components/ui/input"
import axios, { AxiosError } from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '../../../@/components/ui/use-toast';
import { Console, error } from 'console';
export default function verify() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  console.log("came to Verify page")

      
  async function verifyAccount(){
      try {
      const verifyTokenEncoded = searchParams.get("vtoken");
      const decodedEmail = searchParams.get("email");
      const response = await axios.post('/api/verify-email', {
        verifyTokenEncoded: verifyTokenEncoded,
        email:decodedEmail
      });
      console.log(response)
      
      if (response.data.success) {
        console.log("Success in verify ")
        router.replace('/sign-in');

      } else 
      {
        
        console.log("Not Success in verify ")
      }

    }
     catch(err){

          console.log("Error in verify @@@: ",err)
   }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Click on the button to verify Your account
          </h1>
        </div>
        <Button onClick={verifyAccount}>click Here</Button>
        </div>
        </div>
        
  )
}