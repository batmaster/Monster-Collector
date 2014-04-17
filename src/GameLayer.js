var GameLayer = cc.LayerColor.extend({
    init: function(scene) {
        this._super(new cc.Color4B(127, 127, 127, 255));
        this.setPosition(new cc.Point(0, 0));
        
        this.scene = scene;
        
        this.botNum = 50;
        this.killedBot = 0;
        this.time = 3000;
        this.bots = [];
        this.fires = [];
        this.botFires = [];
        this.lastFire = new Date().getTime();
       
        this.createBlocks();

        this.jumper = new Jumper(400, 160, this);
        this.jumper.setBlocks(this.blocks);
        this.addChild(this.jumper);
        this.scheduleOnce(function() {
            this.jumper.scheduleUpdate();
        }, 2);
        
        this.scorelbl = cc.LabelTTF.create('0', 'Arial', 40);
        this.scorelbl.setPosition(new cc.Point(750, 550));
        this.addChild(this.scorelbl);
        
        this.timelbl = cc.LabelTTF.create('0', 'Arial', 40);
        this.timelbl.setPosition(new cc.Point(500, 550));
        this.addChild(this.timelbl);
        
        this.lifelbl = cc.LabelTTF.create('0', 'Arial', 40);
        this.lifelbl.setString(this.jumper.life);
        this.lifelbl.setPosition(new cc.Point(100, 550));
        this.addChild(this.lifelbl);
        
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
    
    fire: function() {
        var fire = new Fire(this.jumper.x, this.jumper.y, this);
        this.fires.push(fire);
        this.lastFire = new Date().getTime();
    },
    
    botFire: function(bot) {
        var botFire = new BotFire(bot.x, bot.y, this);
        this.botFires.push(botFire);
    },
    
    onKeyDown: function(e) {
        this.jumper.handleKeyDown(e);
        
        switch(e) {
            case cc.KEY.space:
                if (new Date().getTime() - this.lastFire >= 300) {
                    this.fire();
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
        this.checkBotKilled();
        this.checkBotTouched();
        this.checkKilled();
        
        this.time--;
        this.timelbl.setString(parseInt(this.time));
        
        if (this.time <= 0 || this.jumper.life <= 0) {
            this.gameOver();
            //this.scene.removeChild(this);
        }
    },
    
    checkBotKilled: function() {
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
                    return;
                }
            }
        }
    },
    
    checkKilled: function() {
        for (var i = 0; i < this.botFires.length; i++) {
            if ((this.botFires[i].x >= this.jumper.x - 30) && (this.botFires[i].x <= this.jumper.x + 30) &&
                (this.botFires[i].y >= this.jumper.y - 30) && (this.botFires[i].y <= this.jumper.y + 30)) {
                this.removeChild(this.botFires[i]);
                this.removeElement(this.botFires, this.botFires[i]);
                
                this.lifelbl.setString(--this.jumper.life);
            }
        }
    },
    
    checkBotTouched: function() {
        for (var i = 0; i < this.bots.length; i++) {
            if (this.bots[i].isTouch(this.jumper)) {
                console.log("bots[" + i + "] " + this.bots[i].touch);
                this.bots[i].touch++;
            }
            
            // stamp
            if (this.bots[i].isStamp(this.jumper)) {
                this.jumper.vy = this.jumper.jumpV;
                
                this.removeChild(this.bots[i]);
                this.removeElement(this.bots, this.bots[i]);
                this.scorelbl.setString(++this.killedBot);
                console.log("stamp " + i);
            }
        }
    },
    
    removeElement: function(list, data) {
        var index = list.indexOf(data);
        if (index > -1) {
            list.splice(index, 1);
        }
    },
    
    gameOver: function() {
        this.setKeyboardEnabled(false);
        this.unscheduleUpdate();
        this.scene.gameOver();
        for (var i = 0; i < this.bots.length; i++) {
            this.bots[i].unscheduleUpdate();
        }
        this.jumper.unscheduleUpdate();
    }
});