$(document).ready(function() {
    var key;
    var direction = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }
    console.log('Woot');
    $('.wrapper').on('keyup', function (evt) {
        key = evt.which ;
        if (direction[key] !== undefined) {
            console.log(direction[key]);
        }
    });
});

setup = {

    gameContainer: document.getElementById('container'), 
    playerAvatar: undefined,
    playerObject: undefined,
    countMoves: 0,
    menuOpen: false,
    gameStart: true,
    
    tileSize: undefined,
    width: undefined,
    height: undefined,
    boundaries: [],
    directionBoundary: [],
    
    init: function() {
        // Run setup functions
        setup.createSetting();
        setup.createPlayer();
        setup.detectKey();
        
        // Game has now started
        setup.gameStart = false;
        
        // Set focus when user clicks the start button
        document.querySelector('.startgame').addEventListener('click', setFocus, true);
        function setFocus(e) {
            e.preventDefault();
            setup.gameContainer.focus();
        }  
    },

    detectKey: function() {
        
        // Prevent scroll on keying Up or Down
        setup.gameContainer.addEventListener('keydown', function(evt) {
            if(evt.keyCode === 40 || evt.keyCode === 38) {
                evt.preventDefault();
            }
        }, true)
        
        // In-game key bindings
        setup.gameContainer.onkeyup = function(evt){
            // Move avatar if menu isn't open
            if(setup.menuOpen === false) {
                setup.playerObject.move(setup.playerAvatar, evt);
            }
        };
    },
    
    createPlayer: function() {
        // Place the avatar
        var avatar = document.createElement('div');
        avatar.classList.add('player');
        avatar.classList.add('move-avatar');
        
        if (setup.gameStart == true) {
            avatar.setAttribute('data-pos-x', '1');
            avatar.setAttribute('data-pos-y', '1');
            avatar.setAttribute('data-face', 'down');
            avatar.setAttribute('data-rotate', '0');
            avatar.classList.add('face-down');
        } else {
            // Need data passed from last setting
            
        }
        setup.gameContainer.appendChild(avatar);
        setup.playerAvatar = avatar;
        
        // Create player Object
        setup.playerObject = new entities.moveableObject;
    },
    
    createSetting: function() {
        if(setup.gameStart == true) {
            console.log(setup.gameStart);

            setup.width = parseInt(settings.start.width, 10);
            setup.height = parseInt(settings.start.height, 10);
            setup.tileSize = parseInt(settings.start.tileSize, 10);
            
            // Setup container
            setup.gameContainer.style.width = setup.width * setup.tileSize +'px'; 
            setup.gameContainer.style.height = setup.height * setup.tileSize +'px';
            
            // Layout tiles
            var noTiles = setup.height * setup.height;
            for(tiles = 1; tiles <= noTiles; tiles++) {
                thisTile = document.createElement('div');
                thisTile.className = "tile";
                thisTile.setAttribute('data-tile-type', 'grass');
                thisTile.setAttribute('data-pos-x', tiles);
                thisTile.setAttribute('data-pos-y', Math.ceil(tiles / setup.width));
                thisTile.style.width = setup.tileSize + 'px';
                thisTile.style.height = setup.tileSize + 'px';
                setup.gameContainer.appendChild(thisTile);
            }
            
            // Set boundries 
            // Movement helpers
            setup.boundaries[38] = [-1, 'y'];
            setup.boundaries[39] = [1, 'x'];
            setup.boundaries[40] = [1, 'y'];
            setup.boundaries[37] = [-1, 'x'];
            // Actual boundaries
            setup.directionBoundary['x'] = setup.width;
            setup.directionBoundary['y'] = setup.height;

            
        } else { 
            // Not game start
        
        }
    }

};

entities = {

    moveableObject: function() {
        this.stopMovement = false;
        this.move = actions.move;
    }

};

actions = {

    move: function(avatar, evt) {
        
        // Prevent movement if avatar is already moving
        if(avatar.stopMovement == true) {
            return false;
            console.log('No!');
        } else {
        
            setup.countMoves = setup.countMoves + 1;

            // Control boundaries
            var distance = setup.boundaries[evt.keyCode][0];
            var direction = setup.boundaries[evt.keyCode][1];

            // Rotate helpers
            var face = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down',
                99: 'start'
            }
            var faceDiff = {
                left: {
                    up: 90,
                    right: 180,
                    down: -90
                },
                up: {
                    left: -90,
                    right: 90,
                    down: 180
                },
                right: {
                    left: 180,
                    up: -90,
                    down: 90
                },
                down: {
                    left: 90,
                    up: 180,
                    right: -90
                }
            }
            var rotated;
            var newRotate;
            
            // Check whether movement is off-screen
            function offScene() {
                if(parseInt(avatar.getAttribute('data-pos-' + direction), 10) + distance <= 0) {
                    return true;
                }
                if(parseInt(avatar.getAttribute('data-pos-' + direction), 10) + distance >= setup.directionBoundary[direction] + 1) {
                    return true;
                }
                return false;
            };

            // Don't allow charcter offscreen
            if(offScene() === true) {
                alert('You can\'t go that way');
            } else {

                // Prevent movement while avatar is moving
                avatar.stopMovement = true;

                // Do we need to rotate?
                if (face[evt.keyCode] !== avatar.getAttribute('data-face')) {
                    rotate(avatar.getAttribute('data-face'), face[evt.keyCode])
                } else {
                    postRotate();
                }

                function rotate(currentDir, newDir) {
                    newRotate = parseInt(avatar.getAttribute('data-rotate'), 10) + faceDiff[currentDir][newDir];
                    avatar.style.transform = 'rotate(' + newRotate + 'deg)';
                    avatar.setAttribute('data-rotate', newRotate);
                    avatar.setAttribute('data-face', newDir);                
                    rotated = true;
                    avatar.addEventListener('transitionend', postRotate, true);
                }

                function postRotate(removeEvtList) {
                    if(rotated === true) {
                        avatar.removeEventListener('transitionend', postRotate, true);
                        rotated = undefined;
                    }
                    // Add animation
                    avatar.classList.add('action-walk');
                    // Change the data attribute
                    avatar.setAttribute('data-pos-' + direction, parseInt(avatar.getAttribute('data-pos-' + direction), 10) + distance, 10);
                    // Move the avatar
                    if(direction === 'y') {
                        // Add walking class
                        avatar.style.top = (avatar.getAttribute('data-pos-' + direction) - 1) * setup.tileSize + 'px';
                        // Remove walk
                    } else {
                        avatar.style.left = (avatar.getAttribute('data-pos-' + direction) - 1) * setup.tileSize + 'px';
                    }
                    avatar.setAttribute('data-face', face[evt.keyCode]);            
                    avatar.addEventListener('transitionend', postMove, true);           
                }

                function postMove() {
                    avatar.removeEventListener('transitionend', postMove, true);
                    avatar.classList.remove('action-walk');
                    avatar.stopMovement = false;
                }
            }
        }
    }
};

setup.init();