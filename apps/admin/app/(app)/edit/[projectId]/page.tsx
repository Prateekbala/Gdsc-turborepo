"use client";
import * as z from "zod";
import { useEdgeStore } from '../../../../@/lib/edgestore';
import { projectSchema } from "../../../../schemas/projectSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../@/components/ui/form";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { useState , useEffect } from "react";
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter, usePathname } from 'next/navigation';

export default  function Home() {

  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const pathname = usePathname();
  const projectID = pathname.split('/').pop();
  console.log("project id in edit/projectId is  ###:",projectID);
  const [projectData, setProjectData] = useState<z.infer<typeof projectSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      GitHub: '',
      TechStack: '',
      Hostedlink: '',
    },
  });
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await axios.post(`/api/individualProject`, {
          projectID,
        });
        console.log("Project data: ", result.data.project);
        form.reset({
          name: result.data.project.name,
          description: result.data.project.description,
          GitHub: result.data.project.GitHub,
          TechStack: result.data.project.TechStack,
          Hostedlink: result.data.project.Hostedlink,
        });
        setProjectData(result.data.project);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectID, form]);

const [IsSubmitting,setIsSubmitting]=useState(false)

  const handleSubmit = async (data: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true)
    const response= await axios.post('/api/edit',{
      ...data,
      projectID,
      imageLink: url 
    })
    if(response.data.success){
      await axios.post('/api/sendMessage',{
        projectID
      })
    router.replace("/dashboard");
    }
    setIsSubmitting(false)
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="GitHub"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paste your GitHub Link</FormLabel>
                <FormControl>
                  <Input placeholder="GitHub Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="TechStack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack Used</FormLabel>
                <FormControl>
                  <Input placeholder="Tech Stack" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Hostedlink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hosted Link</FormLabel>
                <FormControl>
                  <Input placeholder="Hosted Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center m-6 gap-2">
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files?.[0]);
              }}
            />
            <div className="h-[6px] w-44 border rounded overflow-hidden">
              <div className="h-full bg-green-600 transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
            <button className="bg-black text-white rounded px-2 hover:opacity-80"
              type="button"
              onClick={async () => {
                if (file) {
                  const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                      setProgress(progress);
                    },
                  });
                  setUrl(res.url);
                  console.log(res);
                }
              }}
            >
              Upload
            </button>
          </div>
          <Button type="submit" className="w-full bg-black text-white " disabled={IsSubmitting}>
          {IsSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Submit'
              )}
          </Button>
        </form>
      </Form>
    </main>
  );
}
