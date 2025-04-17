import Hero from "@/components/hero"
import About from "@/components/about"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import ThemeSwitcher from "@/components/theme-switcher"

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="fixed bottom-5 right-5 z-50">
        <ThemeSwitcher />
      </div>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  )
}
