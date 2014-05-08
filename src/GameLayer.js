var GameLayer = cc.LayerColor.extend({
    // initial part //
    init: function(scene, state) {
        this._super(new cc.Color4B(127, 127, 127, 255));
        this.setPosition(new cc.Point(0, 0));
        
        this.scene = scene;
        this.state = state;
        this.createBlocks();
        
        this.initValue();
        this.initJumper();
        
        this.finishStart = false;
        this.timeStart = 4;
        this.frameStart = 0;
        this.notPlayLayer = true;
        this.startTimelbl = this.lifelbl = this.createLbl(screenWidth/2, screenHeight/2, this.timeStart);
        this.scheduleUpdate();
        
        return true;
    },
    
    initValue: function() {
        this.botNum = GameLayer.BOTNUM[this.state];
        this.killedBot = 0;
        this.time = GameLayer.TIME[this.state];;
        this.bots = [];
        this.fires = [];
        this.botFires = [];
        this.lastFire = new Date().getTime();
    },
    
    initJumper: function() {
        var x = GameLayer.BIRTHPOSITION[this.state][0];
        var y = GameLayer.BIRTHPOSITION[this.state][1];
        this.jumper = new Jumper(x, y, this);
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
        for (var i = 0; i < GameLayer.BLOCKS[this.state].length; i++) {
            var x1 = GameLayer.BLOCKS[this.state][i][0];
            var y1 = GameLayer.BLOCKS[this.state][i][1];
            var x2 = GameLayer.BLOCKS[this.state][i][2];
            var y2 = GameLayer.BLOCKS[this.state][i][3];
            var block = new Block(x1, y1, x2, y2);
            this.blocks.push(block);
            this.addChild(block);
        }
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
    },
    
    createBot: function() {
        var len = GameLayer.BOTBIRTHPOSITION[this.state].length;
        var ran = 0 + Math.floor(Math.random() * len);
        var x = GameLayer.BOTBIRTHPOSITION[this.state][ran][0];
        var y = GameLayer.BOTBIRTHPOSITION[this.state][ran][1];
        var bot = new Bot(x, y, this);
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
                //console.log("bots[" + i + "] " + this.bots[i].inLine);
                this.bots[i].inLine++;
            }

            // touch
            if (this.bots[i].isTouch(this.jumper)) {
                //console.log("bots[" + i + "] " + this.bots[i].touch);
                this.bots[i].touch++;
            }
            
            // stamp
            if (this.bots[i].isStamp(this.jumper)) {
                this.jumper.vy = this.jumper.jumpV;
                
                this.removeChild(this.bots[i]);
                this.removeElement(this.bots, this.bots[i]);
                this.scorelbl.setString(++this.killedBot);
                //console.log("stamp " + i);
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
            this.clearLayer();
            this.scene.gameOver();
        }  
    },
    
    checkStateCleared: function() {
        if (this.killedBot >= GameLayer.BOTNUM[this.state]) {
            this.clearLayer();
            this.scene.stateCleared();
        }  
    },
    
    clearLayer: function() {
        this.setKeyboardEnabled(false);
        this.unscheduleUpdate();
        for (var i = 0; i < this.bots.length; i++) {
            this.bots[i].unscheduleUpdate();
        }
        for (var i = 0; i < this.fires.length; i++) {
            this.fires[i].unscheduleUpdate();
        }
        this.jumper.unscheduleUpdate();
    },
    
    randomItem: function() {
        
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
        if (this.finishStart) {
            if (this.notPlayLayer) {
                this.scorelbl = this.createLbl(750, 550, 0);
                this.timelbl = this.createLbl(500, 550, 0);
                this.lifelbl = this.createLbl(100, 550, this.jumper.life);
                this.setKeyboardEnabled(true);
                
                this.notPlayLayer = false;
            }
            
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
            this.checkStateCleared();
        }
        else {
            if (++this.frameStart >= 60) {
                this.startTimelbl.setString(--this.timeStart);
                this.frameStart = 0;
                
                if (this.timeStart <= 0) {
                    this.removeChild(this.startTimelbl);
                    this.finishStart = true;
                }
            }
        }
    },
    
    removeElement: function(list, data) {
        var index = list.indexOf(data);
        if (index > -1) {
            list.splice(index, 1);
        }
    }
});

GameLayer.BOTNUM = [
    30,
    40,
    80  
];

GameLayer.TIME = [
    3000,
    3000,
    4000
];

GameLayer.BIRTHPOSITION = [
    [400, 160],
    [400, 120],
    [400, 50]
];

GameLayer.BOTBIRTHPOSITION = [
    [[650, 600]],
    [[650, 600], [150, 600]],
    [[650, 600], [150, 600], [400, 600], [100, 50]]
];

GameLayer.BLOCKS = [
    [[0, 0, 700, 160], [100, 200, 400, 250], [600, 400, 800, 450]],
    [[0, 0, 700, 120], [0, 400, 200, 450], [100, 200, 400, 250], [600, 400, 800, 450]],
    [[0, 0, 700, 50], [0, 350, 200, 400], [300, 200, 500, 250], [600, 400, 800, 450]]
];
