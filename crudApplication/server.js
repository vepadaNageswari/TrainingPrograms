const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const server = express();
const PORT = 4003;

server.use(cors());
server.use(express.static(__dirname));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'nageswari1',
    password: 'Nageswari1@##$$$',
    database: 'dbNageswari1'
});

const routesDirectory = path.join(__dirname, 'routes');

function loadRoutes() {
    if (!fs.existsSync(routesDirectory)) fs.mkdirSync(routesDirectory);

    const folderNames = fs.readdirSync(routesDirectory);

    folderNames.forEach(folderName => {
        const folderPath = path.join(routesDirectory, folderName);

        if (fs.statSync(folderPath).isDirectory()) {
            const scriptFiles = fs.readdirSync(folderPath);

            scriptFiles.forEach(fileName => {
                if (fileName.endsWith('.js')) {
                    const routeEndpoint = fileName.split('.')[0];
                    const fullScriptPath = path.join(folderPath, fileName);

                    server.all(`/${folderName}/${routeEndpoint}`, async (request, response) => {
                        try {
                            delete require.cache[require.resolve(fullScriptPath)];
                            const routeHandler = require(fullScriptPath);
                            // Passing the full request, response, and database pool
                            await routeHandler(request, response, dbPool);
                        } catch (error) {
                            console.error(`Error in ${folderName}/${fileName}:`, error);
                            response.status(500).send("Execution Error on Server");
                        }
                    });
                }
            });
        }
    });
}

loadRoutes();

server.listen(PORT, () => {
    console.log(`Server is active at http://138.68.140.83:${PORT}/crud.html`);
});
