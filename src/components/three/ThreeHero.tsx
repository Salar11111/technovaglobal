import { useEffect, useRef, useState } from 'react';

interface ThreeHeroProps {
  className?: string;
}

/**
 * A single, restrained WebGL scene for the TechNova hero.
 * Falls back to the CSS gradient when WebGL is unavailable or motion is reduced.
 */
export default function ThreeHero({ className = '' }: ThreeHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    import('three')
      .then(THREE => {
        if (disposed || !containerRef.current) return;

        let renderer: import('three').WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'low-power'
          });
        } catch {
          // Headless browsers and devices without WebGL keep the CSS fallback.
          return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const placeholder = container.querySelector('.three-placeholder');
        if (placeholder) placeholder.remove();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          60,
          container.clientWidth / Math.max(container.clientHeight, 1),
          0.1,
          1000
        );
        camera.position.z = 4;

        const geometry = new THREE.BufferGeometry();
        const vertices: number[] = [];
        const particleCount = window.innerWidth < 768 ? 1000 : 2400;
        for (let i = 0; i < particleCount; i++) {
          vertices.push(
            THREE.MathUtils.randFloatSpread(12),
            THREE.MathUtils.randFloatSpread(12),
            THREE.MathUtils.randFloatSpread(12)
          );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
          color: 0x38bdf8,
          size: 0.02,
          transparent: true,
          opacity: 0.65,
          sizeAttenuation: true
        });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const sphereGeo = new THREE.IcosahedronGeometry(1.2, 2);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          wireframe: true,
          transparent: true,
          opacity: 0.12
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphere);

        let targetX = 0;
        let targetY = 0;
        const handleMouseMove = (event: MouseEvent) => {
          targetX = (event.clientX / window.innerWidth - 0.5) * 0.6;
          targetY = (event.clientY / window.innerHeight - 0.5) * 0.6;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const handleResize = () => {
          if (!containerRef.current) return;
          camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // One animation loop only; pause while the tab is hidden.
        let frame = 0;
        const animate = () => {
          frame = requestAnimationFrame(animate);
          if (document.hidden) return;
          const t = performance.now() * 0.001;
          particles.rotation.y += (targetX - particles.rotation.y) * 0.02 + 0.0006;
          particles.rotation.x += (targetY - particles.rotation.x) * 0.02;
          sphere.rotation.y += 0.0025;
          sphere.rotation.x = Math.sin(t * 0.3) * 0.15;
          renderer.render(scene, camera);
        };
        animate();
        setReady(true);

        cleanup = () => {
          cancelAnimationFrame(frame);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
          if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
          geometry.dispose();
          material.dispose();
          sphereGeo.dispose();
          sphereMat.dispose();
          renderer.dispose();
        };
        if (disposed) cleanup();
      })
      .catch(() => {
        // Keep the CSS fallback if the three.js chunk fails to load.
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }}>
      {!ready && <div className="three-placeholder" aria-hidden="true" />}
    </div>
  );
}
