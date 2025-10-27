"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleBackgroundProps {
  particleCount?: number;
  particleColor?: number;
  particleOpacity?: number;
  animationSpeed?: number;
  particleSize?: number;
  className?: string;
}

export default function ParticleBackground({
  particleCount = 100,
  particleColor = 0xFFD700,
  particleOpacity = 0.8,
  animationSpeed = 0.001,
  particleSize = 0.02,
  className = "fixed inset-0 -z-10"
}: ParticleBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 6);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create particles - EXACT same as 3D test
    const particles = new THREE.Group();
    const particleGeometry = new THREE.SphereGeometry(particleSize, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: particleColor,
      transparent: true,
      opacity: particleOpacity
    });

    // Create multiple particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      particle.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      particles.add(particle);
    }

    scene.add(particles);

    // Animation - EXACT same as 3D test
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      particles.children.forEach((particle, index) => {
        particle.position.y += Math.sin(Date.now() * animationSpeed + index) * 0.01;
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
      });

      particles.rotation.y += 0.002;

      if (rendererRef.current) {
        rendererRef.current.render(scene, camera);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      particleGeometry.dispose();
      particleMaterial.dispose();
      rendererRef.current?.dispose();
    };
  }, [particleCount, particleColor, particleOpacity, animationSpeed, particleSize]);

  return (
    <div 
      ref={mountRef} 
      className={className}
      style={{ pointerEvents: 'none' }}
    />
  );
}