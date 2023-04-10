import { create } from "zustand";
import { loadCSV, fetchJSON, getLegend } from "../utils.js";
import h337 from "@mars3d/heatmap.js";

//const res = await loadCSV("./models/csv/grid_res_01.csv");
//const res = await loadCSV("https://github.com/Noumena-bcn/NEX-UI-DPL/blob/main/src/models/csv/grid_res_01.csv")
//const res = await loadCSV("Noumena-bcn.github.io/NEX-UI-DPL/models/csv/grid_res_01.csv")
//const grid_arr = await loadCSV("./models/csv/grid.csv");
//const grid_vals = await fetchJSON("./models/json/grid_values_10.json");

const res = await loadCSV("https://raw.githubusercontent.com/Noumena-bcn/NEX-UI-DPL/main/src/models/csv/grid_res_01.csv")
const grid_arr = await loadCSV("https://raw.githubusercontent.com/Noumena-bcn/NEX-UI-DPL/main/src/models/csv/grid.csv")
const grid_vals = await fetchJSON("https://raw.githubusercontent.com/Noumena-bcn/NEX-UI-DPL/main/src/models/json/grid_values_10.json")


const legend = await getLegend("./models/colors_viz.json");

export let useStore = create((set, get) => ({
    grid_arr: grid_arr,
    grid_res: res[0],
    grid_vals: grid_vals.data,
    legend: legend,

    ////////////////////////////////////////////////////////////////
    // viz Settings

    vizSettings: {
        width: {
            value: 1.5,
            min: 0,
            max: 3,
            step: 0.05,
        },

        height: {
            value: 0.5,
            min: 0,
            max: 0.5,
            step: 0.1,
        },

        clip: {
            value: [0, 1],
            min: 0,
            max: 1,
            step: 0.1,
        },

        skew: {
            value: 3,
            min: 1,
            max: 5,
            step: 0.5,
        },

        stocazzo: "batti",
    },

    vizChange: (id, value) => {
        const settings = get().vizSettings;
        settings[id].value = value;

        set((state) => ({
            vizSettings: settings,
        }));
    },

    ////////////////////////////////////////////////////////////////
    // Active btns
    main_btns: 0,
    submain_btns: 0,
    bars_active: 0,
    quad_active: "",
    blur: false,

    ////////////////////////////////////////////////////////////////
    // Camera Settings
    cameraSel: 0,
    camera: {
        position: [5, 10, 0],
        up: [0, 1, 0],
        rot: true,
    },

    cameraChange: () => {
        const active = (get().cameraSel + 1) % 2;
        const center = [
            (get().grid_res.Y / 2) * 0.25,
            (get().grid_res.X / 2) * 0.25,
        ];
        const positions = [
            [5, 10, 0],
            [center[0], 100, center[1]],
        ];
        const ups = [
            [0, 1, 0],
            [0, 0, 1],
        ];

        set((state) => ({
            cameraSel: active,
            camera: {
                position: positions[active],
                up: ups[active],
                rot: !active,
            },
        }));
    },

    ////////////////////////////////////////////////////////////////
    // Heatmap Settings
    heatmapInstance: h337.create({
        container: document.getElementById("heat_container"),
        backgroundColor: "#141414",
        radius: 10,
        width: 0.25 * res[0].Y * 10,
        height: 0.25 * res[0].X * 10,
        maxOpacity: 1,
        minOpacity: 0.5,
        blur: 0.95,
        gradient: {
            // enter n keys between 0 and 1 here
            // for gradient color customization
            ".0": "#141414",
            ".5": "blue",
            ".8": "red",
            ".95": "yellow",
        },
    }),
}));
