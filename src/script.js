import "./style.css";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import * as dat from "dat.gui";

// Debug
// const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.6,
	1200
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Make Canvas Responsive
window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

// Light
const lights = [];
const lightHelpers = [];

const lightValues = [
	{ colour: 0x4542f5, intensity: 8, dist: 12, x: 1, y: 0, z: 8 },
	{ colour: 0x8142f5, intensity: 6, dist: 12, x: -2, y: 1, z: -10 },
	{ colour: 0x6d22b3, intensity: 3, dist: 10, x: 0, y: 10, z: 1 },
	{ colour: 0x251c8a, intensity: 6, dist: 12, x: 0, y: -10, z: -1 },
	{ colour: 0x9e42f5, intensity: 6, dist: 12, x: 10, y: 3, z: 0 },
	{ colour: 0x3e368f, intensity: 6, dist: 12, x: -10, y: -1, z: 0 },
];

for (let i = 0; i < lightValues.length; i++) {
	lights[i] = new THREE.PointLight(
		lightValues[i]["colour"],
		lightValues[i]["intensity"],
		lightValues[i]["dist"]
	);
	lights[i].position.set(
		lightValues[i]["x"],
		lightValues[i]["y"],
		lightValues[i]["z"]
	);
	scene.add(lights[i]);

	lightHelpers[i] = new THREE.PointLightHelper(lights[i], 0.5);
	scene.add(lightHelpers[i]);
}

// Create Box
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.rotation.set(40, 0, 40);
scene.add(boxMesh);

// Create spheres
const sphereMeshes = [];
const sphereGeometry = new THREE.SphereGeometry(0.2, 64, 64);
const sphareMaterial = new THREE.MeshLambertMaterial({ color: 0xab132c });

for (let i = 0; i < 4; i++) {
	sphereMeshes[i] = new THREE.Mesh(sphereGeometry, sphareMaterial);
	sphereMeshes[i].position.set(0, 0, 0);
	scene.add(sphereMeshes[i]);
}

// Trigonometry Constants for Orbital Paths
let theta = 0;
const dTheta = (2 * Math.PI) / 100;

// Trackball Controls for Camera
const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;
controls.dynamicDampingFactor = 0.15;

// Rendening (!important)
const rendering = () => {
	requestAnimationFrame(rendering);

	scene.rotation.z -= 0.005;
	scene.rotation.x -= -0.01;
	theta += dTheta;

	// Update trackball controls
	controls.update();

	// Store trig functions for sphere orbits
	const trigs = [
		{
			x: Math.cos(theta * 1.05),
			y: Math.sin(theta * 1.05),
			z: Math.cos(theta * 1.05),
			r: 2,
		},
		{
			x: Math.cos(theta * 0.8),
			y: Math.sin(theta * 0.8),
			z: Math.sin(theta * 0.8),
			r: 2.25,
		},
		{
			x: Math.cos(theta * 1.25),
			y: Math.cos(theta * 1.25),
			z: Math.sin(theta * 1.25),
			r: 2.5,
		},
		{
			x: Math.sin(theta * 0.6),
			y: Math.cos(theta * 0.6),
			z: Math.sin(theta * 0),
			r: 2.75,
		},
	];

	for (let i = 0; i < 4; i++) {
		sphereMeshes[i].position.x = trigs[i]["r"] * trigs[i]["x"];
		sphereMeshes[i].position.y = trigs[i]["r"] * trigs[i]["y"];
		sphereMeshes[i].position.z = trigs[i]["r"] * trigs[i]["z"];
	}

	renderer.render(scene, camera);
};

rendering();
