const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  getAdmin: (req, res) => {
    res.send("Hello from admin");
  },

  login: (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM admin WHERE username = ?";
    db.query(query, [username], (err, result) => {
      if (err) {
        res.status(500).send({ success: false, message: "Error logging in" });
      } else {
        if (result.length > 0) {
          const user = result[0];
          const isPasswordCorrect = bcrypt.compareSync(password, user.password);
          if (isPasswordCorrect) {
            user.role = "admin";
            delete user.password;
            delete user.salt;
            const token = jwt.sign({ data: user }, process.env.JWT_SECRET);
            res.send({ success: true, message: "Logged in successfully", token, user });
          } else {
            res.status(401).send({ success: false, message: "Invalid credentials" });
          }
        } else {
          res.status(401).send({ success: false, message: "Invalid credentials" });
        }
      }
    });
  },

  getAdmins: (req, res) => {
    const query = "SELECT * FROM admin";
    db.query(query, (err, result) => {
      res.send(result);
    });
  },

  createAdmin: (req, res) => {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);
    const query = "INSERT INTO admin (username, password, salt) VALUES (?, ?, ?)";
    db.query(query, [username, encryptedPassword, salt], (err, result) => {
      res.send(result);
    });
  },

  updateAdmin: (req, res) => {
    const { id, username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);
    const query = "UPDATE admin SET username = ?, password = ?, salt = ? WHERE id = ?";
    db.query(query, [username, encryptedPassword, salt, id], (err, result) => {
      res.send(result);
    });
  },

  deleteAdmin: (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM admin WHERE id = ?";
    db.query(query, [id], (err, result) => {
      res.send(result);
    });
  },
};
