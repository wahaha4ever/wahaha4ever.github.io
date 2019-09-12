InputAdapter = (function(THREE, CoreLib, window){
	var gamepads = {};
	
	var refresh = function() {
		var gps = navigator.getGamepads();
		
		for (var i = 0; i<gps.length; i++) {
			var gp = gps[i];
			for (var j = 0; j<gamepads.length; j++) {
				
			}
		}
		
	}
	
	var initEvent = function() {
		
		window.addEventListener("gamepadconnected", (event) => {
			console.log("A gamepad connected:");
			console.log(event.gamepad);

			var adapter = new GamepadAdapter();
			if (event.gamepad.mapping == "standard")
				adapter.init(event.gamepad.index, null);	
			else
				adapter.init(event.gamepad.index, "gamepad.PS2.config.json");
			gamepads.push(adapter);
		  
		});

		window.addEventListener("gamepaddisconnected", (event) => {
			console.log("A gamepad disconnected:");
			console.log(event.gamepad);
			
			for(var i = gamepads.length - 1; i>=0; i--) {
				if (gamepads[i].getIndex() == event.gamepad.index) {
					gamepads.splice(i, 1);
				}
			}
		});
	}
	
	
	
	
	
})(THREE, CoreLib, window)