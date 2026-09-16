import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useProgress, Sparkles } from '@react-three/drei';
import { ArcadeScreen } from './ArcadeScreen';
import { Floor } from './Floor';
import { Environment } from './Environment';
import { StreetLight } from './StreetLight';
import { BlinkingLed } from './BlinkingLed';
import * as THREE from 'three';

// 1. ELIMINADAS las importaciones estáticas de TerminalOverlay y Effects

// Instancias fijas fuera del render loop para evitar basura en memoria
const POS_INITIAL = new THREE.Vector3(2, 1.51, 2.57);
const TARGET_INITIAL = new THREE.Vector3(0, 0, 0);
const SCREEN_CENTER = new THREE.Vector3(-0.63, 0.035, -0.065);
const POS_ZOOMED = new THREE.Vector3(0.50, 0.380, -0.060);

// 2. Declaración lazy de componentes grandes
const TerminalOverlay = lazy(() => import('./TerminalOverlay').then(m => ({ default: m.TerminalOverlay })));
const Effects = lazy(() => import('./Effects').then(m => ({ default: m.Effects })));

function LoaderController() {
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      const loader = document.getElementById("loader");
      if (!loader) return;

      const timer1 = setTimeout(() => {
        loader.classList.add("hide");
        const timer2 = setTimeout(() => loader.classList.add("removed"), 500);
        return () => clearTimeout(timer2);
      }, 200);

      return () => clearTimeout(timer1);
    }
  }, [progress]);

  return null;
}

function CameraRig({ isZoomed, controlsRef }) {
  const isReturningRef = React.useRef(false);
  const prevZoomRef = React.useRef(isZoomed);

  useEffect(() => {
    if (prevZoomRef.current && !isZoomed) {
      isReturningRef.current = true;
    }
    prevZoomRef.current = isZoomed;
  }, [isZoomed]);

  useFrame((state) => {
    if (!controlsRef.current) return;

    if (isZoomed) {
      state.camera.position.lerp(POS_ZOOMED, 0.08);
      controlsRef.current.target.lerp(SCREEN_CENTER, 0.08);
    } else if (isReturningRef.current) {
      const distance = state.camera.position.distanceTo(POS_INITIAL);
      if (distance > 0.02) {
        state.camera.position.lerp(POS_INITIAL, 0.08);
        controlsRef.current.target.lerp(TARGET_INITIAL, 0.08);
      } else {
        isReturningRef.current = false;
      }
    }
  });

  return null;
}

// App.jsx
export default function App() {
  const [isZoomed, setIsZoomed] = useState(false);
  // 1. Declarar el estado faltante
  const [shouldRenderEffects, setShouldRenderEffects] = useState(false); 
  const controlsRef = React.useRef();

  // 2. Activar los efectos de postprocesado tras la carga inicial de la escena
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRenderEffects(true);
    }, 1000); // 1 segundo de retraso para liberar el hilo principal en la carga inicial
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'CLOSE_SCREEN') setIsZoomed(false);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#05050d' }}>
      <Canvas 
        shadows={false}
        dpr={[1, 1.2]}
        performance={{ min: 0.5 }}
        camera={{ position: [2, 1.51, 2.57], fov: 50 }}
        gl={{ preserveDrawingBuffer: false, powerPreference: 'high-performance', antialias: false }}
      >
        <Suspense fallback={null}>
          <LoaderController />
          <Environment />
          <StreetLight position={[-0.81, -1.11, 0.62]} />
          <BlinkingLed position={[0.063, -0.32, -0.58]} color="#ff0044" />
          <CameraRig isZoomed={isZoomed} controlsRef={controlsRef} />
          <ArcadeScreen isZoomed={isZoomed} setIsZoomed={setIsZoomed} />
          <Sparkles count={40} scale={[2.5, 2.5, 2.5]} size={1} speed={0.3} color="#2cf0f7" />
          <Floor />
          
          {/* 3. Renderizado condicional seguro */}
          {shouldRenderEffects && <Effects />}
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

      <Suspense fallback={null}>
        <TerminalOverlay 
          isZoomed={isZoomed} 
          onClose={() => setIsZoomed(false)}
        />
      </Suspense> 
    </div>
  );
}