(function() {
    var randBool = function(probability) {
        return Math.random() < probability;
    };
 
    var calcDamage = function(atk, def) {
        var dmg = Math.round(atk * Math.pow(0.9375, def));
        console.log('atk:' + atk + ', def:' + def + ', damage = ' + dmg);
        return dmg;
    };
 
    var attack = function() {
        var id = $gameVariables.value(1)
        var enemy = $gameSystem.enemies[id];
        var player = $gameParty.leader();
        var patk = player.atk;
        var edef = enemy.def;
        enemy.hp -= calcDamage(patk, edef);
        if (enemy.hp <= 0) {
            console.log('def enemy');
            var p = enemy.probability;
            var exp = enemy.exp;
            player.changeExp(player.currentExp()+exp, true);
            console.log('prob = ' + p);
            var key = [$gameMap.mapId(), id, 'A'];
            if(randBool(p)) {
                console.log('item drop');
                key = [$gameMap.mapId(), id, 'B'];
            }
            $gameSelfSwitches.setValue(key, true);
        }
    };
 
    var damage = function() {
        var id = $gameVariables.value(1)
        var enemy = $gameSystem.enemies[id];
        var player = $gameParty.leader();
        var eatk = enemy.atk;
        var pdef = player.def;
        var dmg = calcDamage(eatk, pdef);
        $gameMap._interpreter.changeHp(player, -dmg, true);
        if (player.hp <= 0) { //dead
            switch(player.actorId()) {
            case 2:
                $gameSwitches.setValue(4, true);
                break;
            case 3:
                $gameSwitches.setValue(5, true);
                break;
            case 4:
                $gameSwitches.setValue(6, true);
                break;
            default:
                break;
            }
            if($gameSwitches.value(4) && $gameSwitches.value(5) && $gameSwitches.value(6)){
                //gameover
                $gameMap._interpreter.command353();
            } else {
                //retry
                $gameSwitches.setValue(2, true);
                $gameParty.removeActor(player.actorId());
            }
        }
    };
 
    var _Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        //if ($gameVariables.value(2) == 13) {
            this._characterSprites = [];
            $gameSystem.bossEventSprites = [];
            $gameMap.events().forEach(function(event) {
                var characterSprite = new Sprite_Character(event);
                $gameSystem.bossEventSprites[event.eventId()] = characterSprite;
                this._characterSprites.push(characterSprite);
            }, this);
            $gameMap.vehicles().forEach(function(vehicle) {
                this._characterSprites.push(new Sprite_Character(vehicle));
            }, this);
            $gamePlayer.followers().reverseEach(function(follower) {
                this._characterSprites.push(new Sprite_Character(follower));
            }, this);
            this._characterSprites.push(new Sprite_Character($gamePlayer));
            for (var i = 0; i < this._characterSprites.length; i++) {
                this._tilemap.addChild(this._characterSprites[i]);
            }
        //} else {
        //    _Spriteset_Map_createCharacters.call(this);
        //}
    };
 
    var tintBossImage = function(toneStr) {
        var tone = [0, 0, 0, 0];
        switch(toneStr) {
        case 'red':
            tone[0] = 127;
            break;
        case 'green':
            tone[1] = 127;
            break;
        case 'blue':
            tone[2] = 127;
            break;
        case 'yellow':
            tone[0] = 127;
            tone[1] = 127;
            break;
        case 'none':
            tone[0] = 0;
            tone[1] = 0;
            tone[2] = 0;
            break;
        default:
            break;
        }
        if($gameSystem.bossEventSprites) {
            $gameSystem.bossEventSprites[1].setColorTone(tone);
            $gameSystem.bossEventSprites[4].setColorTone(tone);
            $gameSystem.bossEventSprites[5].setColorTone(tone);
            $gameSystem.bossEventSprites[6].setColorTone(tone);
            $gameMap.events()[0].refresh();
            $gameMap.events()[3].refresh();
            $gameMap.events()[4].refresh();
            $gameMap.events()[5].refresh();
        }
    };
 
    var bossPosition = function() {
        $gameVariables.setValue(3, $gameMap.events()[0].x);
        $gameVariables.setValue(4, $gameMap.events()[0].y);
        //console.log($gameVariables.value(3)  + ', ' + $gameVariables.value(4));
 
    };
 
    var setBossState = function() {
        var boss = {};
        boss.hp = 100;
        boss.def = 8;
        $gameSystem.bossState = boss;
    }
 
    var attackBoss = function() {
        var player = $gameParty.leader();
        var boss = $gameSystem.bossState;
        var patk = player.atk;
        var bdef = boss.def;
        boss.hp -= calcDamage(patk, bdef);
        console.log('bossHp ' + boss.hp);
        if (boss.hp <= 0) {
            console.log('def boss');
            $gameSwitches.setValue(29, true);
        }
    };
 
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'EnemyManager') {
            if (args[0] === 'Attack') {
                attack();
            }
            if (args[0] === 'Damage') {
                damage();
            }
            if (args[0] === 'TintBossImage') {
                tintBossImage(args[1]);
            }
            if (args[0] === 'BossPosition') {
                bossPosition();
            }
            if (args[0] === 'SetBossState') {
                setBossState();
            }
            if (args[0] === 'AttackBoss') {
                attackBoss();
            }
        }
    };
 
})();