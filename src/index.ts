import { PlanetSimulator } from './components/PlanetSimulator';
import './main.scss';

const root = document.querySelector('#app');
if (root != null) {
    const canvasEl = document.createElement('canvas');
    canvasEl.classList.add('simulation');
    root.appendChild(canvasEl);
    
    const simulation = new PlanetSimulator(canvasEl);
    simulation.run();
}
