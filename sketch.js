// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(3, 3, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);
  const loader = new THREE.TextureLoader()
  const earthTexture = loader.load('./earth.jpg')
  const moonTexture = loader.load('./moon.jpg')
  // Setup a material
  const material = new THREE.MeshStandardMaterial({
    roughness:1,
    metalness:0,
    map:earthTexture
  });
  const moonMaterial = new THREE.MeshStandardMaterial({
    rotation:10,
    map:moonTexture
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  const moonGroup = new THREE.Group()
  const light = new THREE.PointLight('white',1.25 )
  light.position.set(1.5,1,0)
  scene.add(light)
  moonMesh.position.set(1.5,1,0)
  moonMesh.scale.setScalar(.25)
  // scene.add(new THREE.PointLightHelper(light))
  scene.add(mesh);
  moonGroup.add(moonMesh);
  // moonGroup.add(light);
  scene.add(moonGroup);
  

  
  // scene.add(new THREE.PointLightHelper(light,1))
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      mesh.rotation.y = time *.15
      moonMesh.rotation.y = time *.25
      moonGroup.rotation.y = time * .35
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
