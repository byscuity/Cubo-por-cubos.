import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- CONFIGURAÇÃO VISUAL PRINCIPAL ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510); // Fundo escuro sem efeitos

// Câmera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(6, 5, 8);
camera.lookAt(0, 0, 0);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controles orbitais
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;
controls.target.set(0, 0, 0);

// --- PARÂMETROS DOS 27 CUBOS ---
const cubeSize = 1.0;
const spacing = 0.085;
const step = cubeSize + spacing;
const positions = [-1, 0, 1];

// Material BRANCO (padrão)
const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.05,
    emissive: 0x000000
});

// Material METALIZADO (opcional para alternar)
const metallicMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f0ff,
    roughness: 0.22,
    metalness: 0.88,
    emissive: 0x331a66,
    emissiveIntensity: 0.32
});

// Material das arestas - PRETO
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

const cubes = [];

// Criar os 27 cubos BRANCOS com arestas PRETAS
positions.forEach(x => {
    positions.forEach(y => {
        positions.forEach(z => {
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cube = new THREE.Mesh(geometry, whiteMaterial.clone());
            cube.position.set(x * step, y * step, z * step);
            scene.add(cube);
            
            // Adicionar arestas PRETAS
            const edgesGeo = new THREE.EdgesGeometry(geometry);
            const wireframe = new THREE.LineSegments(edgesGeo, edgeMaterial);
            wireframe.position.copy(cube.position);
            scene.add(wireframe);
            
            cube.userData = {
                wireframe: wireframe,
                whiteMaterial: whiteMaterial,
                metallicMaterial: metallicMaterial,
                isWhite: true
            };
            cubes.push(cube);
        });
    });
});

// Iluminação simples e uniforme (sem efeitos dramáticos)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(3, 5, 2);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-2, 1, 3);

scene.add(ambientLight);
scene.add(mainLight);
scene.add(fillLight);

// Estado e controle de alternância (inicia em modo BRANCO)
let isWhiteMode = true;
const statusDiv = document.getElementById('status');
const toggleBtn = document.getElementById('toggleBtn');

function toggleMode() {
    isWhiteMode = !isWhiteMode;
    
    cubes.forEach(cube => {
        cube.material = isWhiteMode ? whiteMaterial : metallicMaterial;
    });
    
    if (isWhiteMode) {
        // Modo BRANCO
        statusDiv.innerHTML = '⬜ MODO BRANCO LISO ⬜';
        statusDiv.style.color = '#ffffff';
        toggleBtn.innerHTML = '✨ ALTERNAR PARA METALIZADO ✨';
        toggleBtn.style.background = 'linear-gradient(135deg, rgba(30,30,40,0.9), rgba(15,15,25,0.95))';
        ambientLight.intensity = 0.7;
        mainLight.intensity = 0.8;
        fillLight.intensity = 0.4;
    } else {
        // Modo METALIZADO
        statusDiv.innerHTML = '✨ MODO METALIZADO ✨';
        statusDiv.style.color = '#ff99cc';
        toggleBtn.innerHTML = '⬜ ALTERNAR PARA BRANCO LISO ⬜';
        toggleBtn.style.background = 'linear-gradient(135deg, rgba(255,51,102,0.85), rgba(200,40,80,0.9))';
        ambientLight.intensity = 0.65;
        mainLight.intensity = 1.0;
        fillLight.intensity = 0.5;
    }
}

toggleBtn.addEventListener('click', toggleMode);

// Animação simples (apenas atualiza controles)
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Evento de resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

console.log('✅ 27 cubos BRANCOS com arestas PRETAS | Sem efeitos de profundidade | Clique no botão para alternar');
