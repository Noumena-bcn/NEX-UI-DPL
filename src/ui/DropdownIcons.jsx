import React, { useState, useEffect } from "react";
import { Dropdown, Icon } from "semantic-ui-react";
import { useStore } from "zustand";

export default function DropdownIcons({ legend }) {
    const [selectedDropOption, setSelectedDropOption] = useState({
        text: "Filter",
        icon: <Icon name="filter" />,
    });

    const handleDropChange = (e, { text, icon, value }) => {
        setSelectedDropOption({
            text: text,
            icon: icon,
            value: value,
        });

        const quad_active = selectedDropOption["value"];
        useStore.setState({ quad_active: quad_active });
    };

    // Prepare legend entries
    let drops = [];
    const keys = Object.keys(legend);
    keys.forEach((key, index) => {
        let arr = legend[key];
        for (let subIndex = 0; subIndex < arr.length; subIndex++) {
            let el = arr[subIndex];
            drops.push({
                name: Object.keys(el).flat()[0],
                color: Object.values(el).flat()[0],
                id: String(index).concat("_", String(subIndex)),
            });
        }
    });

    const dropDownOpts = [];
    for (let i = 0; i < drops.flat().length; i++) {
        let item = drops.flat()[i];
        let dropItem = {
            key: i,
            text: item["name"],
            value: item["id"],
            icon: (
                <Icon
                    name="circle"
                    style={{ color: item["color"] }}
                />
            ),
            color: item["color"],
        };
        dropDownOpts.push(dropItem);
    }

    return (
        <Dropdown
            text={selectedDropOption.text}
            icon={selectedDropOption.icon}
            labeled
            button
            floating
            className="icon inverted basic"
        >
            <Dropdown.Menu>
                {dropDownOpts.map(({ text, key, icon, value }) => (
                    <Dropdown.Item
                        key={key}
                        text={text}
                        icon={icon}
                        value={value}
                        onClick={handleDropChange}
                    />
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}
