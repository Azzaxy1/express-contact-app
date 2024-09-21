const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const {
  loadContacts,
  findContact,
  addContact,
  checkDuplicate,
} = require("./utils/contact");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

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
    //* Gunakan flash
    msg: req.flash("msg"),
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
app.post(
  "/contact",
  body("nama").custom((value) => {
    const duplicate = checkDuplicate(value);
    if (duplicate) {
      throw new Error("Nama contact sudah terdaftar!");
    }

    return true;
  }),
  check("email", "Email tidak valid!").isEmail().withMessage(),
  check("nohp").isMobilePhone("id-ID").withMessage("No HandPhone tidak valid!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Form Tambah Data Contact",
        layout: "layouts/main-layout",
        activeRoute: "contact",
        errors: errors.array(),
        success: "Data berhasil dimasukan",
      });
    } else {
      addContact(req.body);
      // kirimkan flash message
      req.flash("msg", "Data contact berhasil ditambahkan!");
      res.redirect("/contact");
    }
  }
);

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
