const multer = require('multer');
const { getFileDate } = require('../utils/utils')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./src/storage/documents");
	},
	filename: (req, file, cb) => {
		cb(null, getFileDate(new Date()) + file.originalname);
	},
});
let upload = multer({ storage });

module.exports = upload;