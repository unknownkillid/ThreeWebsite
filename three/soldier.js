const scene = new THREE.Scene();
scene.background = new THREE.Color(0xADD8E6);

const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 0.6
camera.rotation.z = 0

const newFOV = 120;
camera.fov = newFOV;
camera.updateProjectionMatrix();

function positions() {
  requestAnimationFrame(positions)

  console.log(camera.position)
}

positions();

const renderer = new THREE.WebGLRenderer({ antialias: true });

const soldierContainer = document.getElementById('SoldierContainer');
const containerWidth = soldierContainer.clientWidth;
const containerHeight = window.innerHeight;
renderer.setSize(containerWidth, containerHeight);
soldierContainer.appendChild(renderer.domElement);

// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.enableZoom = true;
// controls.enableRotate = true;
// controls.enabled = true;

// controls.minPolarAngle = Math.PI / 2;
// controls.maxPolarAngle = Math.PI / 2; 


function onWindowResize() {
  const newWidth = soldierContainer.clientWidth;
  const newHeight = window.innerHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
}

onWindowResize();

window.addEventListener('resize', onWindowResize);


// const place = new THREE.GLTFLoader();
// place.load('three/place/scene.gltf', (gltf) => {
//   const city = gltf.scene;
//   scene.add(city);

//   city.rotation.x = 0.3;
//   // city.rotation.y = -1;
//   city.rotation.z = 1;
//   // city.position.z = 40;
//   city.position.x = -25;
//   city.position.y = -13;

//   city.scale.set(100, 100, 100);
// })

const loader = new THREE.GLTFLoader();
let mixer;

loader.load('three/model/scene.gltf', (gltf) => {
  const weapon = gltf.scene;
  scene.add(weapon);

  const bbox = new THREE.Box3().setFromObject(weapon);
  const center = bbox.getCenter(new THREE.Vector3());
  weapon.position.sub(center);

  camera.position.z = -18.5;
  camera.rotation.x = -0.2
  // camera.lookAt(center);
  weapon.position.y = -2.7;
  // weapon.position.x = 1.9;
  weapon.position.z = -19.1;
  weapon.rotation.x = 0.4
  weapon.rotation.z = 0.1
  weapon.rotation.y = 3.2;
  weapon.scale.set(7, 7, 7);

  mixer = new THREE.AnimationMixer(weapon);
  const reloadAnimation = gltf.animations[4];
  const reloadAction = mixer.clipAction(reloadAnimation);
  reloadAction.setLoop(THREE.LoopOnce);

  const inspectAnimation = gltf.animations[2];
  const inspectAction = mixer.clipAction(inspectAnimation)
  inspectAction.setLoop(THREE.LoopOnce);

  const shootingAnimation = gltf.animations[6]
  const shootingAction = mixer.clipAction(shootingAnimation)
  shootingAction.setLoop(THREE.LoopOnce);

  const idleAnimation = gltf.animations[0]
  const idleAction = mixer.clipAction(idleAnimation)
  idleAction.setLoop(THREE.LoopTwice);

  const SMGReload = new Audio();
  SMGReload.src = 'sounds/SMGReload/reload.mp3'
  SMGReload.volume = 1;

  const SMGShooting = new Audio();
  SMGShooting.src = 'sounds/SMGReload/9mmShooting.mp3'
  SMGShooting.volume = 1;
  
  let reloading = false; 
  let inspect = false;
  let shooting = false;
  let idle = true;

  function idleFunction() {
    if (idle) {
      idleAction.play()
    } else {
      idleAction.stop();
    }
    requestAnimationFrame(idleFunction)
  }

  idleFunction();
  
  function reloadingOnKey() {
    addEventListener('keydown', (event) => {
      if (event.keyCode === 82 && !reloading && !inspect) {
        reloadAction.reset(); 
        reloadAction.play();
        // SMGReload.play();
        reloading = true;
        idle = false;
  
        const animationDuration = reloadAnimation.duration * 1000;
        setTimeout(() => {
          reloading = false;
          idle = true;
        }, animationDuration);
      }

      else if (event.keyCode === 70 && !inspect && !reloading) {
        inspectAction.reset();
        inspectAction.play();
        inspect = true;
        idle = false;

        const inspectDuration = inspectAnimation.duration * 1000
        setTimeout(() => {
          inspect = false;
          idle = true;
        }, inspectDuration);
      } 

      else if (event.keyCode === 81 && !inspect && !reloading && !shooting) {
        shootingAction.reset();
        shootingAction.play();
        shooting = true;
        idle = false;
        // SMGShooting.loop = true;

        const shootingDuration = shootingAnimation.duration * 280
        setTimeout(() => {
          shooting = false;
          idle = true;
        }, shootingDuration);
      } else if (event.keyCode === 81) {
        SMGShooting.play()
      }
   
    });
  
    requestAnimationFrame(reloadingOnKey);
  }
  
  reloadingOnKey();
});

const animate = () => {
  requestAnimationFrame(animate);
  // controls.update();
  if (mixer) {
    mixer.update(0.02);
  }
  renderer.render(scene, camera);

};

animate();

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
scene.add(directionalLight);

const pointlight = new THREE.PointLight(0xffffff, 500)
scene.add(pointlight)

pointlight.position.x = 1;
pointlight.position.z = -2;
pointlight.position.y = 3;

// const pointLightHelper = new THREE.PointLightHelper(PointLight);
// scene.add(pointLightHelper);

