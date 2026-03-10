import { Color, Mesh, PerspectiveCamera, Scene, Timer, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import { Group } from 'three';
import { SphereGeometry } from 'three';
import { MeshBasicMaterial } from 'three';

export class PlanetSimulator {
    private renderer: WebGLRenderer;
    private canvas: HTMLCanvasElement;
    private camera: PerspectiveCamera;
    private scene: Scene;
    private controls: OrbitControls;
    private fpsCounter: Stats;
    private timer: Timer;

    private moonOrbit: Group;
    private earthOrbit: Group;

    private createSolarSystem() {
        const moon = new Mesh(
            new SphereGeometry(1, 32, 32),
            new MeshBasicMaterial({ color: new Color(225, 225, 225) }),
        );

        const earth = new Mesh(
            new SphereGeometry(10, 32, 32),
            new MeshBasicMaterial({ color: new Color(0, 0, 225) }),
        );

        const sun = new Mesh(
            new SphereGeometry(40, 32, 32),
            new MeshBasicMaterial({ color: new Color(225, 225, 0) }),
        );
        this.earthOrbit = new Group();

        moon.position.set(15, 0, 0);
        this.moonOrbit.add(moon);
        this.moonOrbit.rotateX(Math.PI / 4);

        earth.position.set(100, 0, 0);
        this.moonOrbit.position.copy(earth.position);
        this.earthOrbit.add(this.moonOrbit);
        this.earthOrbit.add(earth);
        this.scene.add(this.earthOrbit);
        this.scene.add(sun);
    }

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

        this.moonOrbit = new Group();
        this.earthOrbit = new Group();
        this.createSolarSystem();
    }

    private update(deltaTime: number) {
        this.controls.update(deltaTime);

        this.earthOrbit.rotateY(deltaTime * 0.5);
        this.moonOrbit.rotateY(deltaTime * 0.5);
    }

    run() {
        const loop = (time?: number) => {
            this.fpsCounter.begin();

            this.timer.update(time);
            const deltaTime = this.timer.getDelta();
            this.update(deltaTime);

            this.renderer.render(this.scene, this.camera);
            this.fpsCounter.end();
            
            window.requestAnimationFrame(loop);
        };

        window.requestAnimationFrame(loop);
    }
}