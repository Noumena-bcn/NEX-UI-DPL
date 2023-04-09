import { useRef, useEffect, useState, useLayoutEffect } from "react";
import * as THREE from "three";
import { remapValue } from "../utils.js";
import Gradient from "javascript-color-gradient";
import { useStore } from "../store/useStore.jsx";

export default function Bars() {
    const cells = useStore((state) => state.grid_arr);
    const values = useStore((state) => state.grid_vals);
    const active = useStore((state) => state.bars_active);

    let count = cells.length * 6 + 1; // Max bars instances as the max grid cells
    let dummy = new THREE.Object3D();
    const subdiv = [2, 4, 6]; // Grid subdivision factor per data layer
    const keys = ["gender", "age", "group"]

    let w = 0.05;
    let d = 0.05;
    let h = 1;
    const ref = useRef();

    let detections = values;

    // Inputs ---------------------------------------------
    const fac_H = useStore((state) => state.vizSettings.height.value);
    const fac_W = useStore((state) => state.vizSettings.width.value);
    const fac_Sk = useStore((state) => state.vizSettings.skew.value);
    const filt_clip = useStore((state) => state.vizSettings.clip.value);

    let key = keys[active];

    // let key_foc = localStorage.getItem("bars_active");

    // let filt_foc = sldFoc.noUiSlider.get(); // Filter focus distance
    // let toggle =
    //     document.getElementById(idsGridProd[0]).classList.contains("block") *
    //     barBtn.classList.contains("block");

    let labels = [
        ["layers_lbl_0_0", "layers_lbl_0_1"],
        [
            "layers_lbl_1_0",
            "layers_lbl_1_1",
            "layers_lbl_1_2",
            "layers_lbl_1_3",
        ],
        [
            "layers_lbl_2_0",
            "layers_lbl_2_1",
            "layers_lbl_2_2",
            "layers_lbl_2_3",
            "layers_lbl_2_4",
            "layers_lbl_2_5",
        ],
    ];

    const v = 0.1 / 2;
    const vec_X = [
        [v, -v],
        [v, v, -v, -v],
        [v, v, v, -v, -v, -v],
    ];
    const vec_Z = [
        [0, 0],
        [v, -v, v, -v],
        [v, -v, 0, 0, v, -v],
    ];

    useLayoutEffect(() => {
        let colors_sel = localStorage.getItem("cols_" + active).split(",");
        let j = 0;
        for (let i = 0; i < subdiv[active]; i++) {
            let vals_filt = [];
            // Prepare filtered values
            for (const detection of detections) {
                if (detection[key] == i) {
                    vals_filt.push(detection.id);
                }
            }

            // Update labels
            let lbl_id = labels[active][i];
            let lbl = document.getElementsByClassName(lbl_id);
            let perc = Math.round((vals_filt.length * 100) / detections.length);

            Array.from(lbl).forEach(function (input) {
                input.textContent = perc + "%";
            });

            // Count occurencies per id
            let counts = [...Array(cells.length)].map((x) => 0);
            for (const num of vals_filt) {
                counts[num] = counts[num] + 1;
            }
            let cMax = Math.max(...Object.values(counts)); // Extract max occurencies for color gradient

            // Cap values to avoid [TEMPORARY FIX]
            let capMax = 20;
            if (cMax > capMax) {
                cMax = capMax;
            }

            let cMin = Math.min(...Object.values(counts)); // Extract min occ for remap
            let baseRange = [cMin, cMax];
            let skewRange = [Math.pow(cMin, fac_Sk), Math.pow(cMax, fac_Sk)];

            const gradient = new Gradient()
                .setColorGradient("#000000", colors_sel[i])
                .setMidpoint(cMax * filt_clip[1]); // Extract Mid point based on cMax and the SldClip

            for (let id = 0; id < cells.length; id++) {
                if (counts[id]) {
                    if (
                        filt_clip[0] * cMax <= counts[id] &&
                        counts[id] <= filt_clip[1] * cMax
                    ) {
                        // if (
                        //     cells[id][key_foc] <= parseFloat(filt_foc) ||
                        //     typeof cells[id][key_foc] == "undefined"
                        // ) {
                        // Positions
                        const x = parseFloat(cells[id].X);
                        const y = parseFloat(cells[id].Y);
                        const z = parseFloat(cells[id].Z);
                        dummy.position.set(x, 0, z);

                        let scaleY, scaleXZ, color;
                        scaleY =
                            remapValue(
                                Math.pow(counts[id], fac_Sk),
                                skewRange,
                                baseRange
                            ) * fac_H;
                        scaleXZ = (counts[id] / cMax) * fac_W + 1;
                        color = gradient.getColor(counts[id]); // Extract color gradient

                        // color = colors_sel[i];
                        dummy
                            .translateY(scaleY / 2)
                            .translateX(vec_X[active][i])
                            .translateZ(vec_Z[active][i]);

                        dummy.scale.set(scaleXZ, scaleY, scaleXZ);
                        dummy.updateMatrix();

                        // Apply deformation on bar
                        j++;
                        ref.current.setMatrixAt(j, dummy.matrix);
                        ref.current.setColorAt(
                            j,
                            new THREE.Color(String(color))
                        );
                    }
                    // }
                }
            }
        }

        // Remove bars that are not included in the db
        while (j < count) {
            j++;
            dummy.scale.set(0, 0, 0);
            dummy.updateMatrix();
            ref.current.setMatrixAt(j, dummy.matrix);
            ref.current.setColorAt(j, new THREE.Color("#000000"));
        }

        // Enable update properties in loop
        ref.current.instanceMatrix.needsUpdate = true;
        ref.current.instanceColor.needsUpdate = true;
    }, [cells, values, active, fac_W, fac_H, fac_Sk, filt_clip]);

    return (
        <instancedMesh
            ref={ref}
            args={[null, null, count]}
        >
            <boxGeometry args={[w, h, d]} />
            <meshBasicMaterial transparent />
        </instancedMesh>
    );
}
