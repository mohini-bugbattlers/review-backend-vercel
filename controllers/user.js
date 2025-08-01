const db = require("../db");
const jwt = require("jsonwebtoken");

module.exports = {
  getUsers: (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;
    db.query(query, (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error fetching users",
          data: err,
        });
      }
    });
  },

  addUser: (req, res) => {
    const { mobile, password, name } = req.body;
    const query = `INSERT INTO users (mobile, password, name) VALUES (?, ?, ?)`;
    db.query(query, [mobile, password, name], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error adding user",
          data: err,
        });
      }
    });
  },

  login: (req, res) => {
    const { mobile, password } = req.body;
    const query = `SELECT * FROM users WHERE mobile = ? AND password = ?`;
    db.query(query, [mobile, password], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error logging in",
          data: err,
        });
      } else if (result.length === 0) {
        res.status(401).send({
          success: false,
          message: "Invalid mobile or password",
        });
      } else {
        const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).send({
          success: true,
          message: "Login successful",
          token: token,
        });
      }
    });
  },

  getUser: (req, res) => {
    const { id } = req.user;
    const query = `SELECT * FROM users WHERE id = ?`;
    db.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error fetching user",
          data: err,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "User fetched successfully",
          data: result,
        });
      }
    });
  },

  updateUser: (req, res) => {
    const { id } = req.user;
    const { mobile, password, name } = req.body;
    const query = `UPDATE users SET mobile = ?, password = ?, name = ? WHERE id = ?`;
    db.query(query, [mobile, password, name, id], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Error updating user",
          data: err,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "User updated successfully",
        });
      }
    });
  },
};
