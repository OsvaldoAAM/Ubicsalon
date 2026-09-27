import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FIME_BUILDINGS, GROUND_DECORATIONS } from '../data/fimeBuildings3D';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export default function IsometricMap({ selectedBuildingId, selectedPiso, onSelectBuilding }) {
  // Referencia directa al elemento <canvas> del JSX — Three.js usará este canvas
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const buildingsMapRef = useRef(new Map());
  const floorIndicatorsRef = useRef(new Map());
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070a12');
    sceneRef.current = scene;

    // 2. Cámara Ortográfica
    const aspect = width / height;
    const d = aspect < 1 ? 18 / aspect : 16;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 1000);
    // Posición cenital elevada con offset para evitar gimbal lock
    camera.position.set(4, 55, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer usando el <canvas> existente del DOM (no crea un canvas nuevo)
    const renderer = new THREE.WebGLRenderer({
      canvas,           // <— Clave: usa el canvas de React directamente
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    // 4. OrbitControls sobre el mismo canvas del DOM
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.minPolarAngle = 0;
    controls.minZoom = 0.3;
    controls.maxZoom = 5.0;
    controls.touches = {
      ONE: THREE.TOUCH.PAN,
      TWO: THREE.TOUCH.DOLLY_ROTATE,
    };
    controlsRef.current = controls;

    // 5. Iluminación
    scene.add(new THREE.AmbientLight('#ffffff', 0.85));

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.0);
    dirLight.position.set(25, 50, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = dirLight.shadow.camera.bottom = -28;
    dirLight.shadow.camera.right = dirLight.shadow.camera.top = 28;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    scene.add(new THREE.HemisphereLight('#38bdf8', '#0b0f19', 0.45));

    // 6. Terreno Base
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: '#0b0f19', roughness: 0.85, metalness: 0.1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(50, 25, '#1e293b', '#172033');
    grid.position.y = -0.08;
    scene.add(grid);

    GROUND_DECORATIONS.forEach(dec => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(dec.size.width, dec.size.height, dec.size.depth),
        new THREE.MeshStandardMaterial({ color: dec.color, roughness: 0.6 })
      );
      mesh.position.set(dec.position.x, dec.position.y, dec.position.z);
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    // 7. Edificios
    buildingsMapRef.current.clear();
    floorIndicatorsRef.current.clear();

    FIME_BUILDINGS.forEach(bld => {
      const group = new THREE.Group();
      group.position.set(bld.position.x, 0, bld.position.z);
      group.userData = { id: bld.id };

      const geo = new THREE.BoxGeometry(bld.size.width, bld.size.height, bld.size.depth);
      const mat = new THREE.MeshStandardMaterial({ color: bld.color, roughness: 0.35, metalness: 0.15 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = bld.size.height / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 })
      );
      edges.position.y = bld.size.height / 2;
      group.add(edges);

      const floorIndicators = [];
      const step = bld.size.height / bld.floors;
      for (let f = 1; f <= bld.floors; f++) {
        const sliceMat = new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0 });
        const slice = new THREE.Mesh(
          new THREE.BoxGeometry(bld.size.width + 0.2, 0.2, bld.size.depth + 0.2),
          sliceMat
        );
        slice.position.y = (f - 0.5) * step;
        group.add(slice);
        floorIndicators.push({ floor: f, mat: sliceMat });
      }

      scene.add(group);
      buildingsMapRef.current.set(bld.id, { group, mesh, mat, originalColor: bld.color, bldData: bld });
      floorIndicatorsRef.current.set(bld.id, floorIndicators);
    });

    // 8. Raycasting: seleccionar edificio con clic/toque rápido
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDown = { x: 0, y: 0, time: 0 };

    const onPointerDown = (e) => {
      pointerDown = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    const onPointerUp = (e) => {
      const dt = Date.now() - pointerDown.time;
      const dx = e.clientX - pointerDown.x;
      const dy = e.clientY - pointerDown.y;
      if (dt > 300 || Math.hypot(dx, dy) > 8) return; // Ignorar arrastres

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      for (const intersect of raycaster.intersectObjects(scene.children, true)) {
        let obj = intersect.object.parent;
        while (obj && obj !== scene) {
          if (obj.userData?.id) { onSelectBuilding(obj.userData.id); return; }
          obj = obj.parent;
        }
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);

    // 9. Loop de animación
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.08);
      controls.target.copy(currentLookAtRef.current);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 10. Resize
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const a = w / h;
      const nd = a < 1 ? 18 / a : 16;
      camera.left = -nd * a; camera.right = nd * a;
      camera.top = nd; camera.bottom = -nd;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      cancelAnimationFrame(rafId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Resaltado de Edificio y Piso seleccionado
  useEffect(() => {
    buildingsMapRef.current.forEach(({ group, mesh, mat, originalColor, bldData }, id) => {
      const sel = id === selectedBuildingId;
      mat.color.set(sel ? bldData.highlightColor : originalColor);
      mat.emissive?.set(sel ? '#2563eb' : '#000000');
      if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = sel ? 0.5 : 0;
      group.position.y = sel ? 0.5 : 0;
      if (sel) targetLookAtRef.current.set(bldData.position.x, 0, bldData.position.z);
    });
    if (!selectedBuildingId) targetLookAtRef.current.set(0, 0, 0);

    floorIndicatorsRef.current.forEach((indicators, bldId) => {
      const sel = bldId === selectedBuildingId;
      indicators.forEach(({ floor, mat }) => {
        if (sel && selectedPiso && floor === selectedPiso) {
          mat.opacity = 0.95; mat.color.set('#fbbf24');
        } else if (sel) {
          mat.opacity = 0.35; mat.color.set('#38bdf8');
        } else {
          mat.opacity = 0;
        }
      });
    });
  }, [selectedBuildingId, selectedPiso]);

  // Controles de Zoom con botones en pantalla
  const zoomIn = () => { if (cameraRef.current) { cameraRef.current.zoom = Math.min(cameraRef.current.zoom * 1.3, 5); cameraRef.current.updateProjectionMatrix(); } };
  const zoomOut = () => { if (cameraRef.current) { cameraRef.current.zoom = Math.max(cameraRef.current.zoom / 1.3, 0.3); cameraRef.current.updateProjectionMatrix(); } };
  const resetCam = () => {
    if (controlsRef.current && cameraRef.current) {
      onSelectBuilding(null);
      cameraRef.current.zoom = 1;
      cameraRef.current.updateProjectionMatrix();
      controlsRef.current.reset();
    }
  };

  return (
    <div className="fixed inset-0 z-0">
      {/* Canvas referenciado directamente: Three.js renderiza aquí */}
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }}
      />

      {/* Botones flotantes de control de zoom */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-auto">
        <button onClick={zoomIn} className="p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 text-sky-400 border border-slate-700/80 backdrop-blur-xl shadow-xl active:scale-95 transition-all" title="Acercar">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={zoomOut} className="p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 text-sky-400 border border-slate-700/80 backdrop-blur-xl shadow-xl active:scale-95 transition-all" title="Alejar">
          <Minus className="w-5 h-5" />
        </button>
        <button onClick={resetCam} className="p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 text-amber-400 border border-slate-700/80 backdrop-blur-xl shadow-xl active:scale-95 transition-all" title="Restablecer vista">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
