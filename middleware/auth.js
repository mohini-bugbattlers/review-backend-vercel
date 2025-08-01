const jwt = require("jsonwebtoken");

module.exports = {

    isAdmin: (req, res, next) => {
        console.log(req.path);
        if (req.path === "/login") {
            next();
            return;
        }
        const authorization = req.headers["authorization"];
        if (!authorization) {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ success: false, message: "Unauthorized" });
            }
            if (decoded.data.role !== "admin") {
                return res.status(401).send({ success: false, message: "Unauthorized" });
            }
            if (req.method === "DELETE" || req.path === "/admins" && req.method === "POST") {
                if (decoded.data.id != 1) {
                    return res.status(401).send({ success: false, message: "Unauthorized" });
                }
            }
            req.admin = decoded.data;
            next();
        });
    },

    isUser: (req, res, next) => {
        const token = req.headers["authorization"].split(" ")[1];
        if (!token) {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ success: false, message: "Unauthorized" });
            }
            if (decoded.data.role !== "user") {
                return res.status(401).send({ success: false, message: "Unauthorized" });
            }
            req.user = decoded.data;
            next();
        });
    },
    
};
