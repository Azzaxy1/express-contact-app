const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const { loadContacts, findContact, addContact } = require("./utils/contact");

const port = 3000;

app.set("view engine", "ejs"); // gunakan ejs
app.use(expressLayouts); // Third party middleware
app.use(express.static("public")); // Built-in level middleware
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.render("index", {
    title: "Halaman Home",
    layout: "layouts/main-layout",
    activeRoute: "home",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layout",
    activeRoute: "about",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContacts();

  res.render("contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
    contacts,
    activeRoute: "contact",
  });
});

// halaman form tambah data
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Form Tambah Data Contact",
    layout: "layouts/main-layout",
    activeRoute: "contact",
  });
});

// proses data contact
app.post("/contact", (req, res) => {
  addContact(req.body);
  res.redirect("/contact");
});

// halaman detail contact
app.get("/contact/:nama", (req, res) => {
  const params = req.params.nama;
  const contact = findContact(params);

  res.render("detail", {
    title: "Detail Contact",
    layout: "layouts/main-layout",
    contact,
    params,
    activeRoute: "contact",
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404 Not Found</h1>");
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}....`);
});
