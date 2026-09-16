import React, { Suspense } from 'react';
import { MeshReflectorMaterial, Text } from '@react-three/drei';

const asciiJo = `    .     .         .      .    .             .-=:   .         .   .                 
             . .      .     .     .            .+@@@=    .  .                        
 .                    .    .      .       .      .@@@@.                              
                 .           .           .        #@@@@*.                            
             .                              .     -@@@@@@@@:                 .       
 .            .             .  .                  :@@@@@@:        .         .        
.            .       .                            .@@@@@* .    ..       . .          
                                  .      :#       .@@@@@=                 . .        
      .          .        .            .#@@@-.    .@@@@@=          .    .            
   .              +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.@@@@@=%@@@@@@@@.               . .
     .          .  ..@=................*@@@@@:.....@@@@@=.....#+                     
      ..             .@.               *@@@@@:    .@@@@@=    *+ .                    
  .                   #=               *@@@@@:    .@@@@@=    #=      .      .      . 
          .           #=        .%@@= .*@@@@@:    .@@@@@=   .#-  .            .      
                      #=      .@@@.    *@@@@@:    .@@@@@=    #-        .  .  .. .  ..
             .        *=  .  .@@@-     *@@@@@:    .@@@@@=    #-                .     
                      *=     -@@@:     *@@@@@:    .@@@@@=    %-              .       
  . .  .              *=.   .@@@@-     *@@@@@:    .@@@@@=..  %-    .     .   .       
       .        .     *= .. .@@@@=.    #@@@@@-    .@@@@@=    %-                      
     .                *=    :@@@@%     @@@@@@*    .@@@@@= .  %-       .              
     .                *=    :@@@@@.  .%@@@@@@@=   .@@@@@=.   %-  .                  .
                      +*  . *@@@@@. =@@@@@@@@@@#. .@@@@@=    %:                  .   
.              .      -%.   @@@@@@.   -@@@@@@%  . .@@@@@=   =% .                     
                   .   .*. :@@@@@@.    %@@@@@=    .@@@@@%  +-              .         
                         .=@@@@@@@.    #@@@@@:    .@@@@@@%.                        . 
                    ..  +@@@@@@@@@.    *@@@@@:    .@@@@@@@@#:       .                
        .          ...    .@@@@@@@. .  *@@@@@:.   .@@@@@@=                  .        
       .            .  . . :@@@@@@.    *@@@@@:    .@@@@@%     ..                .    
                       .   .@@@@@@.    *@@@@@:  . .@@@@@=                   .    ..  
         .                  @@@@@@.    *@@@@@:    .@@@@@=                            
                      .    .@@@@@@.    *@@@@@:   .:@@@@@=                            
  .                        :@@@@@@@#.  *@@@@@:  :@@@@@@@%            .    ..         
.                          @@@@@@@.    *@@@@@:    :@@@@@@-                     .     
         .               :@@@@@-.      %@@@@@+      .%@@@@%     .    ..          .  .
         .         .  .#@@@#:         :-------.        .-@@@@-           .           
                 =@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%. .       ..     .
       .     .  .....................:########*......................           ..   
 .    .                     .          *@@@@@:         ..                            
               .                   .    =@@%. .                   .              .  .
.                              .    .    *@: .          .                            
          . .     .                   .  .*                .   .                     
       .  .                                                                          
`;

export function Floor() {
  return (
    <group>
      <Suspense fallback={null}>
        <Text
          maxWidth={1.5}
          font="/assets/fonts/SpaceMono.ttf" 
          fontSize={0.2}
          position={[0.4, -0.40, 0.8]}
          rotation={[-Math.PI / 2, 0, 1.6]}
        >
          José Toyo
          <meshStandardMaterial color="#39eafa" roughness={0.4} metalness={0.6} />
        </Text>

        <Text
          maxWidth={1.1}
          lineHeight={1.3}
          textAlign="left"
          font="/assets/fonts/SpaceMono.ttf" 
          fontSize={0.1}
          position={[0.65, -0.40, 0.77]}
          rotation={[-Math.PI / 2, 0, 1.6]}
        >
          Developer // Digital Artist //
          <meshStandardMaterial color="#39eafa" roughness={0.5} metalness={0.5} />
        </Text>

        <Text
          maxWidth={1}
          lineHeight={1.1}
          font="/assets/fonts/SpaceMono.ttf" 
          fontSize={0.09}
          position={[0.28, -0.40, -0.44]}
          rotation={[-Math.PI / 2, 0, 1.6]}
        >
          ❮❮❮❮
          <meshStandardMaterial color="#85f5ff" roughness={0.4} metalness={0.6} />
        </Text>

        <Text
          maxWidth={5}
          lineHeight={1}
          font="/assets/fonts/SpaceMono.ttf" 
          fontSize={1}
          position={[-0.4, -0.40, -0.1]}
          rotation={[-Math.PI / 2, 0, 1.6]}
        >
          [     ]
          <meshStandardMaterial color="#0b2f38" roughness={0.2} metalness={0.8} />
        </Text>

        <Text
          font="/assets/fonts/SpaceMono.ttf" 
          position={[-0.2, -0.41, -0.1]}
          rotation={[-Math.PI / 2, 0, 1.6]}
          fontSize={0.095}
          lineHeight={1.1}
          anchorX="center"
          anchorY="middle"
          whiteSpace="pre"
        >
          {asciiJo}
          <meshStandardMaterial color="#2c2453" roughness={0.2} metalness={0.8} />
        </Text>
      </Suspense>

      <mesh rotation={[Math.PI / -2, 0, 0]} position={[-0.2, -0.419, 0]} receiveShadow>
        <circleGeometry args={[3, 6]} />
        <meshStandardMaterial color="#05060d" roughness={0.5} metalness={0.9} />
      </mesh>
    </group>
  );
}