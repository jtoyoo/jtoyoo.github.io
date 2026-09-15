import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function BlinkingLed({ position = [0, 0, 0], color = "#ff0000" }) {
  const lightRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const intensity = Math.sin(time * 15) > 0 ? 3 : 0.2;

    if (lightRef.current) {
      lightRef.current.intensity = intensity;
    }
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = intensity * 2;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.003, 8, 8]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color={color}
        distance={0.03}
        decay={2}
      />
    </group>
  );
}