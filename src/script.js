// IMPORTS
import './main.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";

// DRACO LOADER SETUP
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)
// ... [Rest of your imports and initializations]

// CREATE SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color('#c8f0f9')

// RENDERER CONFIGURATION
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// CAMERA CONFIGURATION
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(34,16,-20);
camera.lookAt(0, 0, 0);

// REGISTER GSAP's ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Scroll container
const scrollContainer = document.querySelector('#scrollContainer');

// Animate camera based on overall scroll progress
gsap.to(camera.position, {
    x: -30,  // Further move in X direction.
    y: 20,   // Higher vertical move.
    z: -40,  // Further move in Z direction.
    ease: 'none',
    scrollTrigger: {
        trigger: scrollContainer,
        start: "top top",
        end: "50% 50%",
        scrub: 0.5 // Increased scrub duration for a slower animation
    }
});



// HANDLE RESIZE
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(2);
});

// LIGHTS SETUP
const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82);
scene.add(ambient);
const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96);
sunLight.position.set(-69, 44, 14);
scene.add(sunLight);

// LOADING GLB/GLTF MODEL
loader.load('models/gltf/starter-scene.glb', function (gltf) {
    scene.add(gltf.scene);
});

// RENDER LOOP
function renderLoop() {
    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
}
renderLoop();


import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
const gui = new GUI()

// create parameters for GUI
var params = {color: sunLight.color.getHex(), color2: ambient.color.getHex(), color3: scene.background.getHex()}

// create a function to be called by GUI
const update = function () {
	var colorObj = new THREE.Color( params.color )
	var colorObj2 = new THREE.Color( params.color2 )
	var colorObj3 = new THREE.Color( params.color3 )
	sunLight.color.set(colorObj)
	ambient.color.set(colorObj2)
	scene.background.set(colorObj3)
}

//////////////////////////////////////////////////
//// GUI CONFIG
gui.add(sunLight, 'intensity').min(0).max(10).step(0.0001).name('Dir intensity')
gui.add(sunLight.position, 'x').min(-100).max(100).step(0.00001).name('Dir X pos')
gui.add(sunLight.position, 'y').min(0).max(100).step(0.00001).name('Dir Y pos')
gui.add(sunLight.position, 'z').min(-100).max(100).step(0.00001).name('Dir Z pos')
gui.add(camera.position, 'x').min(-100).max(100).step(0.00001).name('Dir camera  x')
gui.add(camera.position, 'y').min(-100).max(100).step(0.00001).name('Dir camera  y')
gui.add(camera.position, 'z').min(-100).max(100).step(0.00001).name('Dir camera  z')
gui.add(camera.rotation, 'x').min(-100).max(100).step(0.00001).name('Dir camera  rot x')
gui.add(camera.rotation, 'y').min(-100).max(100).step(0.00001).name('Dir camera  rot y')
gui.add(camera.rotation, 'z').min(-100).max(100).step(0.00001).name('Dir camera  rot z')
gui.addColor(params,'color').name('Dir color').onChange(update)
gui.addColor(params,'color2').name('Amb color').onChange(update)
gui.add(ambient, 'intensity').min(0).max(10).step(0.001).name('Amb intensity')
gui.addColor(params,'color3').name('BG color').onChange(update)

//////////////////////////////////////////////////
//// ON MOUSE MOVE TO GET CAMERA POSITION
document.addEventListener('mousemove', (event) => {
    event.preventDefault()

    console.log(camera.position)

}, false)