import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Assists = {
  screenMesh: THREE.Mesh;
  computerMesh: THREE.Mesh;
  crtMesh: THREE.Mesh;
  keyboardMesh: THREE.Mesh;
  shadowPlaneMesh: THREE.Mesh;
  bakeTexture: THREE.Texture;
  bakeFloorTexture: THREE.Texture;
  publicPixelFont: Font;
  chillFont: Font;
  environmentMapTexture: THREE.CubeTexture;
};

function loadAssists(callback: (assists: Assists) => any) {
  const assists: any = {};

  const manager = new THREE.LoadingManager();

  manager.onLoad = function () {
    callback(assists as Assists);
  };

  // Fonts
  const fontLoader = new FontLoader(manager);
  fontLoader.load("/fonts/public-pixel.json", (font) => {
    assists.publicPixelFont = font;
  });
  fontLoader.load("/fonts/chill.json", (font) => {
    assists.chillFont = font;
  });

  // Texture

  // Texture
  const textureLoader = new THREE.TextureLoader(manager);
  textureLoader.load("/textures/bake-quality-5.jpg", (tex) => {
    tex.flipY = false;
    tex.encoding = THREE.sRGBEncoding;
    assists.bakeTexture = tex;
  });

  textureLoader.load("/textures/bake_floor-quality-3.jpg", (tex) => {
    tex.flipY = false;
    tex.encoding = THREE.sRGBEncoding;
    assists.bakeFloorTexture = tex;
  });

  const cubeTextureLoader = new THREE.CubeTextureLoader(manager);

  cubeTextureLoader.load(
    [
      `/textures/environmentMap/px.jpg`,
      `/textures/environmentMap/nx.jpg`,
      `/textures/environmentMap/py.jpg`,
      `/textures/environmentMap/ny.jpg`,
      `/textures/environmentMap/pz.jpg`,
      `/textures/environmentMap/nz.jpg`,
    ],
    (tex) => {
      assists.environmentMapTexture = tex;
    }
  );

  // Mesh
  const gltfLoader = new GLTFLoader(manager);
  gltfLoader.load("/models/Commodore710_33.5.glb", (gltf) => {
    assists.screenMesh = gltf.scene.children.find((m) => m.name === "Screen");
    assists.computerMesh = gltf.scene.children.find(
      (m) => m.name === "Computer"
    );
    assists.crtMesh = gltf.scene.children.find((m) => m.name === "CRT");
    assists.keyboardMesh = gltf.scene.children.find(
      (m) => m.name === "Keyboard"
    );
    assists.shadowPlaneMesh = gltf.scene.children.find(
      (m) => m.name === "ShadowPlane"
    );
 
  });
}

export { loadAssists };
export type { Assists };
