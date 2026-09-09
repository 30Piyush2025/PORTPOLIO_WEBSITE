import {
  Matrix4,
  Vector3,
  Quaternion,
  Object3D,
  BoxGeometry,
  WebGLRenderer,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  Scene,
  Color,
  FogExp2,
  PerspectiveCamera,
  MeshStandardMaterial,
  HemisphereLight,
  SpotLight,
  DirectionalLight,
  PointLight,
  RepeatWrapping,
  Group,
  Mesh,
  CylinderGeometry,
  DoubleSide,
  ConeGeometry,
  TorusGeometry,
  PlaneGeometry,
  MeshBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  CanvasTexture,
  SRGBColorSpace,
  Vector2,
  Raycaster,
  MathUtils
} from './three-adapter.js';

import { CONFIG } from './config.js';

// CSS3D System
const _v1 = new Vector3();
const _q1 = new Quaternion();
const _m1 = new Vector3();

export class CSS3DObject extends Object3D {
  constructor(element = document.createElement('div')) {
    super();
    this.isCSS3DObject = true;
    this.element = element;
    this.element.style.position = 'absolute';
    this.element.style.pointerEvents = 'auto';
    this.element.style.userSelect = 'none';
    this.element.setAttribute('draggable', false);
    this.addEventListener('removed', function() {
      this.traverse(function(child) {
        if (child.element instanceof child.element.ownerDocument.defaultView.Element && child.element.parentNode !== null) {
          child.element.remove();
        }
      });
    });
  }
  copy(source, recursive) {
    super.copy(source, recursive);
    this.element = source.element.cloneNode(true);
    return this;
  }
}

const _mat1 = new Matrix4();
const _mat2 = new Matrix4();

export class CSS3DRenderer {
  constructor(params = {}) {
    const scope = this;
    let width, height, halfWidth, halfHeight;
    const cache = {
      camera: { style: '' },
      objects: new WeakMap()
    };
    const domElement = params.element !== undefined ? params.element : document.createElement('div');
    domElement.style.overflow = 'hidden';
    this.domElement = domElement;

    const cameraElement = document.createElement('div');
    cameraElement.style.transformOrigin = '0 0';
    cameraElement.style.pointerEvents = 'none';
    domElement.appendChild(cameraElement);

    const worldElement = document.createElement('div');
    worldElement.style.transformStyle = 'preserve-3d';
    cameraElement.appendChild(worldElement);

    this.getSize = function() {
      return { width, height };
    };

    function epsilon(v) {
      return Math.abs(v) < 1e-10 ? 0 : v;
    }

    function getCameraCSSMatrix(matrix) {
      const el = matrix.elements;
      return 'matrix3d(' +
        epsilon(el[0]) + ',' + epsilon(-el[1]) + ',' + epsilon(el[2]) + ',' + epsilon(el[3]) + ',' +
        epsilon(el[4]) + ',' + epsilon(-el[5]) + ',' + epsilon(el[6]) + ',' + epsilon(el[7]) + ',' +
        epsilon(el[8]) + ',' + epsilon(-el[9]) + ',' + epsilon(el[10]) + ',' + epsilon(el[11]) + ',' +
        epsilon(el[12]) + ',' + epsilon(-el[13]) + ',' + epsilon(el[14]) + ',' + epsilon(el[15]) +
      ')';
    }

    function getObjectCSSMatrix(matrix) {
      const el = matrix.elements;
      return 'translate(-50%,-50%)' +
        'matrix3d(' +
        epsilon(el[0]) + ',' + epsilon(el[1]) + ',' + epsilon(el[2]) + ',' + epsilon(el[3]) + ',' +
        epsilon(-el[4]) + ',' + epsilon(-el[5]) + ',' + epsilon(-el[6]) + ',' + epsilon(-el[7]) + ',' +
        epsilon(el[8]) + ',' + epsilon(el[9]) + ',' + epsilon(el[10]) + ',' + epsilon(el[11]) + ',' +
        epsilon(el[12]) + ',' + epsilon(el[13]) + ',' + epsilon(el[14]) + ',' + epsilon(el[15]) +
      ')';
    }

    function hideObject(obj) {
      if (obj.isCSS3DObject) obj.element.style.display = 'none';
      for (let i = 0, l = obj.children.length; i < l; i++) {
        hideObject(obj.children[i]);
      }
    }

    function renderObject(obj, scene, camera) {
      if (obj.visible === false) {
        hideObject(obj);
        return;
      }
      if (obj.isCSS3DObject) {
        const visible = obj.layers.test(camera.layers) === true;
        const el = obj.element;
        el.style.display = visible ? '' : 'none';
        if (visible) {
          obj.onBeforeRender(scope, scene, camera);
          let style;
          if (obj.isCSS3DSprite) {
            _mat1.copy(camera.matrixWorldInverse);
            _mat1.transpose();
            if (obj.rotation2D !== 0) _mat1.multiply(_mat2.makeRotationZ(obj.rotation2D));
            obj.matrixWorld.decompose(_v1, _q1, _m1);
            _mat1.setPosition(_v1);
            _mat1.scale(_m1);
            _mat1.elements[3] = 0;
            _mat1.elements[7] = 0;
            _mat1.elements[11] = 0;
            _mat1.elements[15] = 1;
            style = getObjectCSSMatrix(_mat1);
          } else {
            style = getObjectCSSMatrix(obj.matrixWorld);
          }
          const cached = cache.objects.get(obj);
          if (cached === undefined || cached.style !== style) {
            el.style.transform = style;
            cache.objects.set(obj, { style });
          }
          if (el.parentNode !== worldElement) {
            worldElement.appendChild(el);
          }
          obj.onAfterRender(scope, scene, camera);
        }
      }
      for (let i = 0, l = obj.children.length; i < l; i++) {
        renderObject(obj.children[i], scene, camera);
      }
    }

    this.render = function(scene, camera) {
      const fov = camera.projectionMatrix.elements[5] * halfHeight;
      if (camera.view && camera.view.enabled) {
        cameraElement.style.transform = `translate(${-camera.view.offsetX * (width / camera.view.width)}px, ${-camera.view.offsetY * (height / camera.view.height)}px)`;
        cameraElement.style.transform += `scale(${camera.view.fullWidth / camera.view.width}, ${camera.view.fullHeight / camera.view.height})`;
      } else {
        cameraElement.style.transform = '';
      }
      if (scene.matrixWorldAutoUpdate === true) scene.updateMatrixWorld();
      if (camera.parent === null && camera.matrixWorldAutoUpdate === true) camera.updateMatrixWorld();

      let tx, ty;
      if (camera.isOrthographicCamera) {
        tx = -(camera.right + camera.left) / 2;
        ty = (camera.top + camera.bottom) / 2;
      }
      const scale = camera.view && camera.view.enabled ? camera.view.height / camera.view.fullHeight : 1;
      const cameraCSS = camera.isOrthographicCamera
        ? `scale(${scale})scale(${fov})translate(${epsilon(tx)}px,${epsilon(ty)}px)${getCameraCSSMatrix(camera.matrixWorldInverse)}`
        : `scale(${scale})translateZ(${fov}px)${getCameraCSSMatrix(camera.matrixWorldInverse)}`;
      const fullTransform = (camera.isPerspectiveCamera ? `perspective(${fov}px) ` : '') + cameraCSS + `translate(${halfWidth}px,${halfHeight}px)`;

      if (cache.camera.style !== fullTransform) {
        worldElement.style.transform = fullTransform;
        cache.camera.style = fullTransform;
      }
      renderObject(scene, scene, camera);
    };

    this.setSize = function(w, h) {
      width = w;
      height = h;
      halfWidth = width / 2;
      halfHeight = height / 2;
      domElement.style.width = w + 'px';
      domElement.style.height = h + 'px';
      cameraElement.style.width = w + 'px';
      cameraElement.style.height = h + 'px';
      worldElement.style.width = w + 'px';
      worldElement.style.height = h + 'px';
    };
  }
}

