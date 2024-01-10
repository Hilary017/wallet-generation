#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
require('dotenv').config();
const db = require('./util/database');

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

// db.execute()

const fetchCoordinates = async (address) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`
  const response = await axios.get(url
//     , {
//     params: { access_token: MAPBOX_TOKEN }
//   }
  );
  console.log("This is the response", response);
//   console.log("This is a break...........");
  const coordinates = response.data.features[0].center;
  return { lat: coordinates[1], lon: coordinates[0] };
}

// fetchCoordinates('50 California St., 50 California St, San Francisco, California 94111, United States');

const generatePropertiesSql = async (csvFilePath, sqlFilePath) => {
  const sqlStream = fs.createWriteStream(sqlFilePath);
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
        const clientAddress = `${row['Property 1 Street Address']} ${row['Property 1 City']} ${row['Property 1 State']}`;
        const { lat, lon } = await fetchCoordinates(clientAddress);
        const propertyName = `${row['First Name']} ${row['Last Name']} ${clientAddress}`;
        const ownerId = `${row['Record ID']}`;
        // sqlStream.write(`INSERT INTO properties (ownerId, title, address, latitude, longitude) VALUES (${ownerId}, '${propertyName}', '${clientAddress}', ${lat}, ${lon});\n`);
        sqlStream.write(`INSERT INTO properties (
            "createdAt", "updateAt", address, "ownerId", "propertyStatusId", "hasChargingStation", "hasLandingDeck",
            "hasStorageHub", "isRentableAirspace", title, "transitFee", "noFlyZone", 
            "isFixedTransitFee", latitude, longitude, timezone, "isActive"
          ) 
          VALUES ('2023-11-01 13:15:48.324', '2023-11-29 09:03:39.087', '${clientAddress}', ${ownerId}, 1, false, false, false, true, '${propertyName}', '0.01-0.99', false, false, ${lat}, ${lon}, 'UTC', true);\n`);
        
    })
    // .on('end', () => {
    //     console.log('generation ended...');
    // });
}

const filePath = path.join(__dirname, 'manor-straits-properties.csv');



generatePropertiesSql(filePath, 'sky-properties.sql');

const generateVertexesSql = async (csvFilePath) => {
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
        const clientAddress = `${row['Property 1 Street Address']} ${row['Property 1 City']} ${row['Property 1 State']}`;
        console.log(clientAddress);
    })

    // console.log("This is the final end");
}

// generateVertexesSql(filePath);





// const add = encodeURIComponent('50, Union Avenue, New Providence, Union County, New Jersey, 07974, USA')
// const add = encodeURIComponent('50, Fremont Street, Transbay, San Francisco, California, 94105, USA');
// const add = encodeURIComponent('50, Paramount Drive, Fruitville, Fruitville, Sarasota County, Florida, 34232, USA');
// const add = encodeURIComponent('50, California Street, Financial District, San Francisco, California, 94111, USA');

// console.log('This is the encoded address', add);