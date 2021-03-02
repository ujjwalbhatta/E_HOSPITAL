const multer = require("multer");

//Multer for report storage and filter
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
      cb(new Error("File is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
