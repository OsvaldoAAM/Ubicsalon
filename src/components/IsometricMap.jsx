import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FIME_BUILDINGS, GROUND_DECORATIONS } from '../data/fimeBuildings3D';
import { RotateCcw, Lock, Unlock } from 'lucide-react';

// Aliases para nombres alternativos que puedan venir del GLB
const ID_ALIASES = {
  'cidet': 'cidte',
  'centro-desarrollo': 'centro-cultural',
  'centro-cultural-y-deportivo': 'centro-cultural',
  'cdfc': 'centro-cultural',
  'posgrado': 'edificio-12',
  'cultural': 'centro-cultural',
  'beisbol': 'campo-beisbol',
  'campo-beisbol': 'campo-beisbol',
  'campo-fime': 'campo-fime',
  'campo-sintetico': 'campo-sintetico-fime',
  'campo-sintetico-fime': 'campo-sintetico-fime',
  'huella': 'huella',
  'la-huella': 'huella',
};

// Mapear cualquier nombre de malla o nodo de Blender a un ID de edificio en FIME_BUILDINGS
function findBuildingIdInName(rawName) {
  if (!rawName) return null;

  const cleaned = rawName
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[_ ]+/g, '-')
    .trim();

  // 1. Revisar alias explícitos
  for (const [alias, targetId] of Object.entries(ID_ALIASES)) {
    if (cleaned.includes(alias)) return targetId;
  }

  // 2. Buscar coincidencia con IDs, nombres o nombres cortos conocidos
  const sortedBuildings = [...FIME_BUILDINGS].sort((a, b) => b.id.length - a.id.length);
  for (const bld of sortedBuildings) {
    const normId = bld.id.toLowerCase();
    const normName = bld.name.toLowerCase().replace(/[_ ]+/g, '-');
    const normShort = bld.shortName.toLowerCase().replace(/[_ ]+/g, '-');

    if (cleaned.includes(normId) || cleaned.includes(normName) || cleaned === normShort) {
      return bld.id;
    }
  }

  return null;
}

// Verificar si un nombre corresponde a terreno / suelo / accesorios de mapa
function isIgnoredMeshName(name) {
  if (!name) return false;
  const cleaned = name.toLowerCase();
  return (
    cleaned.includes('plane') ||
    cleaned.includes('empty') ||
    cleaned.includes('circle') ||
    cleaned.includes('ground') ||
    cleaned.includes('piso') ||
    cleaned.includes('calle') ||
    cleaned.includes('terreno')
  );
}

// Verificar que una malla sea visible y no sea transparente/invisible
function isMeshVisible(mesh) {
  if (!mesh || !mesh.visible) return false;
  if (mesh.material) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const allInvisible = mats.every(m => m.transparent && m.opacity === 0);
    if (allInvisible) return false;
  }
  return true;
}

