import "./style.css";
import "semantic-ui-css/semantic.min.css";
import ReactDOM from "react-dom/client";
import React, { StrictMode, Suspense } from "react";
import Scene from "./scene/Scene.jsx";
import { Canvas } from "@react-three/fiber";
import UI from "./ui/UI.jsx";
const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
    <>
        <Canvas
            className="scene_style zBack"
            gl={{
                alpha: false,
                antialias: true,
            }}
        >
            <Scene />
        </Canvas>
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: "none",
            }}
            className="zFront"
        >
            <UI />
        </div>
    </>
);
