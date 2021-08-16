import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import PieSlice3d from './PieSlice3d';

export const COLORS = [
    [0x1db2f6, 0x1682b5],
    [0xf4564a, 0xb53f36],
    [0x98c95c, 0x6a8a3f],
    [0xffc720, 0xbf9519],
    [0xe93574, 0xa82754],
    [0xa63cb8, 0x6c2878],
]

export default class PieChart3d {
    constructor(width, height) {
        this.sceneWidth = width;
        this.sceneHeight = height;
        this.radius = 20;
        this.maxHeight = 1.25;
        this.minHeight = 0.5;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xffffff );
        this.camera = new THREE.PerspectiveCamera( 75, this.sceneWidth / this.sceneHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        this.renderer.setSize( this.sceneWidth, this.sceneHeight );
 
        this.setCamera(undefined, -28, 35);

        this.slices = [];
        this.staggered = false;
        this.getUpGetDown = true;
        this.sliceHeight = [];
        this.sliceUp = [];
        this.animating = false;
    }

    addRenderer(parent, sibling=null) {
        parent.insertBefore(this.renderer.domElement, sibling );
    }

    setCamera(x=0, y=0, z=0) {
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z
        this.controls.update();
    }

    createSlice(angles) {
        const newSlice = new PieSlice3d(this.radius, angles, COLORS[this.slices.length]);
        this.slices.push(newSlice);
    }

    populateScene() {

        if (this.getUpGetDown || this.staggered) {
            for (let i = 0; i < this.slices.length; i++) {
                this.slices[i].height =  1 - (i/this.slices.length * .5) ;
                this.slices[i].rising = true;
            }
        }

        for (const slice of this.slices) {
            this.scene.add(slice.mesh);
        }

        if (!this.animating) {
            this.animating = true;
            this.animate();
        }
    }

    clearScene() {
        for (const slice of this.slices) {
            this.scene.remove(slice.mesh);
            slice.clear();
        }

        this.slices = [];
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.getUpGetDown) {
            for (const slice of this.slices) {
                if (slice.height >= this.maxHeight) {
                    slice.rising = false;
                } else if (slice.height <= this.minHeight) {
                    slice.rising = true;
                }

                if (slice.rising) {
                    slice.height += .005;
                } else {
                    slice.height -= .005;
                }
            }
        }
        for (const slice of this.slices) {
            slice.mesh.rotation.z += .01;
            slice.mesh.scale.set(1, 1, slice.height);
        }

        this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }

}