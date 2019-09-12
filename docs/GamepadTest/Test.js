(function(THREE, CoreLib, GameLogic){
	'use strict'
	
	var raycaster;
	var mouse;
	var intersected;
	
	var gamepads = [];
	
	function writeInfo(msg)
	{
		if (msg) {
			document.getElementById("score").innerHTML = document.getElementById("score").innerHTML + msg + "</br>";
		}
		else {
			document.getElementById("score").innerHTML = msg;
		}
	}
	
	function init(scene, camera) {
		camera.position.z = 200;
		camera.position.y = 100;
		//camera.fov = 50;
		camera.lookAt( new THREE.Vector3(0,0,0) );
		//initBlock(scene, 10, 10);
		
		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();
		//var loader = new THREE.FontLoader();
		//loader.load( 'lib/fonts/gentilis_regular.typeface.json', function ( font ) {
        //
		//	var geometry = new THREE.TextGeometry( 'Hello three.js!', {
		//		font: font,
		//		size: 80,
		//		height: 5,
		//		curveSegments: 12,
		//		bevelEnabled: true,
		//		bevelThickness: 10,
		//		bevelSize: 8,
		//		bevelSegments: 5
		//	} );
		//} );
		
		let geometry = new THREE.SphereGeometry( 100, 8, 8 );
		let material = new THREE.MeshBasicMaterial( {color: "#FFFFAA", wireframe: true} );
		let mesh = new THREE.Mesh( geometry, material );
		mesh.name = "ball";
		scene.add(mesh);
		
		CoreLib.Run();
	}
	function render(scene, camera, delta) {
		
		//let obj = scene.getObjectByName("ball");
		////obj.rotation.x -= 0.03;//Math.PI / 2;
		////obj.rotation.y -= 0.03;
		//CoreLib.RotateAroundWorldAxis(obj, new THREE.Vector3(1,0,0), Math.PI / 180);
		//CoreLib.RotateAroundWorldAxis(obj, new THREE.Vector3(0,1,0), Math.PI / 180);
		//CoreLib.RotateAroundWorldAxis(obj, new THREE.Vector3(0,0,1), Math.PI / 180);
		
		//==========================
		// gamepad
		//==========================
		let obj = scene.getObjectByName("ball");
        
		let gps = navigator.getGamepads();
        
		//if (gps.length > 0) {
		//	//console.log(gamepads);
		//	let gp = gps[0];
		//		
        //
		//	writeInfo("");
		//	writeInfo("ID: " + gp.id);
		//	writeInfo("Axes: " + gp.axes.length);
		//	writeInfo("Buttons: " + gp.buttons.length);
		//	writeInfo("Mapping: " + gp.mapping);
		//	
		//	for (var i=0; i< gp.axes.length; i++)
		//		writeInfo("Axes " + i + ": " + gp.axes[i].toFixed(4));
		//	
		//	for (var i=0; i< gp.buttons.length; i++)
		//		writeInfo("Buttons " + i + ": " + gp.buttons[i].pressed);
		//	
	    //
		//	//if (y < 0) {
		//	//	console.log("Right stick is being pushed up!");
		//	//}
		//}
		writeInfo("");		
		for (var i = 0; i<gps.length; i++) {
			let gp = gps[i];
			for (var j = 0; j<gamepads.length; j++) {	
				if (gamepads[j].getIndex() == gp.index) {

					writeInfo("ID: " + gp.id);
					writeInfo("Axes: " + gp.axes.length);
					writeInfo("Buttons: " + gp.buttons.length);
					writeInfo("Mapping: " + gp.mapping);
					
					for (var i=0; i< gp.axes.length; i++)
						writeInfo("Axes " + i + ": " + gp.axes[i].toFixed(4));
					
					for (var i=0; i< gp.buttons.length; i++)
						writeInfo("Buttons " + i + ": " + gp.buttons[i].pressed);
				}
			}
		}
		
		
		////====================
		////mouse
		////====================
		//// update the picking ray with the camera and mouse position
		//raycaster.setFromCamera( mouse, camera );
		//
		//// calculate objects intersecting the picking ray
		//var intersects = raycaster.intersectObjects( scene.children );
        //
		//if (intersects.length > 0) {
		//	if (intersected != intersects[0].object) {
		//		if (intersected) intersected.material.color.setHex( intersected.currentHex );
		//		intersected = intersects[0].object
		//		intersected.currentHex = intersected.material.color.getHex();
		//		intersected.material.color.setHex( 0xff0000 );
		//	}
		//}
		//else {
		//	if (intersected) intersected.material.color.setHex( intersected.currentHex );
		//	intersected = null;
		//}
		//
		////for ( var i = 0; i < intersects.length; i++ ) {
        ////
		////	intersects[ i ].object.material.color.set( 0xff0000 );
        ////
		////}
	}
	function initKey() {
		function onMouseMove( event ) {

			// calculate mouse position in normalized device coordinates
			// (-1 to +1) for both components

			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		}
		window.addEventListener( 'mousemove', onMouseMove, false );
		
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
		
		var adapter = new GamepadAdapter();		  
		adapter.init(0,null);
	}
	
	function initBlock(scene, xcnt, ycnt) {
		for(var x = 0; x < xcnt; x++) {
			for(var y = 0; y < ycnt; y++) {
				let g = new THREE.PlaneGeometry( 8, 8, 32 );
				let m = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
				let p = new THREE.Mesh( g, m );
				p.position.x = x * 10
				p.position.y = y * 10
				scene.add(p);
			}
		}
	}
	
	GameLogic.Init = init;
	GameLogic.InitKey = initKey;
	GameLogic.Render = render;
	
})(THREE, CoreLib, this.GameLogic = this.GameLogic || {})