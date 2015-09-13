var scene;
var camera;
var renderer;

function createSpotlight() {
    var spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(-10, 2, 30);
    spotlight.castShadow = true;
    return spotlight;
}

function createCameraLookingAt(position) {
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.x = -10;
    camera.position.y = 0;
    camera.position.z = 30;
    camera.lookAt(position);

    return camera;
}

function createRenderer() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x444444, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    return renderer;
}

function renderScene() {
    //scene.traverse(function(obj) {
    //    if(obj instanceof THREE.Mesh) {
    //        obj.animate();
    //    }
    //});

    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
}

function init() {

    scene = new THREE.Scene();
    camera = createCameraLookingAt(scene.position);
    renderer = createRenderer();
    var spotlight = createSpotlight();
    var mine = Mine.create({x: 0, y: 0});

    scene.add(camera);
    scene.add(spotlight);
    scene.add(mine.mesh);

    document.getElementById("WebGL-output")
        .appendChild(renderer.domElement);

    renderScene(renderer, scene, camera);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize, false);
window.onload = init;