export default function IsometricMap({ selectedBuildingId, selectedPiso, onSelectBuilding, resetCamTrigger }) {
  const [isRotationLocked, setIsRotationLocked] = useState(false);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const buildingsMapRef = useRef(new Map());
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const proceduralGroupRef = useRef(null);
  const customModelGroupRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const glbLoadedRef = useRef(false);

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
    camera.position.set(4, 55, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.screenSpacePanning = false; // Bloquear paneo estrictamente al plano del suelo XZ
    controls.maxPolarAngle = Math.PI / 3.2; // Evitar bajar demasiado cerca del horizonte
    controls.minPolarAngle = Math.PI / 15;
    controls.minZoom = 0.7;
    controls.maxZoom = 3.5;
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

    // 6. Terreno Base y Grid
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: '#0b0f19', roughness: 0.85, metalness: 0.1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    ground.userData.isGround = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(60, 30, '#1e293b', '#172033');
    grid.position.y = -0.08;
    grid.userData.isGround = true;
    scene.add(grid);

    // Grupo procedimental de respaldo
    const proceduralGroup = new THREE.Group();
    scene.add(proceduralGroup);
    proceduralGroupRef.current = proceduralGroup;

    GROUND_DECORATIONS.forEach(dec => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(dec.size.width, dec.size.height, dec.size.depth),
        new THREE.MeshStandardMaterial({ color: dec.color, roughness: 0.6 })
      );
      mesh.position.set(dec.position.x, dec.position.y, dec.position.z);
      mesh.receiveShadow = true;
      mesh.userData.isGround = true;
      proceduralGroup.add(mesh);
    });

    buildingsMapRef.current.clear();

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
      mesh.userData.buildingId = bld.id;
      group.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 })
      );
      edges.position.y = bld.size.height / 2;
      group.add(edges);

      proceduralGroup.add(group);
      buildingsMapRef.current.set(bld.id, {
        group,
        meshes: [mesh],
        materials: [mat],
        originalColors: [mat.color.getHex()],
        worldPos: new THREE.Vector3(bld.position.x, 0, bld.position.z),
        bldData: bld
      });
    });

    // 7. Cargar modelo GLTF/GLB
    const loader = new GLTFLoader();
    loader.load(
      `${import.meta.env.BASE_URL}campus.glb`,
      (gltf) => {
        if (customModelGroupRef.current) {
          scene.remove(customModelGroupRef.current);
        }
        const model = gltf.scene;
        customModelGroupRef.current = model;
        scene.add(model);
        proceduralGroup.visible = false;
        glbLoadedRef.current = true;

        // Auto-escalado y centrado
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.z);
        if (maxDim > 0) {
          const targetScale = 35 / maxDim;
          model.scale.set(targetScale, targetScale, targetScale);
        }

        model.position.x = -center.x * model.scale.x;
        model.position.z = -center.z * model.scale.z;
        model.position.y = -box.min.y * model.scale.y;

        // Actualizar matrices mundiales post-transformación
        model.updateMatrixWorld(true);

        // Limpiar mapa procedimental
        buildingsMapRef.current.clear();

        // Recorrer TODAS las mallas del modelo GLB
        model.traverse((child) => {
          if (!child.isMesh) return;

          child.castShadow = true;
          child.receiveShadow = true;

          // Si es un plano/empty/suelo de Blender, etiquetarlo como terreno
          if (isIgnoredMeshName(child.name)) {
            child.userData.isGround = true;
            return;
          }

          // Buscar si la malla o algún ancestro pertenece a un edificio conocido
          let foundBuildingId = null;
          let curr = child;

          while (curr && curr !== model && curr !== scene) {
            const rawName = curr.userData?.id || curr.name;
            const bldId = findBuildingIdInName(rawName);
            if (bldId) {
              foundBuildingId = bldId;
              break;
            }
            curr = curr.parent;
          }

          if (foundBuildingId) {
            child.userData.buildingId = foundBuildingId;

            if (!buildingsMapRef.current.has(foundBuildingId)) {
              const bldData = FIME_BUILDINGS.find(b => b.id === foundBuildingId);
              buildingsMapRef.current.set(foundBuildingId, {
                group: child.parent || child,
                meshes: [],
                materials: [],
                originalColors: [],
                meshBox: new THREE.Box3(),
                worldPos: new THREE.Vector3(),
                bldData
              });
            }

            const bldRecord = buildingsMapRef.current.get(foundBuildingId);
            bldRecord.meshes.push(child);
            bldRecord.meshBox.expandByObject(child);

            // Clonar material para resaltado independiente por edificio
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            const clonedMats = mats.map((m) => {
              const cloned = m.clone();
              bldRecord.materials.push(cloned);
              bldRecord.originalColors.push(cloned.color.getHex());
              return cloned;
            });
            child.material = clonedMats.length === 1 ? clonedMats[0] : clonedMats;
          } else {
            // Malla no identificada como edificio → Terreno decorativo
            child.userData.isGround = true;
          }
        });

        // Calcular centros mundiales reales de los edificios
        buildingsMapRef.current.forEach((record) => {
          record.meshBox.getCenter(record.worldPos);
        });

        console.log(`GLB cargado. Edificios interactivos mapeados: [${[...buildingsMapRef.current.keys()].join(', ')}]`);
      },
      undefined,
      () => {
        console.log('Sin modelo campus.glb predeterminado. Usando fallback procedimental.');
      }
    );

    // 8. Detección Inteligente de Toque (Raycast + Selección por Proximidad)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDown = { x: 0, y: 0, time: 0 };

    const onPointerDown = (e) => {
      pointerDown = { x: e.clientX, y: e.clientY, time: Date.now() };
      isTransitioningRef.current = false;
    };

    const onPointerUp = (e) => {
      const dt = Date.now() - pointerDown.time;
      const dx = e.clientX - pointerDown.x;
      const dy = e.clientY - pointerDown.y;
      // Tolerancia amplia para toques móviles y clics rápidos (hasta 500ms y 15px)
      if (dt > 500 || Math.hypot(dx, dy) > 15) return;

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      const hitBuildings = [];
      let groundPoint = null;

      // Evaluar todas las mallas en el rayo
      for (const intersect of intersects) {
        const mesh = intersect.object;
        if (!isMeshVisible(mesh)) continue;

        // Si es malla de suelo/terreno/grid, registrar el punto 3D en el suelo sin interrumpir
        if (mesh.userData.isGround || mesh === ground || mesh === grid) {
          if (!groundPoint) {
            groundPoint = intersect.point.clone();
          }
          continue;
        }

        // Si la malla pertenece a un edificio conocido
        const bldId = mesh.userData?.buildingId || findBuildingIdInName(mesh.name);
        if (bldId && buildingsMapRef.current.has(bldId)) {
          if (!hitBuildings.some(h => h.id === bldId)) {
            hitBuildings.push({
              id: bldId,
              distance: intersect.distance,
              point: intersect.point.clone(),
              record: buildingsMapRef.current.get(bldId)
            });
          }
        }
      }

      // CASO A: El rayo tocó polígonos de edificio(s)
      if (hitBuildings.length > 0) {
        if (hitBuildings.length === 1) {
          console.log(`Toque 3D: Impacto directo → Edificio ${hitBuildings[0].id}`);
          onSelectBuilding(hitBuildings[0].id);
          return;
        }

        // Si tocó múltiples edificios por superposición de vista, seleccionar el mas cercano a su propio centro
        hitBuildings.sort((a, b) => {
          const distA = a.point.distanceTo(a.record.worldPos);
          const distB = b.point.distanceTo(b.record.worldPos);
          return distA - distB;
        });

        console.log(`Toque 3D: Múltiples mallas rozadas [${hitBuildings.map(h => h.id).join(', ')}] → Seleccionado por centro: ${hitBuildings[0].id}`);
        onSelectBuilding(hitBuildings[0].id);
        return;
      }

      // CASO B: El rayo tocó terreno o pasó muy cerca del edificio (Tolerancia de proximidad 2D)
      if (!groundPoint) {
        const planeY0 = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        groundPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(planeY0, groundPoint);
      }

      if (groundPoint) {
        let closestBldId = null;
        let minDistance = Infinity;
        const TOUCH_THRESHOLD = 4.5; // Radio de tolerancia alrededor del edificio en el suelo

        buildingsMapRef.current.forEach((record, bldId) => {
          const dxSq = (groundPoint.x - record.worldPos.x) ** 2;
          const dzSq = (groundPoint.z - record.worldPos.z) ** 2;
          const dist2D = Math.sqrt(dxSq + dzSq);

          if (dist2D < TOUCH_THRESHOLD && dist2D < minDistance) {
            minDistance = dist2D;
            closestBldId = bldId;
          }
        });

        if (closestBldId) {
          console.log(`Toque 3D: Toque cercano en suelo (${groundPoint.x.toFixed(1)}, ${groundPoint.z.toFixed(1)}) → Edificio seleccionado: ${closestBldId} (dist: ${minDistance.toFixed(2)})`);
          onSelectBuilding(closestBldId);
          return;
        }
      }

      // CASO C: Suelo distante fuera de cualquier edificio
      console.log(`Toque 3D: Suelo distante → Deseleccionar (Cámara intacta)`);
      onSelectBuilding(null);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);

    // 9. Loop de animación
    let rafId;
    const tempNextLookAt = new THREE.Vector3();
    const tempDelta = new THREE.Vector3();

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (isTransitioningRef.current) {
        tempNextLookAt.copy(currentLookAtRef.current).lerp(targetLookAtRef.current, 0.08);
        tempDelta.subVectors(tempNextLookAt, currentLookAtRef.current);

        if (tempDelta.lengthSq() > 0.000001) {
          currentLookAtRef.current.copy(tempNextLookAt);
          controls.target.copy(currentLookAtRef.current);
          camera.position.add(tempDelta);
        } else {
          isTransitioningRef.current = false;
        }
      } else {
        currentLookAtRef.current.copy(controls.target);
        targetLookAtRef.current.copy(controls.target);
      }

      // Bloquear la altura del objetivo al plano del suelo (y = 0)
      controls.target.y = 0;

      // Calcular límite dinámico de paneo según el zoom
      const zoomRatio = (camera.zoom - controls.minZoom) / (controls.maxZoom - controls.minZoom);
      const currentMaxBound = THREE.MathUtils.lerp(10, 20, THREE.MathUtils.clamp(zoomRatio, 0, 1));

      const clampedX = THREE.MathUtils.clamp(controls.target.x, -currentMaxBound, currentMaxBound);
      const clampedZ = THREE.MathUtils.clamp(controls.target.z, -currentMaxBound, currentMaxBound);

      if (clampedX !== controls.target.x || clampedZ !== controls.target.z) {
        const dx = clampedX - controls.target.x;
        const dz = clampedZ - controls.target.z;

        controls.target.x = clampedX;
        controls.target.z = clampedZ;
        currentLookAtRef.current.copy(controls.target);
        targetLookAtRef.current.copy(controls.target);
        camera.position.x += dx;
        camera.position.z += dz;
      }

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

  // Manejar el botón explícito de restablecer vista ("Todos" o botón flotante)
  useEffect(() => {
    if (resetCamTrigger > 0 && controlsRef.current && cameraRef.current) {
      targetLookAtRef.current.set(0, 0, 0);
      currentLookAtRef.current.set(0, 0, 0);
      isTransitioningRef.current = true;
      cameraRef.current.zoom = 1;
      cameraRef.current.updateProjectionMatrix();
      controlsRef.current.reset();
    }
  }, [resetCamTrigger]);

  // Resaltado de Edificio seleccionado y encuadre
  useEffect(() => {
    buildingsMapRef.current.forEach(({ materials, originalColors, worldPos, bldData }, id) => {
      const sel = id === selectedBuildingId;

      materials.forEach((mat, i) => {
        if (mat.emissive !== undefined) {
          if (sel) {
            mat.emissive.set('#0284c7');
            mat.emissiveIntensity = 0.9;
          } else {
            mat.emissive.set('#000000');
            mat.emissiveIntensity = 0;
          }
        } else {
          if (sel) {
            mat.color.set('#38bdf8');
          } else {
            mat.color.setHex(originalColors[i]);
          }
        }
      });

      // Mover la cámara a la posición del edificio SOLO cuando se selecciona un edificio concreto
      if (sel && worldPos) {
        targetLookAtRef.current.set(worldPos.x, 0, worldPos.z);
        isTransitioningRef.current = true;
      }
    });
  }, [selectedBuildingId, selectedPiso]);

  const toggleRotationLock = () => {
    if (controlsRef.current) {
      const newState = !isRotationLocked;
      controlsRef.current.enableRotate = !newState;
      setIsRotationLocked(newState);
    }
  };

  const resetCam = () => {
    if (controlsRef.current && cameraRef.current) {
      onSelectBuilding(null, true);
    }
  };

  return (
    <div className="fixed inset-0 z-0">
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }}
      />

      {/* Controles flotantes */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={toggleRotationLock}
          className="p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 text-sky-400 border border-slate-700/80 backdrop-blur-xl shadow-xl active:scale-95 transition-all"
          title={isRotationLocked ? "Desbloquear rotación" : "Bloquear rotación"}
        >
          {isRotationLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
        </button>
        <button
          onClick={resetCam}
          className="p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 text-amber-400 border border-slate-700/80 backdrop-blur-xl shadow-xl active:scale-95 transition-all"
          title="Restablecer vista"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
