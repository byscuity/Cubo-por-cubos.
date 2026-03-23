import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- CONFIGURAÇÃO VISUAL PRINCIPAL ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);
scene.fog = new THREE.FogExp2(0x050510, 0.008);

// Câmera
const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(6.2, 5.5, 7.8);
camera.lookAt(0, 0, 0);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controles orbitais
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.rotateSpeed = 1.2;
controls.zoomSpeed = 1.2;
controls.enableZoom = true;
controls.enablePan = true;
controls.panSpeed = 0.8;
controls.target.set(0, 0, 0);

// --- PARÂMETROS DOS 27 CUBOS ---
const cubeSize = 1.0;
const spacing = 0.085;
const step = cubeSize + spacing;
const positions = [-1, 0, 1];

// Materiais
const resilientMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f0ff,
    roughness: 0.22,
    metalness: 0.88,
    emissive: 0x331a66,
    emissiveIntensity: 0.32,
    flatShading: false
});

const flatMaterial = new THREE.MeshStandardMaterial({
    color: 0xfefefe,
    roughness: 0.7,
    metalness: 0.05,
    emissive: 0x000000,
    flatShading: true
});

const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x2a2a2a });

const cubes = [];

// Estrelas de fundo
const starGeometry = new THREE.BufferGeometry();
const starCount = 800;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    starPositions[i*3] = (Math.random() - 0.5) * 200;
    starPositions[i*3+1] = (Math.random() - 0.5) * 100;
    starPositions[i*3+2] = (Math.random() - 0.5) * 80 - 40;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xaaccff, size: 0.08, transparent: true, opacity: 0.5 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Criar os 27 cubos
positions.forEach(x => {
    positions.forEach(y => {
        positions.forEach(z => {
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cube = new THREE.Mesh(geometry, resilientMaterial.clone());
            cube.position.set(x * step, y * step, z * step);
            scene.add(cube);
            
            const edgesGeo = new THREE.EdgesGeometry(geometry);
            const wireframe = new THREE.LineSegments(edgesGeo, edgeMaterial);
            wireframe.position.copy(cube.position);
            scene.add(wireframe);
            
            cube.userData = {
                wireframe: wireframe,
                originalMat: resilientMaterial,
                flatMat: flatMaterial,
                isResilient: true
            };
            cubes.push(cube);
        });
    });
});

// Elementos de apoio
const gridHelper = new THREE.GridHelper(14, 20, 0x88aaff, 0x335588);
gridHelper.position.y = -2.4;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.2;
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(4);
axesHelper.material.transparent = true;
axesHelper.material.opacity = 0.12;
scene.add(axesHelper);

// Iluminação
const ambientLight = new THREE.AmbientLight(0x404064, 0.65);
const mainLight = new THREE.DirectionalLight(0xffffff, 1.3);
mainLight.position.set(4, 6, 3);
mainLight.castShadow = true;
mainLight.receiveShadow = false;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;

const fillLight = new THREE.PointLight(0xddaa66, 0.55);
fillLight.position.set(-2.5, 1.8, 3.2);

const backLight = new THREE.PointLight(0x6688ff, 0.5);
backLight.position.set(1.5, 2, -4);

const rimLight = new THREE.PointLight(0xff88aa, 0.45);
rimLight.position.set(-2, 3.5, -3);

const extraFill = new THREE.HemisphereLight(0x88aaff, 0x332233, 0.35);

scene.add(ambientLight);
scene.add(mainLight);
scene.add(fillLight);
scene.add(backLight);
scene.add(rimLight);
scene.add(extraFill);

// Efeitos adicionais
const centerGlow = new THREE.PointLight(0x8855ff, 0.35);
centerGlow.position.set(0, 0, 0);
scene.add(centerGlow);

