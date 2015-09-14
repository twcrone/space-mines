Mine = {radius: 3, spacing: 10};

Mine.create = function (props) {
    var geometry = new THREE.SphereGeometry(Mine.radius);
    var material = new THREE.MeshLambertMaterial({color: 0xD3D3D3});
    var mesh = new THREE.Mesh(geometry, material);
    var mine = {mesh: mesh, isMine: false, mineCount: 0, x: props.x, y: props.y, z: props.z};

    mesh.position.x = props.x * props.spacing;
    mesh.position.y = props.y * props.spacing;
    mesh.position.z = props.z * props.spacing;
    mesh.castShadow = true;

    return mine;
};

Mine.createMinefield = function(size) {
    var mines = [];
    var minefield = {mines: mines, size: size * size * size, width: size};

    for(var x = 0; x < size; ++x) {
        for(var y = 0; y < size; ++y) {
            for (var z = 0; z < size; ++z) {
                var position = {x: x, y: y, z: z, spacing: Mine.spacing};
                var index = Mine.getIndex(x, y, z, size);
                if(mines[index] != undefined) {
                    alert(index + " is already assigned!");
                }
                mines[index] = Mine.create(position);
            }
        }
    }

    Mine.addActiveMine(minefield, 0, 2, 1);
    Mine.addActiveMine(minefield, 1, 0, 4);
    Mine.addActiveMine(minefield, 3, 3, 3);
    Mine.addActiveMine(minefield, 3, 2, 3);
    Mine.addActiveMine(minefield, 3, 4, 4);

    return minefield;
};

Mine.addActiveMine = function(minefield, x, y, z) {
    var activeMine = Mine.getMine(minefield, x, y, z);
    activeMine.isMine = true;
    Mine.incrementNeighborMineCount(minefield, activeMine);
}

Mine.getIndex = function(x, y, z, width) {
    if(x < 0 || y < 0 || z < 0) {
        return -1;
    }
    if(x >= width || y >= width || z >= width) {
        return -1;
    }
    return x + y * width + z * width * width;
};

Mine.getCenter = function(minefield) {
    var index = Math.floor(minefield.mines.length / 2);
    return minefield.mines[index].mesh.position
};

Mine.getMine = function(minefield, x, y, z) {
    var index = Mine.getIndex(x, y, z, minefield.width);
    if(index == -1) {
        return null;
    }
    return minefield.mines[index];
};

Mine.findByMesh = function(minefield, mineMesh) {
    var mine;
    for (var i = 0; i < minefield.mines.length; ++i) {
        if (minefield.mines[i].mesh == mineMesh) {
            mine = minefield.mines[i];
            break;
        }
    }
    return mine;
};

Mine.select = function(minefield, mineMesh) {
    var mine = Mine.findByMesh(minefield, mineMesh);
    if(mine == undefined) {
        console.log("Couldn't fined " + mineMesh);
    }

    if(mine.isMine) {
        mine.mesh.material = new THREE.MeshBasicMaterial({color: 0xffffff});
    }
    else if(mine.mineCount == 0) {
        mine.mesh.visible = false;
        Mine.checkNeighbors(minefield, mine);
    }
    else {
        Mine.revealIfNotMine(minefield, mine.x, mine.y, mine.z);
    }
};

Mine.checkNeighbors = function(minefield, mine) {
    //
    Mine.revealIfNotMine(minefield, mine.x -1, mine.y + 1, mine.z + 1);
    Mine.revealIfNotMine(minefield, mine.x, mine.y + 1, mine.z + 1);
    Mine.revealIfNotMine(minefield, mine.x +1, mine.y + 1, mine.z + 1);

    Mine.revealIfNotMine(minefield, mine.x -1, mine.y, mine.z + 1);
    Mine.revealIfNotMine(minefield, mine.x, mine.y, mine.z + 1);
    Mine.revealIfNotMine(minefield, mine.x +1, mine.y, mine.z + 1);

    Mine.revealIfNotMine(minefield, mine.x -1, mine.y - 1, mine.z + 1);
    Mine.revealIfNotMine(minefield, mine.x, mine.y - 1, mine.z + 1);
    Mine.revealIfNotMine(minefield, mine.x +1, mine.y - 1, mine.z + 1);

    //
    Mine.revealIfNotMine(minefield, mine.x -1, mine.y + 1, mine.z);
    Mine.revealIfNotMine(minefield, mine.x, mine.y + 1, mine.z);
    Mine.revealIfNotMine(minefield, mine.x +1, mine.y + 1, mine.z);

    Mine.revealIfNotMine(minefield, mine.x -1, mine.y, mine.z);
    Mine.revealIfNotMine(minefield, mine.x +1, mine.y, mine.z);

    Mine.revealIfNotMine(minefield, mine.x -1, mine.y - 1, mine.z);
    Mine.revealIfNotMine(minefield, mine.x, mine.y - 1, mine.z);
    Mine.revealIfNotMine(minefield, mine.x +1, mine.y - 1, mine.z);

    //
    Mine.revealIfNotMine(minefield, mine.x -1, mine.y + 1, mine.z - 1);
    Mine.revealIfNotMine(minefield, mine.x, mine.y + 1, mine.z - 1);
    Mine.revealIfNotMine(minefield, mine.x +1, mine.y + 1, mine.z - 1);

    Mine.revealIfNotMine(minefield, mine.x -1, mine.y, mine.z - 1);
    Mine.revealIfNotMine(minefield, mine.x, mine.y, mine.z - 1);
    Mine.revealIfNotMine(minefield, mine.x +1, mine.y, mine.z - 1);

    Mine.revealIfNotMine(minefield, mine.x -1, mine.y - 1, mine.z - 1);
    Mine.revealIfNotMine(minefield, mine.x, mine.y - 1, mine.z - 1);
    Mine.revealIfNotMine(minefield, mine.x +1, mine.y - 1, mine.z - 1);
};

