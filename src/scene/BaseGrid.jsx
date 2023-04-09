import * as THREE from "three";
import { useEffect, useRef, useMemo } from "react";
import { useStore } from "../store/useStore.jsx";

export default function BaseGrid() {
    const res = useStore((state) => state.grid_res);
    const groupRef = useRef(null);
    const dim = 0.25;

    useEffect(() => {
        console.log("grid loaded");
        for (let x = 0; x < res.X; x++) {
            for (let z = 0; z < res.Y; z++) {
                const line = new THREE.LineSegments(
                    new THREE.EdgesGeometry(new THREE.BoxGeometry(dim, 0, dim)),
                    new THREE.LineBasicMaterial({
                        color: "rgb(50,50,50)",
                        linewidth: 0.01,
                    })
                );
                line.position.set(z * dim, -0.05, x * dim);
                line.translateX(dim / 2).translateZ(dim / 2);
                groupRef.current.add(line);
            }
        }
    }, [res]);

    return <group ref={groupRef} />;
}