const groundRing = new THREE.Mesh(
    new THREE.RingGeometry(2.2, 3.8, 32),
    new THREE.MeshStandardMaterial({ color: 0x336699, metalness: 0.4, roughness: 0.7, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
);
groundRing.rotation.x = -Math.PI / 2;
groundRing.position.y = -1.9;
scene.add(groundRing);

// Partículas
const particleCount = 400;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    const radius = 2.4 + Math.random() * 1.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    particlePositions[i*3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i*3+2] = radius * Math.cos(phi);
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.04, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Estado e controle de alternância
let resilienceEnabled = true;
const statusDiv = document.getElementById('status');
const toggleBtn = document.getElementById('toggleBtn');

function toggleResilience() {
    resilienceEnabled = !resilienceEnabled;
    
    cubes.forEach(cube => {
        cube.material = resilienceEnabled ? resilientMaterial : flatMaterial;
    });
    
    if (resilienceEnabled) {
        mainLight.intensity = 1.3;
        fillLight.intensity = 0.55;
        backLight.intensity = 0.5;
        rimLight.intensity = 0.45;
        ambientLight.intensity = 0.65;
        extraFill.intensity = 0.35;
        statusDiv.innerHTML = '💎 MODO RESILIENTE • Metal + Brilho 💎';
        statusDiv.style.color = '#ff99cc';
        statusDiv.style.background = 'rgba(0,0,0,0.7)';
        toggleBtn.style.background = 'linear-gradient(135deg, rgba(255,51,102,0.85), rgba(200,40,80,0.9))';
        toggleBtn.style.borderColor = 'rgba(255,200,220,0.6)';
        starMaterial.color.setHex(0xcceeff);
        starMaterial.size = 0.09;
    } else {
        mainLight.intensity = 0.7;
        fillLight.intensity = 0.4;
        backLight.intensity = 0.3;
        rimLight.intensity = 0.2;
        ambientLight.intensity = 0.8;
        extraFill.intensity = 0.5;
        statusDiv.innerHTML = '⬜ MODO BRANCO LISO • Estética Pura ⬜';
        statusDiv.style.color = '#dddddd';
        statusDiv.style.background = 'rgba(30,30,50,0.8)';
        toggleBtn.style.background = 'linear-gradient(135deg, rgba(80,80,100,0.9), rgba(40,40,60,0.95))';
        toggleBtn.style.borderColor = 'rgba(255,255,255,0.3)';
        starMaterial.color.setHex(0x88aadd);
        starMaterial.size = 0.07;
    }
}

toggleBtn.addEventListener('click', toggleResilience);

// Animações
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    time += 0.012;
    
    const intensityPulse = 0.28 + Math.sin(time * 1.8) * 0.08;
    if (resilienceEnabled) {
        centerGlow.intensity = 0.32 + Math.sin(time * 2.2) * 0.1;
        stars.rotation.y += 0.0008;
        stars.rotation.x = Math.sin(time * 0.2) * 0.1;
    } else {
        centerGlow.intensity = 0.18 + Math.sin(time * 1.5) * 0.06;
        stars.rotation.y += 0.0004;
        stars.rotation.x = Math.sin(time * 0.15) * 0.05;
    }
    
    renderer.render(scene, camera);
}

animate();

function animateParticles() {
    requestAnimationFrame(animateParticles);
    particles.rotation.y += 0.003;
    particles.rotation.x += 0.001;
    particles.rotation.z += 0.002;
    stars.rotation.z += 0.0003;
}

animateParticles();

// Evento de resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Efeito de cor nas partículas ao alternar
toggleBtn.addEventListener('click', () => {
    if (resilienceEnabled) {
        particleMat.color.setHex(0xffaa88);
        particleMat.size = 0.045;
        setTimeout(() => {
            if (resilienceEnabled) particleMat.color.setHex(0x88aaff);
            else particleMat.color.setHex(0xccddff);
        }, 400);
    } else {
        particleMat.color.setHex(0xaaccff);
        particleMat.size = 0.035;
        setTimeout(() => {
            if (!resilienceEnabled) particleMat.color.setHex(0xcceeff);
            else particleMat.color.setHex(0x88aaff);
        }, 400);
    }
});

// Garantir estado inicial correto
if (resilienceEnabled) {
    mainLight.intensity = 1.3;
    fillLight.intensity = 0.55;
    backLight.intensity = 0.5;
    rimLight.intensity = 0.45;
    ambientLight.intensity = 0.65;
    statusDiv.innerHTML = '💎 MODO RESILIENTE • Metal + Brilho 💎';
    statusDiv.style.color = '#ff99cc';
    toggleBtn.style.background = 'linear-gradient(135deg, rgba(255,51,102,0.85), rgba(200,40,80,0.9))';
}

console.log('✨ 27 cubos ativos | Arestas #2a2a2a | Modo resiliente ativo');
