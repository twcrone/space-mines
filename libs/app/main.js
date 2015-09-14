var scene;
var camera;
var flyControls;
var renderer;
var minefield;
var mineMeshes = [];
var difficulty;

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function createSpotlight() {
    var spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(10, 10, 100);
    spotlight.castShadow = true;
    return spotlight;
}

function createCameraLookingAt(position) {
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(25, 25, 100);
    camera.lookAt(position);

    flyControls = new THREE.FlyControls(camera);

    flyControls.movementSpeed = 25;
    flyControls.domElement = document.querySelector("#WebGL-output");
    flyControls.rollSpeed = Math.PI / 24;
    flyControls.autoForward = false;
    flyControls.dragToLook = true;

    return camera;
}

function createRenderer() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x444444, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    return renderer;
}

var clock = new THREE.Clock();

function renderScene() {
    var delta = clock.getDelta();
    flyControls.update(delta);

    //scene.traverse(function(obj) {
    //    if(obj instanceof THREE.Mesh) {
    //        obj.animate();
    //    }
    //});

    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
}

function addMinefieldTo(scene) {
    minefield = Mine.createMinefield(difficulty);
    for(var i = 0; i < minefield.size; ++i) {
        var mesh = minefield.mines[i].mesh;
        scene.add(mesh);
        mineMeshes.push(mesh);
    }
}

function init() {

    difficulty = get("difficulty");

    scene = new THREE.Scene();
    addMinefieldTo(scene);
    camera = createCameraLookingAt(Mine.getCenter(minefield));
    renderer = createRenderer();

    var spotlight = createSpotlight();
    var ambientLight = new THREE.AmbientLight(0x383838);


    scene.add(ambientLight);
    scene.add(camera);
    scene.add(spotlight);

    document.onmousedown = onMouseDown;

    document.getElementById("WebGL-output")
        .appendChild(renderer.domElement);

    renderScene(renderer, scene, camera);
}

function onMouseDown(event) {
    var vector = new THREE.Vector3();

    vector.set(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        -( event.clientY / window.innerHeight ) * 2 + 1,
        0.5);

    vector.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(mineMeshes);
    var selected;

    for(var i = 0; i < intersects.length; ++i) {
        selected = intersects[i].object;
        if(selected.visible) {
            if(event.ctrlKey || event.button != 0) {
                Mine.mark(minefield, selected);
            }
            else {
                Mine.select(minefield, selected);
            }
            break;
        }
    }
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize, false);
window.onload = init;
