import React from 'react';

export function Environment() {
  return (
    <>
      <color attach="background" args={['#05050d']} />
      <fog attach="fog" args={['#05050d', 1.5, 9]} />

      <ambientLight intensity={4} />
      {/* Sombra direccional única optimizada */}
      <directionalLight 
        castShadow 
        shadow-mapSize-width={512} 
        shadow-mapSize-height={512} 
        position={[-5, -5, -5]} 
        intensity={2} 
        color="#1cfff7" 
      />
      {/* Luces puntuales */}
      <pointLight position={[-0.5, 1, 1.5]} intensity={4} color="#0084ff" distance={8} />
      <pointLight position={[1, 1, -0.3]} intensity={7} color="#ff0073" distance={10} />
      <pointLight position={[-1.5, 1, 0.5]} intensity={7} color="#8800ff" distance={8} />
      <pointLight position={[0.5, 1, 0.3]} intensity={4} color="#ff00ee" distance={10} />   
    </>
  );
}