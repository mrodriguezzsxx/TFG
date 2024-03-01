const express = require("express");

const app = express();
const Admin = require("../controllers/admin");
const check = require("../middleware/auth");

app.post("/login", Admin.login);
app.get('/profileAdmin/:id', check.auth, Admin.profileAdmin);
app.get("/list-usuarios", check.auth, Admin.listUsuarios);
app.post("/pendiente", check.auth, Admin.pendiente);
app.get("/list-pendientes", check.auth, Admin.listPendientes);
app.get('/list-pendiente/:id', check.auth, Admin.listPendiente);
module.exports = app;