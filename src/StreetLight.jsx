import React from 'react';

export function StreetLight({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.089, 12, 12]} />
        <meshStandardMaterial color="#52eecc" emissive="#6471e9" emissiveIntensity={2} />
      </mesh>

      <spotLight
        position={[0, 2, 0]}
        target-position={[0, 0, 0]}
        color="#c825fe"
        intensity={3}
        distance={8}           
        angle={Math.PI / 3.5}  
        penumbra={0.9}
      />
    </group>
  );
}