#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const filePath = path.join(__dirname, 'emails.txt');

function readEmailsFromFile(filePath) {
    return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').split(' \n').filter(Boolean);
}

async function fetchAddress(email) {
    const apiUrl = 'https://lookup.web3auth.io/lookup';
    const params = {
        verifier: process.env.VERIFIER,
        verifierId: email,
        web3AuthNetwork: process.env.AUTH_NETWORK,
        clientId: process.env.CLIENTID
    };

    try {
        const response = await axios.get(apiUrl, { params });
        console.log(response.data);
        const address = response.data.data.evmAddress;
        return { email, address };
    } catch (error) {
        console.error(`Error fetching evmAddress for ${email}:`, error.message);
        return { email, address: null };
    }
}


async function processEmailAddresses() {
    const emails = readEmailsFromFile(filePath);
    const results = [];

    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const result = await fetchAddress(email);
        results.push([i + 1, email, result.address || '']);
    }
    
    console.log(results);

    const csvContent = results.map(e => e.join(',')).join('\n');
    const header = 'S/No,Email,Wallet Address\n';
    const csv = header + csvContent;

    const csvFilePath = path.join(__dirname, 'generated_wallets.csv');

    fs.writeFileSync(csvFilePath, csv, 'utf8');
}

processEmailAddresses();
