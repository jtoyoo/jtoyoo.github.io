import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import './ArcadeScreen.css';

const asciiJoystick = `  .                             .           .     .        .       .                   .    
        .                                   .      .          .     .    .        .         
                                            .          .                     .              
          .                             .      . +@@@@-.       .                            
               . .                                  =@@@*             .                  
                                      . . .          =@@@@. . .                       .     
                      .                    .. .   . ..@@@@@@:                    .          
                              .        . .            @@@@@@@#:.                            
                                         .            %@@@@@:    .    . .                   
                    .  .                    .        .%@@@@@. .                      .      
        .                                   .@+  .    %@@@@@.  .                            
   .                -++++++++++++++++++++++@@@@@*++++-%@@@@@:+++++++++=      . .            
                    :%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*%@@@@@-@@@@@@@+   .                     
              .         =%.     .         :@@@@@*     %@@@@@.    +*                         
           .             *+.              :@@@@@*     %@@@@@.   .@     .                    
      .             .    +*              .:@@@@@*     %@@@@@.   -%.          .              
             .   .       +*        +@@%:  :@@@@@*     %@@@@@.   -%  .                       
                         +*       @@@.   .:@@@@@*     %@@@@@.   -%           .              
                         +*      %@@*   . :@@@@@*     %@@@@@.   -%          .               
  .                .   . +* .   .@@@+     :@@@@@*     %@@@@@.   -%                       .  
  ..              .      +*    .%@@@#     :@@@@@*  .  %@@@@@.   -%               ...   .    
                         +*  . .@@@@@     -@@@@@#     %@@@@@.   -%     .                    
     .                   +*    .@@@@@.   .#@@@@@@.    %@@@@@.   -%                          
                         =*    .@@@@@:  .%@@@@@@@@-   %@@@@@.   -% .           ..           
                         =#    -@@@@@:  =@@@@@@@@@*.  %@@@@@.  .=#                   . .    
             .      .     %=   *@@@@@:    %@@@@@@:   .%@@@@@.  :@:                    .     
       .           ..      :: .@@@@@@:  . -@@@@@%     %@@@@@:  - .  .         .             
                          . .+@@@@@@@:    :@@@@@*     %@@@@@@%.                             
                        .   +@@@@@@@@:    :@@@@@*     %@@@@@@@#.         .                  
                     .        =@@@@@@:    :@@@@@*     %@@@@@@.        ..                    
       .                     ..@@@@@@:   .:@@@@@*     %@@@@@.    ..     .                   
                   .   .    .  #@@@@@:    :@@@@@*     %@@@@@.                  ..          
             .      .          #@@@@@:    :@@@@@*     %@@@@@.                               
                               #@@@@@-    :@@@@@*    .@@@@@@.                         .     
     .                        .@@@@@@@#.  :@@@@@*   +@@@@@@@:                               
           .           .      *@@@@@%.    :@@@@@*     +@@@@@@.    .  .    ..  .             
                            :@@@@@=  .    *@@@@@@.      :%@@@@+                 .    .      
  .                      :*@@@%:::::::::::--------::::::::::#@@@%:.   .                  .  
                    -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#                    .
             .          .             . .%@@@@@@@@- .   .                                   
       .                   .   .          :@@@@@+                 .  .          .  .        
           . .       .  .        .         .@@@:    .                      .                
            .            .                . .@+                                            .
              .    .                         %.            .       .        .. .        .  
                                                                           .          .   . 
 .            .                                  .                      .                  .
               .  .                    .      .        .     .       .          .   .   .   
`;

