import React, { useState, useEffect } from "react";
import { Button, Grid, Icon, Segment } from "semantic-ui-react";
import { useStore } from "../store/useStore.jsx";
import Settings from "./Settings";
import DropdownIcons from "./DropdownIcons.jsx";
import AccordionNested from "./AccordionNested.jsx";
let colorsPath = "./colors_viz.json";

export default function Header() {
    const btnsMenu = ["PEOPLE", "SPACE", "REPORT"];

    return (
        <>
            <div className="ui_wrapper no_click">
                <div className="menu_wrapper no_click ">
                    <Settings />
                    <MainButtonGroup btnsMenu={btnsMenu} />
                </div>
            </div>
        </>
    );
}

const MainButtonGroup = ({ btnsMenu }) => {
    const btnsSubMenu = [
        { name: "heat", icon: "bullseye" },
        { name: "bar", icon: "align right clockwise rotated" },
        { name: "quad", icon: "th" },
    ];

    const activeButtonId = useStore((state) => state.main_btns);
    const activeIconButtonId = useStore((state) => state.submain_btns);
    const legend = useStore.getState().legend;
    const blur = useStore((state) => state.blur);

    return (
        <>
            {btnsMenu.map((button, index) => (
                <Button
                    className="inverted big head_btns"
                    key={index}
                    active={activeButtonId == index}
                    onClick={() => useStore.setState({ main_btns: index })}
                >
                    {button}
                </Button>
            ))}

            {!blur && activeButtonId == 0 && (
                <Segment
                    basic
                    className="ui_content no_click"
                    style={{ width: "20%" }}
                >
                    <Grid
                        className="fluid"
                        columns={2}
                    >
                        <Grid.Column
                            width={2}
                            textAlign="left"
                        >
                            <Button.Group vertical>
                                {btnsSubMenu.map((button, index) => (
                                    <Button
                                        className="circular small inverted pg1_sub_btns"
                                        icon
                                        key={index}
                                        active={activeIconButtonId == index}
                                        onClick={() =>
                                            useStore.setState({
                                                submain_btns: index,
                                            })
                                        }
                                        style={{ marginBottom: "5px" }}
                                    >
                                        <Icon name={button.icon} />
                                    </Button>
                                ))}
                            </Button.Group>
                        </Grid.Column>
                        <Grid.Column
                            width={14}
                            textAlign="left"
                        >
                            {activeIconButtonId === 0 && (
                                <div id="costumer_heat"></div>
                            )}
                            {activeIconButtonId === 1 && (
                                <div id="customer_bar">
                                    <AccordionNested legend={legend} />
                                </div>
                            )}
                            {activeIconButtonId === 2 && (
                                <div id="customer_quad">
                                    <DropdownIcons legend={legend} />
                                </div>
                            )}
                        </Grid.Column>
                    </Grid>
                </Segment>
            )}

            {blur && (
                <>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                        }}
                        className="blur_bk zBack"
                    ></div>
                </>
            )}
            {/* 
            {activeButtonId == 2 && (
                <>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                        }}
                        className="blur_bk zBack"
                    ></div>

                    <div style={{ marginTop: "10px" }}>
                        <DropdownIcons legend={legend} />
                    </div>
                </>
            )} */}
        </>
    );
};

//     <Segment
//     basic
//     className="ui_content no_click"
//     style={{ width: "20%" }}
// >
//     <Grid
//         className="fluid"
//         columns={2}
//     >
//         <Grid.Column
//             width={2}
//             textAlign="left"
//         >
//         </Grid.Column>
//         <Grid.Column
//             width={14}
//             textAlign="left"
//         >

//                 <div>
//                     <DropdownIcons legend={legend} />
//                 </div>
//         </Grid.Column>
//     </Grid>
// </Segment>
