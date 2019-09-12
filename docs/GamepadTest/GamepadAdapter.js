var GamepadAdapter = (function(THREE, CoreLib){
	'use strict';
	
	var constructorA = function() {
		var index;
		var keyConfig;
		var init = function(index, config) {
			this.index = index;
			if (!config)
				config = "gamepad.Standard.config.json";
			
			CoreLib.LoadBytes(config, function(b) {
				keyConfig = CoreLib.ByteToJson(b);
				
				//var testGamepad = {
				//	axes: [0.01, 0.01, 0.02, 0.04],
				//	buttons: [
				//	  { pressed: true, value: 1 },
				//	  { pressed: false, value: 0 },
				//	  { pressed: false, value: 0 },
				//	  { pressed: false, value: 0 },
				//	],
				//	connected: true,
				//	id: "Xbox 360 Controller (XInput STANDARD GAMEPAD)",
				//	index: 0,
				//	mapping: "standard",
				//	timestamp: 177550
				//};			
				//
				//console.log(isPressed(testGamepad, "A"));
				//console.log(isPressed(testGamepad, "Up"));
				//console.log(getValue(testGamepad, "A"));
				//console.log(getValue(testGamepad, "Up"));
			});
		};
		
		var getIndex = function() {
			return this.index;
		};
		
		var getAll = function(gp) {
			var result = {};
			for (var k in keyConfig) {
				let b = isPressed(gp, k);
				let v = getValue(gp, k);
				if (b)
					result.b = v;
			}
			return result;
		}
		
		var isPressed = function(gp, code) {
			let type = keyConfig[code].type
			let idx = keyConfig[code].idx
			if (type == "buttons")
			{
				if (gp.buttons.length > idx)
					return gp.buttons[idx].pressed;
				else
					return false;
			}
			else if (type == "axes+") {
				if (gp.axes.length > idx)
					return gp.axes[idx] > 0.5;
				else
					return false;
			}
			else if (type == "axes-") {
				if (gp.axes.length > idx)
					return gp.axes[idx] < -0.5;
				else
					return false;
			}
			else {
				return false
			}
		};
		
		var getValue = function(gp, code) {
			let type = keyConfig[code].type
			let idx = keyConfig[code].idx
			if (type == "buttons")
			{
				if (gp.buttons.length > idx)
					return gp.buttons[idx].value;
				else
					return 0;
			}
			else if (type == "axes+") {
				if (gp.axes[idx] > 0.5) 
					return gp.axes[idx]
				else 
					return 0;
			}
			else if (type == "axes-") {
				if (gp.axes[idx] < -0.5) 
					return gp.axes[idx]
				else 
					return 0;
			}
			else {
				return 0
			}
		};
		
		// public object declaration
		let publicApis = {};
		publicApis.init = init;
		publicApis.isPressed = isPressed;
		publicApis.getValue = getValue;
		publicApis.getIndex = getIndex;
		return publicApis;
	};	
	return constructorA;

})(THREE, CoreLib)