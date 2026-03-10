import { Color, Mesh, Object3D, PerspectiveCamera, Scene, Timer, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import { Group } from 'three';
import { SphereGeometry } from 'three';
import { MeshBasicMaterial } from 'three';
import { AstronomicalEntity } from '../types/AstronomicalEntity';
import solarSystem from '../data/solar-system.json';

export class PlanetSimulator {
    private renderer: WebGLRenderer;
    private canvas: HTMLCanvasElement;
    private camera: PerspectiveCamera;
    private scene: Scene;
    private controls: OrbitControls;
    private fpsCounter: Stats;
    private timer: Timer;

    private orbitSpeeds: Map<Object3D, number> = new Map();

    private createSolarSystem(baseEntity: AstronomicalEntity) {
        const addObject = (entity: AstronomicalEntity, parent: Object3D, distance: number) => {
            const object = new Mesh(
                new SphereGeometry(entity.size, 32, 32),
                new MeshBasicMaterial({ color: new Color(...entity.color) })
            );
            if (entity.orbits != null && entity.orbits.length > 0) {
                entity.orbits.forEach((orbit) => {
                    const orbitEntity = new Group();
                    orbitEntity.rotateX(orbit.rotation);
                    addObject(orbit.object, orbitEntity, orbit.distance);
                    this.orbitSpeeds.set(orbitEntity, orbit.speed);
                    object.add(orbitEntity);
                });
            }
            object.name = entity.name;
            object.position.set(distance, 0, 0);
            parent.add(object);
        };
        addObject(baseEntity, this.scene, 0);
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

        this.createSolarSystem(solarSystem as AstronomicalEntity);
    }

    private update(deltaTime: number) {
        this.controls.update(deltaTime);

        this.orbitSpeeds.forEach((speed, orbit) => {
            orbit.rotateY(deltaTime * speed);
        });
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