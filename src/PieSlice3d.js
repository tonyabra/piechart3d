import * as THREE from 'three';

const EXTRUDE_SETTINGS = {
	depth: 12,
	bevelEnabled: false
};

export default class PieSlice3d {
    constructor(radius, angles, colors) {
        const curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            radius, radius,           // xRadius, yRadius
            angles[0], angles[1],
            false,            // aClockwise
            0                 // aRotation
        );
        
        const zero = {x: 0, y: 0};

        // TODO: Determine how many points

        const points = [zero, ...curve.getPoints( 50 ), zero];
        this.shape = new THREE.Shape(points)
        this.colors = colors;
        this.height = 1;
        this.rising = Math.random() > .5;

        this.geometry = new THREE.ExtrudeGeometry( this.shape, EXTRUDE_SETTINGS );
        this.material1 = new THREE.MeshBasicMaterial( { color: this.colors[0] } );
        this.material2 = new THREE.MeshBasicMaterial( { color: this.colors[1] } );
        this.mesh = new THREE.Mesh( this.geometry, [this.material1, this.material2, this.material1] );
    }

    clear() {
        this.geometry.dispose();
        this.material1.dispose();
        this.material2.dispose();
    }
}