Mine.incrementMineCount = function(minefield, x, y, z) {
    var mine = Mine.getMine(minefield, x, y, z);
    if(mine != null) {
        mine.mineCount++;
    }
}

Mine.incrementNeighborMineCount = function(minefield, mine) {
    //
    Mine.incrementMineCount(minefield, mine.x -1, mine.y + 1, mine.z + 1);
    Mine.incrementMineCount(minefield, mine.x, mine.y + 1, mine.z + 1);
    Mine.incrementMineCount(minefield, mine.x +1, mine.y + 1, mine.z + 1);

    Mine.incrementMineCount(minefield, mine.x -1, mine.y, mine.z + 1);
    Mine.incrementMineCount(minefield, mine.x, mine.y, mine.z + 1);
    Mine.incrementMineCount(minefield, mine.x +1, mine.y, mine.z + 1);

    Mine.incrementMineCount(minefield, mine.x -1, mine.y - 1, mine.z + 1);
    Mine.incrementMineCount(minefield, mine.x, mine.y - 1, mine.z + 1);
    Mine.incrementMineCount(minefield, mine.x +1, mine.y - 1, mine.z + 1);

    //
    Mine.incrementMineCount(minefield, mine.x -1, mine.y + 1, mine.z);
    Mine.incrementMineCount(minefield, mine.x, mine.y + 1, mine.z);
    Mine.incrementMineCount(minefield, mine.x +1, mine.y + 1, mine.z);

    Mine.incrementMineCount(minefield, mine.x -1, mine.y, mine.z);
    Mine.incrementMineCount(minefield, mine.x +1, mine.y, mine.z);

    Mine.incrementMineCount(minefield, mine.x -1, mine.y - 1, mine.z);
    Mine.incrementMineCount(minefield, mine.x, mine.y - 1, mine.z);
    Mine.incrementMineCount(minefield, mine.x +1, mine.y - 1, mine.z);

    //
    Mine.incrementMineCount(minefield, mine.x -1, mine.y + 1, mine.z - 1);
    Mine.incrementMineCount(minefield, mine.x, mine.y + 1, mine.z - 1);
    Mine.incrementMineCount(minefield, mine.x +1, mine.y + 1, mine.z - 1);

    Mine.incrementMineCount(minefield, mine.x -1, mine.y, mine.z - 1);
    Mine.incrementMineCount(minefield, mine.x, mine.y, mine.z - 1);
    Mine.incrementMineCount(minefield, mine.x +1, mine.y, mine.z - 1);

    Mine.incrementMineCount(minefield, mine.x -1, mine.y - 1, mine.z - 1);
    Mine.incrementMineCount(minefield, mine.x, mine.y - 1, mine.z - 1);
    Mine.incrementMineCount(minefield, mine.x +1, mine.y - 1, mine.z - 1);
}

Mine.revealIfNotMine = function(minefield, x, y, z) {
    var mine = Mine.getMine(minefield, x, y, z);

    if(mine == null || mine.isMine) return;

    if(mine.mineCount == 0 && mine.mesh.visible == true) {
        mine.mesh.visible = false;
        Mine.checkNeighbors(minefield, mine);
    }
    else if(mine.mineCount == 1) {
        mine.mesh.material = new THREE.MeshLambertMaterial({color: 0x0000FF});
    }
    else if(mine.mineCount == 2) {
        mine.mesh.material = new THREE.MeshLambertMaterial({color: 0x00FF00});
    }
    else if(mine.mineCount == 3) {
        mine.mesh.material = new THREE.MeshLambertMaterial({color: 0xFFFF00});
    }
    else if(mine.mineCount == 3) {
        mine.mesh.material = new THREE.MeshLambertMaterial({color: 0xFFA500});
    }
    else {
        mine.mesh.material = new THREE.MeshLambertMaterial({color: 0xFF0000});
    }
};
