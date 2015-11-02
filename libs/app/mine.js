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

Mine.createMinefield = function(difficulty) {
    var size = Mine.getSize(difficulty);
    var mineCount = Mine.getMineCount(difficulty);
    var mines = [];
    var minefield = {mines: mines, size: size * size * size, width: size, gameOver: false};

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

    Mine.addActiveMinesRandomly(minefield, mineCount);

    return minefield;
};

Mine.getSize = function(difficulty) {
    if(difficulty == "extreme") {
        return 6;
    }
    else if(difficulty == "hard"  || difficulty == "very") {
        return 5;
    }
    else {
        return 4;
    }
};

Mine.getMineCount = function(difficulty) {
    if(difficulty == "extreme") {
        return 6;
    }
    else if(difficulty == "average") {
        return 3;
    }
    else if(difficulty == "hard") {
        return 4;
    }
    else if(difficulty == "very") {
        return 5;
    }
    else {
        return 2;
    }
};

Mine.addActiveMinesRandomly = function(minefield, count) {
    for(var i = 0; i < count; ++i) {
        Mine.addActiveMineRandomly(minefield);
    }
};

Mine.addActiveMineRandomly = function(minefield) {
    var x = Math.floor(Math.random() * minefield.width);
    var y = Math.floor(Math.random() * minefield.width);
    var z = Math.floor(Math.random() * minefield.width);
    var added = Mine.addActiveMine(minefield, x, y, z);
    if(!added) {
        Mine.addActiveMineRandomly(minefield);
    }
};

Mine.addActiveMine = function(minefield, x, y, z) {
    var activeMine = Mine.getMine(minefield, x, y, z);
    if(activeMine.isMine == false) {
        activeMine.isMine = true;
        Mine.incrementNeighborMineCount(minefield, activeMine);
        return true;
    }
    return false;
};

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
    if(minefield.gameOver) return;

    var mine = Mine.findByMesh(minefield, mineMesh);
    if(mine == undefined) {
        console.log("Couldn't fined " + mineMesh);
    }
    if(mine.marked) {
        return;  // must be unmarked first
    }

    if(mine.isMine) {
        Mine.revealAll(minefield);
        minefield.gameOver = true;
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
};

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
};

Mine.revealIfNotMine = function(minefield, x, y, z) {
    var mine = Mine.getMine(minefield, x, y, z);

    if(mine == null || mine.isMine) return;

    if(mine.mineCount == 0 && mine.mesh.visible == true) {
        mine.mesh.visible = false;
        Mine.checkNeighbors(minefield, mine);
    }
    else {
        Mine.reveal(mine);
    }
};

Mine.revealAll = function(minefield) {
    var mines = minefield.mines;
    for(var i = 0; i < mines.length; ++i) {
        Mine.reveal(mines[i]);
    }
};

Mine.reveal = function(mine) {
    if(mine.isMine) {
        mine.mesh.material = new THREE.MeshBasicMaterial({color: 0xFF0000});
    }
    else if(mine.mineCount == 0) {
        mine.mesh.visible = false;
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
    else if(mine.mineCount == 4) {
        mine.mesh.material = new THREE.MeshLambertMaterial({color: 0xFFA500});
    }
    else {
        mine.mesh.material = new THREE.MeshLambertMaterial({color: 0xFF0000});
    }
    mine.revealed = true;
};

Mine.mark = function(minefield, mineMesh) {
    if(minefield.gameOver) return;

    var mine = Mine.findByMesh(minefield, mineMesh);
    if(mine == undefined) {
        console.log("Couldn't find " + mineMesh);
        return;
    }
    if(mine.revealed) {
        return;
    }

    if(mine.marked) {
        mine.marked = false;
        mine.mesh.material = new THREE.MeshLambertMaterial({color: 0xD3D3D3});
    }
    else {
        mine.marked = true;
        mine.mesh.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    }

    if(Mine.allActiveMinesMarked(minefield)) {
        Mine.win(minefield);
    }
};

Mine.allActiveMinesMarked = function(minefield) {
    var mine;
    for(var i = 0; i < minefield.mines.length; ++i) {
        mine = minefield.mines[i];
        if(mine.isMine && mine.marked != true) {
            return false;
        }
        else if(mine.isMine == false && mine.marked) {
            return false;
        }
    }
    return true;
};

Mine.win = function(minefield) {
    var mines = minefield.mines;
    var mine;
    for(var i = 0; i < mines.length; ++i) {
        mine = mines[i];
        if(mine.isMine == false) {
            mine.mesh.visible = false;
        }
    }
    minefield.gameOver = true;
};

