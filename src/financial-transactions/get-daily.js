const dv = {}; // mock dv

// constants
const TAGS = "[[financial transactions]]"
const TEMPLATE_FOLDER = "003 - Templates"
const COLUMNS = { datetime: "datetime", type: "type", details: "details", amount: "amount", remarks: "remarks" };
const fields = Object.values(COLUMNS).slice(1,);

// functions
const getDatetime = (row) => row[COLUMNS.datetime] ? row[COLUMNS.datetime] : row.file.mtime;
const mapRow = (row) => {
    const datetime = getDatetime(row);
    const fieldMap = fields.map(field => row[field]);
    return [datetime, ...fieldMap];
}

// main code
if (dv.current().file.folder !== TEMPLATE_FOLDER) {
    const rows = dv.pages(TAGS)
        .map(x => mapRow(x))
        .filter(k => !dv.equal(k[Object.values(COLUMNS).findIndex(a => a === COLUMNS.type)], null))
        .filter(row => {
            const today = new Date(row[0]).setHours(0, 0, 0, 0);
            const currentFileDate = dv.current().file.mday.ts;
            return today === currentFileDate;
        });

    dv.table(Object.values(COLUMNS), rows);
} else {
    dv.el("p", "Currently on a Template. Table will not render.");
}