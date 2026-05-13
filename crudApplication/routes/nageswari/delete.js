const fs = require('fs');
const path = require('path');

module.exports = async (request, response, db) => {
    const table = fs.readFileSync(path.join(__dirname, '../../config.txt'), 'utf8').trim();
    const [fields] = await db.execute(`SHOW COLUMNS FROM ${table}`);
    const idCol = fields[0].Field;

    const [result] = await db.execute(`DELETE FROM ${table} WHERE ${idCol} = ?`, [request.query.id]);
    response.send(result.affectedRows > 0 ? "1" : "0");
};
