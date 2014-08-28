var sokoban = {

    CELL_SIZE: 30,

    // @ - player
    // B - box
    // * - spot
    // $ - box on spot
    // % - player on spot
    level: [
        ["-", "-", "-", "-", "-", "-", "-", "-", "-"],

        ["-", "-", "-", "-", "-", "-", "-", "-", "-"],

        ["-", "-", "-", "-", "B", "-", "B", "-", "-"],

        ["-", "B", "-", "-", "-", "-", "-", "-", "-"],

        ["-", "-", "*", "-", "-", "*", "-", "B", "-"],

        ["-", "-", "-", "B", "B", "-", "-", "-", "-"],

        ["-", "-", "-", "B", "-", "-", "-", "-", "-"],

        ["-", "B", "-", "-", "*", "-", "-", "-", "-"],

        ["-", "-", "-", "-", "-", "-", "-", "-", "@"],
    ],

    _isLevelChanged: true, // re-parse level only id needed, not for each animation frame

    getPlayerPosition: function() {
        for (var i=0; i<sokoban.level.length; i++) {
            for (var j=0; j<sokoban.level[i].length; j++) {
                if (sokoban.level[i][j] === "@") {
                    var position = {};
                    position.x = j;
                    position.y = i;
                    return position;
                }
            }
        }

    },

    setPlayerPosition: function(position) {
        // delete old player position from map array
        for (var i=0; i<sokoban.level.length; i++) {
            for (var j=0; j<sokoban.level[i].length; j++){
                if (sokoban.level[i][j] === "@") {
                    sokoban.level[i][j] = "-";
                }
            }
        }
        // and set a new position
        sokoban.level[position.y][position.x] = "@";
        // and re-render the view
        sokoban.renderView();
    },

    goUp: function() {
        sokoban._isLevelChanged = true;
        var curPosition = sokoban.getPlayerPosition(); 
        var isPushed = false;

        // check for upper map border
        if (curPosition.y > 0) {

            // check for obsticles
            if (sokoban.level[curPosition.y-1][curPosition.x] !== "-" && 
                sokoban.level[curPosition.y-1][curPosition.x] !== "*"

            ) {
                // box and empty space ahead
                if (sokoban.level[curPosition.y-1][curPosition.x] === "B" &&
                    curPosition.y - 1 > 0 &&
                    sokoban.level[curPosition.y-2][curPosition.x] === "-"
                     
                    ) {
                        sokoban.level[curPosition.y-1][curPosition.x] = "-";
                        sokoban.level[curPosition.y-2][curPosition.x] = "B";
                        curPosition.y--;
                        sokoban.setPlayerPosition(curPosition);
                        isPushed = true;
                }

                // push box from spot
                // if (sokoban.level[curPosition.y-1][curPosition.x] === "$" &&
                //     curPosition.y - 1 > 0 &&
                //     sokoban.level[curPosition.y-2][curPosition.x] === "-"
                     
                //     ) {
                //         sokoban.level[curPosition.y-1][curPosition.x] = "*";
                //         sokoban.level[curPosition.y-2][curPosition.x] = "B";
                //         curPosition.y--;
                //         sokoban.setPlayerPosition(curPosition);
                //         isPushed = true;
                // }
                // push box to spot
                if (sokoban.level[curPosition.y-1][curPosition.x] === "B" &&
                    curPosition.y - 1 > 0 &&
                    sokoban.level[curPosition.y-2][curPosition.x] === "*" &&
                    !isPushed
                    ) {
                        sokoban.level[curPosition.y-1][curPosition.x] = "-";
                        sokoban.level[curPosition.y-2][curPosition.x] = "$"
                        curPosition.y--;
                        sokoban.setPlayerPosition(curPosition);
                }

            } else { // there's no obsticles on top
                curPosition.y--;
                sokoban.setPlayerPosition(curPosition);
                if (sokoban.isPlayerOnspot) {
                    console.log('on spot');
                    sokoban.level[curPosition.y-1][curPosition.x] = "*";
                    sokoban.isPlayerOnspot = false;
                }

                if ( sokoban.level[curPosition.y-1][curPosition.x] == "*") {
                    sokoban.isPlayerOnspot = true; 
                }
            }
        }

        sokoban._isLevelChanged = true;
        sokoban.renderView();
    },

    goDown: function() {
        var curPosition = sokoban.getPlayerPosition(); 
        var isPushed = false;

        if (curPosition.y < sokoban.level.length-1) {
            // check for obsticles
            if (sokoban.level[curPosition.y+1][curPosition.x] !== "-") {
                // box
                if (sokoban.level[curPosition.y+1][curPosition.x] === "B" &&
                    curPosition.y + 1 < sokoban.level.length - 1 &&
                    sokoban.level[curPosition.y+2][curPosition.x] === "-"
                     
                    ) {
                        sokoban.level[curPosition.y+1][curPosition.x] = "-";
                        sokoban.level[curPosition.y+2][curPosition.x] = "B";
                        curPosition.y++;
                        sokoban.setPlayerPosition(curPosition);
                        isPushed = true;
                }

                // push box to spot
                if (sokoban.level[curPosition.y+1][curPosition.x] === "B" &&
                    curPosition.y + 1 < sokoban.level.length - 1 &&
                    sokoban.level[curPosition.y+2][curPosition.x] === "*" &&
                    !isPushed
                    ) {
                        sokoban.level[curPosition.y+1][curPosition.x] = "-";
                        sokoban.level[curPosition.y+2][curPosition.x] = "$"
                        curPosition.y++;
                        sokoban.setPlayerPosition(curPosition);
                        sokoban.renderView();
                }

            } else {
                curPosition.y++;
                sokoban.setPlayerPosition(curPosition);
            }

            sokoban.setPlayerPosition(curPosition);
        }
        sokoban._isLevelChanged = true;
        sokoban.renderView();
    },

    goRight: function() {
        var curPosition = sokoban.getPlayerPosition(); 
        var isPushed = false;

        // check for map right border
        if (curPosition.x < sokoban.level[0].length-1) {
            // check for obsticles
            if (sokoban.level[curPosition.y][curPosition.x+1] !== "-") {
                // box
                if (sokoban.level[curPosition.y][curPosition.x+1] === "B" &&
                    curPosition.x + 1 > 0 &&
                    sokoban.level[curPosition.y][curPosition.x+2] === "-"
                     
                    ) {
                        sokoban.level[curPosition.y][curPosition.x+1] = "-";
                        sokoban.level[curPosition.y][curPosition.x+2] = "B";
                        curPosition.x++;
                        sokoban.setPlayerPosition(curPosition);
                        isPushed = true;
                }

                // push box to spot
                if (sokoban.level[curPosition.y][curPosition.x+1] === "B" &&
                    curPosition.x + 1 > 0 &&
                    sokoban.level[curPosition.y][curPosition.x+2] === "*" &&
                    !isPushed
                    ) {
                        sokoban.level[curPosition.y][curPosition.x+1] = "-";
                        sokoban.level[curPosition.y][curPosition.x+2] = "$";
                        curPosition.x++;
                        sokoban.setPlayerPosition(curPosition);
                }

            } else { // no obsticles at right
                curPosition.x++;
                sokoban.setPlayerPosition(curPosition);
            }

        }
        // canvas redraw needed
        sokoban._isLevelChanged = true;
        sokoban.renderView();
    },

    goLeft: function() {
        var curPosition = sokoban.getPlayerPosition(); 
        var isPushed = false;
        if (curPosition.x > 0) {
            // check for obsticles
            if (sokoban.level[curPosition.y][curPosition.x-1] !== "-") {

                // push box to empty space
                if (sokoban.level[curPosition.y][curPosition.x-1] === "B" &&
                    curPosition.x - 1 > 0 &&
                    sokoban.level[curPosition.y][curPosition.x-2] === "-" &&
                    sokoban.level[curPosition.y][curPosition.x-2] !== "*"
                    ) {
                        sokoban.level[curPosition.y][curPosition.x-1] = "-";
                        sokoban.level[curPosition.y][curPosition.x-2] = "B";
                        curPosition.x--;
                        isPushed = true;
                        sokoban.setPlayerPosition(curPosition);
                }

                // push box to spot
                if (sokoban.level[curPosition.y][curPosition.x-1] === "B" &&
                    sokoban.level[curPosition.y][curPosition.x-2] === "*" &&
                    !isPushed
                    ) {
                        sokoban.level[curPosition.y][curPosition.x-1] = "-";
                        sokoban.level[curPosition.y][curPosition.x-2] = "$";
                        curPosition.x--;
                        sokoban.setPlayerPosition(curPosition);
                }

            } else { // no obsticles at left
                curPosition.x--;
                sokoban.setPlayerPosition(curPosition);
            }
        }
        // canvas redraw needed
        sokoban._isLevelChanged = true;
        sokoban.renderView();

        
    },

    renderView: function(options) {
        var htmlView = "";

        // render html view
        for (var i=0; i<sokoban.level.length; i++){
            for (var j=0; j<sokoban.level[i].length; j++){
                htmlView += sokoban.level[i][j] + " "; 
                if (j == 8) {
                    htmlView += "<br>";
                }
            }
        }
        $('body code').html(htmlView);

        // render canvas view
        var curPosition = sokoban.getPlayerPosition(); 
        sokoban.player.x = curPosition.x * sokoban.CELL_SIZE;
        sokoban.player.y = curPosition.y * sokoban.CELL_SIZE;

        if (sokoban._isLevelChanged) {
            sokoban.updateCanvasView();
        }

    },

    updateCanvasView: function() {

        sokoban._isLevelChanged = false;

        // create bg blocks
        var bg_blocks = [];
        sokoban.boxes = [];
        sokoban.spots = [];
        sokoban.bspots = [];

        for (var i=0; i<sokoban.level.length; i++){
            for (var j=0; j<sokoban.level[i].length; j++){
                var cur_x = j * sokoban.CELL_SIZE;
                var cur_y = i * sokoban.CELL_SIZE;

                var cur_block = new plant.Sprite({
                    src: 'grass.png',
                    x: cur_x,
                    y: cur_y
                });

                bg_blocks.push(cur_block);
                sokoban.scene.add(bg_blocks[bg_blocks.length - 1]);

                // box
                if (sokoban.level[i][j] == "B") {
                    var box = new plant.Sprite({
                        src: "box.png",
                        x: cur_x,
                        y: cur_y,
                        color: "#ff9966",
                    });
                    
                    box.xCell = j;
                    box.yCell = i;

                    sokoban.boxes.push(box);
                    sokoban.scene.add(sokoban.boxes[sokoban.boxes.length - 1]);
                }

                // spot
                if (sokoban.level[i][j] == "*") {
                    var spot = new plant.Sprite({
                        src: "spot.png",
                        x: cur_x,
                        y: cur_y,
                        width: sokoban.CELL_SIZE,
                        height: sokoban.CELL_SIZE
                    });
                    sokoban.spots.push(spot);
                    sokoban.scene.add(sokoban.spots[sokoban.spots.length - 1]);
                }

                // box on spot
                if (sokoban.level[i][j] == "$") {
                    var bspot = new plant.Sprite({
                        src: "bspot.png",
                        x: cur_x,
                        y: cur_y,
                        zindex: 100,
                        width: sokoban.CELL_SIZE,
                        height: sokoban.CELL_SIZE
                    });
                    sokoban.bspots.push(bspot);
                    sokoban.scene.add(sokoban.bspots[sokoban.bspots.length - 1]);
                }
            }
        }
    
    },

    onLoad: function() {

        var sceneWidth = sokoban.CELL_SIZE * sokoban.level.length; 
        var sceneHeight = sokoban.CELL_SIZE * sokoban.level[0].length; 

        sokoban.scene = new plant.Scene({
            width: sceneHeight,
            height: sceneHeight 
        });


        // calculate player's position on canvas
         
        var curPosition = sokoban.getPlayerPosition(); 
        sokoban.curPositionCanvX = curPosition.x * sokoban.CELL_SIZE;
        sokoban.curPositionCanvY = curPosition.y * sokoban.CELL_SIZE;


        sokoban.player = new plant.Sprite({
            src: "player.png",
            zindex: 100,
            width: sokoban.CELL_SIZE,
            height: sokoban.CELL_SIZE,
            x: sokoban.curPositionCanvX,
            y: sokoban.curPositionCanvY
        });



        sokoban.plantGameLoop = new plant.GameLoop({
            scene: sokoban.scene,
            interval: 100 
        });

        sokoban.scene.add(sokoban.player);

        sokoban.plantGameLoop.code = function() {
            sokoban.scene.update();
        };

        sokoban.plantGameLoop.start();

        sokoban.renderView();

    },

    keyDown: function(e) {
        if (e.keyCode === 38) { sokoban.goUp() }
        if (e.keyCode === 37) { sokoban.goLeft() }
        if (e.keyCode === 39) { sokoban.goRight() }
        if (e.keyCode === 40) { sokoban.goDown() }
    }
    
};

window.addEventListener('load', sokoban.onLoad, false);
window.addEventListener('keydown', sokoban.keyDown, false);

