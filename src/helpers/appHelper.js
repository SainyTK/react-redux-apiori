function toArrayTable(strTable) {
    const arrTable = [];
    strTable.forEach(row => {
        arrTable.push(row.trim().split(' '));
    });
    return arrTable;
}


export default {
    toArrayTable
}