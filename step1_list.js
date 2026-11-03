// 단계 3 (step1): 메뉴 목록 표시 — Read
// 실행: node step1_list.js → http://localhost:3000/menus

const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;
const db = new Database(path.join(__dirname, "cafe.db"));

app.set("view engine", "ejs");

app.get("/", (req, res) => res.redirect("/menus"));

// [R] 목록 조회
app.get("/menus", (req, res) => {
  // better-sqlite3: prepare(SQL).all() → 결과 배열 (동기 방식이라 await 불필요)
  const menus = db
    .prepare("SELECT * FROM menus ORDER BY category, price")
    .all();

  res.render("menu_step1", { menus });
});

app.listen(PORT, () => {
  console.log(`카페 메뉴 서버 실행 중: http://localhost:${PORT}/menus`);
});
