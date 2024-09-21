const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();

const port = 3000;

app.set("view engine", "ejs"); // gunakan ejs
app.use(expressLayouts); // Third party middleware
app.use(express.static("public")); // Built-in level middleware

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Azis",
      email: "azis@gmail.com",
    },
    {
      nama: "Hadi",
      email: "hadi@gmail.com",
    },
    {
      nama: "Ahmad",
      email: "ahmad@gmail.com",
    },
  ];
  res.render("index", {
    nama: "Abdurrohman Azis",
    title: "Halaman Home",
    mahasiswa,
    layout: "layouts/main-layout",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layout",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404 Not Found</h1>");
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}....`);
});
