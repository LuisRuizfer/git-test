const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, callBack) => {
		callBack(null, "./src/storage/facturas");
	},
	filename: (req, file, callBack) => {
		callBack(null, file.originalname);
	},
});
let upload = multer({ storage });

module.exports = upload;