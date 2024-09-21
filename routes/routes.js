const express = require("express");
const {
  loadContacts,
  findContact,
  addContact,
  checkDuplicate,
} = require("../utils/contact");
const { body, validationResult, check } = require("express-validator");
const router = express.Router();

// Rute untuk halaman utama
router.get("/", (req, res) => {
  res.render("index", {
    title: "Halaman Home",
    layout: "layouts/main-layout",
    activeRoute: "home",
  });
});

// Rute untuk halaman about
router.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layout",
    activeRoute: "about",
  });
});

// Rute untuk halaman contact
router.get("/contact", (req, res) => {
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

// Rute halaman form tambah data
router.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Form Tambah Data Contact",
    layout: "layouts/main-layout",
    activeRoute: "contact",
  });
});

// proses data contact
router.post(
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

// Rute halaman detail contact
router.get("/contact/:nama", (req, res) => {
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

module.exports = router;
