const { defineConfig } = require("cypress");
const ExcelJS = require('exceljs');
const path = require('path');
const { readCell, readColumn, readRow, readSheet,writeCell, loadExcelData} = require('./cypress/support/excelHelper');
// const {writeCellByColumnNamel } = require('./cypress/support/resultWriter');

const { verifyDownloadTasks, isFileExist } = require('cy-verify-downloads');
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');
require('dotenv').config()
// const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin')
module.exports = defineConfig({
	projectId: 'fbmeaq',
	defaultCommandTimeout: 15000,
	experimentalMemoryManagement: true,
	// numTestsKeptInMemory:  50,
	// retries: 2,
	e2e: {
		screenshotsFolder: './cypress/snapshots/actual',
		trashAssetsBeforeRuns: true,
		video: false,
		//npx cypress run --record --key a0cc454c-43b1-444b-90d1-05bde334127a
		// specPattern: "./cypress/e2e/TestOldOrderForm.cy.js",
		viewportWidth: 1440,
		viewportHeight: 1200,
		experimentalModifyObstructiveThirdPartyCode: true,
		experimentalSessionAndOrigin: true,
		chromeWebSecurity: false,
		// baseUrl: `https://kamora:iamafriend@writersperhour.dev`,
		baseUrl: `https://${process.env.BASIC_USERNAME}:${process.env.BASIC_PASSWORD}@writersperhour.dev`,
		// baseUrl: process.env.BASE_URL,
		// specPattern: './cypress/e2e/test.cy.js',
		env: {
			BASIC_USERNAME: 'kamora',
			BASIC_PASSWORD: 'iamafriend',
			type: 'base',
			failSilently: false,
			"ALWAYS_GENERATE_DIFF": true,
			"ALLOW_VISUAL_REGRESSION_TO_FAIL": false
		},
		setupNodeEvents(on, config) {
			on('task', {
				isFileExist(filePath) {
					return isFileExist(filePath);
				},
				verifyDownload(filePath) {
					// Chờ file tải xuống trong tối đa 5 giây
					return new Promise((resolve) => {
						const timeout = 15000;
						const interval = 500;
						let elapsedTime = 0;

						const checkFile = () => {
							if (isFileExist(filePath)) {
								resolve(true);
							} else if (elapsedTime >= timeout) {
								resolve(false);
							} else {
								elapsedTime += interval;
								setTimeout(checkFile, interval);
							}
						};

						checkFile();
					});
				},
			    readCell({ filename, sheetIndex, rowIndex, colIndex }) {
                    return readCell(filename, sheetIndex, rowIndex, colIndex);
                },
                readRow({ filename, sheetIndex, rowIndex }) {
                    return readRow(filename, sheetIndex, rowIndex);
                },
                readColumn({ filename, sheetIndex, colIndex }) {
                    return readColumn(filename, sheetIndex, colIndex);
                },
                writeCell({ filename, sheetIndex, rowIndex, colIndex, value }) {
                    return writeCell(filename, sheetIndex, rowIndex, colIndex, value);
                },
				readSheet({filename, sheetName}){
					return readSheet(filename, sheetName);
				},
				loadExcelData({filename, sheetName}){
					return readSheet(filename, sheetName);
				}
			});
			return config;
		}
	}
})
