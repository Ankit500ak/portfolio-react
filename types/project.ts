
export interface Project {
  id: string
  title: string
  description: string
  techStack: string
  githubLink: string
  liveLink: string
  featuredImage: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectData {
  title: string
  description: string
  techStack: string
  githubLink: string
  liveLink: string
  featuredImage: string
}

export interface UpdateProjectData {
  title?: string
  description?: string
  techStack?: string
  githubLink?: string
  liveLink?: string
  featuredImage?: string
}
