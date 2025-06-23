// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
import './commands'
// const ExcelJS = require('exceljs');
// const fs = require('fs');
// const path = require('path');

// Cypress.Commands.add('readExcel', (filename) => {
//     const filePath = path.join('cypress', 'fixtures', filename);

//     if (!fs.existsSync(filePath)) {
//         throw new Error(`File ${filename} không tồn tại!`);
//     }

//     const workbook = new ExcelJS.Workbook();
//     return workbook.xlsx.readFile(filePath).then(() => {
//         const worksheet = workbook.getWorksheet(1);
//         const data = [];

//         worksheet.eachRow((row) => {
//             data.push(row.values);
//         });

//         return data;
//     });
// });