// Rounded Box Geometry implementation
const _vBox = new Vector3();
function calcRoundedCorner(target, pos, normal, uAxis, vAxis, radius, depth) {
  const S = 2 * Math.PI * radius / 4;
  const I = Math.max(depth - 2 * radius, 0);
  const quarter = Math.PI / 4;
  _vBox.copy(pos);
  _vBox[uAxis] = 0;
  _vBox.normalize();
  const halfS = 0.5 * S / (S + I);
  const angle = 1 - _vBox.angleTo(target) / quarter;
  return Math.sign(_vBox[normal]) === 1 ? angle * halfS : I / (S + I) + halfS + halfS * (1 - angle);
}

export class RoundedBoxGeometry extends BoxGeometry {
  constructor(width = 1, height = 1, depth = 1, segments = 2, radius = 0.1) {
    const totalSegments = segments * 2 + 1;
    radius = Math.min(width / 2, height / 2, depth / 2, radius);
    super(1, 1, 1, totalSegments, totalSegments, totalSegments);
    this.type = 'RoundedBoxGeometry';
    this.parameters = { width, height, depth, segments, radius };
    if (totalSegments === 1) return;

    const nonIndexed = this.toNonIndexed();
    this.index = null;
    this.attributes.position = nonIndexed.attributes.position;
    this.attributes.normal = nonIndexed.attributes.normal;
    this.attributes.uv = nonIndexed.attributes.uv;

    const pos = new Vector3();
    const nor = new Vector3();
    const half = new Vector3(width, height, depth).divideScalar(2).subScalar(radius);
    const pArr = this.attributes.position.array;
    const nArr = this.attributes.normal.array;
    const uArr = this.attributes.uv.array;
    const faceCount = pArr.length / 6;
    const faceDir = new Vector3();
    const delta = 0.5 / totalSegments;

    for (let i = 0, uvIdx = 0; i < pArr.length; i += 3, uvIdx += 2) {
      pos.fromArray(pArr, i);
      nor.copy(pos);
      nor.x -= Math.sign(nor.x) * delta;
      nor.y -= Math.sign(nor.y) * delta;
      nor.z -= Math.sign(nor.z) * delta;
      nor.normalize();

      pArr[i + 0] = half.x * Math.sign(pos.x) + nor.x * radius;
      pArr[i + 1] = half.y * Math.sign(pos.y) + nor.y * radius;
      pArr[i + 2] = half.z * Math.sign(pos.z) + nor.z * radius;
      nArr[i + 0] = nor.x;
      nArr[i + 1] = nor.y;
      nArr[i + 2] = nor.z;

      switch (Math.floor(i / faceCount)) {
        case 0:
          faceDir.set(1, 0, 0);
          uArr[uvIdx + 0] = calcRoundedCorner(faceDir, nor, 'z', 'y', radius, depth);
          uArr[uvIdx + 1] = 1 - calcRoundedCorner(faceDir, nor, 'y', 'z', radius, height);
          break;
        case 1:
          faceDir.set(-1, 0, 0);
          uArr[uvIdx + 0] = 1 - calcRoundedCorner(faceDir, nor, 'z', 'y', radius, depth);
          uArr[uvIdx + 1] = 1 - calcRoundedCorner(faceDir, nor, 'y', 'z', radius, height);
          break;
        case 2:
          faceDir.set(0, 1, 0);
          uArr[uvIdx + 0] = 1 - calcRoundedCorner(faceDir, nor, 'x', 'z', radius, width);
          uArr[uvIdx + 1] = calcRoundedCorner(faceDir, nor, 'z', 'x', radius, depth);
          break;
        case 3:
          faceDir.set(0, -1, 0);
          uArr[uvIdx + 0] = 1 - calcRoundedCorner(faceDir, nor, 'x', 'z', radius, width);
          uArr[uvIdx + 1] = 1 - calcRoundedCorner(faceDir, nor, 'z', 'x', radius, depth);
          break;
        case 4:
          faceDir.set(0, 0, 1);
          uArr[uvIdx + 0] = 1 - calcRoundedCorner(faceDir, nor, 'x', 'y', radius, width);
          uArr[uvIdx + 1] = 1 - calcRoundedCorner(faceDir, nor, 'y', 'x', radius, height);
          break;
        case 5:
          faceDir.set(0, 0, -1);
          uArr[uvIdx + 0] = calcRoundedCorner(faceDir, nor, 'x', 'y', radius, width);
          uArr[uvIdx + 1] = 1 - calcRoundedCorner(faceDir, nor, 'y', 'x', radius, height);
          break;
      }
    }
  }
}

