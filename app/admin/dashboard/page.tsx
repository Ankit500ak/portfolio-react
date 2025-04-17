"use server"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Image, Link2, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Check if user is authenticated
const checkAuth = () => {
  const token = localStorage.getItem("adminToken")
  return token === "admin-auth-token"
}

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveLink: "",
    featuredImage: "",
  })

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  // Handle project submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const project = await prisma.project.create({
        data: projectData,
      })

      if (project) {
        toast({
          title: "Success",
          description: "Project added successfully",
        })
        // Reset form
        setProjectData({
          title: "",
          description: "",
          techStack: "",
          githubLink: "",
          liveLink: "",
          featuredImage: "",
        })
      } else {
        throw new Error("Failed to add project")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      })
    }
  }

  if (!checkAuth()) {
    router.push("/admin/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <Input
                type="text"
                placeholder="Enter project title"
                value={projectData.title}
                onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                placeholder="Enter project description"
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tech Stack</label>
              <Input
                type="text"
                placeholder="Enter tech stack (comma separated)"
                value={projectData.techStack}
                onChange={(e) => setProjectData({ ...projectData, techStack: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">GitHub Link</label>
                <Input
                  type="url"
                  placeholder="https://github.com/..."
                  value={projectData.githubLink}
                  onChange={(e) => setProjectData({ ...projectData, githubLink: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Live Demo Link</label>
                <Input
                  type="url"
                  placeholder="https://your-project.com"
                  value={projectData.liveLink}
                  onChange={(e) => setProjectData({ ...projectData, liveLink: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Featured Image</label>
              <Input
                type="text"
                placeholder="Enter image URL"
                value={projectData.featuredImage}
                onChange={(e) => setProjectData({ ...projectData, featuredImage: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Add Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
