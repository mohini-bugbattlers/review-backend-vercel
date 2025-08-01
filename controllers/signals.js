const db = require("../db");

module.exports = {
  getSignals: (req, res) => {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const fromDate = date + ' 00:00:00.000000';
    const toDate = date + ' 23:59:59.000000';
    const category_id = req.query.category_id || '';
    let query = "";
    if (category_id) {
      query = "SELECT sig.*, sym.name, cat.name as category_name FROM signals as sig, symbol as sym, categories as cat WHERE sig.symbol_id = sym.id AND sig.category_id = cat.id AND sig.opening_time BETWEEN ? AND ? AND sig.category_id = ?";
    } else {
      query = "SELECT sig.*, sym.name, cat.name as category_name FROM signals as sig, symbol as sym, categories as cat WHERE sig.symbol_id = sym.id AND sig.category_id = cat.id AND sig.opening_time BETWEEN ? AND ?";
    }
    db.query(query, [fromDate, toDate, category_id], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error fetching signals",
          data: err,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Signals fetched successfully",
          data: result,
        });
      }
    });
  },

  addSignal: (req, res) => {
    // format 2024-12-16 00:42:54.000000
    let { symbol_id, opening_time, open_price, status, action, time_frame, tp1, tp2, tp3, sl, pnl, possibility, info, result } = req.body;
    const query = "INSERT INTO signals (symbol_id, opening_time, open_price, status, action, time_frame, tp1, tp2, tp3, sl, pnl, possibility, info, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [symbol_id, opening_time, open_price, status, action, time_frame, tp1, tp2, tp3, sl, pnl, possibility, info, result], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error adding signal",
          data: err,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Signal added successfully",
          data: result,
        });
      }
    });
  },

  updateSignal: (req, res) => {
    let { symbol_id, opening_time, open_price, status, action, time_frame, tp1, tp2, tp3, sl, pnl, possibility, info, result } = req.body;
    const query = "UPDATE signals SET symbol_id = ?, opening_time = ?, open_price = ?, status = ?, action = ?, time_frame = ?, tp1 = ?, tp2 = ?, tp3 = ?, sl = ?, pnl = ?, possibility = ?, info = ?, result = ?, updated_at = NOW() WHERE id = ?";
    db.query(query, [symbol_id, opening_time, open_price, status, action, time_frame, tp1, tp2, tp3, sl, pnl, possibility, info, result, req.params.id], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error updating signal",
          data: err,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Signal updated successfully",
          data: result,
        });
      }
    });
  },

  deleteSignal: (req, res) => {
    const query = "DELETE FROM signals WHERE id = ?";
    db.query(query, [req.params.id], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error deleting signal",
          data: err,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Signal deleted successfully",
          data: result,
        });
      }
    });
  },

  getSignalById: (req, res) => {
    const query = "SELECT signals.*, symbol.name, categories.name as category_name FROM signals LEFT JOIN symbol ON signals.symbol_id = symbol.id WHERE signals.id = ?";
    db.query(query, [req.params.id], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error fetching signal",
          data: err,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Signal fetched successfully",
          data: result,
        });
      }
    });
  },

  getSignalBySymbol: (req, res) => {
    const query = "SELECT signals.*, symbol.name, categories.name as category_name FROM signals LEFT JOIN symbol ON signals.symbol_id = symbol.id WHERE symbol_id = ?";
    db.query(query, [req.params.symbol_id], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error fetching signal",
          data: err,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Signal fetched successfully",
          data: result,
        });
      }
    });
  }
};
