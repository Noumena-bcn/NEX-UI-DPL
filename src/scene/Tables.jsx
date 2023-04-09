import { Html, Box } from "@react-three/drei";

export default function Tables() {
    //This positions will change with the tables from first event and second event.
    const positions = [
        [23, 1.2, 8],
        [17, 1.2, 12],
        [17, 1.2, 8.5],
        [13.3, 1.2, 14.5],
        [13.3, 1.2, 9.8],
        [11.0, 1.2, 9.8],
        [8.5, 1.2, 11.6],
        [5.2, 1.2, 10.3],
        [4.5, 1.2, 5.0],
    ];

    return (
        <>
            {positions.map((box, index) => (
                <Box
                    key={index}
                    position={[box[0], box[1], box[2]]}
                    args={[0.25, 0.25, 0.25]}
                >
                    <meshStandardMaterial color={"violet"} />
                    <Html
                        position={[0, 0.8, 0]}
                        wrapperClass="lbl_3d"
                        center
                        distanceFactor={0.02}
                    >
                        H_02
                        <br />
                        {"Table_0" + index}
                    </Html>
                </Box>
            ))}
        </>
    );
}
