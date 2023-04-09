import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore.jsx";
import {
    Accordion,
    Button,
    Icon,
    Label,
    Table,
    Transition,
} from "semantic-ui-react";

export default function AccordionNested({ legend }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (e, titleProps) => {
        const { index } = titleProps;
        setActiveIndex(index === activeIndex ? -1 : index);
    };

    useEffect(() => {
        useStore.setState({ bars_active: activeIndex });
    }, [activeIndex]);

    // Prepare legend entries
    let data = [];
    let categoriesName = ["Gender", "Age", "Ethnicity"];
    const keys = Object.keys(legend);
    keys.forEach((key, index) => {
        let arr = legend[key];
        let category = [];

        for (let subIndex = 0; subIndex < arr.length; subIndex++) {
            let el = arr[subIndex];

            // Capitalize category key
            const categoryName = categoriesName[index];

            category.push({
                category: categoryName,
                name: Object.keys(el).flat()[0],
                color: Object.values(el).flat()[0],
                id: "layers_lbl_".concat(String(index), "_", String(subIndex)),
            });
        }
        data.push(category);
    });

    return (
        <Accordion
            fluid
            styled
        >
            {data.map((category, index) => (
                <div key={index}>
                    <Accordion.Title
                        active={activeIndex === index}
                        index={index}
                        onClick={handleClick}
                    >
                        <Button>{category[0]["category"]}</Button>
                        <Icon
                            name="dropdown"
                            style={{ float: "right", marginTop: "10px" }}
                        />
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === index}>
                        {/* <Transition.Group
                            animation={"fade down"}
                            duration={50}
                        >
                            {activeIndex === index && ( */}
                        <Table
                            basic
                            textAlign="right"
                            className="db_filter"
                        >
                            <Table.Body>
                                {category.map(
                                    ({ name, color, id }, subIndex) => (
                                        <Table.Row key={subIndex}>
                                            <Table.Cell textAlign="left">
                                                {name}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Label className={id}> %</Label>
                                                <Icon
                                                    name="stop"
                                                    style={{ color }}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                )}
                            </Table.Body>
                        </Table>
                        {/* )}
                        </Transition.Group> */}
                    </Accordion.Content>
                </div>
            ))}
        </Accordion>
    );
}
