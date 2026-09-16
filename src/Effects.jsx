import { EffectComposer, Bloom } from '@react-three/postprocessing';

export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom 
        intensity={0.2} 
        luminanceThreshold={2} /* Solo hace brillar lo verdaderamente claro */
        luminanceSmoothing={0.9}
        resolutionScale={0.5}   /* Reduce a la mitad el trabajo de la GPU */
        mipmapBlur
      />
    </EffectComposer>
  );
}