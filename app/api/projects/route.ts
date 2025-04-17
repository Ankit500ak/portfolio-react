import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { CreateProjectData } from "@/types/project"

// Add return type annotations
export async function GET(): Promise<NextResponse> {
  try {
    // Add explicit select to ensure we only get the fields we want
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        techStack: true,
        githubLink: true,
        liveLink: true,
        featuredImage: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Parse and validate the request body
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'techStack', 'githubLink', 'liveLink', 'featuredImage']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create the project
    const project = await prisma.project.create({
      data: body as CreateProjectData,
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    
    // Handle different types of errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}