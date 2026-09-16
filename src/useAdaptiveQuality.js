import { useState, useEffect } from 'react';
import * as DetectGPU from 'detect-gpu';

export function useAdaptiveQuality() {
  const [quality, setQuality] = useState({
    loading: true,
    tier: 1,
    dpr: 1,
    enableEffects: false,
    starsCount: 400,
    showSparkles: false,
    isMobile: false
  });

  useEffect(() => {
    let isMounted = true;

    // Resuelve la función independientemente de cómo Vite empaquete la librería
    const getGpu = DetectGPU.getGpuTier || DetectGPU.default?.getGpuTier || DetectGPU.default;

    if (typeof getGpu === 'function') {
      getGpu().then((gpu) => {
        if (!isMounted) return;

        const isHighEnd = gpu.tier >= 2;
        const isMobile = gpu.isMobile ?? false;

        setQuality({
          loading: false,
          tier: gpu.tier,
          isMobile,
          dpr: isHighEnd ? (isMobile ? 1.2 : 1.5) : 1,
          enableEffects: isHighEnd,
          starsCount: isHighEnd ? 800 : (isMobile ? 300 : 400),
          showSparkles: isHighEnd,
        });
      }).catch((err) => {
        console.warn('Error al detectar GPU, usando valores por defecto:', err);
        if (isMounted) setQuality(prev => ({ ...prev, loading: false }));
      });
    } else {
      if (isMounted) setQuality(prev => ({ ...prev, loading: false }));
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const degradeQuality = () => {
    setQuality((prev) => {
      if (!prev.enableEffects && prev.dpr <= 0.75) return prev;

      return {
        ...prev,
        dpr: 0.75,
        enableEffects: false,
        starsCount: 200,
        showSparkles: false,
      };
    });
  };

  return { quality, degradeQuality, setQuality };
}