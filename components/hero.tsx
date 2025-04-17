"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  useAnimations,
  ContactShadows,
  Float
} from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'

// 3D Model Configuration
interface ModelConfig {
  modelPath: string;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  autoRotate: boolean;
  autoRotateSpeed: number;
  animation?: string;
  animationSpeed?: number;
  glow?: boolean;
  cursorReactivity?: number;
}

// Default configuration values
const DEFAULT_CONFIG: ModelConfig = {
  modelPath: '/assets/3d/scene.gltf',
  position: [0, -0.5, 0],
  scale: 0.2,
  rotation: [0, 0, 0],
  autoRotate: false,
  autoRotateSpeed: 0.5,
  animation: 'idle',
  animationSpeed: 1.0,
  glow: true,
  cursorReactivity: 0.5
};

// Stylized loading fallback
function LoadingFallback() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <meshStandardMaterial color="#5686F5" wireframe />
      </mesh>
    </Float>
  );
}

// Enhanced Model component with strong cursor reactivity
function Model({ config = DEFAULT_CONFIG }: { config?: Partial<ModelConfig> }) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const { scene, animations } = useGLTF(mergedConfig.modelPath);
  const { actions, mixer } = useAnimations(animations, groupRef);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize model and animations
  useEffect(() => {
    try {
      if (!scene) {
        setError("Failed to load model scene");
        return;
      }
      
      // Apply material enhancements to the original scene
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          if (node.material) {
            // Enhance material properties
            if (node.material instanceof THREE.MeshStandardMaterial) {
              node.material.envMapIntensity = 1.5;
              node.material.roughness = 0.4;
              node.material.metalness = 0.7;
              node.castShadow = true;
              node.receiveShadow = true;
            }
          }
        }
      });
      
      setLoaded(true);
      
      // Start animation if available
      if (mergedConfig.animation && actions[mergedConfig.animation]) {
        const action = actions[mergedConfig.animation];
        if (action) {
          action.reset().fadeIn(0.5).play();
          
          if (mergedConfig.animationSpeed) {
            action.setEffectiveTimeScale(mergedConfig.animationSpeed);
          }
        }
      }
    } catch (err) {
      console.error("Error initializing model:", err);
      setError("Failed to initialize model");
    }
    
    return () => {
      // Clean up animations on unmount
      if (actions) {
        Object.values(actions).forEach(action => {
          if (action) action.fadeOut(0.5);
        });
      }
    };
  }, [scene, actions, mergedConfig.animation, mergedConfig.animationSpeed]);
  
  // Enhanced cursor interaction
  useFrame((state, delta) => {
    if (groupRef.current && loaded) {
      // Calculate target rotation based on mouse position with enhanced reactivity
      const targetRotationY = mouse.x * (mergedConfig.cursorReactivity || 0.5);
      const targetRotationX = -mouse.y * (mergedConfig.cursorReactivity || 0.5) * 0.5; // Reduced vertical movement
      
      // Apply smooth rotation with easing
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 3 * delta;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 3 * delta;
      
      // Subtle floating animation
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = mergedConfig.position[1] + Math.sin(time * 0.5) * 0.05;
      
      // Update animations
      if (mixer) {
        mixer.update(delta);
      }
    }
  });

  // Error handling
  if (error) {
    console.error("Model error:", error);
    return <LoadingFallback />;
  }

  return (
    <Float 
      speed={1} 
      rotationIntensity={0.2} 
      floatIntensity={0.3}
    >
      <group 
        ref={groupRef}
        position={mergedConfig.position} 
        scale={mergedConfig.scale}
        rotation={mergedConfig.rotation}
      >
        {/* Original model */}
        <primitive object={scene} />
        
        {/* Enhanced glow effect if enabled */}
        {mergedConfig.glow && loaded && (
          <>
            <pointLight
              position={[0, 0.5, 0]}
              distance={2}
              intensity={0.5}
              color="#4f95fc"
            />
            <pointLight
              position={[0, -0.5, 0]}
              distance={1.5}
              intensity={0.3}
              color="#4f95fc"
            />
          </>
        )}
      </group>
    </Float>
  );
}

