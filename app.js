require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// MySQL 연결
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// EJS 설정
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// 메인 페이지
app.get('/', (req, res) => {
    res.redirect('/menus');
});

// 메뉴 목록 조회
app.get('/menus', (req, res) => {
    const sql = 'SELECT * FROM menus ORDER BY category, price';

    db.query(sql, (err, menus) => {
        if (err) {
            console.error(err);
            return res.status(500).send('메뉴 조회 실패');
        }

        res.render('menu_step4', { menus });
    });
});

// 메뉴 등록
app.post('/menus', (req, res) => {
    const { name, price, category } = req.body;

    const sql = 'INSERT INTO menus (name, price, category) VALUES (?, ?, ?)';

    db.query(sql, [name, Number(price), category], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('메뉴 등록 실패');
        }

        res.redirect('/menus');
    });
});

// 메뉴 수정 화면
app.get('/menus/:id/edit', (req, res) => {
    const sql = 'SELECT * FROM menus WHERE id = ?';

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('메뉴 조회 실패');
        }

        if (results.length === 0) {
            return res.redirect('/menus');
        }

        res.render('edit', { menu: results[0] });
    });
});

// 메뉴 수정 실행
app.post('/menus/:id/edit', (req, res) => {
    const { name, price, category } = req.body;

    const sql = `
        UPDATE menus
        SET name = ?, price = ?, category = ?
        WHERE id = ?
    `;

    db.query(sql, [name, Number(price), category, req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('메뉴 수정 실패');
        }

        res.redirect('/menus');
    });
});

// 메뉴 삭제
app.post('/menus/:id/delete', (req, res) => {
    const sql = 'DELETE FROM menus WHERE id = ?';

    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('메뉴 삭제 실패');
        }

        res.redirect('/menus');
    });
});

// 서버 실행
db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err);
        return;
    }

    console.log('MySQL 연결 성공!');

    app.listen(PORT, () => {
        console.log(`카페 메뉴 서버 실행 중: http://localhost:${PORT}/menus`);
    });
});