export function ArcadeScreen({ isZoomed, setIsZoomed, ...props }) {
  const { nodes, materials } = useGLTF('/escena1-transformed.glb');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useCursor(hovered);

  const textRef = useRef();
  const hologramRef = useRef(); // Ref para rotar el holograma

  useFrame((state, delta) => {
    // Parpadeo del texto
    if (textRef.current) {
      if (!isTransitioning) {
        textRef.current.fillOpacity = Math.max(0, Math.min(1, (Math.sin(state.clock.elapsedTime * 3) + 1) / 2));
      } else {
        textRef.current.fillOpacity = 1;
      }
    }

    // Animación del holograma
  if (hologramRef.current) {
    // Rotación continua
    hologramRef.current.rotation.y += delta * 1.5; 

    // Efecto de parpadeo digital rápido 
    const time = state.clock.elapsedTime;
    const flicker = Math.sin(time * 20) * 0.1 + Math.cos(time * 45) * 0.05;
    
    // Opacidad tenue con micro-interferencias
    hologramRef.current.material.opacity = 0.35 + flicker;
  }
  });

  useEffect(() => {
    Object.values(materials).forEach((material) => {
      if (material) material.envMapIntensity = 1.5;
    });
  }, [materials]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isZoomed && !isTransitioning) {
      setIsTransitioning(true);
      setIsZoomed(true);
    }
  };

  useEffect(() => {
    if (!isZoomed) setIsTransitioning(false);
  }, [isZoomed]);

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes['2'].geometry} material={materials.PaletteMaterial001} position={[0.009, 0.346, -0.071]} rotation={[1.573, -0.18, -1.564]} scale={[0.094, 0.087, 0.082]} />
      <mesh geometry={nodes.antenna01.geometry} material={materials['place_holder.002']} position={[12.892, -1.098, -2.774]} rotation={[0, 1.565, 0]} scale={0.02} />
      <mesh geometry={nodes.antenna02.geometry} material={materials['place_holder.005']} position={[12.892, -1.098, -2.774]} rotation={[0, 1.565, 0]} scale={0.02} />
      <mesh geometry={nodes.console.geometry} material={materials['tripo_material_c07d0d50-f663-4333-8d12-d6154f4c649f.001']} position={[0.061, 0, 0]} scale={[0.824, 1, 0.99]} />
      <mesh geometry={nodes.geometry_0.geometry} material={materials['place_holder.001']} />
      <mesh geometry={nodes.lampBulb.geometry} material={materials.PaletteMaterial002} position={[12.892, -1.098, -2.774]} rotation={[0, 1.565, 0]} scale={0.02} />

      {/* --- MESH10 HOLOGRAMA --- */}
      <points 
        ref={hologramRef}
        geometry={nodes.Mesh10.geometry} 
        position={[0, 0.798, -0.066]} 
        rotation={[0, Math.PI / 2, 0]} 
        scale={0.25} 
      >
        <pointsMaterial 
          color="#e600ff"             
          size={0.0007}                 
          transparent={true}          
          opacity={0.30}               
          depthWrite={false}           // Evita solapamientos raros y mejora el efecto de transparencia
        />
      </points>

      <mesh 
        geometry={nodes.lamp.geometry} 
        position={[-0.808, -0.352, 0.619]} 
        rotation={[0, 1.553, 0]} 
        scale={[0.026, 0.046, 0.026]}
      >
        <meshBasicMaterial 
          color="#7949ff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.3}
        />
      </mesh>

      <mesh geometry={nodes.rsg_military_barbed_wire_01.geometry} material={materials['Jackson_PBR.003']} position={[-0.511, -0.238, 0.222]} rotation={[-2.902, 0.979, 3.105]} scale={[0.35, 0.25, 0.25]} />
      <mesh geometry={nodes.rsg_military_barbed_wire_01001.geometry} material={materials.PaletteMaterial003} position={[-0.58, -0.43, -0.663]} rotation={[Math.PI, -0.653, Math.PI]} scale={[0.24, 0.25, 0.25]} />
      
      <group position={[0.211, 0.292, -0.062]} rotation={[-Math.PI, 0, -0.303]} scale={[0.089, 0.079, 0.144]}>
        <mesh geometry={nodes.Mesh007.geometry} material={materials.PaletteMaterial004} />
        <mesh geometry={nodes.Mesh007_1.geometry} material={materials.PaletteMaterial005} />
      </group>

      {/* Pantalla interactiva */}
      <group position={[0.202, 0.288, -0.065]} rotation={[-1.572, 1.269, -3.132]}>
        <mesh 
          onClick={handleClick}
          onPointerOver={(e) => { e.stopPropagation(); if (!isZoomed) setHovered(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        >
          <planeGeometry args={[0.28, 0.20]} />
          <meshStandardMaterial 
            color="#05060d" 
            roughness={0.2}
            metalness={0.8}
            emissive={isTransitioning ? "#7c57f6" : "#120e29"}
            emissiveIntensity={isTransitioning ? 1.5 : 0.6}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>

        <Text
          ref={textRef}
          font="/assets/fonts/SpaceMono.ttf" 
          position={[-0.078, 0, 0.03]}
          rotation={[0, 0, -1.58]}
          fontSize={0.022}
          color={isTransitioning ? "#1d8ac9" : "#5acbf7"}
          anchorX="center"
          anchorY="middle"
        >
          {isTransitioning ? "҉" : ">> tap to start <<"}
        </Text>

        <Text
          font="/assets/fonts/SpaceMono.ttf" 
          position={[0.025, 0, 0.03]}
          rotation={[0, 0, -1.58]}
          fontSize={0.0035}
          lineHeight={1.1}
          color={isTransitioning ? "#b615d6" : "#f90faf"}
          anchorX="center"
          anchorY="middle"
          whiteSpace="pre"
        >
          {asciiJoystick}
        </Text>
      </group>
    </group>
  );
}

useGLTF.preload('/escena1-transformed.glb');