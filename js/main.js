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
            avatar.setAttribute('data-face', 'start');
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
            // Change the data attribute
            avatar.setAttribute('data-pos-' + direction, parseInt(avatar.getAttribute('data-pos-' + direction), 10) + distance, 10);
            
            if (avatar.getAttribute('data-face') == 'start' && evt.keyCode == 39) { // Facing start, rotating anti-clockwise
                console.log('Turn right');
                avatar.classList.remove('move-avatar');
                avatar.classList.remove('face-start');
                avatar.classList.add('face-down');
                // Prevent new direction from being removed
                removePreviousDirection('40');
                avatar.classList.add('move-avatar');
            } else if (avatar.getAttribute('data-face') == 'down' && evt.keyCode == 37) { // Facing down, rotating clockwise
                console.log('Turn left');
                avatar.classList.remove('move-avatar');
                avatar.classList.remove('face-down');
                avatar.classList.add('face-start');
                avatar.classList.add('move-avatar');                
                avatar.classList.add('face-left');
            } else if (avatar.getAttribute('data-face') == 'start' && evt.keyCode == 40) { // Facing start, moving down
                console.log('Down from start')
                avatar.classList.remove('move-avatar');
                avatar.classList.remove('face-start');
                avatar.classList.add('face-down');
                // Prevent new direction from being removed 
                removePreviousDirection('40');
                avatar.classList.add('move-avatar');
            }
            
            avatar.classList.add('face-' + face[evt.keyCode]);
            avatar.setAttribute('data-face', face[evt.keyCode]);            
            
            function removePreviousDirection(exclusion) {
                console.log(exclusion);
                for(f = 37; f < 42; f++) {
                    // Allow 'start' rotate helper to be unrelated to keyCode
                    f = f == 41 ? 99 : f;
                    // Remove pre-existing face classes
                    if(avatar.classList.contains('face-' + face[f]) && (f !== evt.keyCode | f !== exclusion)) {
                        avatar.classList.remove('face-' + face[f]);
                        console.log(f + ': ' + face[f]);
                    }
                }
            }
            
            avatar.addEventListener('transitionend', postRotate, true);           
            
            // Run this once rotation has finished
            function postRotate() {
                // Update the style
                if(direction === 'y') {
                    // Add walking class
                    avatar.style.top = (avatar.getAttribute('data-pos-' + direction) - 1) * 40 + 'px';
                    // Remove walk
                } else {
                    avatar.style.left = (avatar.getAttribute('data-pos-' + direction) - 1) * 40 + 'px';
                }

                avatar.addEventListener('transitionend', finishMovement, true);
                console.log('Fin1');
            }
            
            function finishMovement() { 
                console.log('Fin2');
                // Reset rotation if we've come full circle
                if(avatar.getAttribute('data-face') === 'down') {
                    avatar.classList.remove('face-down');
                    avatar.classList.add('face-start');
                    avatar.setAttribute('data-face', 'start');
                }
            }
        }
    }
    
};

setup.init();