(function(THREE, CoreLib){
	'use strict'
	
	var scene;
	var camera;
	var renderer;
	
	var ctnr;
	var cid;
	var stats;
	
	var canvas_width;
	var canvas_height;
	
	var debugMode = false;
	//var mixers = [];
	var clock = new THREE.Clock();
	
	var ASSETS_PATH = 'assets/models/';
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};

	var fnActionPerFrame;
	
	function setAssetPath(path) {
		ASSETS_PATH = path;
	}
	
	function getCamera() {
		return camera;
	}
	
	function getScene() {
		return scene;
	}
	
	function initCamera(width, height){
		let c = new THREE.PerspectiveCamera( 75, canvas_width / canvas_height, 0.01, 10000 );
		c.position.z = -10;//200;
		return c;
	}

	function init(isDebug, ctnrID, fnInit, fnController, fnAction, fnCamera){
		debugMode = isDebug || false;
		//let canvas_width = window.innerWidth;
		//let canvas_height = window.innerHeight;
		canvas_width = window.innerWidth;
		canvas_height = window.innerHeight;		
		ctnr = document.getElementById(ctnrID);
		if (ctnr) {
			cid = ctnrID;
			canvas_width = ctnr.offsetWidth;
			canvas_height = ctnr.offsetHeight;
		}
		ctnr = ctnr || document.body;	
		
		console.log(ctnr, canvas_width, canvas_height);
		
		if (fnCamera)
			camera = fnCamera(canvas_width, canvas_height);
		else
			camera = initCamera(canvas_width, canvas_height);
		//camera = new THREE.PerspectiveCamera( 75, canvas_width / canvas_height, 0.01, 10000 );
		//camera.position.z = -10;//200;

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x000000 );
		//scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

		//var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
		//light.position.set( 0.5, 1, 0.75 );
		//scene.add( light );
		
		//var ambientLight = new THREE.AmbientLight('#fff');
		//scene.add(ambientLight);
		
		renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setSize( canvas_width, canvas_height );
		ctnr.appendChild( renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );
		
		if (debugMode == true) {
			let axes = new THREE.AxesHelper( 1000 );
			scene.add( axes );
			
			let controls = new THREE.OrbitControls( camera, renderer.domElement );		
			
			stats = new Stats();
			stats.showPanel( 0 );
			ctnr.appendChild( stats.dom );
		}

		if (fnInit){
			fnInit(scene, camera);
		}
		
		if (fnController){
			fnController();
		}
		
		if (fnAction){
			fnActionPerFrame = fnAction || "";
		}
	}
	
	function onWindowResize(){
		//camera.aspect = window.innerWidth / window.innerHeight;
		//camera.updateProjectionMatrix();
		//renderer.setSize( window.innerWidth, window.innerHeight );
		
		//let canvas_width = ctnr.offsetWidth;
		//let canvas_height = ctnr.offsetHeight;		
		if (cid){
			canvas_width = ctnr.offsetWidth;
			canvas_height = ctnr.offsetHeight;
		}
		else{
			canvas_width = window.innerWidth;
			canvas_height = window.innerHeight;
		}

		//camera.aspect = window.innerWidth / window.innerHeight;
		camera.aspect = canvas_width / canvas_height;
		camera.updateProjectionMatrix();
		
		//renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setSize( canvas_width, canvas_height );
		
		console.log(ctnr, canvas_width, canvas_height);
	}
	
	function run() {
		if (debugMode == true)
			stats.begin();
		
		requestAnimationFrame( run );	
		
		//if ( mixers.length > 0 ) {
        //
		//	for ( var i = 0; i < mixers.length; i ++ ) {
        //
		//		mixers[ i ].update( clock.getDelta() );
        //
		//	}
        //
		//}
		//if (CoreLib.ActionPerFrame)
		//	CoreLib.ActionPerFrame();
		var delta = clock.getDelta();
	
		if (fnActionPerFrame)
			fnActionPerFrame(scene, camera, delta);
		
		renderer.render( scene, camera );
		if (debugMode == true)
			stats.end();
	}
	
	let onProgress = function ( xhr ) {
				if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					console.log( Math.round(percentComplete, 2) + '% downloaded' );
				}
			};
			
	let onError = function ( xhr ) { 
				console.log(xhr);
			};	
	
	function initTexture(name, subFolder, fnAfterLoad) {
		return new Promise( function (resolve, reject) {
			//var onProgress = function ( xhr ) {
			//	if ( xhr.lengthComputable ) {
			//		var percentComplete = xhr.loaded / xhr.total * 100;
			//		console.log( Math.round(percentComplete, 2) + '% downloaded' );
			//	}
			//};
			//
			//var onError = function ( xhr ) { 
			//	console.log(xhr);
			//};	
			
			var loader = new THREE.TextureLoader(manager);
			loader.crossOrigin = "anonymous";
			let folder = subFolder || "";
			folder = ASSETS_PATH + folder;
			console.log(folder);
			//loader.setPath(folder);
			loader.load(folder + name, function(object) {
				if (fnAfterLoad)
					fnAfterLoad(object);
				resolve( object );
			}, onProgress, xhr => reject(xhr));
		});
	}
	
	function initGLTF(name, subFolder, fnAfterLoad) {
		return new Promise( function (resolve, reject) {
			//var onProgress = function ( xhr ) {
			//	if ( xhr.lengthComputable ) {
			//		var percentComplete = xhr.loaded / xhr.total * 100;
			//		console.log( Math.round(percentComplete, 2) + '% downloaded' );
			//	}
			//};
			//
			//var onError = function ( xhr ) { 
			//	console.log(xhr);
			//};	
			
			var loader = new THREE.GLTFLoader(manager);
			let folder = subFolder || "";
			folder = ASSETS_PATH + folder;
			console.log(folder);
			//loader.setPath(folder);
			loader.load(folder + name, function(object) {
				//object.scene
				if (fnAfterLoad)
					fnAfterLoad(object);
				resolve( object );
			}, onProgress, xhr => reject(xhr));
		});
	}
	
	//function initGLTF(name, subFolder, fnAfterLoad) {
	//	var promises = [];
	//	promises.push(new Promise( function (resolve, reject) {
	//		var onProgress = function ( xhr ) {
	//			if ( xhr.lengthComputable ) {
	//				var percentComplete = xhr.loaded / xhr.total * 100;
	//				console.log( Math.round(percentComplete, 2) + '% downloaded' );
	//			}
	//		};
	//		
	//		var onError = function ( xhr ) { 
	//			console.log(xhr);
	//		};	
	//		
	//		var loader = new THREE.GLTFLoader(manager);
	//		let folder = subFolder || "";
	//		folder = ASSETS_PATH + folder;
	//		console.log(folder);
	//		//loader.setPath(folder);
	//		loader.load(folder + name, function(object) {
	//			fnAfterLoad(object);
	//		}, onProgress, xhr => reject(xhr));
	//	}));
	//	
	//	Promise.all(promises).then( 
	//		function (arrayOfObjects) {
	//			//objGrp.add( arrayOfObjects[0] );
	//			return arrayOfObjects[0];
	//			//scene.add( arrayOfObjects[0] );
	//		}, 
	//		function (error)  {
	//			console.error( "Could not load all textures:", error );			
	//		}
	//	);
	//}	

	function initMtlObj(name, subFolder, fnAfterLoad) {
		return new Promise( function (resolve, reject) {
			//var onProgress = function ( xhr ) {
			//	if ( xhr.lengthComputable ) {
			//		var percentComplete = xhr.loaded / xhr.total * 100;
			//		console.log( Math.round(percentComplete, 2) + '% downloaded' );
			//	}
			//};
			//	
			//var onError = function ( xhr ) { 
			//	console.log(xhr);
			//};		

			var mtlLoader = new THREE.MTLLoader(manager);
			let folder = subFolder || "";
			folder = ASSETS_PATH + folder
			console.log(folder);
			mtlLoader.setPath(folder);
			mtlLoader.load(name + '.mtl', function (materials) {
				
				materials.preload();
				
				var objLoader = new THREE.OBJLoader(manager);		
				objLoader.setMaterials(materials);
				objLoader.setPath(folder);
				objLoader.load(name + '.obj', function (object) {
					if (fnAfterLoad)					
						fnAfterLoad(object);
					//object.mixer = new THREE.AnimationMixer( object );
					//mixers.push( object.mixer );
					//console.log(object);
					
					resolve( object );
				}, onProgress, xhr => reject(xhr) );
			}, onProgress, xhr => reject(xhr));
		});
	}
	//function initMtlObj0(name, subFolder, fnAfterLoad){
	//	return initMtlObjX(name, null, subFolder, fnAfterLoad, null);
	//}
	function initMtlObjX(nameObj, nameMtl, subFolder, fnAfterLoadObj, fnAfterLoadMtl) {
		return new Promise( function (resolve, reject) {
			//var onProgress = function ( xhr ) {
			//	if ( xhr.lengthComputable ) {
			//		var percentComplete = xhr.loaded / xhr.total * 100;
			//		console.log( Math.round(percentComplete, 2) + '% downloaded' );
			//	}
			//};
			//	
			//var onError = function ( xhr ) { 
			//	console.log(xhr);
			//};		

			var mtlLoader = new THREE.MTLLoader(manager);
			let folder = subFolder || "";
			nameObj = nameObj || "";
			nameMtl = nameMtl || nameObj || "";
			folder = ASSETS_PATH + folder
			console.log(folder);
			mtlLoader.setPath(folder);
			mtlLoader.load(nameMtl + '.mtl', function (materials) {
				
				materials.preload();

				if (fnAfterLoadMtl)
					fnAfterLoadMtl(materials);
				
				var objLoader = new THREE.OBJLoader(manager);		
				objLoader.setMaterials(materials);
				objLoader.setPath(folder);
				objLoader.load(nameObj + '.obj', function (object) {
					if (fnAfterLoadObj)					
						fnAfterLoadObj(object);
					//object.mixer = new THREE.AnimationMixer( object );
					//mixers.push( object.mixer );
					//console.log(object);
					
					resolve( object );
				}, onProgress, xhr => reject(xhr) );
			}, onProgress, xhr => reject(xhr));
		});
	}
	
	
	function initMtlObj0(name, subFolder, fnAfterLoad){
		return initMtlObj2(name, null, subFolder, fnAfterLoad, null);
	}
	function initMtlObj2(nameMat, nameObj, subFolder, fnAfterLoadMat, fnAfterLoadObj) {		
		return new Promise( function (resolve, reject) {
			//var onProgress = function ( xhr ) {
			//	if ( xhr.lengthComputable ) {
			//		var percentComplete = xhr.loaded / xhr.total * 100;
			//		console.log( Math.round(percentComplete, 2) + '% downloaded' );
			//	}
			//};
			//	
			//var onError = function ( xhr ) { 
			//	console.log(xhr);
			//};				
			
			nameObj = nameObj || "";
			nameMat = nameMat || nameObj || "";
			let obj2 = new THREE.OBJLoader2();
			obj2.onProgress = onProgress;
			let folder = subFolder || "";
			folder = ASSETS_PATH + folder
			obj2.setPath(folder);
			obj2.loadMtl(nameMat + ".mtl", null, function(materials) {
				if (fnAfterLoadMat)
					fnAfterLoadMat(materials);
				
				obj2.setMaterials(materials);
				obj2.load(nameObj + ".obj", function(object) {
					//let root = object.detail.loaderRootNode;
					if (fnAfterLoad)
						fnAfterLoad( object );
					resolve( object );
				}, onProgress, xhr => reject(xhr) );
			}, onProgress, xhr => reject(xhr) );    
		});
	}
	

	//function initMtlObj(name, subFolder, fnAfterLoad) {
	//	var promises = [];
	//	promises.push(new Promise( function (resolve, reject) {
	//		var onProgress = function ( xhr ) {
	//			if ( xhr.lengthComputable ) {
	//				var percentComplete = xhr.loaded / xhr.total * 100;
	//				console.log( Math.round(percentComplete, 2) + '% downloaded' );
	//			}
	//		};
	//			
	//		var onError = function ( xhr ) { 
	//			console.log(xhr);
	//		};		
    //
	//		var mtlLoader = new THREE.MTLLoader(manager);
	//		let folder = subFolder || "";
	//		folder = ASSETS_PATH + folder
	//		console.log(folder);
	//		mtlLoader.setPath(folder);
	//		mtlLoader.load(name + '.mtl', function (materials) {
	//			
	//			materials.preload();
	//			
	//			var objLoader = new THREE.OBJLoader(manager);		
	//			objLoader.setMaterials(materials);
	//			objLoader.setPath(folder);
	//			objLoader.load(name + '.obj', function (object) {			
	//				fnAfterLoad(object);
	//				//object.mixer = new THREE.AnimationMixer( object );
	//				//mixers.push( object.mixer );
	//				//console.log(object);
	//				
	//				resolve( object );
	//			}, onProgress, xhr => reject(xhr) );
	//		}, onProgress, xhr => reject(xhr));
	//	}));
	//	
	//	Promise.all(promises).then( 
	//		function (arrayOfObjects) {
	//			//objGrp.add( arrayOfObjects[0] );
	//			return arrayOfObjects[0];
	//			//scene.add( arrayOfObjects[0] );
	//		}, 
	//		function (error)  {
	//			console.error( "Could not load all textures:", error );			
	//		}
	//	);
	//}
	
	function initFbx(name, subFolder, fnAfterLoad){
		return new Promise( function (resolve, reject) {
			//var onProgress = function ( xhr ) {
			//	if ( xhr.lengthComputable ) {
			//		var percentComplete = xhr.loaded / xhr.total * 100;
			//		console.log( Math.round(percentComplete, 2) + '% downloaded' );
			//	}
			//};
			//	
			//var onError = function ( xhr ) { 
			//	console.log(xhr);
			//};		

			var loader = new THREE.FBXLoader(manager);
			let folder = subFolder || "";
			folder = ASSETS_PATH + folder
			console.log(folder);
			loader.load(folder + name + '.fbx', function (object) {				
				//object.mixer = new THREE.AnimationMixer( object );
				//mixers.push( object.mixer );
                //console.log(object.animations);
				//var action = object.mixer.clipAction( object.animations[ 0 ] );
				//action.play();
                
				object.traverse( function ( child ) {
                
					if ( child.isMesh ) {
                
						child.castShadow = true;
						child.receiveShadow = true;
                
					}
                
				} );
				if (fnAfterLoad)
					fnAfterLoad(object);
				resolve( object );
			}, onProgress, xhr => reject(xhr));
		});
	}
	
	//function initFbx(name, subFolder, fnAfterLoad){
	//	var promises = [];
	//	
	//	promises.push(new Promise( function (resolve, reject) {
	//		var onProgress = function ( xhr ) {
	//			if ( xhr.lengthComputable ) {
	//				var percentComplete = xhr.loaded / xhr.total * 100;
	//				console.log( Math.round(percentComplete, 2) + '% downloaded' );
	//			}
	//		};
	//			
	//		var onError = function ( xhr ) { 
	//			console.log(xhr);
	//		};		
    //
	//		var loader = new THREE.FBXLoader(manager);
	//		let folder = subFolder || "";
	//		folder = ASSETS_PATH + folder
	//		console.log(folder);
	//		loader.load(folder + name + '.fbx', function (object) {				
	//			//object.mixer = new THREE.AnimationMixer( object );
	//			//mixers.push( object.mixer );
    //            //console.log(object.animations);
	//			//var action = object.mixer.clipAction( object.animations[ 0 ] );
	//			//action.play();
    //            
	//			object.traverse( function ( child ) {
    //            
	//				if ( child.isMesh ) {
    //            
	//					child.castShadow = true;
	//					child.receiveShadow = true;
    //            
	//				}
    //            
	//			} );
	//			fnAfterLoad(object);
	//		}, onProgress, xhr => reject(xhr));
	//	}));
	//	
	//	Promise.all(promises).then( 
	//		function (arrayOfObjects) {
	//			//objGrp.add( arrayOfObjects[0] );
	//			return arrayOfObjects[0];
	//			//scene.add( arrayOfObjects[0] );
	//		}, 
	//		function (error)  {
	//			console.error( "Could not load all textures:", error );			
	//		}
	//	);
	//}
	
	
	//var rotObjectMatrix;
	// Rotate an object around an arbitrary axis in object space	
	function rotateAroundObjectAxis(object, axis, radians) {
		var rotObjectMatrix = new THREE.Matrix4();
		rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

		// old code for Three.JS pre r54:
		// object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
		// new code for Three.JS r55+:
		object.matrix.multiply(rotObjectMatrix);

		// old code for Three.js pre r49:
		// object.rotation.getRotationFromMatrix(object.matrix, object.scale);
		// old code for Three.js r50-r58:
		// object.rotation.setEulerFromRotationMatrix(object.matrix);
		// new code for Three.js r59+:
		object.rotation.setFromRotationMatrix(object.matrix);
	}
	
	//var rotWorldMatrix;
	// Rotate an object around an arbitrary axis in world space       
	function rotateAroundWorldAxis(object, axis, radians) {
		var rotWorldMatrix = new THREE.Matrix4();
		rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

		// old code for Three.JS pre r54:
		//  rotWorldMatrix.multiply(object.matrix);
		// new code for Three.JS r55+:
		rotWorldMatrix.multiply(object.matrix);                // pre-multiply

		object.matrix = rotWorldMatrix;

		// old code for Three.js pre r49:
		// object.rotation.getRotationFromMatrix(object.matrix, object.scale);
		// old code for Three.js pre r59:
		// object.rotation.setEulerFromRotationMatrix(object.matrix);
		// code for r59+:
		object.rotation.setFromRotationMatrix(object.matrix);
	}
	
	function getRaySource(mesh, bIncludeCenter){
		let arrPt = []
		for (var vertexIndex = 0; vertexIndex < mesh.geometry.vertices.length; vertexIndex++) {
			let localVertex = mesh.geometry.vertices[vertexIndex].clone();			
			let globalVertex = localVertex.applyMatrix4(mesh.matrixWorld);
			arrPt.push(globalVertex);
		}
		
		if (bIncludeCenter){
			let pt = new THREE.Vector3();
			mesh.getWorldPosition(pt);
			arrPt.push(pt);
		}
		return arrPt;
	}
	
	function collisionDetection2(raycaster, arrStartPts, arrHurtBox, isSingleHit, fnOnHit){
		for(let i=0; i<arrStartPts.length; i++){
			raycaster.ray.origin.copy(arrStartPts[i]);
			let intersections = raycaster.intersectObjects( arrHurtBox );
			for (var j=0; j<intersections.length; j++) {
				let hurtbox = intersections[j].object;
				if (fnOnHit(arrStartPts[i], hurtbox)){
					if (isSingleHit)
						return;
				}
			}	
		}		
	}
	
	function loadBytes(path/*String*/, callback)
	{
		var request = new XMLHttpRequest();
		request.open("GET", path, true);
		request.responseType = "arraybuffer";
		request.onload = function(){
			switch(request.status){
			case 200:
				callback(request.response);
				break;
			default:
				console.error("Failed to load (" + request.status + ") : " + path);
				break;
			}
		}
		request.send(null);
		//return request;
	}
	
	function jsonParseFromBytes(buf)
	{
		
		// Assume UTF-8 without BOM
		let enc = new TextDecoder("utf-8");
		let jsonStr = enc.decode(buf);
		let jsonObj = JSON.parse(jsonStr);
		return jsonObj;
		//var jsonStr;
		//
		//
		//
		//var bomCode = new Uint8Array(buf, 0, 3);
		//if (bomCode[0] == 239 && bomCode[1] == 187 && bomCode[2] == 191) {
		//    jsonStr = String.fromCharCode.apply(null, new Uint8Array(buf, 3));
		//} else {
		//    jsonStr = String.fromCharCode.apply(null, new Uint8Array(buf));
		//}
		//
		//var jsonObj = JSON.parse(jsonStr);
		//
		//return jsonObj;
	}

	function textParseFromBytes(buf)
	{
		
		// Assume UTF-8 without BOM
		let enc = new TextDecoder("utf-8");
		let str = enc.decode(buf);
		return str;
	}
	
	
	function getParameterByName(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}
	
	CoreLib.SetAssetPath = setAssetPath
	CoreLib.Init = init;
	CoreLib.Run = run;
	CoreLib.InitMtlObj = initMtlObj;
	//CoreLib.InitMtlObj2 = initMtlObj2;
	CoreLib.InitFbx = initFbx;
	CoreLib.InitGLTF = initGLTF;
	CoreLib.InitTexture = initTexture;
	CoreLib.RotateAroundObjectAxis = rotateAroundObjectAxis;
	CoreLib.RotateAroundWorldAxis = rotateAroundWorldAxis;
	CoreLib.ActionPerFrame = "";
	CoreLib.GetCamera = getCamera;
	CoreLib.GetScene = getScene;
	CoreLib.GetParameterByName = getParameterByName;
	CoreLib.GetRaySource = getRaySource;
	CoreLib.CollisionDetection = collisionDetection2;
	CoreLib.LoadBytes = loadBytes;	
	CoreLib.ByteToJson = jsonParseFromBytes;
	CoreLib.ByteToText = textParseFromBytes;
	
})(THREE, this.CoreLib = this.CoreLib || {})



