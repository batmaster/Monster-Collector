var GameLayer = cc.LayerColor.extend({
    init: function() {
        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );
        
        this.botNum = 5;
        this.bots = [];
        this.fires = [];
       
        this.createBlocks();

        this.jumper = new Jumper( 400, 160, this );
        this.jumper.setBlocks( this.blocks );
        this.addChild( this.jumper );
        this.scheduleOnce(function() {
            this.jumper.scheduleUpdate();
        }, 2);
        
        this.setKeyboardEnabled( true );
        this.scheduleUpdate();
        return true;
    },
    
    update: function() {
        if (this.botNum > 0) {
            var ran = 1 + Math.floor(Math.random() * 100);
            if (ran == 50) {
                var bot = new Bot(600, 600, this);
                bot.setBlocks( this.blocks );
                this.addChild( bot );
                bot.scheduleUpdate();
                this.bots.push(bot);
                this.botNum--;
            }
        }
        this.checkBot();
    },
    
    checkBot: function() {
        console.log("length: " + this.bots.length + " " + this.fires.length);
        for (var i = 0; i < this.bots.length; i++) {
            for (var j = 0; j < this.fires.length; j++) {
                if ((this.bots[i].x >= this.fires[j].x - 20) && (this.bots[i].x <= this.fires[j].x + 20) &&
                    (this.bots[i].y >= this.fires[j].y - 20) && (this.bots[i].y <= this.fires[j].y + 20)) {
                    this.removeChild(this.bots[i]);
                    this.removeChild(this.fires[j]);
                    this.removeElement(this.bots, this.bots[i]);
                    this.removeElement(this.fires, this.fires[j]);
                    console.log("remove: " + i + " " + j);
                }
            }
        }
    },
    
    removeElement: function(list, data) {
        var index = list.indexOf(data);
        if (index && index > -1) {
            list.splice(index, 1);
        }
    },
    
    createBlocks: function() {
        this.blocks = [];
        var groundBlock = new Block( 0, 0, 700, 160 );
        this.blocks.push( groundBlock );

        var middleBlock = new Block( 0, 200, 400, 250 );
        this.blocks.push( middleBlock );

        var topBlock = new Block( 600, 400, 800, 450 );
        this.blocks.push( topBlock );

        this.blocks.forEach( function( b ) {
            this.addChild( b );
        }, this );
    },

    onKeyDown: function( e ) {
        this.jumper.handleKeyDown( e );
        
        switch(e){
            case cc.KEY.space:
                var fire = new Fire(this.jumper.x, this.jumper.y, this);
                this.fires.push(fire);
            break;
        }
    },

    onKeyUp: function( e ) {
        this.jumper.handleKeyUp( e );
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    }
});
