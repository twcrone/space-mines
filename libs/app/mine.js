Mine = {};

Mine.create = function (props) {
    var geometry = new THREE.SphereGeometry(10);
    var material = new THREE.MeshLambertMaterial({color: 0xD3D3D3});
    var mesh = new THREE.Mesh(geometry, material);
    var mine = {mesh: mesh};

    mesh.position.x = props.x;
    mesh.position.y = props.y;
    mesh.position.z = -2;
    mesh.castShadow = true;

    return mine;
};

