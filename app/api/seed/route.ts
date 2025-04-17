import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/lib/db"

export async function POST() {
  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: "admin@example.com",
      },
    })

    if (!existingUser) {
      // Create admin user
      const hashedPassword = await hash("password123", 10)
      await prisma.user.create({
        data: {
          name: "Admin",
          email: "admin@example.com",
          password: hashedPassword,
        },
      })
    }

    // Check if sample projects exist
    const projectCount = await prisma.project.count()

    if (projectCount === 0) {
      // Create sample projects
      await prisma.project.createMany({
        data: [
          {
            title: "E-Commerce Dashboard",
            description:
              "A comprehensive dashboard for e-commerce businesses with real-time analytics, inventory management, and customer insights.",
            imageUrl: "/placeholder.svg?height=600&width=800",
            demoUrl: "https://example.com/demo",
            repoUrl: "https://github.com/example/repo",
            category: "web",
            tags: "Next.js, TypeScript, Tailwind CSS, Prisma",
            featured: true,
          },
          {
            title: "Finance Mobile App",
            description:
              "A mobile application for personal finance management with expense tracking, budgeting, and investment monitoring.",
            imageUrl: "/placeholder.svg?height=600&width=800",
            demoUrl: "https://example.com/demo",
            repoUrl: "https://github.com/example/repo",
            category: "mobile",
            tags: "React Native, Redux, Firebase",
            featured: false,
          },
          {
            title: "AI Content Generator",
            description:
              "A web application that leverages AI to generate marketing content, blog posts, and social media captions.",
            imageUrl: "/placeholder.svg?height=600&width=800",
            demoUrl: "https://example.com/demo",
            repoUrl: "https://github.com/example/repo",
            category: "web",
            tags: "React, Node.js, OpenAI API",
            featured: true,
          },
        ],
      })
    }

    return NextResponse.json({
      message: "Database seeded successfully",
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
