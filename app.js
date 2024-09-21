const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const router = require("./routes/routes");

const port = 3000;

app.set("view engine", "ejs"); // gunakan ejs
app.use(expressLayouts); // Third party middleware
app.use(express.static("public")); // Built-in level middleware
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

// Menggunakan rute yang ada di routes.js
app.use("/", router);

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404 Not Found</h1>");
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}....`);
});
