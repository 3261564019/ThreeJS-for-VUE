/**
 * @description  This code has originally been copied from Sketchbook
 *
 * @author       swift502 <blaha.j502@gmail.com> (http://jblaha.art/)
 * @copyright    Copyright (c) 2018 swift502; Project Url: https://github.com/swift502/Sketchbook
 * @license      {@link https://github.com/swift502/Sketchbook/blob/master/LICENSE GPL-3.0}
 *
 * @author       Yannick Deubel (https://github.com/yandeu)
 * @copyright    Copyright (c) 2021 Yannick Deubel; Project Url: https://github.com/enable3d/enable3d
 * @license      {@link https://github.com/enable3d/enable3d/blob/master/LICENSE LGPL-3.0}
 */
import { MathUtils as THREE_Math, Vector2, Vector3 } from 'three';
class ThirdPersonControls {
    constructor(camera, target, config) {
        this.camera = camera;
        this.target = target;
        this.config = config;
        const
            {
                offset = new Vector3(0, 0, 0),
                sensitivity = new Vector2(0.25, 0.25),
                radius = 8,
                targetRadius = 10,
                interpolationFactor = 0.05,
                pointerLock = true,
                autoUpdate = true,
                theta = 0,
                phi = 0,
                 /** Max Phi in deg */
                maxPhi = 85,
                 /** Min Phi in deg */
                minPhi = -85
            } = config;
        this.offset = offset;
        this.sensitivity = sensitivity;
        this.radius = radius;
        this.targetRadius = targetRadius;
        this.interpolationFactor = interpolationFactor;
        this.theta = theta;
        this.phi = phi;
        this.maxPhi = maxPhi;
        this.minPhi = minPhi;
        // if (pointerLock) {
        //   scene.input.on('pointerdown', () => {
        //     scene.input.mouse.requestPointerLock()
        //   })
        //   scene.input.on('pointermove', (pointer: PointerEvent) => {
        //     if (scene.input.mouse.locked) {
        //       this.update(pointer.movementX, pointer.movementY)
        //     }
        //   })
        // }
        // if (autoUpdate) {
        //   scene.events.on('update', () => {
        //     this.update(0, 0)
        //   })
        // }
    }
    update(deltaX, deltaY) {
        //在外面将该值传进来时将y进行取反了
        const target = this.target.position.clone().add(this.offset);

        this.theta -= deltaX * (this.sensitivity.x / 2);
        this.theta %= 360;
        this.phi += deltaY * (this.sensitivity.y / 2);
        this.phi = Math.min(this.maxPhi, Math.max(this.minPhi, this.phi));


        this.radius = THREE_Math.lerp(this.radius, this.targetRadius, this.interpolationFactor);
        this.camera.position.x =
            target.x + this.radius * Math.sin((this.theta * Math.PI) / 180) * Math.cos((this.phi * Math.PI) / 180);
        this.camera.position.y =
            target.y + this.radius * Math.sin((this.phi * Math.PI) / 180);
        this.camera.position.z =
            target.z + this.radius * Math.cos((this.theta * Math.PI) / 180) * Math.cos((this.phi * Math.PI) / 180);

        this.camera.updateMatrix();
        this.camera.lookAt(target);
    }
}
export { ThirdPersonControls };
//# sourceMappingURL=thirdPersonControls.js.map