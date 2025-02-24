import * as THREE from "three";

export class Scene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    public models : [] = [];

    constructor( 
        width: number,
        height: number,
        wrapper: HTMLElement
     ) {
        this.scene = new THREE.Scene();
        // props: camera: ( fov: number, aspect: number, near: number, far: number )
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        this.renderer.setSize(width, height);
        wrapper.appendChild(this.renderer.domElement);

        this.renderer.domElement.id = "layer-3D";
     }

    public add3DModel() {}

    public render() {}

}