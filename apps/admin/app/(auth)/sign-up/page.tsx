"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../@/components/ui/form';

import { Button } from '../../../@/components/ui/button';
import { Input } from '../../../@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, useToast } from '../../../@/components/ui/use-toast';
import { signUpSchema } from '../../../schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../../../types/ApiResponse';
import { Loader2 } from 'lucide-react';



export default function SignUpForm(){

const router = useRouter();
const { toast } = useToast(); 

const [IsSubmitting,setIsSubmitting]=useState(false)
const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name:"",
      password:"",
     conformPassword:"",
    },
  })

async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true)
    try {
     const response= await axios.post<ApiResponse>('/api/sign-up',data)
     toast({
        title: 'Successful',
        description: response.data.message,
      });
      
      router.replace("/sign-in");
      setIsSubmitting(false)
        
    } catch (error) {
        console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
    
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-400">
    <div className="w-full max-w-md p-3 space-y-4 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          ADMIN Sign-up
        </h1>
      </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conformPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conform Password</FormLabel>
              <FormControl>
                <Input placeholder="Conform Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className='w-full' disabled={IsSubmitting}>
              {IsSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a User?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    
  );

}