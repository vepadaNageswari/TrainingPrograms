const fs = require('fs');
const path = require('path');

module.exports = async (request, response, db) => {
    const table = fs.readFileSync(path.join(__dirname, '../../config.txt'), 'utf8').trim();
    const data = request.query;
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    const placeholders = columns.map(() => '?').join(', ');
    const updatePart = columns.slice(1).map(c => `${c}=?`).join(', ');
    
    const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders}) 
                 ON DUPLICATE KEY UPDATE ${updatePart}`;
    
    await db.execute(sql, [...values, ...values.slice(1)]);
    response.send("1");
};
