var RocketFire = cc.Sprite.extend({
    ctor: function(gameLayer, bot) {
        this._super();
        this.initWithFile('res/images/ie.png');
        this.setScale(2);
        this.setAnchorPoint(0.5, 0 );
        this.x = gameLayer.jumper.x;
        this.y = gameLayer.jumper.y;
        this.v = 8;
        this.dirX = this.v;
        this.dirY = this.v;
        this.startFrame = 0;
        this.dir = gameLayer.jumper.dir;
        this.gameLayer = gameLayer;
        this.bot = bot;
        
        this.updatePosition();
        this.gameLayer.addChild(this);
        this.scheduleUpdate();
    },
    
    updatePosition: function() {
        this.setPosition(cc.p(Math.round(this.x), Math.round(this.y)));
    },
    
    update: function() {
        if (this.isBotAlive()) {
            if (this.bot.x >= this.x) {
                this.dirX = this.v;
            }
            else if (this.bot.x < this.x) {
                this.dirX = -this.v;
            }
            if (this.bot.y >= this.y) {
                this.dirY = this.v;
            }
            else if (this.bot.y < this.y) {
                this.dirY = -this.v;
            }
        }
        else {
            this.changeTarget();
        }
        
        this.x += this.dirX;
        this.y += this.dirY;
        this.updatePosition();
        
        this.startFrame++;
        if (this.startFrame >= 120) {
            this.gameLayer.removeElement(this.gameLayer.fires, this);
            this.gameLayer.removeChild(this);
        }
    },
    
    isBotAlive: function() {
        for (var i = 0; i < this.gameLayer.bots.length; i++) {
            if (this.gameLayer.bots[i] == this.bot) {
                return true;
            }
        }
        return false;
    },
    
    changeTarget: function() {
        var min = Number.MAX_VALUE;
        var index = Number.MAX_VALUE;
        for (var i = 0; i < this.gameLayer.bots.length; i++) {
            var distance = Math.sqrt(Math.pow((this.gameLayer.bots[i].x - this.x), 2) + Math.pow(this.gameLayer.bots[i].y - this.y, 2));
            if (distance < min) {
                index = i;
            }
        }
        this.bot = this.gameLayer.bots[i];
    }
});