// Art 109 Three.js Demo Site
// client3.js
// A three.js scene which uses basic shapes to generate a scene which can be traversed with basic WASD and mouse controls, this scene is full screen with an overlay.

// Import required source code
// Import three.js core
import * as THREE from "./build/three.module.js";
// Import pointer lock controls
import { PointerLockControls } from "./src/PointerLockControls.js";
import { GLTFLoader } from "./src/GLTFLoader.js";
import { OrbitControls } from './src/OrbitControls.js';
import { TrackballControls } from './src/TrackballControls.js';
// Establish variables
let camera, scene, renderer, controls;

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();
var mesh;
var mesh2;
var mesh3;
var mesh4;
var mesh5;
var mesh6;
var mesh7;

// Initialization and animation function calls
init();
animate();

// Initialize the scene
function init() {
  // Establish the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Define basic scene parameters
  scene = new THREE.Scene();
//  scene.background = new THREE.Color(0x97C0FC);
  var bgTexture = new THREE.TextureLoader().load("assets/grafitti.jpg");
  scene.background = bgTexture;
  scene.fog = new THREE.Fog(0xFEF9E7, 0, 750);

  // Define scene lighting
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // Define controls
  controls = new PointerLockControls(camera, document.body);

  // Identify the html divs for the overlays
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  // Listen for clicks and respond by removing overlays and starting mouse look controls
  // Listen
  instructions.addEventListener("click", function() {
    controls.lock();
  });
  // Remove overlays and begin controls on click
  controls.addEventListener("lock", function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  // Restore overlays and stop controls on esc
  controls.addEventListener("unlock", function() {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  // Add controls to scene
  scene.add(controls.getObject());

  // Define key controls for WASD controls
  const onKeyDown = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Add raycasting for mouse controls
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // Generate the ground
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // Vertex displacement pattern for ground
  let position = floorGeometry.attributes.position;

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);

    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  const colorsFloor = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.1 + 0, 0.05, Math.random() * 0.05 + 0.05);
    colorsFloor.push(color.r, color.g, color.b);
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );

  const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Insert completed floor into the scene
  scene.add(floor);
  for ( let i = 0; i < 20; i ++ ) {
  var newMaterial = new THREE.MeshStandardMaterial({
      color: 0xFA9626
    });

    //renderer.outputEncoding = THREE.sRGBEncoding;

  const loader = new GLTFLoader().load(
    "assets/cag.glb", // comment this line out and un comment the line below to swithc models
    //"./assets/gourd_web.glb", //<-- photogrammetery model
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        //  child.material = newMaterial;
          renderer.outputEncoding = THREE.sRGBEncoding;

        }
      });
      // set position and scale
      mesh = gltf.scene;
      //mesh.position.set(10, 10, 30);
    //  mesh.position.set(10,80,10);
      mesh.position.x = Math.random() * 600 - 400;
    	mesh.position.y = Math.random() * 1000 - 400;
    	mesh.position.z = Math.random() * 1300 - 400;
      mesh.rotation.set(0, 90, 90);
      mesh.scale.set(120,120, 120); // <-- change this to (1, 1, 1) for photogrammetery model
      // Add model to scene
      scene.add(mesh);


    },

    undefined,
    function(error) {
      console.error(error);
    }
  );
}
  for ( let i = 0; i < 20; i ++ ) {
  var newMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x97C0FC
    });
  const loader2 = new GLTFLoader().load(
    "assets/wild.glb", // comment this line out and un comment the line below to swithc models
    //"./assets/gourd_web.glb", //<-- photogrammetery model
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        //  child.material = newMaterial2;
        renderer.outputEncoding = THREE.sRGBEncoding;

        }
      });
      // set position and scale
      mesh2 = gltf.scene;
      //mesh2.position.set(250,20,30);
      mesh2.position.x = Math.random() * 1200 - 400;
      mesh2.position.y = Math.random() * 700 - 400;
      mesh2.position.z = Math.random() * 1000 - 400;
      mesh2.rotation.set(0, 90, 90);
      mesh2.scale.set(20,20, 20); // <-- change this to (1, 1, 1) for photogrammetery model
      // Add model to scene
      scene.add(mesh2);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
}
  for ( let i = 0; i < 20; i ++ ) {
  var newMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x97C0FC
    });
  const loader3 = new GLTFLoader().load(
    "assets/crazy.glb", // comment this line out and un comment the line below to swithc models
    //"./assets/gourd_web.glb", //<-- photogrammetery model
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        //  child.material = newMaterial2;
        renderer.outputEncoding = THREE.sRGBEncoding;

        }
      });
      // set position and scale
      mesh3 = gltf.scene;
    //  mesh3.position.set(50,20,10);
    mesh3.position.x = Math.random() * 1000 - 400;
    mesh3.position.y = Math.random() * 800 - 300;
    mesh3.position.z = Math.random() * 1000 - 400;
      mesh3.rotation.set(0, 0, 0);
      mesh3.scale.set(20,20, 20); // <-- change this to (1, 1, 1) for photogrammetery model
      // Add model to scene
      scene.add(mesh3);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
}
  for ( let i = 0; i < 20; i ++ ) {
  var newMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x97C0FC
    });
  const loader4 = new GLTFLoader().load(
    "assets/free.glb", // comment this line out and un comment the line below to swithc models
    //"./assets/gourd_web.glb", //<-- photogrammetery model
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        //  child.material = newMaterial2;
        renderer.outputEncoding = THREE.sRGBEncoding;

        }
      });
      // set position and scale
      mesh4 = gltf.scene;
    //  mesh4.position.set(100,20,300);
    mesh4.position.x = Math.random() * 1000 - 400;
    mesh4.position.y = Math.random() * 800 - 400;
    mesh4.position.z = Math.random() * 1000 - 400;
      mesh4.rotation.set(0, 90, 90);
      mesh4.scale.set(50,50, 50); // <-- change this to (1, 1, 1) for photogrammetery model
      // Add model to scene
      scene.add(mesh4);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
}
    for ( let i = 0; i < 20; i ++ ) {
  var newMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x97C0FC
    });
  const loader5 = new GLTFLoader().load(
    "assets/bumberstoot.glb", // comment this line out and un comment the line below to swithc models
    //"./assets/gourd_web.glb", //<-- photogrammetery model
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        //  child.material = newMaterial2;
        renderer.outputEncoding = THREE.sRGBEncoding;

        }
      });
      // set position and scale
      mesh5 = gltf.scene;
    //  mesh5.position.set(20,20,100);
    mesh5.position.x = Math.random() * 1000 - 400;
    mesh5.position.y = Math.random() * 800 - 400;
    mesh5.position.z = Math.random() * 1000 - 400;
      mesh5.rotation.set(0, 90, 90);
      mesh5.scale.set(50,50, 50); // <-- change this to (1, 1, 1) for photogrammetery model
      // Add model to scene
      scene.add(mesh5);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
}
  for ( let i = 0; i < 20; i ++ ) {
  var newMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x97C0FC
    });
  const loader6 = new GLTFLoader().load(
    "assets/bumfuzzle.glb", // comment this line out and un comment the line below to swithc models
    //"./assets/gourd_web.glb", //<-- photogrammetery model
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        //  child.material = newMaterial2;
        renderer.outputEncoding = THREE.sRGBEncoding;

        }
      });
      // set position and scale
      mesh6 = gltf.scene;
      //mesh6.position.set(50,20,-300);
      mesh6.position.x = Math.random() * 1000 - 400;
      mesh6.position.y = Math.random() * 1000 - 400;
      mesh6.position.z = Math.random() * 1000 - 400;
      mesh6.rotation.set(0, 90, 90);
      mesh6.scale.set(50,50, 50); // <-- change this to (1, 1, 1) for photogrammetery model
      // Add model to scene
      scene.add(mesh6);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
}
  for ( let i = 0; i < 20; i ++ ) {
  var newMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x97C0FC
    });
  const loader7 = new GLTFLoader().load(
    "assets/taradiddle.glb", // comment this line out and un comment the line below to swithc models
    //"./assets/gourd_web.glb", //<-- photogrammetery model
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        //  child.material = newMaterial2;
        renderer.outputEncoding = THREE.sRGBEncoding;

        }
      });
      // set position and scale
      mesh7 = gltf.scene;
    //  mesh7.position.set(10,20,200);
    mesh7.position.x = Math.random() * 1000 - 400;
    mesh7.position.y = Math.random() * 1000 - 400;
    mesh7.position.z = Math.random() * 1000 - 400;
      mesh7.rotation.set(0, 90, 90);
      mesh7.scale.set(50,50, 50); // <-- change this to (1, 1, 1) for photogrammetery model
      // Add model to scene
      scene.add(mesh7);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
}


  // Define Rendered and html document placement
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Listen for window resizing
  window.addEventListener("resize", onWindowResize);
}

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  // Check for controls being activated (locked) and animate scene according to controls
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
  mesh.rotation.x += 0.05;
  mesh.rotation.y += 0.05;
  mesh2.rotation.x += 0.1;
  mesh2.rotation.y += 0.1;
  mesh3.rotation.x += 0.05;
  mesh3.rotation.y += 0.05;
  mesh4.rotation.x += 0.1;
  mesh4.rotation.y += 0.1;
  mesh5.rotation.x += 0.1;
  mesh5.rotation.y += 0.1;
  mesh6.rotation.x += 0.05;
  mesh6.rotation.y += 0.05;
  mesh7.rotation.x += 0.05;
  mesh7.rotation.y += 0.05;

}
