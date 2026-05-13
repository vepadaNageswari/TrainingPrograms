const fs = require('fs');
const path = require('path');

module.exports = async (request, response, db) => {
    const table = fs.readFileSync(path.join(__dirname, '../../config.txt'), 'utf8').trim();
    const [rows, fields] = await db.execute(`SELECT * FROM ${table}`);
    response.json({ columns: fields.map(f => f.name), rows });
};
