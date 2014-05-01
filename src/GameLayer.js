var GameLayer = cc.LayerColor.extend({
    // initial part //
    init: function(scene) {
        this._super(new cc.Color4B(127, 127, 127, 255));
        this.setPosition(new cc.Point(0, 0));
        
        this.scene = scene;
        this.createBlocks();
        
        this.initValue();
        this.initJumper();
        
        this.scorelbl = this.createLbl(750, 550, 0);
        this.timelbl = this.createLbl(500, 550, 0);
        this.lifelbl = this.createLbl(100, 550, this.jumper.life);
        
        this.setKeyboardEnabled(true);
        this.scheduleUpdate();
        return true;
    },
    
    initValue: function() {
        this.botNum = 30;
        this.killedBot = 0;
        this.time = 3000;
        this.bots = [];
        this.fires = [];
        this.botFires = [];
        this.lastFire = new Date().getTime();
    },
    
    initJumper: function() {
        this.jumper = new Jumper(400, 160, this);
        this.jumper.setBlocks(this.blocks);
        this.addChild(this.jumper);
        this.scheduleOnce(function() {
            this.jumper.scheduleUpdate();
        }, 2);
    },
    
    createLbl: function(x, y, initString) {
        var lbl = cc.LabelTTF.create('0', 'Arial', 40);
        lbl.setPosition(new cc.Point(x, y));
        lbl.setString(initString);
        this.addChild(lbl);
        return lbl;
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
    
    // game function part //
    fire: function() {
        var fire = new Fire(this);
        this.fires.push(fire);
        this.lastFire = new Date().getTime();
    },
    
    botFire: function(bot) {
        var botFire = new BotFire(bot, this);
        this.botFires.push(botFire);
    },
    
    rocketFires: function() {
        for (var i = 0; i < 5 && i < this.bots.length; i++) {
            var rocketFire = new RocketFire(this, this.bots[i]);
            this.fires.push(rocketFire);
        }
        console.log("rocketFires");
    },
    
    createBot: function() {
        var bot = new Bot(600, 600, this);
        bot.setBlocks(this.blocks);
        this.addChild(bot);
        bot.scheduleUpdate();
        this.bots.push(bot);
        this.botNum--;
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
    
    checkBotTouched: function() {
        for (var i = 0; i < this.bots.length; i++) {
            // inLine
            if (this.bots[i].isInLine(this.jumper)) {
                console.log("bots[" + i + "] " + this.bots[i].inLine);
                this.bots[i].inLine++;
            }

            // touch
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
    
    checkGameOver: function() {
        if (this.time <= 0 || this.jumper.life <= 0) {
            this.gameOver();
            //this.scene.removeChild(this);
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
    },
    
    // general part //
    onKeyDown: function(e) {
        this.jumper.handleKeyDown(e);
        
        switch(e) {
            case cc.KEY.space:
                if (new Date().getTime() - this.lastFire >= 300) {
                    this.fire();
                }
            break;
            case cc.KEY.r:
                this.rocketFires();
            break;
        }
    },

    onKeyUp: function(e) {
        this.jumper.handleKeyUp(e);
    },
    
    update: function() {
        if (this.botNum > 0) {
            var ran = 1 + Math.floor(Math.random() * 50);
            if (ran == 1) {
                this.createBot();
            }
        }
        this.checkBotKilled();
        this.checkBotTouched();
        this.checkKilled();
        
        this.time--;
        this.timelbl.setString(parseInt(this.time));
        
        this.checkGameOver();
    },
    
    removeElement: function(list, data) {
        var index = list.indexOf(data);
        if (index > -1) {
            list.splice(index, 1);
        }
    }
});