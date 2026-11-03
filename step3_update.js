// 단계 5 (step3): 메뉴 수정 — Update
// 실행: node step3_update.js → http://localhost:3000/menus

const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;
const db = new Database(path.join(__dirname, "cafe.db"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.redirect("/menus"));

// [R] 목록
app.get("/menus", (req, res) => {
  const menus = db
    .prepare("SELECT * FROM menus ORDER BY category, price")
    .all();
  res.render("menu_step3", { menus });
});

// [C] 추가
app.post("/menus", (req, res) => {
  const name = (req.body.name || "").trim();
  const price = Number(req.body.price);
  if (name === "" || Number.isNaN(price) || price < 0) return res.redirect("/menus");

  db.prepare("INSERT INTO menus (name, price, category) VALUES (?, ?, ?)")
    .run(name, price, req.body.category);
  res.redirect("/menus");
});

// [U] 수정 폼 보여주기: GET /menus/:id/edit
app.get("/menus/:id/edit", (req, res) => {
  const menu = db.prepare("SELECT * FROM menus WHERE id = ?").get(req.params.id);
  if (!menu) return res.redirect("/menus");
  res.render("edit", { menu });
});

// [U] 수정 실행: POST /menus/:id/edit → UPDATE
app.post("/menus/:id/edit", (req, res) => {
  const name = (req.body.name || "").trim();
  const price = Number(req.body.price);
  if (name !== "" && !Number.isNaN(price) && price >= 0) {
    db.prepare("UPDATE menus SET name = ?, price = ?, category = ? WHERE id = ?")
      .run(name, price, req.body.category, req.params.id);
  }
  res.redirect("/menus");
});

app.listen(PORT, () => {
  console.log(`카페 메뉴 서버 실행 중: http://localhost:${PORT}/menus`);
});
