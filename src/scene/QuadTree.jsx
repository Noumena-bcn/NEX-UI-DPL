import * as THREE from "three";
import Quadtree from "@timohausmann/quadtree-js";
import { useRef, useMemo, useState, useEffect } from "react";
import { useStore } from "../store/useStore.jsx";

let quadPlane;
let canvasQuad = document.getElementById("quad_container");
let tree;
let globAlpha = 0.2;

export default function QuadTree() {
    const cells = useStore((state) => state.grid_arr);
    const res = useStore((state) => state.grid_res);
    const values = useStore((state) => state.grid_vals);
    const meshRef = useRef(null);
    const matRef = useRef(null);
    const textureRef = useRef(null);
    const [ready, setReady] = useState(false);
    const active = useStore((state) => state.quad_active);

    useEffect(() => {
        if (res) {
            const canvasDims = [0.25 * res.X, 0.25 * res.Y];

            meshRef.current.position.x = canvasDims[1] / 2;
            meshRef.current.position.y = 0;
            meshRef.current.position.z = canvasDims[0] / 2;
            meshRef.current.scale.x = canvasDims[1];
            meshRef.current.scale.y = canvasDims[0];

            tree = new Quadtree(
                {
                    x: 0,
                    y: 0,
                    width: canvasDims[1] * 100,
                    height: canvasDims[0] * 100,
                },
                20, //max objects
                6 //max subd
            );
            emptyCanvas(res);
        }
    }, [res]);

    useEffect(() => {
        if (cells && values) {
            updateQuadTree(cells, values, res, active);
            setReady(!ready);
        }
    }, [cells, values, active]);

    // const texture = useMemo(() => {
    //     if (cells && values) {
    //         console.log("ready");
    //         return new THREE.CanvasTexture(canvasQuad);
    //     }
    // }, [ready]);

    useEffect(() => {
        console.log(matRef.current.map);
        matRef.current.map.needsUpdate = true;
    }, [ready]);

    const texture = new THREE.CanvasTexture(canvasQuad);
    return (
        <>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                ref={meshRef}
            >
                <planeGeometry
                    args={[1, 1, 1, 1]}
                    attach="geometry"
                />
                {texture && (
                    <meshStandardMaterial
                        ref={matRef}
                        side={THREE.DoubleSide}
                        transparent
                        map={texture}
                    >
                        <canvasTexture
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

async function drawQuadtree(node, color) {
    let ctx = canvasQuad.getContext("2d");
    let bounds = node.bounds;
    // let lineWidth = sldWidth.noUiSlider.get() * 2; // Width exaggerating factor
    let lineWidth = 1;

    //no subnodes? draw the current node
    if (node.nodes.length === 0) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = String(color);
        ctx.fillStyle = String(color);

        ctx.lineWidth = lineWidth;
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

        if (node.level >= 3) {
            ctx.globalAlpha = (node.level - 3) * 0.3;
            ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height); // fill with rect
        }

        //has subnodes? drawQuadtree them!
    } else {
        for (let i = 0; i < node.nodes.length; i++) {
            drawQuadtree(node.nodes[i], color);
        }
    }
}

function emptyCanvas(res) {
    let canvasDims = [0.25 * res.X, 0.25 * res.Y];
    var ctx = canvasQuad.getContext("2d");

    let w = canvasDims[0] * 100;
    let y = canvasDims[1] * 100;

    canvasQuad.width = y;
    canvasQuad.height = w;
    ctx.width = window.innerWidth;
    ctx.height = window.innerHeight;
    ctx.clearRect(0, 0, y, w);
}

async function initQuadTree(res) {
    let canvasDims = [0.25 * res.X, 0.25 * res.Y];

    tree = new Quadtree(
        {
            x: 0,
            y: 0,
            width: canvasDims[1] * 100,
            height: canvasDims[0] * 100,
        },
        20, //max objects
        6 //max subd
    );
    emptyCanvas();

    const texture = new THREE.CanvasTexture(canvasQuad);

    const geom = new THREE.PlaneGeometry(canvasDims[1], canvasDims[0], 1, 1);
    geom.rotateX(-Math.PI * 0.5); // horizontal
    geom.translate(canvasDims[1] / 2, 0, canvasDims[0] / 2);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    });

    quadPlane = new THREE.Mesh(geom, material);
    scene.add(quadPlane);
}

async function updateQuadTree(cells, values, res, active) {
    // Clear tree before appending
    tree.clear();
    emptyCanvas(res);

    let color = "white";

    let detections = values;
    // detections = detections.slice(time_range[0], time_range[1]); // Slice with time range

    // let filter = localStorage.getItem("quad_active");
    // console.log(filter);
    let cat = active;

    const titles = ["gender", "age", "group"];

    let cells_id = [];
    console.log(active);
    if (active.length > 0) {
        console.log("j");
        let id_map = active.split("_"); // Array with key and value matching the selected filter
        // Mask values based on filter
        const key = titles[id_map[0]];
        // Prepare filtered values
        for (const detection of detections) {
            if (detection[key] == id_map[1]) {
                cells_id.push(detection.id);
            }
        }
        color = localStorage.getItem("cols_" + id_map[0]).split(",")[id_map[1]];
        console.log(color[id_map[1]]);
    } else {
        for (const detection of detections) {
            cells_id.push(detection.id);
        }
    }
    // Count occurencies per id
    let counts = [...Array(cells.length)].map((x) => 0);
    for (const num of cells_id) {
        counts[num] = counts[num] + 1;
    }

    let value, point;
    let points = [];

    for (let i = 0; i < cells.length; i++) {
        if (counts[i] != 0) {
            value = counts[i];

            for (let j = 0; j < value; j++) {
                point = {
                    x: Math.round(Number(cells[i].X) * 100),
                    y: Math.round(Number(cells[i].Z) * 100),
                    width: 10,
                    height: 10,
                };

                tree.insert(point);
                points.push(points);
            }
        } else {
            continue;
        }
    }
    // Draw tree
    drawQuadtree(tree, color);
}
