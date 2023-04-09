import { useMemo, useState, useEffect, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { useStore } from "../store/useStore.jsx";

let canvasHeat = document.getElementById("heat_container");
let heatmapInstance;

export default function HeatmapTexture() {
    heatmapInstance = useStore((state) => state.heatmapInstance);
    const cells = useStore((state) => state.grid_arr);
    const values = useStore((state) => state.grid_vals);
    const res = useStore((state) => state.grid_res);
    const Y = 0.25 * res.X;
    const X = 0.25 * res.Y;

    const meshRef = useRef(null);
    const textureRef = useRef(null);
    const [ready, setReady] = useState(false);

    useLayoutEffect(() => {
        if (cells && values && heatmapInstance) {
            updateHeatMap(cells, values);
            setReady(true);
        }
    }, [cells, values]);

    const texture = useMemo(() => {
        if (cells && values) {
            const imageData = heatmapInstance._renderer.canvas
                .getContext("2d")
                .getImageData(
                    0,
                    0,
                    heatmapInstance._renderer.canvas.width,
                    heatmapInstance._renderer.canvas.height
                );

            return new THREE.CanvasTexture(imageData);
        }
    }, [ready]);

    return (
        <>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[X / 2, 0, Y / 2]}
                scale-x={X}
                scale-y={Y}
                ref={meshRef}
            >
                <planeGeometry
                    args={[1, 1, 1, 1]}
                    attach="geometry"
                />
                {texture && (
                    <meshStandardMaterial
                        // side={THREE.DoubleSide}
                        transparent
                    >
                        <canvasTexture
                            willReadFrequently
                            ref={textureRef}
                            attach="map"
                            image={texture.image}
                            flipY={true}
                        />
                    </meshStandardMaterial>
                )}
            </mesh>
        </>
    );
}

function updateHeatMap(grid_arr, detections) {
    let load = false;
    let dataPoints = [];
    let cMax = 0;
    let cells_id = [];
    for (const detection of detections) {
        cells_id.push(detection.id);
    }
    // Count occurencies per id
    let counts = [...Array(grid_arr.length)].map((x) => 0);
    for (const num of cells_id) {
        counts[num] = counts[num] + 1;
    }
    let value;

    for (let i = 0; i < grid_arr.length; i++) {
        if (counts[i] != 0) {
            value = counts[i];

            dataPoints.push({
                x: Math.round(Number(grid_arr[i].X) * 10),
                y: Math.round(Number(grid_arr[i].Z) * 10),
                value: value,
            });
        } else {
            continue;
        }
    }

    cMax = Math.max(...Object.values(counts)); // Extract max occurencies for color gradient

    heatmapInstance.setData({
        max: cMax * 4,
        min: 0,
        data: dataPoints,
    });
}
