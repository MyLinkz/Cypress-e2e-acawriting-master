let currentMeta = {
    filename: '',
    sheetName: '',
    rowIndex: 0,
    colName: 'RESULT' // mặc định là cột Result
};

function initTestMeta({ filename, sheetName, rowIndex }) {
    currentMeta = { ...currentMeta, filename, sheetName, rowIndex };
}

function writeTestResult(value) {
    if (!currentMeta.filename || !currentMeta.sheetName) {
        throw new Error('Test metadata chưa được khởi tạo. Hãy gọi initTestMeta() trước.');
    }

    return cy.task('writeCell', {
        filename: currentMeta.filename,
        sheetName: currentMeta.sheetName,
        rowIndex: currentMeta.rowIndex,
        colName: currentMeta.colName,
        value
    });
}

module.exports = {
    initTestMeta,
    writeTestResult
};
