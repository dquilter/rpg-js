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
        
        console.log(setup.playerObject);
        
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
                setup.playerObject.mobile.move(evt);
            }
        };
    },
    
    createPlayer: function() {
        // Place the avatar
        var avatar = document.createElement('div');
        avatar.classList.add('player');
        // CSS Helper Class
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
        setup.playerObject = new entity.human(setup.playerAvatar);
    },
    
    createEntity: function(entity) {
        // Place the avatar
        var avatar = document.createElement('div');
        avatar.classList.add('drone');
        avatar.classList.add('move-avatar');
        
        if (setup.gameStart == true) {
            avatar.setAttribute('data-pos-x', entity.posX);
            avatar.setAttribute('data-pos-y', entity.posY);
            avatar.setAttribute('data-face', entity.face);
            avatar.setAttribute('data-rotate', entity.rotate);
            var rotate = {
                0: 'down',
                90: 'left',
                180: 'up',
                270: 'right'
            }
            avatar.classList.add('face-' + rotate[entity.rotate]);
            avatar.style.top = (entity.posX - 1) * setup.tileSize + 'px';
            avatar.style.left = (entity.posY - 1) * setup.tileSize + 'px';
            
        } else {
            // Need data passed from last setting
            
        }
        setup.gameContainer.appendChild(avatar);
        // drones.entity = avatar;
        
        // Create player Object
        // setup.playerObject = new entity.human(setup.playerAvatar);    
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

            var drones = settings.start.npcs;
            for(drone = 0; drone < drones.length; drone++) {
                setup.createEntity(drones[drone]);
            }
            
        } else { 
            // Not game start
        
        }
    }

};

setup.init();