"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button } from "../../../../@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation';
import Typography from '@mui/material/Typography';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../@/components/ui/dropdown-menu"

interface Project {
  id: number;
  name: string;
  description: string;
  GitHub: string;
  TechStack: string;
  Hostedlink: string;
  imageLink: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const userID = pathname.split('/').pop();
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.post('/api/allProjects', {
          userID: userID,  
        });
        if (response.data.success) {
          setProjects(response.data.projects);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const onDelete = async (projectId: number) => {
    try {
      const response = await axios.post('/api/delete', { projectId });
      if (response.data.success) {
        setProjects(projects.filter((project) => project.id !== projectId));
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const onEdit = (projectId: number) => {
    router.push(`/edit/${projectId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row items-center justify-evenly p-24">
 
      {projects.map((project) => (
        <Card key={project.id} sx={{ maxWidth: 345, marginBottom: 2 }}>
          <CardMedia
            sx={{ height: 140 }}
            image={project.imageLink || "/static/images/cards/contemplative-reptile.jpg"} 
            title={project.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Description : {project.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tech Stack : {project.TechStack}
            </Typography>
          </CardContent>
          <CardActions>
            <Button >
              GitHub
            </Button>
            <Button >
              Live Link
            </Button>
            </CardActions>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Options</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onEdit(project.id)}>
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(project.id)} style={{ color: 'red' }}>
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
      
        </Card>
      ))}
    </div>
  );
}
