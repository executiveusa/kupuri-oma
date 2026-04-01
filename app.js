/**
 * Kupuri 3D Studio – main application
 *
 * Uses Three.js r163 (loaded via importmap CDN).
 * Features:
 *  - Perspective / orthographic camera views
 *  - Orbit controls (drag to rotate, scroll to zoom, middle-click to pan)
 *  - TransformControls (translate / rotate / scale)
 *  - Scene hierarchy panel
 *  - Object properties (position, rotation, scale, material)
 *  - Add: Box, Sphere, Cylinder, Cone, Torus, Plane, Point/Directional/Spot lights
 *  - Grid helper, Axes helper, wireframe toggle
 *  - Delete / Duplicate objects
 *  - GLTF export
 *  - FPS counter
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

// ─── Scene / Renderer ─────────────────────────────────────────────────────────

const canvas = document.getElementById('viewport');
const container = document.getElementById('viewport-container');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e14);
scene.fog = new THREE.FogExp2(0x0e0e14, 0.018);

// ─── Camera ───────────────────────────────────────────────────────────────────

const camera = new THREE.PerspectiveCamera(55, 1, 0.01, 1000);
camera.position.set(6, 5, 8);
camera.lookAt(0, 0, 0);

// ─── Orbit controls ───────────────────────────────────────────────────────────

const orbit = new OrbitControls(camera, canvas);
orbit.enableDamping = true;
orbit.dampingFactor = 0.08;
orbit.screenSpacePanning = true;
orbit.minDistance = 0.5;
orbit.maxDistance = 500;

// ─── Transform controls ───────────────────────────────────────────────────────

const transform = new TransformControls(camera, canvas);
transform.addEventListener('dragging-changed', (e) => {
  orbit.enabled = !e.value;
});
transform.addEventListener('objectChange', () => {
  refreshPropertiesPanel();
});
scene.add(transform);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const gridHelper = new THREE.GridHelper(24, 24, 0x333344, 0x222233);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(1.5);
scene.add(axesHelper);

// ─── Default lighting ─────────────────────────────────────────────────────────

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.name = 'Ambient Light';
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff4e0, 1.6);
sunLight.position.set(6, 10, 4);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 100;
sunLight.shadow.camera.left = -15;
sunLight.shadow.camera.right = 15;
sunLight.shadow.camera.top = 15;
sunLight.shadow.camera.bottom = -15;
sunLight.name = 'Sun';
scene.add(sunLight);

// Small clearance to keep objects visually above the ground plane
const GROUND_CLEARANCE = 0.01;

const groundGeo = new THREE.PlaneGeometry(24, 24);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x111118,
  roughness: 0.9,
  metalness: 0.0,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
ground.name = 'Ground';
ground._isGround = true;
scene.add(ground);

// ─── Default starter cube ─────────────────────────────────────────────────────

const starterMat = new THREE.MeshStandardMaterial({ color: 0x7c6fff, roughness: 0.4, metalness: 0.1 });
const starterMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), starterMat);
starterMesh.position.set(0, 0.5, 0);
starterMesh.castShadow = true;
starterMesh.receiveShadow = true;
starterMesh.name = 'Cube';
scene.add(starterMesh);

// ─── State ────────────────────────────────────────────────────────────────────

let selectedObject = null;
let objectCounter = { box: 0, sphere: 0, cylinder: 0, cone: 0, torus: 0, plane: 0, point: 0, directional: 0, spot: 0 };
let showGrid = true;
let showAxes = true;
let globalWireframe = false;

// ─── Raycaster for selection ──────────────────────────────────────────────────

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let isPointerDown = false;
let pointerDownPos = new THREE.Vector2();

canvas.addEventListener('pointerdown', (e) => {
  isPointerDown = true;
  pointerDownPos.set(e.clientX, e.clientY);
});

canvas.addEventListener('pointerup', (e) => {
  if (!isPointerDown) return;
  const dx = e.clientX - pointerDownPos.x;
  const dy = e.clientY - pointerDownPos.y;
  if (Math.sqrt(dx * dx + dy * dy) < 5) {
    onCanvasClick(e);
  }
  isPointerDown = false;
});

function onCanvasClick(e) {
  if (transform.dragging) return;

  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const pickable = scene.children.filter(
    (obj) => obj !== transform && obj !== gridHelper && obj !== axesHelper && obj !== ambientLight
  );
  const hits = raycaster.intersectObjects(pickable, true);

  if (hits.length > 0) {
    let obj = hits[0].object;
    // walk up to a direct child of scene (skip helpers)
    while (obj.parent && obj.parent !== scene) {
      obj = obj.parent;
    }
    if (obj._isGround) {
      selectObject(null);
    } else {
      selectObject(obj);
    }
  } else {
    selectObject(null);
  }
}

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  switch (e.key.toLowerCase()) {
    case 'q': setTool('select'); break;
    case 'g': setTool('translate'); break;
    case 'r': setTool('rotate'); break;
    case 's': setTool('scale'); break;
    case 'f': focusSelected(); break;
    case 'delete':
    case 'backspace': deleteSelected(); break;
    case 'escape': selectObject(null); break;
    case 'd':
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); duplicateSelected(); }
      break;
  }
});

// ─── Object management ────────────────────────────────────────────────────────

function makeDefaultMaterial(color = 0x88aaff) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.1,
  });
}

function makeUniqueName(base) {
  const key = base.toLowerCase();
  objectCounter[key] = (objectCounter[key] || 0) + 1;
  const n = objectCounter[key];
  // First instance has no suffix; subsequent instances use .001, .002, …
  return n === 1 ? base : `${base}.${String(n - 1).padStart(3, '0')}`;
}

/** Add a mesh object to the scene */
window.addObject = function (type) {
  let geo;
  let name;
  const colors = [0x7c6fff, 0x55cc99, 0xff7c6f, 0xffcc55, 0x55ccff, 0xff55cc];
  const color = colors[Math.floor(Math.random() * colors.length)];

  switch (type) {
    case 'box':      geo = new THREE.BoxGeometry(1, 1, 1);              name = 'Cube';     break;
    case 'sphere':   geo = new THREE.SphereGeometry(0.6, 32, 32);       name = 'Sphere';   break;
    case 'cylinder': geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); name = 'Cylinder'; break;
    case 'cone':     geo = new THREE.ConeGeometry(0.6, 1.2, 32);        name = 'Cone';     break;
    case 'torus':    geo = new THREE.TorusGeometry(0.5, 0.2, 16, 64);   name = 'Torus';    break;
    case 'plane':    geo = new THREE.PlaneGeometry(2, 2);                name = 'Plane';    break;
    default:         geo = new THREE.BoxGeometry(1, 1, 1);              name = 'Object';
  }

  const mat = makeDefaultMaterial(color);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // Position slightly above ground
  const box = new THREE.Box3().setFromObject(new THREE.Mesh(geo));
  mesh.position.y = -box.min.y + GROUND_CLEARANCE;

  // Offset position slightly from origin
  mesh.position.x = (Math.random() - 0.5) * 4;
  mesh.position.z = (Math.random() - 0.5) * 4;

  mesh.name = makeUniqueName(name);
  scene.add(mesh);

  updateSceneTree();
  selectObject(mesh);
  setStatus(`Added ${mesh.name}`);
};

