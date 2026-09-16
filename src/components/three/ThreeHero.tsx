import { useEffect, useRef, useState } from 'react';

interface ThreeHeroProps {
  className?: string;
}

export default function ThreeHero({ className = '' }: ThreeHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [threeReady, setThreeReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    import('three').then(THREE => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 4;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Hide CSS placeholder
      const placeholder = container.querySelector('.three-placeholder');
      if (placeholder) placeholder.remove();

      // Star particles
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const particleCount = window.innerWidth < 768 ? 2000 : 6000;
      for (let i = 0; i < particleCount; i++) {
        vertices.push(
          THREE.MathUtils.randFloatSpread(12),
          THREE.MathUtils.randFloatSpread(12),
          THREE.MathUtils.randFloatSpread(12)
        );
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      const material = new THREE.PointsMaterial({
        color: 0x3b82f6,
        size: 0.018,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
      });
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const sphereGeo = new THREE.IcosahedronGeometry(1.2, 2);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.12
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);

      function animate() {
        requestAnimationFrame(animate);
        const t = Date.now() * 0.001;
        particles.rotation.y += 0.0008;
        sphere.rotation.y += 0.003;
        sphere.rotation.x = Math.sin(t * 0.4) * 0.2;
        renderer.render(scene, camera);
      }
      animate();

      let targetX = 0, targetY = 0;
      const handleMouseMove = (e: MouseEvent) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 0.8;
        targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
      };
      document.addEventListener('mousemove', handleMouseMove);

      function smoothMouseUpdate() {
        particles.rotation.y += (targetX - particles.rotation.y) * 0.03;
        particles.rotation.x += (targetY - particles.rotation.x) * 0.03;
        requestAnimationFrame(smoothMouseUpdate);
      }
      smoothMouseUpdate();

      const handleResize = () => {
        if (!containerRef.current) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      setThreeReady(true);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        sphereGeo.dispose();
        sphereMat.dispose();
      };
    });
  }, []);

  if (!mounted) {
    return (
      <div className={className} style={{ width: '100%', height: '100%' }}>
        <div className="three-placeholder" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }}>
      {!threeReady && <div className="three-placeholder" aria-hidden="true" />}
    </div>
  );
}