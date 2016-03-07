import Layer from '../Layer';
import extend from 'lodash.assign';
import THREE from 'three';
import Skybox from './Skybox';

// TODO: Make sure nothing is left behind in the heap after calling destroy()

class EnvironmentLayer extends Layer {
  constructor(options) {
    var defaults = {
      skybox: false
    };

    var _options = extend({}, defaults, options);

    super(_options);
  }

  _onAdd() {
    this._initLights();

    if (this._options.skybox) {
      this._initSkybox();
    }

    // this._initGrid();
  }

  // Not fleshed out or thought through yet
  //
  // Lights could potentially be put it their own 'layer' to keep this class
  // much simpler and less messy
  _initLights() {
    // Position doesn't really matter (the angle is important), however it's
    // used here so the helpers look more natural.

    if (!this._options.skybox) {
      var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.x = 1000;
      directionalLight.position.y = 1000;
      directionalLight.position.z = 1000;

      var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight2.position.x = -1000;
      directionalLight2.position.y = 1000;
      directionalLight2.position.z = -1000;

      // var helper = new THREE.DirectionalLightHelper(directionalLight, 10);
      // var helper2 = new THREE.DirectionalLightHelper(directionalLight2, 10);

      this.add(directionalLight);
      this.add(directionalLight2);

      // this.add(helper);
      // this.add(helper2);
    } else {
      // Directional light that will be projected from the sun
      this._skyboxLight = new THREE.DirectionalLight(0xffffff, 1);

      this._skyboxLight.castShadow = true;

      var d = 1000;
      this._skyboxLight.shadow.camera.left = -d;
      this._skyboxLight.shadow.camera.right = d;
      this._skyboxLight.shadow.camera.top = d;
      this._skyboxLight.shadow.camera.bottom = -d;

      this._skyboxLight.shadow.camera.near = 10000;
      this._skyboxLight.shadow.camera.far = 70000;

      // TODO: Need to dial in on a good shadowmap size
      this._skyboxLight.shadow.mapSize.width = 2048;
      this._skyboxLight.shadow.mapSize.height = 2048;

      // this._skyboxLight.shadowBias = -0.0010;
      // this._skyboxLight.shadow.darkness = 0.15;

      // this._object3D.add(new THREE.CameraHelper(this._skyboxLight.shadow.camera));

      this.add(this._skyboxLight);
    }
  }

  _initSkybox() {
    this._skybox = new Skybox(this._world, this._skyboxLight);
    this.add(this._skybox._mesh);
  }

  // Add grid helper for context during initial development
  _initGrid() {
    var size = 4000;
    var step = 100;

    var gridHelper = new THREE.GridHelper(size, step);
    this.add(gridHelper);
  }

  // Clean up environment
  destroy() {
    this._skyboxLight = null;

    this.remove(this._skybox._mesh);
    this._skybox.destroy();
    this._skybox = null;

    super.destroy();
  }
}

export default EnvironmentLayer;

var noNew = function(options) {
  return new EnvironmentLayer(options);
};

// Initialise without requiring new keyword
export {noNew as environmentLayer};
