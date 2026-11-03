// 단계 4 (step2): 메뉴 추가 — Create
// 실행: node step2_create.js → http://localhost:3000/menus

const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;
const db = new Database(path.join(__dirname, "cafe.db"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // 폼 데이터 처리

app.get("/", (req, res) => res.redirect("/menus"));

// [R] 목록
app.get("/menus", (req, res) => {
  const menus = db
    .prepare("SELECT * FROM menus ORDER BY category, price")
    .all();
  res.render("menu_step2", { menus });
});

// [C] 추가: 폼 POST → INSERT → redirect
app.post("/menus", (req, res) => {
  const name = (req.body.name || "").trim();
  const price = Number(req.body.price);
  const category = req.body.category;

  // 입력 검증
  if (name === "" || Number.isNaN(price) || price < 0) {
    return res.redirect("/menus");
  }

  db.prepare("INSERT INTO menus (name, price, category) VALUES (?, ?, ?)")
    .run(name, price, category); // ? 플레이스홀더 — SQL 인젝션 방지

  res.redirect("/menus"); // 새로고침해도 중복 등록되지 않도록 redirect
});

app.listen(PORT, () => {
  console.log(`카페 메뉴 서버 실행 중: http://localhost:${PORT}/menus`);
});
