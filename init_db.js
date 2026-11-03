// DB 초기화 스크립트 — cafe.db를 (재)생성하고 예시 데이터를 넣는다
// 실행: node init_db.js

const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "cafe.db"));

// 기존 테이블을 지우고 새로 만든다 (초기화)
db.exec(`
  DROP TABLE IF EXISTS menus;

  CREATE TABLE menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 자동 증가 번호
    name TEXT NOT NULL,                    -- 메뉴 이름
    price INTEGER NOT NULL,                -- 가격(원)
    category TEXT NOT NULL,                -- 커피 / 티 / 디저트
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );
`);

// 예시 데이터
const insert = db.prepare(
  "INSERT INTO menus (name, price, category) VALUES (?, ?, ?)"
);

const seed = [
  ["아메리카노", 4500, "커피"],
  ["카페라떼", 5000, "커피"],
  ["바닐라라떼", 5500, "커피"],
  ["얼그레이 티", 4800, "티"],
  ["치즈케이크", 6500, "디저트"],
  ["크루아상", 4000, "디저트"],
];

for (const [name, price, category] of seed) {
  insert.run(name, price, category);
}

console.log("cafe.db 초기화 완료 — menus 테이블에 예시 메뉴 6개를 넣었습니다.");
db.close();
