const ExcelJS = require('exceljs');
const path = require('path');

function getFilePath(filename) {
    return path.resolve('cypress', 'fixtures', filename);
}

async function readCell(filename, sheetIndex, rowIndex, colIndex) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(getFilePath(filename));
    const worksheet = workbook.getWorksheet(sheetIndex);
    return worksheet.getRow(rowIndex).getCell(colIndex).value;
}

async function readRow(filename, sheetIndex, rowIndex) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(getFilePath(filename));
    const worksheet = workbook.getWorksheet(sheetIndex);
    return worksheet.getRow(rowIndex).values; // Trả về array
}

async function readColumn(filename, sheetIndex, colIndex) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(getFilePath(filename));
    const worksheet = workbook.getWorksheet(sheetIndex);

    const columnData = [];
    worksheet.eachRow((row, rowIndex) => {
        columnData.push(row.getCell(colIndex).value);
    });

    return columnData; // Trả về array
}

// Ghi 1 ô (cell)
async function writeCell(filename, sheetName, rowIndex, colIndex, value) {
    const workbook = new ExcelJS.Workbook();
    const filePath = getFilePath(filename);

    try {
        await workbook.xlsx.readFile(filePath);
    } catch (err) {
        console.log(`File ${filename} không tồn tại. Sẽ tạo mới.`);
    }

    let worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
        worksheet = workbook.addWorksheet(sheetName);
    }

    const row = worksheet.getRow(rowIndex);
    row.getCell(colIndex).value = value;

    await workbook.xlsx.writeFile(filePath);
}

// Ghi nguyên 1 dòng (row)
async function writeRow(filename, sheetName, rowIndex, dataArray) {
    const workbook = new ExcelJS.Workbook();
    const filePath = getFilePath(filename);

    try {
        await workbook.xlsx.readFile(filePath);
    } catch (err) {
        console.log(`File ${filename} không tồn tại. Sẽ tạo mới.`);
    }

    let worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
        worksheet = workbook.addWorksheet(sheetName);
    }

    const row = worksheet.getRow(rowIndex);
    row.values = dataArray;

    await workbook.xlsx.writeFile(filePath);
}

// Ghi nguyên 1 cột (column)
async function writeColumn(filename, sheetName, colIndex, dataArray) {
    const workbook = new ExcelJS.Workbook();
    const filePath = getFilePath(filename);

    try {
        await workbook.xlsx.readFile(filePath);
    } catch (err) {
        console.log(`File ${filename} không tồn tại. Sẽ tạo mới.`);
    }

    let worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
        worksheet = workbook.addWorksheet(sheetName);
    }

    dataArray.forEach((value, index) => {
        worksheet.getRow(index + 1).getCell(colIndex).value = value;
    });

    await workbook.xlsx.writeFile(filePath);
}

async function readSheet(filename, sheetName) {
	const workbook = new ExcelJS.Workbook();
	const filePath = getFilePath(filename);

	await workbook.xlsx.readFile(filePath);

	const worksheet = workbook.getWorksheet(sheetName);
	if (!worksheet) {
		throw new Error(`Sheet "${sheetName}" không tồn tại trong file ${filename}`);
	}

	const sheetData = [];
	worksheet.eachRow((row) => {
		const rowData = [];
		row.eachCell({ includeEmpty: true }, (cell) => {  // 👈 Thêm `{ includeEmpty: true }`
			rowData.push(cell.value !== undefined ? cell.value : "");  // 👈 Thay thế `undefined` bằng chuỗi rỗng
		});
		sheetData.push(rowData);
	});

	return sheetData;  // Trả về mảng 2 chiều [row][cell]
}

async function loadExcelData(filename, sheetName) {
	return cy.task('readSheet', { filename, sheetName }).then((data) => {
		if (!Array.isArray(data) || data.length === 0) {
			throw new Error(`Sheet ${sheetName} không có dữ liệu hoặc không đúng định dạng`);
		}

		const header = data[0];  // Lấy header từ dòng đầu tiên
		if (!Array.isArray(header)) {
			throw new Error(`Dữ liệu header không đúng định dạng`);
		}

		// Chuyển đổi từng dòng dữ liệu thành object dựa trên header
		return data.slice(1).map(row => {
			const mappedRow = {};
			header.forEach((colName, index) => {
				mappedRow[colName] = row[index] ?? null;
			});
			return mappedRow;
		});
	});
}



// Xuất tất cả hàm
module.exports = {
    readCell,
    readRow,
    readColumn,
    writeCell,
    writeRow,
    writeColumn,
    readSheet,
	loadExcelData
};
