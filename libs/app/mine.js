Mine = {};

Mine.create = function (props) {
    var geometry = new THREE.SphereGeometry(10);
    var material = new THREE.MeshLambertMaterial({color: 0xD3D3D3});
    var mine = new THREE.Mesh(geometry, material);

    mine.position.x = props.x;
    mine.position.y = props.y;
    mine.position.z = -2;
    mine.castShadow = true;

    return mine;
};

