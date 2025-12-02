import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Earth3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 2.5;

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1a4d7a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const landColor = '#2d5a3d';
    const drawContinent = (startX, startY, width, height, shape) => {
      ctx.fillStyle = landColor;
      ctx.fillRect(startX, startY, width, height);
    };

    drawContinent(300, 250, 400, 300, 'north-america');
    drawContinent(700, 200, 350, 250, 'europe');
    drawContinent(900, 350, 400, 200, 'africa');
    drawContinent(1200, 300, 300, 250, 'asia');
    drawContinent(100, 600, 300, 150, 'south-america');
    drawContinent(1400, 600, 300, 180, 'australia');

    for (let i = 0; i < 500; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.4})`;
      ctx.fillRect(x, y, size, size);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const glowGeometry = new THREE.SphereGeometry(1.02, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const distance = (Math.random() + 1) * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      posArray[i] = distance * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = distance * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = distance * Math.cos(phi);
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      earth.rotation.y += 0.0005;
      glow.rotation.y -= 0.0003;
      particles.rotation.x += 0.00005;
      particles.rotation.y += 0.0001;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

export default Earth3D;