/** Add a light to the scene */
window.addLight = function (type) {
  let light;
  switch (type) {
    case 'point': {
      light = new THREE.PointLight(0xffffff, 2, 20);
      light.position.set(
        (Math.random() - 0.5) * 6,
        2 + Math.random() * 2,
        (Math.random() - 0.5) * 6
      );
      light.castShadow = true;
      light.name = makeUniqueName('PointLight');
      // visual helper
      const helper = new THREE.PointLightHelper(light, 0.25);
      helper._isHelper = true;
      light.add(helper);
      break;
    }
    case 'directional': {
      light = new THREE.DirectionalLight(0xffffff, 1.2);
      light.position.set(3, 6, 3);
      light.castShadow = true;
      light.name = makeUniqueName('DirLight');
      const helper = new THREE.DirectionalLightHelper(light, 0.5);
      helper._isHelper = true;
      scene.add(helper);
      light._helper = helper;
      break;
    }
    case 'spot': {
      light = new THREE.SpotLight(0xffffff, 3, 20, Math.PI / 6, 0.2, 1);
      light.position.set(0, 5, 0);
      light.castShadow = true;
      light.name = makeUniqueName('SpotLight');
      const helper = new THREE.SpotLightHelper(light);
      helper._isHelper = true;
      scene.add(helper);
      light._helper = helper;
      break;
    }
    default: return;
  }

  light._isLight = true;
  scene.add(light);
  updateSceneTree();
  selectObject(light);
  setStatus(`Added ${light.name}`);
};

