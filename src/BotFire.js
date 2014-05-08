var BotFire = cc.Sprite.extend({
    ctor: function( bot, gameLayer ) {
        this._super();
        this.initWithFile( 'res/images/ball.png' );
        this.setScale(2);
        this.setAnchorPoint( 0.5, 0  );
        this.x = bot.x;
        this.y = bot.y;
        this.startX = this.x;
        /// temp direction of botfire ///
        if (bot.x - gameLayer.jumper.x >= 0) {
            bot.turnLeft();
        }
        else {
            bot.turnRight();
        }
        this.dir = bot.dir;
        ///
        this.gameLayer = gameLayer;
        
        this.updatePosition();
        this.gameLayer.addChild(this);
        this.scheduleUpdate();
    },
    
    updatePosition: function() {
        this.setPosition( cc.p( Math.round( this.x ), Math.round( this.y ) ) );
    },
    
    update: function() {
        if (this.dir == Bot.DIR.RIGHT) {
            this.x += 16;
            if (this.x > this.startX + 400) {
                this.gameLayer.removeElement(this.gameLayer.fires, this);
                this.gameLayer.removeChild(this);
            }
        }
        else if (this.dir == Bot.DIR.LEFT) {
            this.x -= 16;
            if (this.x < this.startX - 400) {
                this.gameLayer.removeElement(this.gameLayer.fires, this);
                this.gameLayer.removeChild(this);
            }
        }
        this.updatePosition();
    }
});