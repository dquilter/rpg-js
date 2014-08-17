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
    
    width: undefined,
    height: undefined,
    boundaries: [],
    
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
            console.log(settings.gameStart);

            setup.width = parseInt(settings.start.width, 10);
            setup.height = parseInt(settings.start.height, 10);
            
            // Setup container
            setup.gameContainer.style.width = setup.width * 40 +'px'; 
            setup.gameContainer.style.height = setup.height * 40 +'px';
            
            // Layout tiles
            var noTiles = setup.height * setup.height;
            for(tiles = 1; tiles <= noTiles; tiles++) {
                thisTile = document.createElement('div');
                thisTile.className = "tile";
                thisTile.setAttribute('data-tile-type', 'grass');
                thisTile.setAttribute('data-pos-x', tiles);
                thisTile.setAttribute('data-pos-y', Math.ceil(tiles / setup.width));
                setup.gameContainer.appendChild(thisTile);
            }
            
            // Set boundries 
            // Directional set by keycode for arrow keys
            setup.boundaries[38] = [-1, 'y'];
            setup.boundaries[39] = [1, 'x'];
            setup.boundaries[40] = [1, 'y'];
            setup.boundaries[37] = [-1, 'x'];
        } else { 
            // Not game start
        
        }
    }

};

entities = {

    moveableObject: function() {
        this.move = actions.move;
    }

};

actions = {

    move: function(avatar, evt) {
        
        setup.countMoves = setup.countMoves + 1;

        // Control boundaries
        var distance = setup.boundaries[evt.keyCode][0];
        var direction = setup.boundaries[evt.keyCode][1];
        
        var directionBoundary = [];
        directionBoundary['x'] = setup.width;
        directionBoundary['y'] = setup.height;
        
        // Rotate helpers
        var face = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            99: 'start'
        }
        var rotated;
        
        // Check whether movement is off-screen
        function offScene() {
            if(parseInt(avatar.getAttribute('data-pos-' + direction), 10) + distance <= 0) {
                return true;
            }
            if(parseInt(avatar.getAttribute('data-pos-' + direction), 10) + distance >= directionBoundary[direction] + 1) {
                return true;
            }
            return false;
        };

        // Don't allow charcter offscreen
        if(offScene() === true) {
            alert('You can\'t go that way');
        } else {
            
            // Rotate
            if (face[evt.keyCode] !== avatar.getAttribute('data-face')) {
                rotate(avatar.getAttribute('data-face'), face[evt.keyCode])
            } else {
                postRotate();
            }
            
            function rotate(currentDir, newDir) {
                avatar.classList.add('face-' + newDir);
                avatar.classList.remove('face-' + currentDir);
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
                    avatar.style.top = (avatar.getAttribute('data-pos-' + direction) - 1) * 40 + 'px';
                    // Remove walk
                } else {
                    avatar.style.left = (avatar.getAttribute('data-pos-' + direction) - 1) * 40 + 'px';
                }

                avatar.setAttribute('data-face', face[evt.keyCode]);            
                avatar.addEventListener('transitionend', postMove, true);           
            }
            
            function postMove() {
                avatar.classList.remove('action-walk');
            }
        }
    }
    
};

setup.init();