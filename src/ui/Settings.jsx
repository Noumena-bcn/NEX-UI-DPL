import React, { useState } from "react";
import { Button, Icon, Popup, Table, Segment } from "semantic-ui-react";
import { useStore } from "../store/useStore.jsx";
import { Slider } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Settings() {
    const changeCamera = useStore.getState().cameraChange;
    const [iconCamera, setIconCamera] = useState("eye");
    const [iconTgl, setIconTgl] = useState("cube");
    const [blur, setBlur] = useState([false]);

    const handleCameraToggle = () => {
        changeCamera();
        setIconCamera(iconCamera === "eye" ? "eye" : "eye");
    };

    const handle3DStatsToggle = () => {
        setBlur(!blur);
        setIconTgl(iconTgl === "cube" ? "chart pie" : "cube");
        useStore.setState({ blur: blur });
    };

    return (
        <>
            <div style={{ float: "right", right: 0, textAlign: "right" }}>
                <Button
                    circular
                    icon
                    className="big secondary"
                    onClick={handleCameraToggle}
                    disabled={!blur}
                    style={{ marginBottom: "5px", top: "0" }}
                >
                    <Icon name={iconCamera} />
                </Button>

                <Popup
                    trigger={
                        <Button
                            circular
                            icon
                            className="big secondary"
                            disabled={!blur}
                            style={{ marginBottom: "5px", top: "0" }}
                        >
                            <Icon name="setting" />
                        </Button>
                    }
                    basic
                    on="click"
                    content={popViz()}
                    position="bottom right"
                />
                <Button
                    circular
                    icon
                    className="big"
                    onClick={handle3DStatsToggle}
                    style={{ marginBottom: "5px", top: "0" }}
                >
                    <Icon name={iconTgl} />
                </Button>
                <Popup
                    trigger={
                        <Button
                            circular
                            icon
                            className="big"
                            style={{ marginBottom: "5px", top: "0" }}
                        >
                            <Icon name="calendar alternate outline" />
                        </Button>
                    }
                    basic
                    on="click"
                    content={popCal()}
                    position="bottom right"
                />
            </div>
        </>
    );
}

function popViz() {
    const vizChange = useStore.getState().vizChange;
    const vizInit = useStore.getState().vizSettings;
    const handleSliderChange = (event, newValue, id) => {
        vizChange(id, newValue);
    };

    return (
        <>
            <div style={{ width: "250px" }}>
                <Table>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell textAlign="left">Width</Table.Cell>
                            <Table.Cell width="twelve">
                                <Slider
                                    size="small"
                                    defaultValue={vizInit.width.value}
                                    min={vizInit.width.min}
                                    max={vizInit.width.max}
                                    step={vizInit.width.step}
                                    onChange={(event, value) =>
                                        handleSliderChange(
                                            event,
                                            value,
                                            "width"
                                        )
                                    }
                                />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="left">Height</Table.Cell>
                            <Table.Cell width="twelve">
                                <Slider
                                    size="small"
                                    defaultValue={vizInit.height.value}
                                    min={vizInit.height.min}
                                    max={vizInit.height.max}
                                    step={vizInit.height.step}
                                    onChange={(event, value) =>
                                        handleSliderChange(
                                            event,
                                            value,
                                            "height"
                                        )
                                    }
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Table>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell textAlign="left">Min/Max</Table.Cell>
                            <Table.Cell
                                width="twelve"
                                style={{ color: "blue" }}
                            >
                                <Slider
                                    size="small"
                                    defaultValue={vizInit.clip.value}
                                    min={vizInit.clip.min}
                                    max={vizInit.clip.max}
                                    step={vizInit.clip.step}
                                    onChange={(event, value) =>
                                        handleSliderChange(event, value, "clip")
                                    }
                                />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="left">Skew</Table.Cell>
                            <Table.Cell
                                width="twelve"
                                style={{ color: "blue" }}
                            >
                                <Slider
                                    size="small"
                                    defaultValue={vizInit.skew.value}
                                    min={vizInit.skew.min}
                                    max={vizInit.skew.max}
                                    step={vizInit.skew.step}
                                    onChange={(event, value) =>
                                        handleSliderChange(event, value, "skew")
                                    }
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        </>
    );
}

function popCal() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                style={
                    {
                        // backgroundColor: "blue",
                    }
                }
            />
        </LocalizationProvider>
    );
}
