import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Model {
    private loader: GLTFLoader;
    private model : THREE.Object3D | null = null;

    constructor() {}

    public loadModel() {}

    public setPosition() {}

    public setRotation() {}

    public setScale() {}

    public showModel() {}

    public hideModel() {}

    public getHand() {}
}
