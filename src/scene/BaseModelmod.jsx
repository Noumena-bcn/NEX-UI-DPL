import React, { useState, useEffect, useMemo } from "react";
import { BufferAttribute } from "three";

export default function BaseModelmod({ filePath }) {
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {
        fetch(filePath)
            .then((response) => response.text())
            .then((csv) => {
                const lines = csv.split("\n");
                const points = [];
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    if (!line) continue;
                    const [x, y, z] = line.split(",").map(Number);
                    points.push(x, y, z);
                }
                setCoordinates(points);
            });
    }, [filePath]);

    const points = useMemo(() => {
        return new BufferAttribute(new Float32Array(coordinates), 3);
    }, [coordinates]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach={"attributes-position"}
                    {...points}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                threshold={0.1}
                color={0xff00ff}
                sizeAttenuation={true}
            />
        </points>
    );
}
