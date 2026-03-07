import { BoxGeometry, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, Timer, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';

export class PlanetSimulator {
    private renderer: WebGLRenderer;
    private canvas: HTMLCanvasElement;
    private camera: PerspectiveCamera;
    private scene: Scene;
    private controls: OrbitControls;
    private fpsCounter: Stats;
    private timer: Timer;

    // Temp Code
    private box: Mesh;

    private setSize() {
        const dpr = window.devicePixelRatio;
        const w = Math.floor(this.canvas.clientWidth * dpr);
        const h = Math.floor(this.canvas.clientHeight * dpr);

        if (w === this.canvas.width && h === this.canvas.height) { return; }

        this.renderer.setSize(w, h, false);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderer = new WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
        });

        this.camera = new PerspectiveCamera();
        this.camera.position.set(0, 0, 200);

        this.fpsCounter = new Stats();
        if (__DEBUG__) { document.body.appendChild(this.fpsCounter.dom); }

        this.setSize();
        window.addEventListener('resize', () => this.setSize());


        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);

        this.timer = new Timer();
        this.timer.connect( document );

        this.scene = new Scene();

        // Temp Code
        this.box = new Mesh(
            new BoxGeometry(50, 50, 50),
            new MeshNormalMaterial()
        );
        this.scene.add(this.box);
        this.controls.autoRotate = true;
    }

    run() {
        const loop = (time?: number) => {
            this.fpsCounter.begin();

            this.timer.update(time);
            const deltaTime = this.timer.getDelta();
            this.controls.update(deltaTime);

            this.renderer.render(this.scene, this.camera);
            this.fpsCounter.end();
            
            window.requestAnimationFrame(loop);
        };

        window.requestAnimationFrame(loop);
    }
}