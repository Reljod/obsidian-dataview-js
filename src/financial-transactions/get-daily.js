const dv = {}; // mock dv

// constants
const TAGS = "[[financial transactions]]"
const TEMPLATE_FOLDER = "003 - Templates"
const COLUMNS = { datetime: "datetime", source: "source", type: "type", details: "details", amount: "amount", remarks: "remarks" };
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
        .filter(row => !dv.equal(row[COLUMNS.type], null))
        .filter(row => {
            const datetime = getDatetime(row)
            const today = new Date(datetime).setHours(0, 0, 0, 0);
            const currentFileDate = dv.current().file.mday.ts;
            return today === currentFileDate;
        });

    const typeGroup = rows.groupBy(col => col[COLUMNS.type]).map(val => [val.key, val.rows.values.reduce((acc, s) => acc + s[COLUMNS.amount], 0)]);

    dv.table(["txn type", "amount"], typeGroup);
    dv.paragraph("\n");
    dv.table(Object.values(COLUMNS), rows.map(x => mapRow(x)));
} else {
    dv.el("p", "Currently on a Template. Table will not render.");
}