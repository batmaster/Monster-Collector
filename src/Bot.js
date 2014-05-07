var Bot = cc.Sprite.extend({
    ctor: function(x, y, gameLayer) {
        this._super();
        this.initWithFile('res/images/bot.png');
        this.setScale(2);
        this.setAnchorPoint(0.5, 0 );
        this.x = x;
        this.y = y;
        this.dir = Jumper.DIR.RIGHT;
        this.gameLayer = gameLayer;

        this.maxVx = 8;
        this.accX = 0.25;
        this.backAccX = 0.5;
        this.jumpV = 20;
        this.g = -1;
        
        this.vx = 0;
        this.vy = 0;

        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;

        this.ground = null;

        this.blocks = [];

        this.updatePosition();
        
        this.state = Bot.STATE.IDLE;
        this.lastMovement = new Date().getTime();
        
        this.touch = 0;
	this.inLine = 0;
    },

    updatePosition: function() {
        this.setPosition(cc.p(Math.round(this.x), Math.round(this.y)));
    },
    
    update: function() {
        // random movement if free
        if (new Date().getTime() - this.lastMovement >= 1800) {
            this.lastMovement = new Date().getTime();
            
            this.state = Math.floor(Math.random() * 3);
        }
        
        switch (this.state) {
            case Bot.STATE.IDLE:

                break;
            case Bot.STATE.MOVERIGHT:
                this.x += 3;
                this.randomJump();
                //this.moveRight();
                break;
            case Bot.STATE.MOVELEFT:
                this.x -= 3;
                this.randomJump();
                //this.moveLeft();
                break;
        }
        
        if (this.touch >= 12) {
            this.gameLayer.botFire(this);
            this.touch = 0;
        }

	if (this.inLine >= 60) {
            this.gameLayer.botFire(this);
            this.inLine = 0;
        }
        
        if (this.y < 0) {
            //this.gameLayer.removeChild(this);
            //this.gameLayer.botNum++;
            this.y = screenHeight;
        }
            
        var oldRect = this.getBoundingBoxToWorld();
        var oldX = this.x;
        var oldY = this.y;
        
        this.updateYMovement();
        this.updateXMovement();

        var dX = this.x - oldX;
        var dY = this.y - oldY;
        
        var newRect = cc.rect(oldRect.x + dX,
                               oldRect.y + dY - 1,
                               oldRect.width,
                               oldRect.height + 1);

        this.handleCollision(oldRect, newRect);
        this.updatePosition();
    },

    randomJump: function() {
        var ran = 1 + Math.floor(Math.random() * 300);
        if (ran == 50) {
            this.jump = !this.jump;
        }    
    },
    
    updateXMovement: function() {
        if (this.ground) {
            if ((!this.moveLeft) && (!this.moveRight)) {
                this.autoDeaccelerateX();
            } else if (this.moveRight) {
                this.accelerateX(1);
            } else {
                this.accelerateX(-1);
            }
        }
        this.x += this.vx;
        if (this.x < 0) {
            this.x += screenWidth;
        }
        if (this.x > screenWidth) {
            this.x -= screenWidth;
        }
    },

    updateYMovement: function() {
        if (this.ground) {
            this.vy = 0;
            if (this.jump) {
                this.vy = this.jumpV;
                this.y = this.ground.getTopY() + this.vy;
                this.ground = null;
            }
        } else {
            this.vy += this.g;
            this.y += this.vy;
        }
    },

    isSameDirection: function(dir) {
        return (((this.vx >=0) && (dir >= 0)) ||
                 ((this.vx <= 0) && (dir <= 0)));
    },

    accelerateX: function(dir) {
        if (this.isSameDirection(dir)) {
            this.vx += dir * this.accX;
            if (Math.abs(this.vx) > this.maxVx) {
                this.vx = dir * this.maxVx;
            }
        } else {
            if (Math.abs(this.vx) >= this.backAccX) {
                this.vx += dir * this.backAccX;
            } else {
                this.vx = 0;
            }
        }
    },
    
    autoDeaccelerateX: function() {
        if (Math.abs(this.vx) < this.accX) {
            this.vx = 0;
        } else if (this.vx > 0) {
            this.vx -= this.accX;
        } else {
            this.vx += this.accX;
        }
    },

    handleCollision: function(oldRect, newRect) {
        if (this.ground) {
            if (!this.ground.onTop(newRect)) {
                this.ground = null;
            }
        } else {
            if (this.vy <= 0) {
                var topBlock = this.findTopBlock(this.blocks, oldRect, newRect);
                
                if (topBlock) {
                    this.ground = topBlock;
                    this.y = topBlock.getTopY();
                    this.vy = 0;
                }
            }
        }
    },
    
    findTopBlock: function(blocks, oldRect, newRect) {
        var topBlock = null;
        var topBlockY = -1;
        
        blocks.forEach(function(b) {
            if (b.hitTop(oldRect, newRect)) {
                if (b.getTopY() > topBlockY) {
                    topBlockY = b.getTopY();
                    topBlock = b;
                }
            }
        }, this);
        
        return topBlock;
    },
    
    handleKeyDown: function(e) {
        if (Bot.KEYMAP[ e ] != undefined) {
            this[ Bot.KEYMAP[ e ] ] = true;
        }
    },

    handleKeyUp: function(e) {
        if (Bot.KEYMAP[ e ] != undefined) {
            this[ Bot.KEYMAP[ e ] ] = false;
        }
    },

    setBlocks: function(blocks) {
        this.blocks = blocks;
    },
    
    
    isStamp: function(player) {
        if (player.getPositionX() >= this.x - 40 && player.getPositionX() <= this.x + 40 &&
           player.getPositionY() >= this.y - 40 && player.getPositionY() <= this.y + 40) {
            if (player.vy < 0) {
                return true;
            }
        }
    },
    
    isInLine: function(player) {
        if (player.getPositionY() >= this.y - 40 && player.getPositionY() <= this.y + 40) {
            return true;
        }
    },
    
    isTouch: function(player) {
        if (player.getPositionX() >= this.x - 40 && player.getPositionX() <= this.x + 40 &&
           player.getPositionY() >= this.y - 40 && player.getPositionY() <= this.y + 40) {
            return true;
        }
    }
});

Bot.KEYMAP = {}
Bot.KEYMAP[cc.KEY.left] = 'moveLeft';
Bot.KEYMAP[cc.KEY.right] = 'moveRight';
Bot.KEYMAP[cc.KEY.up] = 'jump';

Bot.STATE = {
    IDLE: 0,
    MOVERIGHT: 1,
    MOVELEFT: 2
};

Bot.DIR = {
    LEFT: -1,
    RIGHT: 1
};