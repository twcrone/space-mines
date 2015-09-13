Mine = {radius: 3, spacing: 10};

Mine.create = function (props) {
    var geometry = new THREE.SphereGeometry(Mine.radius);
    var material = new THREE.MeshLambertMaterial({color: 0xD3D3D3});
    var mesh = new THREE.Mesh(geometry, material);
    var mine = {mesh: mesh};

    mesh.position.x = props.x;
    mesh.position.y = props.y;
    mesh.position.z = props.z;
    mesh.castShadow = true;

    return mine;
};

Mine.createMinefield = function(size) {
    var mines = [];
    var minefield = {mines: mines, size: size * size * size};

    for(var x = 0; x < size; ++x) {
        for(var y = 0; y < size; ++y) {
            for (var z = 0; z < size; ++z) {
                var position = {x: x * Mine.spacing, y: y * Mine.spacing, z: z * Mine.spacing   };
                var index = Mine.getIndex(x, y, z, size);
                if(mines[index] != undefined) {
                    alert(index + " is already assigned!");
                }
                mines[index] = Mine.create(position);
            }
        }
    }
    return minefield;
};

Mine.getIndex = function(x, y, z, size) {
    return x + y * size + z * size * size;
};