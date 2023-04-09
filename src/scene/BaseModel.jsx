import { BufferAttribute, Color } from "three";

const ptCloudPath = "../models/csv/ptcloud_01.csv";
const coords = await loadPT(ptCloudPath);

export default function BaseModel() {
    const color = new Color("rgb(100,100,100))");

    return (
        <>
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach={"attributes-position"}
                        {...new BufferAttribute(new Float32Array(coords), 3)}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.03}
                    threshold={0.1}
                    color={color}
                    sizeAttenuation={true}
                />
            </points>
        </>
    );
}

async function loadPT(path) {
    const response = await fetch(path);
    const csv = await response.text();

    const data = [];
    const rows = csv
        .slice(csv.indexOf("\n") + 1)
        .replace(/[\r]+/gm, "")
        .split("\n");

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row) continue;
        const [x, y, z] = row.split(";").map(Number);

        data.push(x, y, z);
    }

    return data.flat();
}
