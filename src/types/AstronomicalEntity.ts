import { Orbit } from './Orbit';

export interface AstronomicalEntity {
    id: string;
    name: string;
    size: number;
    color: [number, number, number];
    orbits?: Array<Orbit>
}