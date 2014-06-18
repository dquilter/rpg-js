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
        avatar.className = "player";
        avatar.setAttribute('data-pos-x', '1');
        avatar.setAttribute('data-pos-y', '1');
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
        
        // Check whether movement is off-screen
        var offScene = function() {
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

            // Update the style
            if(direction === 'y') {
                avatar.style.top = (avatar.getAttribute('data-pos-' + direction) - 1) * 40 + 'px';
            } else {
                avatar.style.left = (avatar.getAttribute('data-pos-' + direction) - 1) * 40 + 'px';      
            }
        }
    }
    
};

setup.init();