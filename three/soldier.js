const scene = new THREE.Scene();
// scene.background = null;



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

const loader = new THREE.GLTFLoader();
let mixer;

loader.load('three/model/scene.gltf', (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  const bbox = new THREE.Box3().setFromObject(model);
  const center = bbox.getCenter(new THREE.Vector3());
  model.position.sub(center);

  camera.position.z = -18.5;
  camera.rotation.x = -0.2
  // camera.lookAt(center);
  model.position.y = -2.7;
  // model.position.x = 1.9;
  model.position.z = -19.1;
  model.rotation.x = 0.4
  model.rotation.z = 0.1
  model.rotation.y = 3.2;
  model.scale.set(7, 7, 7);

  mixer = new THREE.AnimationMixer(model);
  const reloadAnimation = gltf.animations[4];
  const reloadAction = mixer.clipAction(reloadAnimation);
  reloadAction.setLoop(THREE.LoopOnce);

  const inspectAnimation = gltf.animations[2];
  const inspectAction = mixer.clipAction(inspectAnimation)
  inspectAction.setLoop(THREE.LoopOnce);

  const SMGReload = new Audio();
  SMGReload.src = 'sounds/SMGReload/reload.mp3'
  SMGReload.volume = 1;
  
  let reloading = false; 

  let inspect = false;
  
  function reloadingOnKey() {
    addEventListener('keydown', (event) => {
      if (event.keyCode === 82 && !reloading) {
        reloadAction.reset(); 
        reloadAction.play();
        SMGReload.play();
        reloading = true;
  
        const animationDuration = reloadAnimation.duration * 1000;
        setTimeout(() => {
          reloading = false;
        }, animationDuration);
      }

      if (event.keyCode === 70) {
        inspectAction.reset();
        inspectAction.play();
        inspect = true;

        const inspectDuration = inspectAnimation.duration * 1000
        setTimeout(() => {
          inspect = false;
        }, inspectDuration);
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
    mixer.update(0.008);
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