export default function Hero() {
  const { theme } = useTheme()
  const isDark = theme === "dark" || theme === "cyberpunk" || theme === "neon"

  // Model configuration
  const modelConfig = {
    ...DEFAULT_CONFIG,
    position: [0, 0.2, 0],
    scale: 0.9,
    glow: isDark,
    cursorReactivity: 0.8,
    autoRotate: false
  }

  return (
    <section 
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background/90 to-background/80"
    >
      {/* Decorative patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      {/* Content layout with dedicated mobile/desktop styling */}
      <div className="container relative z-10 mx-auto grid min-h-screen grid-cols-1 items-center px-4 py-12 md:grid-cols-2 md:gap-8 lg:gap-16">
        {/* Left side - Content */}
        <div className="flex flex-col items-start justify-center text-left space-y-8 md:space-y-12">
          {/* Tagline with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-6 inline-block rounded-full bg-primary/10 px-5 py-2 backdrop-blur-sm border border-primary/20"
          >
            <span className="relative z-10 text-sm font-semibold tracking-wide text-primary">
              <span className="text-primary/80">Full-Stack</span> Developer & Creative Coder
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur-xl opacity-70" />
          </motion.div>

          {/* Main heading with enhanced typography */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="relative z-10">
              <span className="block text-primary/80">Crafting</span>
              <span className="block text-primary">Digital Experiences</span>
              <span className="block text-primary/80">That Elevate</span>
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl opacity-70" />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/20 rounded-3xl blur-2xl opacity-50" />
          </motion.h1>

          {/* Description text with improved typography */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            <span className="text-primary/80">I specialize</span> in building performant, accessible, and visually stunning web applications. 
            Focusing on cutting-edge technologies and user-centric design to create impactful digital solutions.
          </motion.p>

          {/* Interactive buttons with improved styling */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <Button 
              size="lg" 
              className="group relative overflow-hidden rounded-lg px-6 py-6 text-base font-medium transition-all duration-300 hover:scale-[1.02] border border-primary/20"
              asChild
            >
              <a href="#projects">
                <span className="relative z-10">View My Work</span>
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg blur-xl" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group relative overflow-hidden rounded-lg px-6 py-6 text-base font-medium transition-all duration-300 hover:scale-[1.02] border border-primary/10 hover:border-primary/20"
              asChild
            >
              <a href="#contact">
                <span className="relative z-10">Get in Touch</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-xl" />
              </a>
            </Button>
          </motion.div>

          {/* Tech stack badges with improved styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-12 flex flex-wrap gap-3"
          >
            {['React', 'Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Node.js', 'MongoDB'].map((tech) => (
              <motion.span 
                key={tech}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.0 + Math.random() * 0.5 }}
                whileHover={{ scale: 1.05 }}
                className={`relative rounded-md px-3 py-1 text-xs font-medium transition-all duration-300 hover:scale-[1.02] ${
                  isDark 
                    ? 'bg-slate-800/60 text-slate-200' 
                    : 'bg-slate-200/60 text-slate-800'
                } backdrop-blur-sm border border-primary/10 hover:border-primary/20`}
              >
                <span className="relative z-10">
                  {tech}
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-md blur-sm" />
              </motion.span>
            ))}
          </motion.div>

          {/* Scroll indicator with improved styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, repeat: Infinity, repeatType: "reverse", repeatDelay: 0.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 md:hidden"
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Explore More</span>
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>
        </div>

        {/* Right side - 3D Model container */}
        <div className="relative h-[400px] w-full md:h-[600px] lg:h-[700px]">
          {/* Decorative elements */}
          <div className="absolute inset-0 z-0 opacity-30">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className={`absolute left-1/4 top-1/4 h-32 w-32 rounded-full ${
                isDark ? 'bg-primary/20' : 'bg-primary/10'
              } blur-3xl`} 
            />
            <motion.div 
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 1 }}
              className={`absolute bottom-1/4 right-1/3 h-40 w-40 rounded-full ${
                isDark ? 'bg-indigo-500/20' : 'bg-indigo-500/10'
              } blur-3xl`} 
            />
          </div>

          {/* 3D Canvas with enhanced styling */}
          <div className="absolute inset-0 z-10 rounded-2xl bg-background/50 backdrop-blur-sm">
            <Canvas 
              dpr={[1, 2]}
              camera={{ 
                position: [0, -1, 5], 
                fov: 45,
                near: 1,
                far: 100
              }}
            >
              {/* Enhanced lighting setup */}
              <ambientLight intensity={0.4} />
              <spotLight 
                position={[5, 10, 7.5]} 
                angle={0.15} 
                penumbra={1} 
                intensity={1} 
                castShadow 
              />
              <pointLight position={[-5, 5, -5]} intensity={0.5} color={isDark ? "#5686F5" : "#ffffff"} />
              <pointLight position={[5, -5, 5]} intensity={0.3} color={isDark ? "#8364ff" : "#f5f5f5"} />
              
              {/* Environment with better presets */}
              <Environment preset={isDark ? "night" : "sunset"} />
              <fog attach="fog" args={[isDark ? '#0a0a0a' : '#f5f5f5', 8, 15]} />
              
              {/* Model with enhanced presentation */}
              <Suspense fallback={<LoadingFallback />}>
                <Model config={modelConfig} />
              </Suspense>
              
              {/* Enhanced shadow beneath model */}
              <ContactShadows 
                position={[0, -0.8, 0]} 
                opacity={isDark ? 0.4 : 0.3}
                scale={10}
                blur={3}
                far={4}
                color={isDark ? "#000000" : "#202020"}
              />
              
              {/* Controls - limited to enhance model focus */}
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                enableRotate={false}
                enableDamping
                dampingFactor={0.05}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  )
}
