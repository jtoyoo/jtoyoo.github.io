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
import { useAdaptiveQuality } from './useAdaptiveQuality';

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
  const controlsRef = React.useRef();

  // Integración del Hook híbrido detect-gpu + monitor adaptativo
  const { quality, degradeQuality, setQuality } = useAdaptiveQuality();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'CLOSE_SCREEN') setIsZoomed(false);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Evitamos montar el Canvas hasta que detect-gpu determine la potencia
  if (quality.loading) {
    return <div style={{ width: '100vw', height: '100dvh', background: '#05050d' }} />;
  }

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative', overflow: 'hidden', background: '#05050d' }}>
      <Canvas 
        shadows={false}
        dpr={quality.dpr}
        performance={{ min: 0.2 }}
        camera={{ position: [1.8, 1, 2.57], fov: 50 }}
        gl={{ 
          preserveDrawingBuffer: false, 
          powerPreference: 'high-performance', 
          antialias: quality.tier >= 2,
          precision: quality.isMobile && quality.tier < 2 ? 'mediump' : 'highp'
        }}
      >
        {/* Monitorea los FPS: ajusta DPR dinámicamente y degrada recursos si bajan los FPS */}
        <PerformanceMonitor
          onChange={({ factor }) => {
            setQuality(prev => ({
              ...prev,
              dpr: Math.max(0.5, Math.min(prev.dpr, factor * prev.dpr))
            }));
          }}
          onDecline={degradeQuality}
        />
        
        <AdaptiveDpr />

        <Suspense fallback={null}>
          <LoaderController />
          <Environment />
          <StreetLight position={[-0.81, -1.11, 0.62]} />
          <BlinkingLed position={[0.063, -0.32, -0.58]} color="#ff0044" />
          <CameraRig isZoomed={isZoomed} controlsRef={controlsRef} />
          <ArcadeScreen isZoomed={isZoomed} setIsZoomed={setIsZoomed} />
          <Floor />  

          <Stars 
            radius={100} 
            depth={50} 
            count={quality.starsCount} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />

          {quality.showSparkles && (
            <Sparkles 
              count={quality.isMobile ? 30 : 60} 
              scale={3} 
              size={1} 
              speed={0.5} 
              color="#00ffff" 
            />
          )}

          {quality.enableEffects && <Effects />}
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