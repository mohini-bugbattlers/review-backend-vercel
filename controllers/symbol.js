const db = require("../db");

module.exports = {
  getSymbols: (req, res) => {
    const query = "SELECT * FROM symbol";
    db.query(query, (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error fetching symbols",
          data: err,
        });
      } else {
        res.send({
          success: true,
          message: "Symbols fetched successfully",
          data: result,
        });
      }
    });
  },
};
