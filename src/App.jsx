import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useProgress, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import { ArcadeScreen } from './ArcadeScreen';
import { Floor } from './Floor';
import { Environment } from './Environment';
import { StreetLight } from './StreetLight';
import { BlinkingLed } from './BlinkingLed';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const POS_INITIAL = new THREE.Vector3(1.8, 1, 2.57);
const TARGET_INITIAL = new THREE.Vector3(0, 0, 0);
const SCREEN_CENTER = new THREE.Vector3(-0.63, 0.035, -0.065);
const POS_ZOOMED = new THREE.Vector3(0.50, 0.380, -0.060);

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

export default function App() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [shouldRenderEffects, setShouldRenderEffects] = useState(false); 
  const [dpr, setDpr] = useState(1);
  // Estado para desactivar elementos pesados si cae el rendimiento
  const [lowPerformance, setLowPerformance] = useState(false);
  const controlsRef = React.useRef();

  // Detección inicial rápida de pantalla móvil/touch
  const isMobile = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Si es móvil, evitamos arrancar los post-effects de entrada
      if (!isMobile) setShouldRenderEffects(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isMobile]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'CLOSE_SCREEN') setIsZoomed(false);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative', overflow: 'hidden', background: '#05050d' }}>
      <Canvas 
        shadows={false}
        dpr={dpr}
        performance={{ min: 0.2 }}
        camera={{ position: [1.8, 1, 2.57], fov: 50 }}
        gl={{ 
          preserveDrawingBuffer: false, 
          powerPreference: 'high-performance', 
          antialias: false,
          precision: isMobile ? 'lowp' : 'highp' // Bajamos precisión de shaders en móviles
        }}
      >
        {/* Monitoriza los FPS. Si caen, apaga efectos pesados y baja el dpr */}
        <PerformanceMonitor
          onChange={({ factor }) => {
            setDpr(Math.max(0.5, Math.min(1.2, factor * 1.2)));
          }}
          onDecline={() => {
            setLowPerformance(true);
            setShouldRenderEffects(false); // Desactiva Post-Processing al detectar caída de FPS
          }}
        />
        
        {/* Reduce el Pixel Ratio automáticamente si la cámara se mueve rápido */}
        <AdaptiveDpr />

        <Suspense fallback={null}>
          <LoaderController />
          <Environment />
          <StreetLight position={[-0.81, -1.11, 0.62]} />
          <BlinkingLed position={[0.063, -0.32, -0.58]} color="#ff0044" />
          <CameraRig isZoomed={isZoomed} controlsRef={controlsRef} />
          <ArcadeScreen isZoomed={isZoomed} setIsZoomed={setIsZoomed} />
          <Floor />  

          {/* Reducimos la cantidad de partículas drasticamente si baja el rendimiento */}
          <Stars 
            radius={100} 
            depth={50} 
            count={lowPerformance ? 200 : (isMobile ? 400 : 800)} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />

          {!lowPerformance && (
            <Sparkles 
              count={isMobile ? 20 : 60} 
              scale={3} 
              size={1} 
              speed={0.5} 
              color="#00ffff" 
            />
          )}

          {shouldRenderEffects && !lowPerformance && <Effects />}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableZoom={!isZoomed}
          enableRotate={!isZoomed}
          enablePan={false}
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