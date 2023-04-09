import {
    OrbitControls,
    OrthographicCamera,
    Bounds,
    useBounds,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore.jsx";
import BaseModel from "./BaseModel.jsx";
import HeatmapTexture from "./HeatmapTexture.jsx";
import Bars from "./Bars.jsx";
import BaseGrid from "./BaseGrid.jsx";
import QuadTree from "./QuadTree.jsx";
import Tables from "./Tables.jsx";

export default function Scene() {
    const res = useStore((state) => state.grid_res);
    const cameraInit = useStore.getState().camera;
    const pg1SubBtns = useStore((state) => state.submain_btns);
    const activePage = useStore((state) => state.main_btns);
    const cameraRef = useRef();

    // const cameraSettings = useStore((state) => state.camera);

    return (
        <>
            <Bounds
                fit
                clip
                observe
                damping={6}
                margin={0.65}
            >
                <UpdateCamera />
                <OrthographicCamera
                    ref={cameraRef}
                    makeDefault
                    position={cameraInit.position}
                />

                <OrbitControls
                    makeDefault //make the default control so that other helps will deactive it if necessary (GIZMO conflict)
                    maxPolarAngle={Math.PI / 2}
                    target={[(res.Y / 2) * 0.25, 0, (res.X / 2) * 0.25]}
                />
                <ambientLight intensity={0.3} />
                <BaseModel />
                <BaseGrid />

                {activePage == 0 ? (
                    (pg1SubBtns == 0 && <HeatmapTexture />) ||
                    (pg1SubBtns == 1 && <Bars />) ||
                    (pg1SubBtns == 2 && <QuadTree />)
                ) : (
                    <></>
                )}

                {activePage == 1 ? <Tables /> : <></>}
            </Bounds>
        </>
    );
}

function UpdateCamera() {
    const bounds = useBounds();
    const camera = useStore((state) => state.camera);
    const res = useStore((state) => state.grid_res);
    const { controls } = useThree();

    useEffect(() => {
        bounds.refresh().clip().fit();
        bounds.to({
            position: camera.position,
            target: [(res.Y / 2) * 0.25, 0, (res.X / 2) * 0.25],
        });

        if (controls) {
            controls.enableRotate = camera.rot;
        }
    }, [camera]);
}
