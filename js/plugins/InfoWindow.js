(function() {

    String.prototype.padSpace = function(length){
        var s = this;
        while (s.length < length) {
            s = ' ' + s;
        }
        return s;
    };
 
    Number.prototype.padSpace = function(length){
        return String(this).padSpace(length);
    };
 
	var Scene_map_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		Scene_map_start.call(this);
        this._InfoWindow = new Window_Info();
        this.addWindow(this._InfoWindow);
        this._MaterialWindow = new Window_Material();
        this.addWindow(this._MaterialWindow);
        this._DepthWindow = new Window_Depth();
        this.addWindow(this._DepthWindow);
 
        var hideWindow = $dataMap.events.filter(function(event) {
            return !!event && !!event.meta.HideWindow;
        });
        if(hideWindow.length > 0) {
            console.log("hidewindow");
            this._InfoWindow.hide();
            this._MaterialWindow.hide();
            this._DepthWindow.hide();
        }
	};
 
    Scene_Map.prototype.show = function() {
        this._InfoWindow.show();
        this._MaterialWindow.show();
        this._DepthWindow.show();
    };
 
    Scene_Map.prototype.hide = function() {
        this._InfoWindow.hide();
        this._MaterialWindow.hide();
        this._DepthWindow.hide();
    };
 
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
            this._InfoWindow.setText();
            this._MaterialWindow.setText();
            this._DepthWindow.setText();
    };
	
	function Window_Info() {
	    this.initialize.apply(this, arguments);
	}

	Window_Info.prototype = Object.create(Window_Base.prototype);
	Window_Info.prototype.constructor = Window_Info;
	Window_Info.prototype.initialize = function() {
		var x = 20;
		var y = 20;
        var width = 280;
        var height = 74;
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
	};

	Window_Info.prototype.setText = function(str) {
		this._text = str;
		this.refresh();
	};
	
	Window_Info.prototype.refresh = function() {
	    this.contents.clear();
		this.changeTextColor(this.textColor(16));
        var leader = $gameParty.leader();
        this.drawCharacter(leader.characterName(), leader.characterIndex(), 13, 40);
		this.resetTextColor();
        var text = 'LV:' + leader.level.padSpace(2);
        text += '   HP: ' + leader.hp.padSpace(3) + "/" + leader.mhp.padSpace(3)
        this.drawText(text, 40, 0);
	};
	
	Window_Info.prototype.standardFontSize = function() {
    	return 20;
    };

	Window_Info.prototype.standardPadding = function() {
    	return 18;
	};
 
 
	function Window_Material() {
        this.initialize.apply(this, arguments);
	}
 
	Window_Material.prototype = Object.create(Window_Base.prototype);
	Window_Material.prototype.constructor = Window_Material;
	Window_Material.prototype.initialize = function() {
        var x = 310;
        var y = 20;
        var width = 110;
        var height = 74;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
	};
 
	Window_Material.prototype.setText = function(str) {
        this._text = str;
        this.refresh();
	};
	
	Window_Material.prototype.refresh = function() {
        this.contents.clear();
        this.changeTextColor(this.textColor(16));
        this.drawCharacter('!Flame', 7, 13, 45);
        this.resetTextColor();
        this.drawText("x" + $gameParty.numItems($dataItems[1]).padSpace(2), 38, 0);
	};

	Window_Material.prototype.standardFontSize = function() {
        return 20;
    };
 
	Window_Material.prototype.standardPadding = function() {
        return 18;
	};
 
 function Window_Depth() {
 this.initialize.apply(this, arguments);
	}
 
	Window_Depth.prototype = Object.create(Window_Base.prototype);
	Window_Depth.prototype.constructor = Window_Depth;
	Window_Depth.prototype.initialize = function() {
        var x = Graphics.width - 130;
        var y = Graphics.height - 94;
        var width = 110;
        var height = 74;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
	};
 
	Window_Depth.prototype.setText = function(str) {
        this._text = str;
        this.refresh();
	};
	
	Window_Depth.prototype.refresh = function() {
        this.contents.clear();
        this.resetTextColor();
        var text = 'B' + $gameVariables.value(2).padSpace(3) + ' F';
        var pos = 8;
        if($gameVariables.value(2) === 13) {
            text = '狭間';
            pos = 18;
        }
        this.drawText(text, pos, 0);
	};
	
	Window_Depth.prototype.standardFontSize = function() {
        return 20;
    };

	Window_Depth.prototype.standardPadding = function() {
        return 18;
	};
 
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'InfoWindow') {
            if (args[0] === 'show') {
                SceneManager._scene.show();
            }
            if (args[0] === 'hide') {
                SceneManager._scene.hide();
            }
        }
    };
 
})();