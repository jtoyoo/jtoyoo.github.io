import React, { useEffect } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import './ArcadeScreen.css';

export function ArcadeScreen({ isZoomed, setIsZoomed, ...props }) {
  const { nodes, materials } = useGLTF('/maqui-transformed.glb');

  useEffect(() => {
    Object.values(materials).forEach((material) => {
      material.envMapIntensity = 1.5;
    });
  }, [materials]);

  return (
    <group {...props} dispose={null}>
      {/* Geometría con proyección de sombra solo en las piezas principales */}
      <mesh castShadow geometry={nodes['2'].geometry} material={materials.PaletteMaterial001} position={[0.009, 0.346, -0.071]} rotation={[1.573, -0.18, -1.564]} scale={[0.094, 0.087, 0.082]} />
      <mesh castShadow geometry={nodes.console.geometry} material={materials['tripo_material_c07d0d50-f663-4333-8d12-d6154f4c649f.002']} position={[0.061, 0, 0]} scale={[0.824, 1, 0.99]} />
      <mesh geometry={nodes.geometry_0.geometry} material={materials.place_holder} />
      <mesh geometry={nodes.lamp.geometry} material={materials['Material.002']} position={[-0.808, -0.352, 0.619]} rotation={[0, 1.553, 0]} scale={[0.026, 0.046, 0.026]} />
      <mesh geometry={nodes.rsg_military_barbed_wire_01.geometry} material={materials['Jackson_PBR.001']} position={[-0.511, -0.238, 0.222]} rotation={[-2.902, 0.979, 3.105]} scale={[0.35, 0.25, 0.25]} />
      <mesh geometry={nodes.rsg_military_barbed_wire_01001.geometry} material={materials.PaletteMaterial003} position={[-0.58, -0.43, -0.663]} rotation={[Math.PI, -0.653, Math.PI]} scale={[0.24, 0.25, 0.25]} />
      
      <group position={[0.211, 0.292, -0.062]} rotation={[-Math.PI, 0, -0.303]} scale={[0.089, 0.079, 0.144]}>
        <mesh geometry={nodes.Mesh006.geometry}>
          <meshStandardMaterial 
            roughness={0.4} 
            metalness={0.6} 
            envMapIntensity={2.0} 
            color="#323439"
          />
        </mesh>
        <mesh geometry={nodes.Mesh006_1.geometry} material={materials.PaletteMaterial005} />
      </group>

      <mesh geometry={nodes.antenna01.geometry} material={materials['place_holder.004']} position={[12.892, -1.098, -2.774]} rotation={[0, 1.565, 0]} scale={0.02} />
      <mesh geometry={nodes.antenna02.geometry} material={materials['place_holder.003']} position={[12.892, -1.098, -2.774]} rotation={[0, 1.565, 0]} scale={0.02} />
      <mesh geometry={nodes.lampBulb.geometry} material={materials.PaletteMaterial002} position={[12.892, -1.098, -2.774]} rotation={[0, 1.565, 0]} scale={0.02} />

      <group 
        position={[0.202, 0.288, -0.065]} 
        rotation={[-1.572, 1.269, -3.132]}
      >
        <Html
          transform
          occlude={!isZoomed} 
          distanceFactor={isZoomed ? 0.15 : 0.11}
          position={[0, 0, 0.025]}
          className={`arcade-html-container ${isZoomed ? 'zoomed' : ''}`}
        >
          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            {!isZoomed && (
              <div
                onClick={() => setIsZoomed(true)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 10,
                  cursor: 'pointer',
                  background: 'transparent',
                  pointerEvents: 'auto' 
                }}
              />
            )}

            <iframe
              src="/index.html"
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none',
                pointerEvents: isZoomed ? 'auto' : 'none' 
              }}
              title="Portfolio Jose Toyo"
            />
          </div>
        </Html>
      </group>
    </group>
  );
}

useGLTF.preload('/maqui-transformed.glb');