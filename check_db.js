// DB 내용 확인 스크립트
// 실행: node check_db.js

const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "cafe.db"), { readonly: true });

const menus = db.prepare("SELECT * FROM menus ORDER BY category, price").all();

console.log(`menus 테이블: 총 ${menus.length}개`);
console.table(menus);

db.close();
