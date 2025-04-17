"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, Github, Linkedin, Twitter, Code2, Palette, Lightbulb, Rocket } from "lucide-react"

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="about" ref={ref} className="relative py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(var(--primary-rgb),0.1),rgba(255,255,255,0))]"></div>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-12 md:grid-cols-2 md:gap-16"
        >
          <motion.div variants={itemVariants} className="relative order-2 md:order-1">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/50">
              <Image
                src="/image.png"
                alt="Portrait"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/80 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 flex gap-3">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                whileHover={{ y: -5 }}
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                whileHover={{ y: -5 }}
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                whileHover={{ y: -5 }}
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="order-1 md:order-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              About Me
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Crafting Digital Experiences With Passion
            </h2>
            <p className="mt-4 text-muted-foreground">
              I'm a passionate full-stack developer with over 5 years of experience building modern web applications. I
              specialize in creating responsive, accessible, and performant user interfaces with React, Next.js, and
              TypeScript.
            </p>
            <p className="mt-4 text-muted-foreground">
              My approach combines technical expertise with creative problem-solving to deliver solutions that not only
              meet but exceed client expectations. I'm constantly exploring new technologies and methodologies to stay
              at the forefront of web development.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-3">
                <Code2 className="mb-2 h-6 w-6 text-primary" />
                <h3 className="font-medium">Development</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Building robust applications with modern frameworks
                </p>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <Palette className="mb-2 h-6 w-6 text-primary" />
                <h3 className="font-medium">Design</h3>
                <p className="mt-1 text-sm text-muted-foreground">Creating intuitive and beautiful user interfaces</p>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <Lightbulb className="mb-2 h-6 w-6 text-primary" />
                <h3 className="font-medium">Strategy</h3>
                <p className="mt-1 text-sm text-muted-foreground">Planning effective solutions to complex problems</p>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <Rocket className="mb-2 h-6 w-6 text-primary" />
                <h3 className="font-medium">Optimization</h3>
                <p className="mt-1 text-sm text-muted-foreground">Enhancing performance and user experience</p>
              </div>
            </div>

            <div className="mt-8">
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download Resume
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
