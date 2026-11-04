/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface OrbProps {
  reducedMotion: boolean;
  mousePos: { x: number; y: number };
  scrollY: number;
}

function MainTranslucentOrb({ reducedMotion, mousePos, scrollY }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));

  const geometry = useMemo(() => new THREE.SphereGeometry(2.0, 64, 64), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (!reducedMotion) {
      meshRef.current.rotation.y += delta * 0.18;
      meshRef.current.rotation.x += delta * 0.1;

      targetPos.current.x = mousePos.x * 0.8;
      targetPos.current.y = -mousePos.y * 0.6 - scrollY * 0.0015;

      meshRef.current.position.lerp(targetPos.current, 0.04);
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.4}
      rotationIntensity={0.4}
      floatIntensity={0.8}
      floatingRange={[-0.2, 0.2]}
    >
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#95D4A8"
          roughness={0.12}
          metalness={0.08}
          transmission={0.85}
          ior={1.46}
          thickness={1.8}
          transparent
          opacity={0.88}
          reflectivity={0.65}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          attenuationColor="#CFEBD8"
          attenuationDistance={2.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingLeafCluster({
  reducedMotion,
  scrollY,
}: {
  reducedMotion: boolean;
  scrollY: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const leafData = useMemo(() => {
    return [
      { pos: [-3.2, 1.8, -0.5] as [number, number, number], scale: 0.35, color: '#5FB37C' },
      { pos: [3.4, 0.6, -1.0] as [number, number, number], scale: 0.4, color: '#76C893' },
      { pos: [-2.4, -2.2, 0.2] as [number, number, number], scale: 0.28, color: '#A9D8B8' },
      { pos: [2.8, -2.4, -0.8] as [number, number, number], scale: 0.32, color: '#5FB37C' },
      { pos: [0.8, 3.0, -1.2] as [number, number, number], scale: 0.3, color: '#95D4A8' },
      { pos: [-1.2, -3.2, -0.4] as [number, number, number], scale: 0.25, color: '#CFEBD8' },
    ];
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.05;
    groupRef.current.position.y = -scrollY * 0.0008;
  });

  return (
    <group ref={groupRef}>
      {leafData.map((item, idx) => (
        <Float key={idx} speed={reducedMotion ? 0 : 2} rotationIntensity={1} floatIntensity={1.2}>
          <mesh position={item.pos} scale={item.scale}>
            <coneGeometry args={[0.6, 1.8, 5]} />
            <meshStandardMaterial
              color={item.color}
              roughness={0.35}
              metalness={0.05}
              transparent
              opacity={0.78}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function AmbientLightParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 32;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#CFEBD8'),
      new THREE.Color('#EAF7EE'),
      new THREE.Color('#A9D8B8'),
      new THREE.Color('#5FB37C'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

export function LandingBackground3D() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener('change', onMotionChange);

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x: nx, y: ny });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      media.removeEventListener('change', onMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_25%,#EAF7EE_0%,#F5FAF7_50%,#FFFFFF_100%)] opacity-85" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[720px] bg-[#CFEBD8]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[60vh] -left-20 w-[500px] h-[500px] bg-[#EAF7EE]/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[120vh] -right-20 w-[600px] h-[600px] bg-[#CFEBD8]/25 rounded-full blur-[130px] pointer-events-none" />

      {!webglError ? (
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-[#EAF7EE]/50 to-white" />
          }
        >
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 42 }}
            dpr={[1, 2]}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
            onError={() => setWebglError(true)}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <ambientLight intensity={1.4} color="#EAF7EE" />
            <directionalLight position={[4, 6, 4]} intensity={2.2} color="#FFFFFF" />
            <directionalLight position={[-4, -3, -2]} intensity={1.0} color="#CFEBD8" />
            <hemisphereLight args={['#FFFFFF', '#A9D8B8', 1.0]} />

            <MainTranslucentOrb
              reducedMotion={reducedMotion}
              mousePos={mousePos}
              scrollY={scrollY}
            />
            <FloatingLeafCluster reducedMotion={reducedMotion} scrollY={scrollY} />
            <AmbientLightParticles reducedMotion={reducedMotion} />
          </Canvas>
        </Suspense>
      ) : null}
    </div>
  );
}

export default LandingBackground3D;
