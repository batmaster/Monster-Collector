var GameLayer = cc.LayerColor.extend({
    init: function(scene) {
        this._super(new cc.Color4B(127, 127, 127, 255));
        this.setPosition(new cc.Point(0, 0));
        
        this.scene = scene;
        
        this.botNum = 50;
        this.killedBot = 0;
        this.time = 600;
        this.bots = [];
        this.fires = [];
        this.lastFire = new Date().getTime();
       
        this.createBlocks();

        this.jumper = new Jumper(400, 160, this);
        this.jumper.setBlocks(this.blocks);
        this.addChild(this.jumper);
        this.scheduleOnce(function() {
            this.jumper.scheduleUpdate();
        }, 2);
        
        this.scorelbl = cc.LabelTTF.create( '0', 'Arial', 40 );
        this.scorelbl.setPosition( new cc.Point( 750, 550 ) );
        this.addChild( this.scorelbl );
        
        this.timelbl = cc.LabelTTF.create( '0', 'Arial', 40 );
        this.timelbl.setPosition( new cc.Point( 500, 550 ) );
        this.addChild( this.timelbl );
        
        this.setKeyboardEnabled(true);
        this.scheduleUpdate();
        return true;
    },
    
    createBlocks: function() {
        this.blocks = [];
        var groundBlock = new Block(0, 0, 700, 160);
        this.blocks.push(groundBlock);

        var middleBlock = new Block(0, 200, 400, 250);
        this.blocks.push(middleBlock);

        var topBlock = new Block(600, 400, 800, 450);
        this.blocks.push(topBlock);

        this.blocks.forEach(function(b) {
            this.addChild(b);
        }, this);
    },
    
    onKeyDown: function(e) {
        this.jumper.handleKeyDown(e);
        
        switch(e){
            case cc.KEY.space:
                if (new Date().getTime() - this.lastFire >= 100) {
                    var fire = new Fire(this.jumper.x, this.jumper.y, this);
                    this.fires.push(fire);
                    this.lastFire = new Date().getTime();
                }
                
            break;
        }
    },

    onKeyUp: function(e) {
        this.jumper.handleKeyUp(e);
    },
    
    update: function() {
        if (this.botNum > 0) {
            var ran = 1 + Math.floor(Math.random() * 100);
            if (ran == 50) {
                var bot = new Bot(600, 600, this);
                bot.setBlocks(this.blocks);
                this.addChild(bot);
                bot.scheduleUpdate();
                this.bots.push(bot);
                this.botNum--;
            }
        }
        this.checkBot();
        
        this.time--;
        this.timelbl.setString(parseInt(this.time/100));
        if (this.time <= 0) {
            this.setKeyboardEnabled(false);
            this.unscheduleUpdate();
            if (this.time <=180) {
                this.scene.gameOver();
                //this.scene.removeChild(this);
            }
        }
    },
    
    checkBot: function() {
        for (var i = 0; i < this.bots.length; i++) {
            for (var j = 0; j < this.fires.length; j++) {
                if ((this.bots[i].x >= this.fires[j].x - 20) && (this.bots[i].x <= this.fires[j].x + 20) &&
                    (this.bots[i].y >= this.fires[j].y - 20) && (this.bots[i].y <= this.fires[j].y + 20)) {
                    this.removeChild(this.bots[i]);
                    this.removeChild(this.fires[j]);
                    this.removeElement(this.bots, this.bots[i]);
                    this.removeElement(this.fires, this.fires[j]);
                    console.log("remove: bots[" + i + "] fires[" + j + "]");
                    
                    this.scorelbl.setString(++this.killedBot);
                }
            }
        }
    },
    
    removeElement: function(list, data) {
        var index = list.indexOf(data);
        if (index > -1) {
            list.splice(index, 1);
        }
    }, 
});