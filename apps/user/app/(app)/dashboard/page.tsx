"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
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
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.post('/api/projects');
        console.log(response);
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
    console.log(projectId);
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
            <Button size='small' href={project.GitHub} target="_blank">
              GitHub
            </Button>
            <Button size='small' href={project.Hostedlink} target="_blank">
              Live Link
            </Button>
          </CardActions>
          <Dropdown>
      <DropdownTrigger>
        <Button 
        >
          Open Menu
          </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Action event example" 
        onAction={(key) => alert(key)}
      >
        <DropdownItem onClick={() => onEdit(project.id)} key="edit">Edit Project</DropdownItem>
        <DropdownItem onClick={() => onDelete(project.id)} key="delete" className="z-90 text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
        </Card>
      ))}
    </div>
  );
}

