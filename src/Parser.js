import { fetchText } from "./utils";

export async function loadCSV(path) {
    const response = await fetch(path);
    const csv = await response.text();

    const data = [];
    const headers = csv
        .slice(0, csv.indexOf("\n"))
        .replace(/[\r]+/gm, "")
        .split("\n")[0]
        .split(";");

    const rows = csv
        .slice(csv.indexOf("\n") + 1)
        .replace(/[\r]+/gm, "")
        .split("\n");

    const cells = [];

    for (let i = 0; i < rows.length; i++) {
        const cell = {};
        for (let j = 0; j < headers.length; j++) {
            cell[headers[j]] = Number(rows[i].split(";")[j]);
        }
        cells.push(cell);
    }

    return cells;
}
export async function loadTXT(path) {
    const data = await fetchText(path);
    return await data[0];
}
export async function readJSON(url) {
    let response = await fetch(url);
    let promise = await response.json();
    return await promise.data;
    // return await promise.data;
}
export async function loadPT(path) {
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

    return await data.flat();
}
