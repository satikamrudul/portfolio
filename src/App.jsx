import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Environment, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const StylizedFish = () => {
  const pivotRef = useRef(null);
  const fishGroupRef = useRef(null);
  const tailRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Rotate the pivot to make the fish swim in a large circle
    if (pivotRef.current) {
      pivotRef.current.rotation.y = t * 0.15;
    }

    // Apply a smooth vertical wobble to the whole fish
    if (fishGroupRef.current) {
      fishGroupRef.current.position.y = Math.sin(t * 1.5) * 1.2;
      // Slight pitch rotation for organic movement
      fishGroupRef.current.rotation.x = Math.cos(t * 1.5) * 0.1;
    }

    // Wiggle the tail back and forth quickly
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 12) * 0.4;
    }
  });

  return (
    <group ref={pivotRef}>
      {/* Offset the fish from the center to establish the circle radius */}
      {/* Facing -Z direction inside its local group */}
      <group position={[12, 0, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <group ref={fishGroupRef}>
          
          {/* Main Body (Ellipsoid) */}
          <mesh scale={[0.4, 0.7, 1.4]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.2} roughness={0.2} />
          </mesh>

          {/* Tail Fin */}
          <group position={[0, 0, 1.2]} ref={tailRef}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.4]}>
              <coneGeometry args={[0.6, 1.2, 4]} />
              <meshStandardMaterial color="#0369a1" roughness={0.3} />
            </mesh>
          </group>

          {/* Dorsal Fin (Top) */}
          <mesh position={[0, 0.7, -0.2]} rotation={[Math.PI / 8, 0, 0]}>
            <coneGeometry args={[0.15, 0.8, 4]} />
            <meshStandardMaterial color="#0369a1" />
          </mesh>

          {/* Pectoral Fins (Sides) */}
          <mesh position={[0.4, -0.2, -0.2]} rotation={[0, 0, -Math.PI / 4]}>
            <coneGeometry args={[0.2, 0.8, 4]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[-0.4, -0.2, -0.2]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.2, 0.8, 4]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>

        </group>
      </group>
    </group>
  );
};

const ProjectCard = ({ position, scale, title, description, tagline }) => {
  const [hovered, setHover] = useState(false);
  const meshRef = useRef(null);

  // Smoothly interpolate scale and rotation on hover
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.05 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
      
      // Add a tiny constant floating effect to the cards
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t + position[0]) * 0.1;
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHover(true);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHover(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={position} scale={scale}>
      <group 
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Card Base */}
        <RoundedBox args={[3.8, 4.8, 0.3]} radius={0.15} smoothness={4}>
          <meshStandardMaterial 
            color={hovered ? "#1e3a8a" : "#0f172a"} 
            roughness={0.4} 
            metalness={0.3}
          />
        </RoundedBox>

        {/* Inner glow frame illusion */}
        <RoundedBox args={[3.6, 4.6, 0.31]} radius={0.1}>
          <meshBasicMaterial color={hovered ? "#3b82f6" : "#1e293b"} wireframe />
        </RoundedBox>
        
        {/* Project Title */}
        <Text 
          position={[0, 1.2, 0.2]} 
          fontSize={0.45} 
          color="#ffffff" 
          anchorX="center" 
          fontWeight="bold"
        >
          {title}
        </Text>

        {/* Separator Line */}
        <mesh position={[0, 0.5, 0.2]}>
          <planeGeometry args={[2.5, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Project Description */}
        <Text 
          position={[0, -0.3, 0.2]} 
          fontSize={0.22} 
          color="#94a3b8" 
          maxWidth={3.0} 
          textAlign="center"
          anchorX="center"
        >
          {description}
        </Text>

        {/* Optional Tagline */}
        {tagline && (
          <Text 
            position={[0, -1.6, 0.2]} 
            fontSize={0.16} 
            color="#38bdf8" 
            maxWidth={3.2} 
            textAlign="center"
            anchorX="center"
          >
            {tagline}
          </Text>
        )}
      </group>
    </group>
  );
};

const Scene = () => {
  const { viewport } = useThree();
  
  // Responsive design logic: Stack vertically on narrow screens
  const isMobile = viewport.width < 12;
  const cardScale = isMobile ? Math.min(viewport.width / 4.5, 1) : 1;
  
  // Define positions based on layout
  const positions = isMobile 
    ? [
        [0, 5.2 * cardScale, 0],
        [0, 0, 0],
        [0, -5.2 * cardScale, 0]
      ]
    : [
        [-4.2, 0, 0],
        [0, 0, 0],
        [4.2, 0, 0]
      ];

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#e0f2fe" />
      <pointLight position={[-10, -5, -10]} intensity={1} color="#0369a1" />
      
      {/* Provides sleek reflections on the materials */}
      <Environment preset="city" />

      {/* Background Animated Fish */}
      <StylizedFish />

      {/* LinkedIn Profile Sections */}
      <ProjectCard 
        position={positions[0]} 
        scale={cardScale}
        title="Education" 
        description="B.Tech CSE (Data Science) Student at Nalla Narasimha Reddy Education Society Group of Institutions." 
      />
      <ProjectCard 
        position={positions[1]} 
        scale={cardScale}
        title="Top Skills" 
        description="Java, Data Science, and active participation in Hackathons and technical projects." 
      />
      <ProjectCard 
        position={positions[2]} 
        scale={cardScale}
        title="Focus Area" 
        description="Based in Hyderabad, Telangana. Passionate about learning by building and exploring Data Science." 
        tagline="Learning by Building"
      />
    </>
  );
};

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050814] select-none font-sans">
      
      {/* HTML UI Overlay */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 z-10 pointer-events-none flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        
        {/* Profile Picture */}
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-2 md:border-4 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] shrink-0">
          <img 
            src="/profile.jpg" 
            alt="Mrudul Satika" 
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-sky-400 tracking-tight drop-shadow-lg">
            Mrudul Satika
          </h1>
          <p className="text-sm md:text-lg text-sky-200 mt-1 md:mt-2 font-medium tracking-wide opacity-80">
            B.Tech CSE (Data Science) Student
          </p>
          <div className="flex items-center gap-2 mt-1 md:mt-2">
            <span className="text-sky-300 text-xs md:text-sm font-semibold bg-sky-900/40 px-3 py-1 rounded-full border border-sky-500/30 backdrop-blur-sm">
              📞 +91 8500661847
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 w-full text-center z-10 pointer-events-none opacity-50">
        <p className="text-xs text-sky-100 uppercase tracking-widest">
          Drag to Rotate &bull; Scroll to Zoom
        </p>
      </div>

      {/* Main 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#050814']} />
        <fog attach="fog" args={['#050814', 15, 35]} />
        
        <Scene />

        {/* Orbit Controls restricted to keep the view focused */}
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          minDistance={8}
          maxDistance={18}
        />
      </Canvas>
    </div>
  );
}
