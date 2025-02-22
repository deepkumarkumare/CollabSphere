'use client'
import React from 'react'
import { Card, CardTitle } from '@/components/ui/card'
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link';


const page = () => {

  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any>(null);
    const [newProject, setNewProject] = useState({ 
        title: '', 
        description: '', 
        image: '',
        projectLink: ''
      });
      const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');

      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        const fetchProfile = async () => {
          if (!user || !isLoaded) return;
          try {
            setLoading(true);
            const res = await fetch('/api/profile');
            if (!res.ok) throw new Error('Failed to fetch profile');
            const data = await res.json();
            setProfile(data);
            setImage(data.image || '');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
            setLoading(false);
          }
        };
        fetchProfile();
      }, [user, isLoaded]);

      const createProject = async () => {
        if (!newProject.title.trim()) return;
        try {
          setLoading(true);
          const res = await fetch('/api/projects', {
            method: 'POST',
            body: JSON.stringify(newProject),
            headers: { 'Content-Type': 'application/json' }
          });
          if (!res.ok) throw new Error('Failed to create project');
          const updatedProfile = await res.json();
          setProfile(updatedProfile);
          setNewProject({ title: '', description: '', image: '', projectLink: '' });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };
    
      const deleteProject = async (projectId: string) => {
        try {
          setLoading(true);
          const res = await fetch('/api/projects', {
            method: 'DELETE',
            body: JSON.stringify({ projectId }),
            headers: { 'Content-Type': 'application/json' }
          });
          if (!res.ok) throw new Error('Failed to delete project');
          const updatedProfile = await res.json();
          setProfile(updatedProfile);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

  return (
    <div>
      <Card className='h-full p-4'> 
      <section>
        <h2 className="text-xl mb-2">Projects</h2>
        <Card className='p-4 my-4'>
        <div className="mb-2">
          <Input
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            placeholder="Project title"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <Textarea
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            placeholder="Description"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <Input
            value={newProject.image}
            onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
            placeholder="Image URL"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <Input
            value={newProject.projectLink}
            onChange={(e) => setNewProject({ ...newProject, projectLink: e.target.value })}
            placeholder="Project Link (e.g., GitHub URL)"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <button 
            onClick={createProject} 
            className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
            disabled={loading}
          >
            Create Project
          </button>
        </div>
        </Card>
        <Card className='p-4'>

        {profile?.projects?.map((project: any) => (
          <div key={project._id} className="">
            <div>

            <Card className='flex-1 m-2 p-2 gap-3'>
        <Card style={{
    backgroundImage: `url(${project.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }} className='h-64 mb-2'></Card>
        <Card>
        <CardTitle className='p-5' >Project Description :</CardTitle>
        <CardTitle className='p-5' >{project.title}</CardTitle>
        <div className='p-5 pt-0 text-sm'>  
        {project.description}
        </div>
        <Link href={project.projectLink || '#'} className={`${buttonVariants({ variant: "outline"})} mb-5 mx-5 w-[90%]`}>Go to Project </Link>
        </Card>
        <Button variant="destructive"
              onClick={() => deleteProject(project._id)}
              className=" m-[2%] w-[96%] p-1 rounded disabled:bg-gray-400"
              disabled={loading}
            >
              Delete
            </Button>
    </Card>



           
            </div>
            
          </div>
        ))}
        </Card>
      </section>
         </Card>
    </div>
  )
}

export default page
