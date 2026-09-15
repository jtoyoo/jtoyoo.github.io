import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
import { ArcadeScreen } from './ArcadeScreen';
import { Floor } from './Floor';
import { Environment } from './Environment';
import { StreetLight } from './StreetLight';
import { BlinkingLed } from './BlinkingLed';
import * as THREE from 'three';

// Manejador del loader conectado a R3F
function LoaderController() {
  const { progress } = useProgress();

  useEffect(() => {
    // Cuando Drei confirma que todo el material 3D se ha cargado al 100%
    if (progress === 100) {
      const loader = document.getElementById("loader");
      if (!loader) return;

      const timer1 = setTimeout(() => {
        loader.classList.add("hide");

        const timer2 = setTimeout(() => {
          loader.classList.add("removed");
        }, 1000);

        return () => clearTimeout(timer2);
      }, 300);

      return () => clearTimeout(timer1);
    }
  }, [progress]);

  return null;
}

function CameraRig({ isZoomed, controlsRef }) {
  const posInitial = useRef(new THREE.Vector3(2.04, 1.51, 2.57));
  const targetInitial = useRef(new THREE.Vector3(0, 0, 0));
  
  const screenCenter = useRef(new THREE.Vector3(-0.63, 0.035, -0.065));
  const posZoomed = useRef(new THREE.Vector3(0.50, 0.380, -0.065));

  const isReturningRef = useRef(false);
  const prevZoomRef = useRef(isZoomed);

  useEffect(() => {
    if (prevZoomRef.current && !isZoomed) {
      isReturningRef.current = true;
    }
    prevZoomRef.current = isZoomed;
  }, [isZoomed]);

  useFrame((state) => {
    if (!controlsRef.current) return;

    if (isZoomed) {
      state.camera.position.lerp(posZoomed.current, 0.08);
      controlsRef.current.target.lerp(screenCenter.current, 0.08);
    } else if (isReturningRef.current) {
      const distance = state.camera.position.distanceTo(posInitial.current);
      if (distance > 0.02) {
        state.camera.position.lerp(posInitial.current, 0.08);
        controlsRef.current.target.lerp(targetInitial.current, 0.08);
      } else {
        isReturningRef.current = false;
      }
    }
  });

  return null;
}

export default function App() {
  const [isZoomed, setIsZoomed] = useState(false);
  const controlsRef = useRef();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'CLOSE_SCREEN') {
        setIsZoomed(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#05050d' }}>
      <Canvas 
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [2.03, 1.51, 2.57], fov: 50 }}
        gl={{ preserveDrawingBuffer: false, powerPreference: 'high-performance' }}
      >
        {/* Suspense es necesario para que useProgress registre los tiempos de carga */}
        <Suspense fallback={null}>
          <LoaderController />
          <Environment />

          <StreetLight position={[-0.81, -1.11, 0.62]} />

          <BlinkingLed position={[0.063, -0.32, -0.58]} color="#ff0044" />

          <CameraRig isZoomed={isZoomed} controlsRef={controlsRef} />
          <ArcadeScreen isZoomed={isZoomed} setIsZoomed={setIsZoomed} />
          
          <Floor />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableZoom={!isZoomed}
          enableRotate={!isZoomed}
          enablePan={!isZoomed}
          minDistance={1.2}
          maxDistance={4.0}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
    </div>
  );
}