/** Select an object and highlight it */
window.selectObject = function (obj) {
  // clear previous outline
  scene.traverse((o) => {
    if (o.isMesh && o._outlineClone) {
      o._outlineClone.visible = false;
    }
  });

  if (obj && obj._isLight) {
    transform.attach(obj);
  } else if (obj && obj.isMesh) {
    transform.attach(obj);
  } else {
    transform.detach();
  }

  selectedObject = obj;
  updateSceneTree();
  refreshPropertiesPanel();
};

window.deleteSelected = function () {
  if (!selectedObject) return;
  const name = selectedObject.name;

  // remove helper if exists
  if (selectedObject._helper) {
    scene.remove(selectedObject._helper);
    selectedObject._helper.dispose?.();
  }

  transform.detach();
  scene.remove(selectedObject);
  if (selectedObject.geometry) selectedObject.geometry.dispose();
  if (selectedObject.material) {
    if (Array.isArray(selectedObject.material)) {
      selectedObject.material.forEach(m => m.dispose());
    } else {
      selectedObject.material.dispose();
    }
  }

  selectedObject = null;
  updateSceneTree();
  refreshPropertiesPanel();
  setStatus(`Deleted ${name}`);
};

window.duplicateSelected = function () {
  if (!selectedObject || !selectedObject.isMesh) return;
  const clone = selectedObject.clone();
  clone.material = selectedObject.material.clone();
  clone.name = selectedObject.name + '.copy';
  clone.position.x += 0.5;
  clone.position.z += 0.5;
  scene.add(clone);
  updateSceneTree();
  selectObject(clone);
  setStatus(`Duplicated → ${clone.name}`);
};

window.newScene = function () {
  if (!confirm('Clear the scene and start fresh?')) return;
  // remove everything except ground, ambient, sun, grid, axes, transform
  const toRemove = scene.children.filter(
    (o) => o !== gridHelper && o !== axesHelper && o !== ambientLight && o !== sunLight && o !== ground && o !== transform
  );
  toRemove.forEach((o) => {
    if (o._helper) scene.remove(o._helper);
    scene.remove(o);
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
      else o.material.dispose();
    }
  });
  selectedObject = null;
  objectCounter = {};
  updateSceneTree();
  refreshPropertiesPanel();
  setStatus('New scene');
};

// ─── Transform tool ───────────────────────────────────────────────────────────

let currentTool = 'select';

window.setTool = function (tool) {
  currentTool = tool;

  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));

  const toolMap = {
    select: 'tool-select',
    translate: 'tool-move',
    rotate: 'tool-rotate',
    scale: 'tool-scale',
  };
  const btn = document.getElementById(toolMap[tool]);
  if (btn) btn.classList.add('active');

  if (tool === 'select') {
    if (selectedObject) transform.attach(selectedObject);
    transform.setMode('translate');
    transform.enabled = true;
  } else {
    transform.setMode(tool);
    transform.enabled = true;
    if (selectedObject) transform.attach(selectedObject);
  }
};

// ─── Camera views ─────────────────────────────────────────────────────────────

window.setCameraView = function (view) {
  const dist = camera.position.distanceTo(orbit.target);
  const label = document.getElementById('view-label');

  switch (view) {
    case 'perspective':
      camera.position.set(6, 5, 8).normalize().multiplyScalar(dist);
      orbit.enableRotate = true;
      if (label) label.textContent = 'Perspective';
      break;
    case 'front':
      camera.position.copy(orbit.target).add(new THREE.Vector3(0, 0, dist));
      orbit.enableRotate = false;
      if (label) label.textContent = 'Front';
      break;
    case 'top':
      camera.position.copy(orbit.target).add(new THREE.Vector3(0, dist, 0.001));
      orbit.enableRotate = false;
      if (label) label.textContent = 'Top';
      break;
    case 'right':
      camera.position.copy(orbit.target).add(new THREE.Vector3(dist, 0, 0));
      orbit.enableRotate = false;
      if (label) label.textContent = 'Right';
      break;
  }
  camera.lookAt(orbit.target);
  orbit.update();
};

window.toggleGrid = function () {
  showGrid = !showGrid;
  gridHelper.visible = showGrid;
};

window.toggleAxes = function () {
  showAxes = !showAxes;
  axesHelper.visible = showAxes;
};

window.toggleWireframe = function () {
  globalWireframe = !globalWireframe;
  scene.traverse((obj) => {
    if (obj.isMesh && !obj._isGround) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => { m.wireframe = globalWireframe; });
      } else if (obj.material) {
        obj.material.wireframe = globalWireframe;
      }
    }
  });
  document.getElementById('render-mode').value = globalWireframe ? 'wireframe' : 'solid';
};

