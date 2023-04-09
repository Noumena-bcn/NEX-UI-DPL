import { Statistic } from "semantic-ui-react";

export default function Stats() {
    const stats = [
        {
            sublbl: "18 (+10%)",
            value: 50,
            label: "Visits",
        },
        {
            sublbl: "21,0% (+0,79%)",
            value: "22,4%",
            label: "occupancy",
        },
        {
            sublbl: "49.8$ (+14.10)",
            value: "53.5%",
            label: "productivity",
        },
        {
            sublbl: "10 min (=)",
            value: "10 min",
            label: "interaction",
        },
        {
            sublbl: "45% (+10%)",
            value: "40%",
            label: "gender balance",
        },
    ];

    return (
        <>
            <Statistic.Group
                inverted
                floating="left"
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    padding: "30px",
                }}
            >
                {stats.map((stat, index) => (
                    <Statistic
                        className="r_spaced"
                        key={index}
                    >
                        <Statistic.Label className="sublbl">
                            {stat.sublbl}
                        </Statistic.Label>
                        <Statistic.Value className="l_a">
                            {stat.value}
                        </Statistic.Value>
                        <Statistic.Label className="lbl">
                            {stat.label}
                        </Statistic.Label>
                    </Statistic>
                ))}
            </Statistic.Group>
        </>
    );
}
