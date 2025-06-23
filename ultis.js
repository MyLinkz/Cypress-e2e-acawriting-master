const fs = require('fs');

module.exports = {
  isFileExist(filePath) {
    return fs.existsSync(filePath);
  },
};