window.setRenderMode = function (mode) {
  globalWireframe = mode === 'wireframe';
  scene.traverse((obj) => {
    if (obj.isMesh && !obj._isGround) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => { m.wireframe = globalWireframe; });
      } else if (obj.material) {
        obj.material.wireframe = globalWireframe;
      }
    }
  });
};

window.focusSelected = function () {
  const target = selectedObject || { position: new THREE.Vector3(0, 0, 0) };
  const pos = new THREE.Vector3();
  if (target.getWorldPosition) {
    target.getWorldPosition(pos);
  } else {
    pos.copy(target.position);
  }
  orbit.target.copy(pos);
  const dir = camera.position.clone().sub(pos).normalize();
  camera.position.copy(pos).addScaledVector(dir, 4);
  orbit.update();
};

// ─── Scene tree ───────────────────────────────────────────────────────────────

function getObjectIcon(obj) {
  if (obj.isLight) {
    return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 2v2M12 20v2M2 12H4M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24"><path d="M12 2l9 5v10l-9 5-9-5V7z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>`;
}

function updateSceneTree() {
  const tree = document.getElementById('scene-tree');
  tree.innerHTML = '';

  let meshCount = 0;
  let polyCount = 0;

  scene.children.forEach((obj) => {
    if (obj === gridHelper || obj === axesHelper || obj === transform || obj._isHelper) return;
    if (obj._isGround) {
      meshCount++;
      return;
    }

    if (obj.isMesh) {
      meshCount++;
      if (obj.geometry) {
        const attr = obj.geometry.index;
        // Geometry is triangulated; each face = 3 indices
        polyCount += attr ? attr.count / 3 : (obj.geometry.attributes.position?.count || 0) / 3;
      }
    }

    const item = document.createElement('div');
    item.className = 'scene-item' + (obj === selectedObject ? ' selected' : '');
    item.innerHTML = `${getObjectIcon(obj)}<span>${obj.name}</span>`;
    item.addEventListener('click', () => selectObject(obj));
    tree.appendChild(item);
  });

  const objCount = document.getElementById('object-count');
  const polyEl = document.getElementById('poly-count');
  if (objCount) objCount.textContent = `Objects: ${meshCount}`;
  if (polyEl) polyEl.textContent = `Polygons: ${Math.round(polyCount).toLocaleString()}`;
}

// ─── Properties panel ─────────────────────────────────────────────────────────

function r2(v) { return Math.round(v * 100) / 100; }
function deg(r) { return Math.round(THREE.MathUtils.radToDeg(r) * 100) / 100; }

function refreshPropertiesPanel() {
  const noSel = document.getElementById('no-selection');
  const props = document.getElementById('object-properties');
  const matSec = document.getElementById('material-section');
  const lightSec = document.getElementById('light-section');

  if (!selectedObject) {
    noSel.style.display = 'flex';
    props.style.display = 'none';
    return;
  }

  noSel.style.display = 'none';
  props.style.display = 'block';

  document.getElementById('prop-name').value = selectedObject.name;

  const p = selectedObject.position;
  document.getElementById('pos-x').value = r2(p.x);
  document.getElementById('pos-y').value = r2(p.y);
  document.getElementById('pos-z').value = r2(p.z);

  const ro = selectedObject.rotation;
  document.getElementById('rot-x').value = deg(ro.x);
  document.getElementById('rot-y').value = deg(ro.y);
  document.getElementById('rot-z').value = deg(ro.z);

  const s = selectedObject.scale;
  document.getElementById('scl-x').value = r2(s.x);
  document.getElementById('scl-y').value = r2(s.y);
  document.getElementById('scl-z').value = r2(s.z);

  if (selectedObject.isLight) {
    matSec.style.display = 'none';
    lightSec.style.display = 'block';
    const lc = '#' + selectedObject.color.getHexString();
    document.getElementById('light-color').value = lc;
    const intSlider = document.getElementById('light-intensity');
    intSlider.value = selectedObject.intensity;
    document.getElementById('light-intensity-val').textContent = r2(selectedObject.intensity);
  } else if (selectedObject.material) {
    matSec.style.display = 'block';
    lightSec.style.display = 'none';
    const mat = selectedObject.material;
    document.getElementById('prop-color').value = '#' + mat.color.getHexString();
    document.getElementById('prop-metalness').value = mat.metalness ?? 0.1;
    document.getElementById('prop-roughness').value = mat.roughness ?? 0.5;
    document.getElementById('prop-wireframe').checked = mat.wireframe ?? false;
  }
}

window.updateObjectName = function (val) {
  if (selectedObject) {
    selectedObject.name = val;
    updateSceneTree();
  }
};

window.updateTransform = function () {
  if (!selectedObject) return;
  const px = parseFloat(document.getElementById('pos-x').value) || 0;
  const py = parseFloat(document.getElementById('pos-y').value) || 0;
  const pz = parseFloat(document.getElementById('pos-z').value) || 0;
  selectedObject.position.set(px, py, pz);

  const rx = THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-x').value) || 0);
  const ry = THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-y').value) || 0);
  const rz = THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-z').value) || 0);
  selectedObject.rotation.set(rx, ry, rz);

  const sx = parseFloat(document.getElementById('scl-x').value) || 1;
  const sy = parseFloat(document.getElementById('scl-y').value) || 1;
  const sz = parseFloat(document.getElementById('scl-z').value) || 1;
  selectedObject.scale.set(sx, sy, sz);
};

window.updateMaterialColor = function (hex) {
  if (selectedObject && selectedObject.material) {
    selectedObject.material.color.set(hex);
  }
};

window.updateMaterial = function () {
  if (!selectedObject || !selectedObject.material) return;
  const mat = selectedObject.material;
  mat.metalness = parseFloat(document.getElementById('prop-metalness').value);
  mat.roughness = parseFloat(document.getElementById('prop-roughness').value);
  mat.wireframe = document.getElementById('prop-wireframe').checked;
};

window.updateLightColor = function (hex) {
  if (selectedObject && selectedObject.isLight) {
    selectedObject.color.set(hex);
    if (selectedObject._helper) selectedObject._helper.update?.();
  }
};

window.updateLightIntensity = function () {
  if (!selectedObject || !selectedObject.isLight) return;
  const val = parseFloat(document.getElementById('light-intensity').value);
  selectedObject.intensity = val;
  document.getElementById('light-intensity-val').textContent = r2(val);
};

// ─── Export ───────────────────────────────────────────────────────────────────

window.exportGLTF = function () {
  const exporter = new GLTFExporter();
  const exportScene = new THREE.Scene();
  scene.children.forEach((o) => {
    if (o !== gridHelper && o !== axesHelper && o !== transform && !o._isHelper) {
      exportScene.add(o.clone());
    }
  });
  exporter.parse(
    exportScene,
    (gltf) => {
      const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
      triggerDownload(blob, 'scene.gltf');
      setStatus('Exported scene as GLTF');
    },
    (err) => { console.error('GLTF export error', err); },
    { binary: false }
  );
};

window.exportOBJ = function () {
  import('three/addons/exporters/OBJExporter.js').then(({ OBJExporter }) => {
    const exporter = new OBJExporter();
    const exportScene = new THREE.Scene();
    scene.children.forEach((o) => {
      if (o.isMesh && !o._isGround) exportScene.add(o.clone());
    });
    const result = exporter.parse(exportScene);
    const blob = new Blob([result], { type: 'text/plain' });
    triggerDownload(blob, 'scene.obj');
    setStatus('Exported scene as OBJ');
  });
};

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Status bar ───────────────────────────────────────────────────────────────

function setStatus(msg) {
  const el = document.getElementById('status-text');
  if (el) el.textContent = msg;
}

// ─── FPS counter ──────────────────────────────────────────────────────────────

let frameCount = 0;
let lastFpsTime = performance.now();

function updateFps() {
  frameCount++;
  const now = performance.now();
  if (now - lastFpsTime > 500) {
    const fps = Math.round((frameCount * 1000) / (now - lastFpsTime));
    const el = document.getElementById('fps-counter');
    if (el) el.textContent = `${fps} fps`;
    frameCount = 0;
    lastFpsTime = now;
  }
}

// ─── Resize handler ───────────────────────────────────────────────────────────

function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

const resizeObserver = new ResizeObserver(onResize);
resizeObserver.observe(container);
onResize();

// ─── Render loop ──────────────────────────────────────────────────────────────

function animate() {
  requestAnimationFrame(animate);
  orbit.update();
  renderer.render(scene, camera);
  updateFps();
}

// ─── Initialise ───────────────────────────────────────────────────────────────

// Set default tool (select = translate gizmo visible)
setTool('select');
transform.attach(starterMesh);

updateSceneTree();
refreshPropertiesPanel();
selectObject(starterMesh);
setStatus('Ready · Drag to orbit · Scroll to zoom · Middle-click to pan · Q/G/R/S – tools · F – focus · Del – delete');

animate();
