entity = {

    human: function(avatar) {
        this.feet = characteristics.bipedal();
        this.mobile = characteristics.mobile(avatar);
        // this.prototype = new characteristics.hasInventory;
    },
        
    tree: function() {
    
    },
    
    rock: function() {
    
    },
    
    chicken: function() {
        this.feet = characteristics.bipedal();

    }
    
}

characteristics = {

    bipedal: function() {
        return 2;
    },
    quadrapedal: function() {
        return 4;
    },

    mobile: function(avatar) {
        mobile = {
            avatar: avatar,
            stopMovement: false,
            move: actions.move
        }
        return mobile;
    },
    
    hasInventory: function() {
        this.hasHands = true;
    }

};

actions = {

    move: function(evt) {
        
        avatar = this.avatar;
        
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