// Helpers
const V3 = (x, y, z) => new Vector3(x, y, z);
const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export async function createArchive({ onAction, onReady, onError, onSound = () => {} }) {
  const worldContainer = document.querySelector('#world');
  const paperContainer = document.querySelector('#paper-world');

  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  worldContainer.append(renderer.domElement);

  const cssRenderer = new CSS3DRenderer();
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  paperContainer.append(cssRenderer.domElement);

  const scene = new Scene();
  scene.background = new Color(0x172019);
  scene.fog = new FogExp2(0x172019, 0.032);

  const cssScene = new Scene();
  const camera = new PerspectiveCamera(43, window.innerWidth / window.innerHeight, 0.1, 80);
  const cameraTarget = V3(0, 2, -1.2);
  camera.position.set(7, 4.5, 10);
  camera.lookAt(cameraTarget);

  let state = 'entrance';
  let isBusy = false;
  let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pointerOffset = { x: 0, y: 0 };
  let pointerStart = null;
  let hoveredObject = null;
  let animId = 0;
  const activeTweens = [];

  // Materials
  const matCabinetDark = new MeshStandardMaterial({ color: 0x4b5844, roughness: 0.48, metalness: 0.5 });
  const matDrawerFront = new MeshStandardMaterial({ color: 0x606c50, roughness: 0.49, metalness: 0.4 });
  const matMetalFrame = new MeshStandardMaterial({ color: 0x1a261e, roughness: 0.8, metalness: 0.45 });
  const matHandleChrome = new MeshStandardMaterial({ color: 0xbbb6a9, roughness: 0.35, metalness: 0.72 });
  const matPaperWhite = new MeshStandardMaterial({ color: 0xe5ddc8, roughness: 0.98 });
  const matManilaFolder = new MeshStandardMaterial({ color: 0xb49965, roughness: 0.94 });
  const matCabinetBase = new MeshStandardMaterial({ color: 0x171e17, roughness: 0.95 });

  function createBox(w, h, d, material, x = 0, y = 0, z = 0, parent = scene, radius = 0) {
    const geom = radius ? new RoundedBoxGeometry(w, h, d, 2, radius) : new BoxGeometry(w, h, d);
    const mesh = new Mesh(geom, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function createCylinder(rTop, rBot, h, material, pos, parent = scene) {
    const mesh = new Mesh(new CylinderGeometry(rTop, rBot, h, 32), material);
    mesh.position.copy(pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function makeCanvasTexture(w, h, drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    drawFn(canvas.getContext('2d'), w, h);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  function createPlaque(title, subtitle, w, h, bgColor = '#e7dec3', textColor = '#17251b', parent = scene) {
    const tex = makeCanvasTexture(1536, 384, (ctx, cw, ch) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      let fontSize = 144;
      ctx.font = `700 ${fontSize}px monospace`;
      while (ctx.measureText(title).width > cw - 120) {
        fontSize -= 2;
        ctx.font = `700 ${fontSize}px monospace`;
      }
      ctx.fillText(title, cw / 2, 192);
      ctx.font = '600 48px monospace';
      ctx.fillText(subtitle, cw / 2, 290, cw - 110);
    });
    const mesh = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ map: tex, toneMapped: false, fog: false, side: DoubleSide }));
    parent.add(mesh);
    return mesh;
  }

  // Lighting
  scene.add(new HemisphereLight(0xc6d3bd, 0x252319, 1.5));

  const deskSpotlight = new SpotLight(0xffdfa1, 95, 25, 0.72, 0.5, 1.7);
  deskSpotlight.position.set(2, 7, 2);
  deskSpotlight.target.position.set(1.5, 2, -2);
  deskSpotlight.castShadow = true;
  deskSpotlight.shadow.mapSize.set(2048, 2048);
  deskSpotlight.shadow.bias = -0.0003;
  deskSpotlight.shadow.normalBias = 0.025;
  scene.add(deskSpotlight, deskSpotlight.target);

  const fillDirLight = new DirectionalLight(0xb8d9bb, 2.1);
  fillDirLight.position.set(-4, 5, -2);
  scene.add(fillDirLight);

  const warmPointLight = new PointLight(0xffdf9e, 12, 9, 1.5);
  warmPointLight.position.set(2.8, 3.1, 3);
  scene.add(warmPointLight);

  const roomPointLight = new PointLight(0xffe870, 22, 15, 1.6);
  roomPointLight.position.set(-2, 6, 3);
  scene.add(roomPointLight);

  // Floor
  const floorTex = makeCanvasTexture(1024, 1024, (ctx, cw, ch) => {
    ctx.fillStyle = '#45473c';
    ctx.fillRect(0, 0, cw, ch);
    for (let i = 0; i < 18000; i++) {
      const c = 40 + Math.random() * 80;
      ctx.fillStyle = `rgba(${c},${c},${c},0.1)`;
      ctx.fillRect(Math.random() * cw, Math.random() * ch, 2, 2);
    }
    ctx.strokeStyle = '#262e2560';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 256, 0);
      ctx.lineTo(i * 256, ch);
      ctx.moveTo(0, i * 256);
      ctx.lineTo(cw, i * 256);
      ctx.stroke();
    }
  });
  floorTex.wrapS = floorTex.wrapT = RepeatWrapping;
  floorTex.repeat.set(4, 4);
  createBox(32, 0.15, 32, new MeshStandardMaterial({ map: floorTex, roughness: 0.96 }), 0, -0.12, 0);

  // Walls
  const matWall = new MeshStandardMaterial({ color: 0x3f4b3d, roughness: 0.94 });
  createBox(22, 9, 0.25, matWall, 0, 4.4, -5.1);
  createBox(0.25, 9, 20, matWall, -8, 4.4, 3);
  createBox(22, 0.16, 0.25, matMetalFrame, 0, 0.14, -4.9);
  createBox(22, 0.04, 0.04, matMetalFrame, 0, 3.9, -4.94);

  // Signboards
  createPlaque('ARCHIVE / 001', CONFIG.personal.department || 'DEPARTMENT OF THOUGHTFUL SYSTEMS', 4.7, 1.18, '#283529', '#ddd9bc').position.set(0.8, 5.6, -4.94);
  createPlaque('AUTHORIZED PERSONNEL', 'ALL GOOD WORK LEAVES A PAPER TRAIL', 2.2, 0.55, '#283529', '#ddd9bc').position.set(-3.8, 3.2, -4.93);

  // Ceiling lights
  for (const lx of [-4, 2.1, 6]) {
    createBox(2.4, 0.14, 0.3, matMetalFrame, lx, 7.3, -2);
    createBox(2.1, 0.035, 0.17, new MeshStandardMaterial({ color: 0xf5e350, emissive: 0xffdf80, emissiveIntensity: 2 }), lx, 7.2, -2);
  }

  // Wall conduits
  for (let i = 0; i < 10; i++) {
    createBox(0.025, 0.07, 3.8, matMetalFrame, -7.82, 3.7 + i * 0.22, 0);
  }

  // Primary Filing Cabinet
  const mainCabinet = new Group();
  mainCabinet.position.set(1.5, 0, -2.5);
  scene.add(mainCabinet);

  createBox(0.13, 4.7, 1.85, matCabinetDark, -1.28, 2.48, 0, mainCabinet, 0.025);
  createBox(0.13, 4.7, 1.85, matCabinetDark, 1.28, 2.48, 0, mainCabinet, 0.025);
  createBox(2.66, 0.14, 1.93, matCabinetDark, 0, 4.84, 0, mainCabinet, 0.03);
  createBox(2.65, 0.2, 1.93, matCabinetDark, 0, 0.15, 0, mainCabinet, 0.02);
  createBox(2.55, 4.6, 0.08, matMetalFrame, 0, 2.5, -0.92, mainCabinet);

  for (const cx of [-1.05, 1.05]) {
    for (const cz of [-0.68, 0.68]) {
      createBox(0.2, 0.16, 0.2, matCabinetBase, cx, 0.01, cz, mainCabinet, 0.02);
    }
  }

  const interactiveDrawers = [];
  let targetDrawerGroup;

  const drawerLabels = [
    'FIELD NOTES',
    'SYSTEMS & OPERATIONS',
    CONFIG.personal.name.toUpperCase(),
    'PERSONNEL ARCHIVE'
  ];

  for (let i = 0; i < 4; i++) {
    const drawerGroup = new Group();
    drawerGroup.position.set(0, 0.79 + i * 1.14, 0);
    mainCabinet.add(drawerGroup);

    const drawerFront = createBox(2.42, 1.06, 0.11, matDrawerFront, 0, 0, 0.97, drawerGroup, 0.025);
    drawerFront.userData.kind = 'rack';
    interactiveDrawers.push(drawerFront);

    createBox(2.3, 0.06, 1.55, matCabinetDark, 0, -0.48, 0.2, drawerGroup);
    for (const sx of [-1.16, 1.16]) createBox(0.055, 0.73, 1.55, matCabinetDark, sx, -0.1, 0.2, drawerGroup);
    for (const sx of [-1.07, 1.07]) createBox(0.035, 0.035, 1.62, matHandleChrome, sx, 0.27, 0.2, drawerGroup);

    const subText = i === 2 ? `${CONFIG.personal.fileCode}  /  ${CONFIG.personal.role.toUpperCase()}` : `SECTION 0${i + 1}   /  RECORDS`;
    createPlaque(drawerLabels[i], subText, 1.75, 0.43, '#e7dec3', '#17251b', drawerGroup).position.set(0, 0.13, 1.052);

    createBox(1.87, 0.035, 0.045, matHandleChrome, 0, 0.38, 1.045, drawerGroup);
    createBox(1.87, 0.035, 0.045, matHandleChrome, 0, -0.12, 1.045, drawerGroup);
    createBox(0.035, 0.53, 0.045, matHandleChrome, -0.95, 0.13, 1.045, drawerGroup);
    createBox(0.035, 0.53, 0.045, matHandleChrome, 0.95, 0.13, 1.045, drawerGroup);

    for (const hx of [-0.43, 0.43]) createBox(0.1, 0.13, 0.18, matHandleChrome, hx, -0.3, 1.08, drawerGroup, 0.02);
    createBox(0.97, 0.095, 0.08, matHandleChrome, 0, -0.3, 1.19, drawerGroup, 0.025);

    if (i === 2) {
      targetDrawerGroup = drawerGroup;
      for (let fIdx = 0; fIdx < 7; fIdx++) {
        for (const dir of [-1, 1]) {
          if (dir === -1 && fIdx >= 3) continue;
          const folderHolder = new Group();
          folderHolder.position.set(dir * 0.55, 0.04, -0.39 + fIdx * 0.18);
          drawerGroup.add(folderHolder);
          createBox(0.72, 0.99, 0.008, new MeshStandardMaterial({ color: [0x9f8b5f, 0xb6a372, 0x87886a][fIdx % 3], roughness: 1 }), 0, 0, 0, folderHolder);
          createBox(0.27, 0.06, 0.008, matManilaFolder, 0.16, 0.52, 0, folderHolder);
        }
      }
    }
  }

  createPlaque(CONFIG.personal.fileCode, 'ENGINEERING DIVISION', 1.1, 0.28, '#233024', '#b6b598', mainCabinet).position.set(0, 4.64, 0.973);

  // Background side cabinets
  for (const bx of [-4.8, 5.1]) {
    const sideCab = new Group();
    sideCab.position.set(bx, 0, -3.1);
    scene.add(sideCab);
    createBox(2.3, 4.5, 1.5, matMetalFrame, 0, 2.3, 0, sideCab, 0.03);
    for (let row = 0; row < 4; row++) {
      createBox(2.14, 0.98, 0.09, matCabinetDark, 0, 0.66 + row * 1.07, 0.79, sideCab, 0.02);
      createBox(0.65, 0.065, 0.1, matHandleChrome, 0, 0.6 + row * 1.07, 0.88, sideCab);
      createPlaque(`0${row + 5}`, 'ARCHIVED', 0.6, 0.18, '#8c937b', '#34402e', sideCab).position.set(0, 0.86 + row * 1.07, 0.849);
    }
  }

  // Wooden Study Desk
  const woodDeskTex = makeCanvasTexture(1024, 512, (ctx, cw, ch) => {
    ctx.fillStyle = '#30291f';
    ctx.fillRect(0, 0, cw, ch);
    for (let i = 0; i < 2200; i++) {
      const c = 45 + Math.random() * 40;
      ctx.strokeStyle = `rgba(${c},${c * 0.82},${c * 0.59},${Math.random() * 0.16})`;
      const ly = Math.random() * ch;
      ctx.beginPath();
      ctx.moveTo(0, ly);
      ctx.bezierCurveTo(cw * 0.3, ly + Math.random() * 10, cw * 0.6, ly - 5, cw, ly + 4);
      ctx.stroke();
    }
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = '#15191255';
      ctx.fillRect(0, i * 128, cw, 1);
    }
  });

  const deskGroup = new Group();
  deskGroup.position.set(0, 0, 3);
  scene.add(deskGroup);

  createBox(8, 0.18, 4.8, new MeshStandardMaterial({ map: woodDeskTex, roughness: 0.73 }), 0, 1.32, 0, deskGroup, 0.045);
  for (const dx of [-3.6, 3.6]) {
    for (const dz of [-1.9, 1.9]) {
      createBox(0.18, 1.3, 0.18, matMetalFrame, dx, 0.61, dz, deskGroup);
    }
  }

  // Desk Mat
  createBox(5.6, 0.03, 3.9, new MeshStandardMaterial({ color: 0x263b2c, roughness: 0.94 }), 0, 1.43, 0, deskGroup, 0.035);

  // Desk Lamp
  createCylinder(0.35, 0.4, 0.09, matHandleChrome, V3(3, 1.47, 2.4));
  createCylinder(0.045, 0.06, 0.94, matHandleChrome, V3(3, 1.96, 2.4));
  const lampShade = new Mesh(new CylinderGeometry(0.33, 0.42, 1.1, 32, 1, true, 0, Math.PI), new MeshStandardMaterial({ color: 0x214b35, roughness: 0.25, metalness: 0.25, side: DoubleSide }));
  lampShade.rotation.z = Math.PI / 2;
  lampShade.position.set(3, 2.55, 2.4);
  scene.add(lampShade);
  createBox(0.87, 0.055, 0.21, new MeshStandardMaterial({ color: 0xffecdc, emissive: 0xffdf4d, emissiveIntensity: 2 }), 3, 2.45, 2.4);

  // Stationery Cup & Pens
  const pen = createCylinder(0.024, 0.024, 1.45, matHandleChrome, V3(2.8, 1.49, 4.1));
  pen.rotation.set(Math.PI / 2, 0, 0.27);
  const penTip = new Mesh(new ConeGeometry(0.025, 0.12, 12), matMetalFrame);
  penTip.rotation.x = Math.PI / 2;
  penTip.position.set(2.8, 1.49, 4.86);
  scene.add(penTip);

  const matBrass = new MeshStandardMaterial({ color: 0xbeb582, roughness: 0.5 });
  createCylinder(0.25, 0.22, 0.4, matBrass, V3(-3, 1.62, 3.2));
  createCylinder(0.218, 0.218, 0.012, new MeshStandardMaterial({ color: 0x21180f, roughness: 0.2 }), V3(-3, 1.826, 3.2));
  const deskTray = new Mesh(new TorusGeometry(0.14, 0.037, 10, 22), matBrass);
  deskTray.position.set(-3.26, 1.65, 3.2);
  scene.add(deskTray);

  // Desk Inspiration Plaque
  const deskPlaque = createPlaque('MAKE IT USEFUL.', 'THEN MAKE IT BEAUTIFUL.', 1.3, 0.35, '#bfb992', '#3a4c34');
  deskPlaque.rotation.set(-Math.PI / 2, 0, -0.13);
  deskPlaque.position.set(-2.85, 1.435, 4.2);

  // The Dossier Folder (Inside drawer)
  const fileFolder = new Group();
  targetDrawerGroup.add(fileFolder);

  const drawerFolderPos = V3(-0.55, 0.04, 0.15);
  const folderScale = 0.29;
  fileFolder.position.copy(drawerFolderPos);
  fileFolder.rotation.set(0, 0, 0);
  fileFolder.scale.setScalar(folderScale);
  worldContainer.dataset.fileLocation = 'drawer';
  worldContainer.dataset.drawer = 'closed';

  createBox(2.43, 3.44, 0.008, matManilaFolder, 0, 0, 0, fileFolder);
  createBox(2.31, 3.32, 0.012, matPaperWhite, 0, 0, 0.012, fileFolder);
  createBox(0.92, 0.22, 0.008, matManilaFolder, 0.66, 1.8, 0, fileFolder);

  const tabPlaque = createPlaque(CONFIG.personal.name.toUpperCase(), CONFIG.personal.fileCode, 0.85, 0.2, '#e7dec3', '#17251b', fileFolder);
  tabPlaque.position.set(0.66, 1.8, 0.006);

  const folderFrontCover = new Group();
  folderFrontCover.position.x = -1.215;
  fileFolder.add(folderFrontCover);

  const frontCoverMesh = createBox(2.43, 3.44, 0.008, matManilaFolder, 1.215, 0, 0.025, folderFrontCover);
  frontCoverMesh.userData.kind = 'file';

  // Preload portrait image for 3D cover mount
  const portraitImg = new Image();
  portraitImg.src = CONFIG.personal.portraitUrl;
  await portraitImg.decode().catch(() => {});

  // Dynamic Dossier Cover Texture
  const coverTex = makeCanvasTexture(1024, 1440, (ctx, cw, ch) => {
    ctx.fillStyle = '#b9a16c';
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#857149';
    ctx.fillRect(72, 0, 2, ch);
    ctx.fillStyle = '#3b412d';
    ctx.font = '28px monospace';
    ctx.fillText(CONFIG.personal.department || 'DEPARTMENT OF INTELLIGENT SYSTEMS', 117, 144);
    ctx.fillRect(117, 180, 780, 2);
    ctx.font = '30px monospace';
    ctx.fillText('PERSONNEL FILE', 117, 255);
    ctx.font = '95px Georgia';
    ctx.fillText(CONFIG.personal.firstName.toUpperCase(), 110, 365);
    ctx.fillText(CONFIG.personal.lastName.toUpperCase(), 110, 465);
    ctx.font = '26px monospace';
    ctx.fillText(CONFIG.personal.role.toUpperCase(), 117, 530);
    ctx.fillText(CONFIG.personal.fileNo.toUpperCase(), 117, 580);

    // Mounted Portrait Photo on Front Cover
    if (portraitImg.complete && portraitImg.naturalWidth > 0) {
      const pw = 360;
      const ph = 430;
      const px = 117;
      const py = 620;

      // Photo mount backing card
      ctx.fillStyle = '#e8dfcb';
      ctx.fillRect(px - 12, py - 12, pw + 24, ph + 50);
      ctx.strokeStyle = '#6e5f4040';
      ctx.lineWidth = 1;
      ctx.strokeRect(px - 12, py - 12, pw + 24, ph + 50);

      // Draw portrait with aspect-ratio crop
      const imgW = portraitImg.naturalWidth;
      const imgH = portraitImg.naturalHeight;
      const targetAspect = pw / ph;
      const imgAspect = imgW / imgH;
      let sX = 0, sY = 0, sW = imgW, sH = imgH;
      if (imgAspect > targetAspect) {
        sW = imgH * targetAspect;
        sX = (imgW - sW) / 2;
      } else {
        sH = imgW / targetAspect;
        sY = (imgH - sH) / 2;
      }
      ctx.drawImage(portraitImg, sX, sY, sW, sH, px, py, pw, ph);

      // Archival corner brackets
      ctx.fillStyle = '#2c3327';
      const cSize = 16;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + cSize, py); ctx.lineTo(px, py + cSize); ctx.fill();
      ctx.beginPath(); ctx.moveTo(px + pw, py + ph); ctx.lineTo(px + pw - cSize, py + ph); ctx.lineTo(px + pw, py + ph - cSize); ctx.fill();

      // Caption
      ctx.fillStyle = '#3b412d';
      ctx.font = '19px monospace';
      ctx.fillText(`SUBJECT / ${CONFIG.personal.fileCode}`, px, py + ph + 26);
    }

    // Declassified Stamp
    ctx.fillStyle = '#8a4434';
    ctx.save();
    ctx.translate(720, 830);
    ctx.rotate(-0.11);
    ctx.strokeStyle = '#8a4434';
    ctx.lineWidth = 5;
    ctx.strokeRect(-210, -52, 420, 100);
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DECLASSIFIED', 0, 16);
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#3b412d';
    ctx.font = '22px monospace';
    ctx.fillText(`${CONFIG.personal.experienceYears.toUpperCase()} / ${CONFIG.personal.roleSub.toUpperCase()}`, 117, 1260);
    ctx.fillText('OPEN TO INVESTIGATE', 117, 1315);
    ctx.fillRect(117, 1345, 780, 2);
  });

  const coverMesh = new Mesh(new PlaneGeometry(2.39, 3.4), new MeshBasicMaterial({ map: coverTex, toneMapped: false }));
  coverMesh.position.set(1.215, 0, 0.03);
  folderFrontCover.add(coverMesh);
  coverMesh.userData.kind = 'file';

  const coverDataUrl = coverTex.image.toDataURL('image/png');
  const coverHtmlFace = `<div class="file-cover-face"><img src="${coverDataUrl}" alt="${CONFIG.personal.name} personnel file cover"></div>`;
  const emptyHtmlFace = '<div class="file-cover-face"></div>';

  const preloadCoverImg = new Image();
  preloadCoverImg.src = coverDataUrl;
  await preloadCoverImg.decode().catch(() => {});
  fileFolder.visible = true;

  // Open Dossier on Desk (Static Bed)
  const openDeskBed = new Group();
  openDeskBed.position.set(0, 1.49, 3);
  openDeskBed.rotation.x = -Math.PI / 2;
  scene.add(openDeskBed);
  openDeskBed.visible = false;

  const bedBacking = createBox(4.98, 3.54, 0.008, matManilaFolder, 0, 0, 0.035, openDeskBed);
  const bedLeft = createBox(2.43, 3.42, 0.012, matPaperWhite, -1.22, 0, 0.048, openDeskBed);
  const bedRight = createBox(2.43, 3.42, 0.012, matPaperWhite, 1.22, 0, 0.048, openDeskBed);
  const bedTab = createBox(0.72, 0.18, 0.008, matManilaFolder, 2.01, 1.82, 0.035, openDeskBed);

  // CSS3D Scene Setup
  const cssWorldGroup = new Group();
  cssWorldGroup.position.copy(openDeskBed.position);
  cssWorldGroup.rotation.copy(openDeskBed.rotation);
  cssScene.add(cssWorldGroup);

  function createCSSPageSurface() {
    const el = document.createElement('div');
    el.style.backfaceVisibility = 'hidden';
    const obj = new CSS3DObject(el);
    obj.scale.setScalar(0.005);
    cssWorldGroup.add(obj);
    return obj;
  }

  const leftPageSurface = createCSSPageSurface();
  const rightPageSurface = createCSSPageSurface();
  leftPageSurface.position.set(-1.22, 0, 0.065);
  rightPageSurface.position.set(1.22, 0, 0.065);
  leftPageSurface.visible = rightPageSurface.visible = false;
  leftPageSurface.element.dataset.pageSurface = 'left';
  rightPageSurface.element.dataset.pageSurface = 'right';

  const turningHingeGroup = new Group();
  cssWorldGroup.add(turningHingeGroup);
  turningHingeGroup.position.set(0, 0, 0.0635);

  const turningSlices = [];

  // Realistic 12-segment curved page bending mesh
  function buildTurningSheet(frontHtml, backHtml, direction) {
    const sliceCount = 12;
    for (let i = 0; i < sliceCount; i++) {
      const pair = [];
      for (const isBack of [false, true]) {
        const sliceObj = createCSSPageSurface();
        cssWorldGroup.remove(sliceObj);
        turningHingeGroup.add(sliceObj);

        const progressCol = (isBack === (direction > 0) ? (sliceCount - 1 - i) : i) * 40;
        sliceObj.element.innerHTML = isBack ? backHtml : frontHtml;
        sliceObj.element.dataset.pageSurface = isBack ? 'turn-back' : 'turn-front';
        sliceObj.element.classList.add('turning-sheet');
        sliceObj.element.inert = true;
        sliceObj.element.setAttribute('aria-hidden', 'true');
        sliceObj.element.style.clipPath = `inset(0 ${Math.max(0, 480 - progressCol - 40 - 0.5)}px 0 ${Math.max(0, progressCol - 0.5)}px)`;

        pair.push({
          face: sliceObj,
          back: isBack,
          center: (progressCol + 40 / 2 - 240) * 0.005
        });
      }
      turningSlices.push(pair);
    }
    updateTurningBend(0, direction);
  }

  function updateTurningBend(progress, direction) {
    const bendArch = 0.58 * Math.sin(Math.PI * progress);
    const sliceStep = 2.4 / turningSlices.length;
    let accumX = direction * 0.02;
    let accumZ = 0;

    turningSlices.forEach((pair, idx) => {
      const angle = bendArch * (idx + 0.5) / turningSlices.length;
      const stepX = direction * Math.cos(angle) * sliceStep;
      const stepZ = -Math.sin(angle) * sliceStep;

      for (const { face, back, center } of pair) {
        const sliceRotY = direction * angle + (back ? Math.PI : 0);
        const zNudge = back ? -0.002 : 0.002;
        face.rotation.y = sliceRotY;
        face.position.set(
          accumX + stepX / 2 - center * Math.cos(sliceRotY) + Math.sin(direction * angle) * zNudge,
          0,
          accumZ + stepZ / 2 + center * Math.sin(sliceRotY) + Math.cos(angle) * zNudge
        );
        face.element.style.setProperty('--turn-shade', String(Math.sin(Math.PI * progress) * (back ? 0.12 : 0.16)));
      }
      accumX += stepX;
      accumZ += stepZ;
    });
  }

  function removeTurningSheet() {
    for (const pair of turningSlices) {
      for (const { face } of pair) {
        turningHingeGroup.remove(face);
      }
    }
    turningSlices.length = 0;
  }

  // Atmospheric Dust Particles
  const particleGeo = new BufferGeometry();
  const particleCount = 230;
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePos[i * 3] = (Math.random() - 0.5) * 17;
    particlePos[i * 3 + 1] = Math.random() * 7;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }
  particleGeo.setAttribute('position', new Float32BufferAttribute(particlePos, 3));
  const dustParticles = new Points(
    particleGeo,
    new PointsMaterial({ color: 0xc9c5a5, size: 0.014, transparent: true, opacity: 0.3, depthWrite: false })
  );
  scene.add(dustParticles);

  function tween(duration, onUpdate) {
    return new Promise(resolve => {
      if (reducedMotion) {
        onUpdate(1);
        resolve();
        return;
      }
      activeTweens.push({
        start: performance.now(),
        ms: duration,
        update: onUpdate,
        resolve
      });
    });
  }

  const cameraCurrentPos = camera.position.clone();
  const cameraCurrentLook = cameraTarget.clone();

  function getCameraDestination(targetState) {
    const isMobile = window.innerWidth < 700;
    if (targetState === 'entrance') {
      return {
        pos: isMobile ? V3(6.8, 4.1, 11) : V3(7, 4.5, 10),
        look: isMobile ? V3(-0.7, 2.3, -1.4) : V3(0, 2, -1.2)
      };
    }
    if (targetState === 'rack') {
      return {
        pos: isMobile ? V3(4.6, 7, 5.5) : V3(4.6, 6.7, 4.5),
        look: isMobile ? V3(1.4, 3, -1.4) : V3(0.7, 3, -1.7)
      };
    }
    if (targetState === 'desk') {
      return {
        pos: isMobile ? V3(1.5, 7.5, 7.2) : V3(2, 7, 7.5),
        look: isMobile ? V3(0, 1.5, 3.4) : V3(-0.6, 1.5, 3)
      };
    }
    // Reading Mode
    const availH = window.innerHeight - (isMobile ? 180 : 205);
    const aspect = (window.innerWidth - (isMobile ? 58 : window.innerWidth > 1100 ? 320 : 160)) / availH;
    const dist = Math.max(3.72, (isMobile ? 2.5 : 5.08) / aspect) / (2 * Math.tan(MathUtils.degToRad(28 / 2))) * (window.innerHeight / availH);
    return {
      pos: V3(0, 1.5 + dist * 0.992, 3 + dist * 0.125),
      look: V3(0, 1.5, 3)
    };
  }

  async function animateCamera(destState, duration = 1500) {
    const startPos = cameraCurrentPos.clone();
    const startLook = cameraCurrentLook.clone();
    const dest = getCameraDestination(destState);
    const startFov = camera.fov;
    const destFov = destState === 'reading' ? 28 : 43;

    await tween(duration, t => {
      const e = easeInOutCubic(t);
      cameraCurrentPos.lerpVectors(startPos, dest.pos, e);
      cameraCurrentLook.lerpVectors(startLook, dest.look, e);
      camera.fov = MathUtils.lerp(startFov, destFov, e);
      camera.updateProjectionMatrix();
      camera.position.copy(cameraCurrentPos);
      cameraTarget.copy(cameraCurrentLook);
      camera.lookAt(cameraTarget);
    });
  }

  function adjustLayout() {
    const isMobile = window.innerWidth < 700;
    leftPageSurface.position.x = isMobile ? 0 : -1.22;
    rightPageSurface.position.x = 1.22;
    bedLeft.position.x = isMobile ? 0 : -1.22;
    bedRight.visible = !isMobile;
    bedBacking.scale.x = isMobile ? 0.5 : 1;
    bedTab.position.x = isMobile ? 0.79 : 2.01;
    rightPageSurface.visible = ['reading', 'opening'].includes(state) && !isMobile;
  }

  function setHtmlIfChanged(obj, html) {
    if (obj.element.innerHTML !== html) {
      obj.element.innerHTML = html || '';
    }
  }

  function setPages(leftHtml, rightHtml) {
    if (isBusy) return;
    setHtmlIfChanged(leftPageSurface, leftHtml);
    setHtmlIfChanged(rightPageSurface, rightHtml);
    leftPageSurface.visible = state === 'reading';
    rightPageSurface.visible = state === 'reading' && window.innerWidth >= 700;
    adjustLayout();
  }

  async function goToState(targetState) {
    if (isBusy) return false;
    isBusy = true;
    hoveredObject = null;
    pointerOffset = { x: 0, y: 0 };

    try {
      if (targetState === 'rack') {
        state = 'rack';
        worldContainer.dataset.drawer = 'opening';
        onSound('drawer-open', reducedMotion ? 0.16 : 1.3);
        const startZ = targetDrawerGroup.position.z;
        await Promise.all([
          animateCamera('rack'),
          (async () => {
            await tween(1300, t => {
              targetDrawerGroup.position.z = MathUtils.lerp(startZ, 1.48, easeInOutCubic(t));
            });
            onSound('drawer-open-stop');
          })()
        ]);
        worldContainer.dataset.drawer = 'open';
      }

      if (targetState === 'desk') {
        state = 'desk';
        worldContainer.dataset.fileLocation = 'in-transit';
        onSound('paper');
        scene.updateMatrixWorld(true);
        scene.attach(fileFolder);
        const startPos = fileFolder.position.clone();
        const liftPos = startPos.clone().add(V3(0, 1.15, 0));
        const startScale = fileFolder.scale.x;

        await Promise.all([
          animateCamera('desk', 2200),
          (async () => {
            await tween(600, t => fileFolder.position.lerpVectors(startPos, liftPos, easeInOutCubic(t)));
            await tween(1550, t => {
              const e = easeInOutCubic(t);
              fileFolder.position.lerpVectors(liftPos, V3(0, 1.49, 3), e);
              fileFolder.position.y += Math.sin(Math.PI * t) * 0.35;
              fileFolder.rotation.x = -Math.PI / 2 * e;
              fileFolder.scale.setScalar(MathUtils.lerp(startScale, 1, e));
            });
            onSound('book-place');
          })()
        ]);
        worldContainer.dataset.fileLocation = 'desk';
      }

      if (targetState === 'reading') {
        state = 'opening';
        onSound('paper');
        paperContainer.dataset.opening = 'true';
        const isMobile = window.innerWidth < 700;
        leftPageSurface.visible = isMobile;
        rightPageSurface.visible = !isMobile;
        leftPageSurface.element.inert = rightPageSurface.element.inert = true;
        leftPageSurface.position.x = isMobile ? 0 : -1.22;
        rightPageSurface.position.x = 0;

        buildTurningSheet(coverHtmlFace, isMobile ? emptyHtmlFace : leftPageSurface.element.innerHTML, 1);
        turningHingeGroup.position.x = -1.22;
        turningHingeGroup.rotation.y = 0;
        frontCoverMesh.visible = coverMesh.visible = false;
        cssRenderer.render(cssScene, camera);

        await Promise.all([
          animateCamera('reading', 1500),
          tween(1400, t => {
            const e = easeInOutCubic(t);
            folderFrontCover.rotation.y = -Math.PI * e;
            fileFolder.position.x = isMobile ? 0 : 1.22 * e;
            rightPageSurface.position.x = fileFolder.position.x;
            turningHingeGroup.position.x = fileFolder.position.x - 1.22;
            turningHingeGroup.rotation.y = -Math.PI * e;
            updateTurningBend(e, 1);
          })
        ]);

        removeTurningSheet();
        turningHingeGroup.position.x = 0;
        turningHingeGroup.rotation.y = 0;
        frontCoverMesh.visible = coverMesh.visible = true;
        fileFolder.visible = false;
        openDeskBed.visible = true;
        state = 'reading';
        leftPageSurface.visible = true;
        rightPageSurface.visible = !isMobile;
        leftPageSurface.element.inert = rightPageSurface.element.inert = false;
        adjustLayout();
        cssRenderer.render(cssScene, camera);
        delete paperContainer.dataset.opening;
      }

      if (targetState === 'entrance') {
        state = 'returning';
        leftPageSurface.visible = rightPageSurface.visible = false;
        openDeskBed.visible = false;
        fileFolder.visible = true;

        if (fileFolder.parent !== targetDrawerGroup) {
          const coverAngle = folderFrontCover.rotation.y;
          onSound('paper');
          await tween(550, t => {
            folderFrontCover.rotation.y = coverAngle * (1 - easeInOutCubic(t));
          });
          worldContainer.dataset.fileLocation = 'in-transit';
          scene.updateMatrixWorld(true);
          const worldDrawerPos = targetDrawerGroup.localToWorld(drawerFolderPos.clone());
          const liftDest = worldDrawerPos.clone().add(V3(0, 1.15, 0));
          const deskPos = fileFolder.position.clone();
          const curScale = fileFolder.scale.x;
          const curRotX = fileFolder.rotation.x;

          await Promise.all([
            animateCamera('rack', 1550),
            tween(1550, t => {
              const e = easeInOutCubic(t);
              fileFolder.position.lerpVectors(deskPos, liftDest, e);
              fileFolder.position.y += Math.sin(Math.PI * t) * 0.35;
              fileFolder.rotation.x = curRotX * (1 - e);
              fileFolder.scale.setScalar(MathUtils.lerp(curScale, folderScale, e));
            })
          ]);
          await tween(650, t => fileFolder.position.lerpVectors(liftDest, worldDrawerPos, easeInOutCubic(t)));
          targetDrawerGroup.attach(fileFolder);
          fileFolder.position.copy(drawerFolderPos);
          fileFolder.rotation.set(0, 0, 0);
          fileFolder.scale.setScalar(folderScale);
        }

        worldContainer.dataset.fileLocation = 'drawer';
        worldContainer.dataset.drawer = 'closing';
        onSound('drawer-close', reducedMotion ? 0.16 : 1.1);
        const curZ = targetDrawerGroup.position.z;
        await Promise.all([
          animateCamera('entrance', 1400),
          (async () => {
            await tween(1100, t => {
              targetDrawerGroup.position.z = curZ * (1 - easeInOutCubic(t));
            });
            onSound('drawer-close-stop');
          })()
        ]);
        worldContainer.dataset.drawer = 'closed';
        state = 'entrance';
      }
      return true;
    } finally {
      isBusy = false;
      onResize();
    }
  }

  // Page Turn Animation
  async function turnPage(leftHtml, rightHtml, direction = 1) {
    if (isBusy || state !== 'reading') return false;
    isBusy = true;
    paperContainer.setAttribute('aria-busy', 'true');
    paperContainer.dataset.turn = direction > 0 ? 'forward' : 'backward';
    leftPageSurface.element.inert = rightPageSurface.element.inert = true;
    const isMobile = window.innerWidth < 700;

    try {
      if (reducedMotion) {
        setHtmlIfChanged(leftPageSurface, leftHtml);
        setHtmlIfChanged(rightPageSurface, rightHtml);
      } else if (isMobile) {
        const startX = leftPageSurface.position.x;
        await tween(180, t => {
          const e = easeInOutCubic(t);
          leftPageSurface.element.style.opacity = String(1 - e);
          leftPageSurface.position.x = startX - direction * 0.12 * e;
        });
        setHtmlIfChanged(leftPageSurface, leftHtml);
        setHtmlIfChanged(rightPageSurface, rightHtml);
        await tween(260, t => {
          const e = 1 - Math.pow(1 - t, 3);
          leftPageSurface.element.style.opacity = String(e);
          leftPageSurface.position.x = startX + direction * 0.12 * (1 - e);
        });
      } else {
        buildTurningSheet(
          direction > 0 ? rightPageSurface.element.innerHTML : leftPageSurface.element.innerHTML,
          direction > 0 ? leftHtml : rightHtml,
          direction
        );
        turningHingeGroup.rotation.y = 0;
        turningHingeGroup.position.z = 0.0635;
        if (direction > 0) setHtmlIfChanged(rightPageSurface, rightHtml);
        else setHtmlIfChanged(leftPageSurface, leftHtml);
        cssRenderer.render(cssScene, camera);

        await tween(1100, t => {
          const e = (1 - Math.cos(Math.PI * t)) / 2;
          turningHingeGroup.rotation.y = -direction * Math.PI * e;
          updateTurningBend(e, direction);
          paperContainer.dataset.turnProgress = t.toFixed(3);
        });
      }
      return true;
    } finally {
      setHtmlIfChanged(leftPageSurface, leftHtml);
      setHtmlIfChanged(rightPageSurface, rightHtml);
      removeTurningSheet();
      leftPageSurface.element.style.opacity = '1';
      leftPageSurface.element.inert = rightPageSurface.element.inert = false;
      turningHingeGroup.rotation.y = 0;
      turningHingeGroup.position.z = 0.0635;
      isBusy = false;
      adjustLayout();
      onResize();
      cssRenderer.render(cssScene, camera);
      paperContainer.setAttribute('aria-busy', 'false');
      delete paperContainer.dataset.turn;
      delete paperContainer.dataset.turnProgress;
    }
  }

  // 2D Annotation Tracker in Entrance Mode
  const annotationElem = document.querySelector('#annotation');
  const annotationTargetPos = V3(0, -0.3, 1.25);
  const projectedDot = new Vector3();
  const annotationDot = annotationElem?.querySelector('.annotation-dot');

  function updateAnnotation() {
    if (!annotationElem) return;
    if (state !== 'entrance' || isBusy) {
      annotationElem.style.visibility = 'hidden';
      return;
    }
    projectedDot.copy(annotationTargetPos);
    targetDrawerGroup.localToWorld(projectedDot);
    projectedDot.project(camera);

    const screenX = (projectedDot.x + 1) * window.innerWidth / 2;
    const screenY = (1 - projectedDot.y) * window.innerHeight / 2;
    const inBounds = projectedDot.z >= -1 && projectedDot.z <= 1 && screenX > 10 && screenX < window.innerWidth - 10 && screenY > 90 && screenY < window.innerHeight - 55;

    annotationElem.style.visibility = inBounds ? 'visible' : 'hidden';
    if (annotationDot) {
      annotationDot.style.left = `${screenX}px`;
      annotationDot.style.top = `${screenY}px`;
    }
  }

  // Raycasting & Pointer Interaction
  const raycaster = new Raycaster();
  const pointerCoords = new Vector2();

  function getIntersectedObject(event) {
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    pointerCoords.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointerCoords, camera);
    const targetCandidates = state === 'entrance' ? interactiveDrawers : (state === 'rack' || state === 'desk' ? [frontCoverMesh, coverMesh, tabPlaque] : []);
    const hits = raycaster.intersectObjects(targetCandidates, false);
    return hits[0]?.object;
  }

  worldContainer.addEventListener('pointermove', e => {
    if (isBusy) return;
    hoveredObject = getIntersectedObject(e);
    worldContainer.style.cursor = hoveredObject ? 'pointer' : (state === 'entrance' ? 'grab' : 'default');
    if (!reducedMotion && state !== 'reading') {
      pointerOffset.x = (e.clientX / window.innerWidth - 0.5) * (pointerStart ? 0.8 : 0.22);
      pointerOffset.y = (e.clientY / window.innerHeight - 0.5) * 0.08;
    }
  });

  worldContainer.addEventListener('pointerdown', e => {
    pointerStart = { x: e.clientX, y: e.clientY };
  });

  worldContainer.addEventListener('pointerup', e => {
    if (pointerStart && Math.hypot(pointerStart.x - e.clientX, pointerStart.y - e.clientY) < 8 && getIntersectedObject(e) && !isBusy) {
      onAction();
    }
    pointerStart = null;
  });

  worldContainer.addEventListener('pointerleave', () => {
    pointerStart = null;
    pointerOffset = { x: 0, y: 0 };
    hoveredObject = null;
  });

  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    if (!isBusy) {
      camera.fov = state === 'reading' ? 28 : 43;
    }
    camera.updateProjectionMatrix();
    adjustLayout();
    if (!isBusy) {
      const dest = getCameraDestination(state === 'reading' ? 'reading' : (state === 'rack' ? 'rack' : (state === 'desk' ? 'desk' : 'entrance')));
      cameraCurrentPos.copy(dest.pos);
      cameraCurrentLook.copy(dest.look);
      camera.position.copy(cameraCurrentPos);
      cameraTarget.copy(cameraCurrentLook);
      camera.lookAt(cameraTarget);
    }
  }

  window.addEventListener('resize', onResize);
  onResize();

  renderer.domElement.addEventListener('webglcontextlost', e => {
    e.preventDefault();
    onError(new Error('3D context lost. Reading view available.'));
  });

  let lastTime = performance.now();
  function loop(time) {
    animId = requestAnimationFrame(loop);
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    for (let i = activeTweens.length - 1; i >= 0; i--) {
      const tw = activeTweens[i];
      const prog = Math.min(1, (time - tw.start) / tw.ms);
      tw.update(prog);
      if (prog >= 1) {
        activeTweens.splice(i, 1);
        tw.resolve();
      }
    }

    if (!document.hidden) {
      if (reducedMotion || isBusy) {
        camera.position.copy(cameraCurrentPos);
        cameraTarget.copy(cameraCurrentLook);
      } else {
        camera.position.lerp(cameraCurrentPos.clone().add(V3(pointerOffset.x, 0, pointerOffset.y)), 1 - Math.exp(-5 * dt));
        cameraTarget.lerp(cameraCurrentLook, 1 - Math.exp(-8 * dt));
      }
      camera.lookAt(cameraTarget);

      if (!reducedMotion) {
        dustParticles.rotation.y += dt * 0.003;
      }
      dustParticles.visible = !reducedMotion;
      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
      updateAnnotation();
    }
  }

  animId = requestAnimationFrame(loop);
  onReady();

  return {
    go: goToState,
    turn: turnPage,
    setPages,
    setMotion(reduced) {
      reducedMotion = reduced;
      pointerOffset = { x: 0, y: 0 };
    },
    getState: () => state,
    isBusy: () => isBusy,
    dispose() {
      cancelAnimationFrame(animId);
      renderer.dispose();
    }
  };
}
