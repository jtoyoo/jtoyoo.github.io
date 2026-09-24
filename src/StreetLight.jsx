import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function StreetLight({ position = [0, 0, 0], scale = 0.5 }) {
  const spotLightRef = useRef();

  useFrame((state) => {
    if (spotLightRef.current) {
      spotLightRef.current.intensity = 
        3 + Math.sin(state.clock.elapsedTime * 20) * 0.3 + (Math.random() - 0.3) * 0.2;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Orbe Emisor Estilo Hacker */}
      <mesh position={[0, 4, 0]}>
        <sphereGeometry args={[0.089, 12, 12]} />
        <meshBasicMaterial 
          color="#fc65f2" 
          transparent={true} 
          opacity={0.8} 
        />
      </mesh>

      {/* Foco de Luz proyectado hacia abajo */}
      <spotLight
        ref={spotLightRef}
        position={[0, 2, 0]}
        target-position={[0, 0, 0]}
        color="#fe2ffb"
        intensity={3}
        distance={6}           
        angle={Math.PI / 3.5}  
        penumbra={0.9}
      />
    </group>
  );
}