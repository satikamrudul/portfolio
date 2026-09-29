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
    if (pivotRef.current) pivotRef.current.rotation.y = t * 0.15;
    if (fishGroupRef.current) {
      fishGroupRef.current.position.y = Math.sin(t * 1.5) * 1.2;
      fishGroupRef.current.rotation.x = Math.cos(t * 1.5) * 0.1;
    }
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 12) * 0.4;
  });

  return (
    <group ref={pivotRef}>
      <group position={[12, 0, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <group ref={fishGroupRef}>
          <mesh scale={[0.4, 0.7, 1.4]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.2} roughness={0.2} />
          </mesh>
          <group position={[0, 0, 1.2]} ref={tailRef}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.4]}>
              <coneGeometry args={[0.6, 1.2, 4]} />
              <meshStandardMaterial color="#0369a1" roughness={0.3} />
            </mesh>
          </group>
          <mesh position={[0, 0.7, -0.2]} rotation={[Math.PI / 8, 0, 0]}>
            <coneGeometry args={[0.15, 0.8, 4]} />
            <meshStandardMaterial color="#0369a1" />
          </mesh>
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

const ProjectCard = ({ position, scale, title, description, tagline, backTitle, backDetails }) => {
  const [hovered, setHover] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.05 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
      
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t + position[0]) * 0.1 + position[1];

      // Smooth rotation for flipping
      const targetRotation = flipped ? Math.PI : 0;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation, delta * 6);
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

  const handleClick = (e) => {
    e.stopPropagation();
    setFlipped(!flipped);
  };

  return (
    <group position={[position[0], 0, position[2]]} scale={scale}>
      <group 
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
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
        
        {/* FRONT SIDE */}
        <group position={[0, 0, 0.16]}>
          <Text position={[0, 1.2, 0]} fontSize={0.45} color="#ffffff" anchorX="center" fontWeight="bold">
            {title}
          </Text>
          <mesh position={[0, 0.5, 0]}>
            <planeGeometry args={[2.5, 0.02]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <Text position={[0, -0.3, 0]} fontSize={0.22} color="#94a3b8" maxWidth={3.0} textAlign="center" anchorX="center" lineHeight={1.3}>
            {description}
          </Text>
          <Text position={[0, -1.8, 0]} fontSize={0.14} color={flipped ? "#0f172a" : "#38bdf8"} maxWidth={3.2} textAlign="center" anchorX="center">
            {tagline || "(Click to flip)"}
          </Text>
        </group>

        {/* BACK SIDE */}
        <group position={[0, 0, -0.16]} rotation={[0, Math.PI, 0]}>
          <Text position={[0, 1.4, 0]} fontSize={0.35} color="#ffffff" anchorX="center" fontWeight="bold">
            {backTitle}
          </Text>
          <mesh position={[0, 0.9, 0]}>
            <planeGeometry args={[2.5, 0.02]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <Text position={[0, -0.3, 0]} fontSize={0.2} color="#cbd5e1" maxWidth={3.2} textAlign="center" anchorX="center" lineHeight={1.5}>
            {backDetails}
          </Text>
          <Text position={[0, -1.8, 0]} fontSize={0.14} color="#38bdf8" maxWidth={3.2} textAlign="center" anchorX="center">
            (Click to flip back)
          </Text>
        </group>

      </group>
    </group>
  );
};

const Scene = () => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 12;
  const cardScale = isMobile ? Math.min(viewport.width / 4.5, 0.85) : 0.9;
  
  // Arrange 5 cards in two rows
  const positions = isMobile 
    ? [
        [0, 10.4 * cardScale, 0],
        [0, 5.2 * cardScale, 0],
        [0, 0, 0],
        [0, -5.2 * cardScale, 0],
        [0, -10.4 * cardScale, 0]
      ]
    : [
        [-4.5, 2.7, 0],
        [0, 2.7, 0],
        [4.5, 2.7, 0],
        [-2.25, -2.7, 0],
        [2.25, -2.7, 0]
      ];

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#e0f2fe" />
      <pointLight position={[-10, -5, -10]} intensity={1} color="#0369a1" />
      
      <Environment preset="city" />
      <StylizedFish />

      <ProjectCard 
        position={positions[0]} 
        scale={cardScale}
        title="Education" 
        description="B.Tech CSE (Data Science) Student at Nalla Narasimha Reddy Education Society Group of Institutions." 
        backTitle="Academic Journey"
        backDetails="Currently pursuing my B.Tech in Computer Science with a specialization in Data Science. \n\nDeveloping a strong foundation in core CS subjects, software engineering principles, and statistical modeling."
      />
      
      <ProjectCard 
        position={positions[1]} 
        scale={cardScale}
        title="Top Skills" 
        description="Java, Data Science, and active participation in Hackathons and technical projects." 
        backTitle="Tech Stack"
        backDetails="Languages: Java, Python, JavaScript/HTML/CSS. \n\nTechnologies: React, Data Science Libraries (Pandas, NumPy), Edge AI. \n\nTools: Git, GitHub, VS Code."
      />
      
      <ProjectCard 
        position={positions[2]} 
        scale={cardScale}
        title="Focus Area" 
        description="Based in Hyderabad, Telangana. Passionate about learning by building and exploring Data Science." 
        tagline="Learning by Building"
        backTitle="My Philosophy"
        backDetails="I believe the best way to master a skill is by applying it to real-world problems. \n\nI constantly participate in hackathons to challenge myself and build creative solutions under pressure."
      />

      <ProjectCard 
        position={positions[3]} 
        scale={cardScale}
        title="Recent Projects" 
        description="Practical applications built during hackathons and personal deep-dives." 
        tagline="Click to view details"
        backTitle="What I've Built"
        backDetails="1. Data Science predictive models utilizing machine learning algorithms. \n\n2. Interactive web applications (like this 3D portfolio!). \n\nAlways looking for the next big idea to build."
      />

      <ProjectCard 
        position={positions[4]} 
        scale={cardScale}
        title="About Me" 
        description="Aspiring software engineer and data scientist ready for industry challenges." 
        tagline="Click to connect"
        backTitle="Let's Connect!"
        backDetails="I'm highly motivated, adaptable, and eager to contribute to innovative tech teams. \n\nPhone: +91 8500661847\nLocation: Hyderabad, India\nLinkedIn: mrudul-satika-30aab7439"
      />
    </>
  );
};

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050814] select-none font-sans">
      
      {/* HTML UI Overlay */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 z-10 pointer-events-none flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 md:border-4 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] shrink-0">
          <img 
            src="./profile.jpg" 
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

      <div className="absolute bottom-6 w-full text-center z-10 pointer-events-none opacity-50 flex flex-col items-center gap-1">
        <p className="text-sm text-sky-300 font-bold tracking-wider animate-pulse">
          👆 CLICK ANY CARD TO FLIP IT!
        </p>
        <p className="text-xs text-sky-100 uppercase tracking-widest mt-2">
          Drag to Rotate &bull; Scroll to Zoom
        </p>
      </div>

      <Canvas 
        camera={{ position: [0, 0, 14], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#050814']} />
        <fog attach="fog" args={['#050814', 15, 35]} />
        
        <Scene />

        <OrbitControls 
          enablePan={true} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
          minDistance={8}
          maxDistance={22}
        />
      </Canvas>
    </div>
  );
}
