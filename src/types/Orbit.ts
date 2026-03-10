import { AstronomicalEntity } from './AstronomicalEntity';

export interface Orbit {
    distance: number;
    rotation: number;
    speed: number;
    object: AstronomicalEntity;
}