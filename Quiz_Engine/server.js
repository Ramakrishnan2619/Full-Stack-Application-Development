const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'quiz_engine' };
const getConn = () => mysql.createConnection(dbConfig);

// ─── Helper: generate unique cert code ───────────────────────────────────────
const genCertCode = () => 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();

// ════════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required.' });
    try {
        const conn = await getConn();
        const [existing] = await conn.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) { await conn.end(); return res.status(409).json({ error: 'Email already registered.' }); }
        const hashed = await bcrypt.hash(password, 10);
        const [result] = await conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
        await conn.end();
        res.json({ success: true, user: { id: result.insertId, name, email, role: 'student' } });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
    try {
        const conn = await getConn();
        const [users] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
        await conn.end();
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials.' });
        const user = users[0];
        // Allow plain text for admin default, otherwise bcrypt compare
        const match = user.password === password || await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════════════════════════
// QUIZ ROUTES
// ════════════════════════════════════════════════════════════════════════════════

// GET /api/questions?limit=10&difficulty=all
app.get('/api/questions', async (req, res) => {
    const { difficulty = 'all', limit = 10 } = req.query;
    try {
        const conn = await getConn();
        let sql = 'SELECT id, question_text, question_type, option_a, option_b, option_c, option_d, category, difficulty, points FROM questions';
        const params = [];
        if (difficulty !== 'all') { sql += ' WHERE difficulty = ?'; params.push(difficulty); }
        sql += ' ORDER BY RAND() LIMIT ?';
        params.push(parseInt(limit));
        const [rows] = await conn.execute(sql, params);
        await conn.end();
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/submit
app.post('/api/submit', async (req, res) => {
    const { userId, answers, timeTaken } = req.body;
    try {
        const conn = await getConn();
        const [questions] = await conn.execute('SELECT id, correct_option, points FROM questions');
        let score = 0, maxScore = 0, streak = 0, maxStreak = 0;
        questions.forEach(q => {
            maxScore += q.points;
            if (answers[q.id] === q.correct_option) {
                score += q.points; streak++; maxStreak = Math.max(maxStreak, streak);
            } else { streak = 0; }
        });
        const total = maxScore;
        const percent = +((score / total) * 100).toFixed(2);
        const [ins] = await conn.execute(
            'INSERT INTO attempts (user_id, score, total, streak, percentage, time_taken) VALUES (?,?,?,?,?,?)',
            [userId, score, total, maxStreak, percent, timeTaken || 0]
        );
        await conn.end();
        res.json({ success: true, score, total, streak: maxStreak, percentage: percent, attemptId: ins.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/history/:userId
app.get('/api/history/:userId', async (req, res) => {
    try {
        const conn = await getConn();
        const [rows] = await conn.execute(
            'SELECT a.*, c.cert_code FROM attempts a LEFT JOIN certificates c ON c.attempt_id = a.id WHERE a.user_id = ? ORDER BY a.date_taken DESC LIMIT 20',
            [req.params.userId]
        );
        await conn.end();
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const conn = await getConn();
        const [rows] = await conn.execute(
            `SELECT u.name, MAX(a.score) as score, MAX(a.total) as total,
             MAX(a.streak) as streak, MAX(a.percentage) as percentage
             FROM attempts a JOIN users u ON u.id = a.user_id
             GROUP BY u.id, u.name ORDER BY percentage DESC, streak DESC LIMIT 10`
        );
        await conn.end();
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/stats/:userId  — for analytics charts
app.get('/api/stats/:userId', async (req, res) => {
    try {
        const conn = await getConn();
        const [attempts] = await conn.execute(
            'SELECT score, total, percentage, streak, time_taken, date_taken FROM attempts WHERE user_id = ? ORDER BY date_taken ASC LIMIT 10',
            [req.params.userId]
        );
        const [cats] = await conn.execute(`
            SELECT q.category, COUNT(*) as total,
            SUM(CASE WHEN q.correct_option IS NOT NULL THEN 1 ELSE 0 END) as attempted
            FROM questions q GROUP BY q.category`
        );
        await conn.end();
        res.json({ attempts, categories: cats });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/admin/stats — for admin dashboard
app.get('/api/admin/stats', async (req, res) => {
    try {
        const conn = await getConn();
        const [[{totalUsers}]] = await conn.execute('SELECT COUNT(*) as totalUsers FROM users WHERE role="student"');
        const [[{totalAttempts}]] = await conn.execute('SELECT COUNT(*) as totalAttempts FROM attempts');
        const [[{avgScore}]] = await conn.execute('SELECT AVG(percentage) as avgScore FROM attempts');
        const [recent] = await conn.execute(
            'SELECT u.name, a.score, a.total, a.percentage, a.date_taken FROM attempts a JOIN users u ON u.id=a.user_id ORDER BY a.date_taken DESC LIMIT 5'
        );
        await conn.end();
        res.json({ totalUsers, totalAttempts, avgScore: (avgScore||0).toFixed(1), recentAttempts: recent });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/certificate
app.post('/api/certificate', async (req, res) => {
    const { userName, score, total, streak, percentage, attemptId, userId } = req.body;
    const grade = percentage >= 90 ? 'A+' : percentage >= 75 ? 'A' : percentage >= 60 ? 'B' : 'C';
    let certCode = genCertCode();

    try {
        const conn = await getConn();
        const [existing] = await conn.execute('SELECT cert_code FROM certificates WHERE attempt_id = ?', [attemptId]);
        if (existing.length > 0) { certCode = existing[0].cert_code; }
        else { await conn.execute('INSERT INTO certificates (attempt_id, user_id, cert_code) VALUES (?,?,?)', [attemptId, userId, certCode]); }
        await conn.end();
    } catch (e) { /* skip cert saving errors */ }

    // PDF
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${userName}.pdf`);
    doc.pipe(res);

    const W = doc.page.width, H = doc.page.height;
    doc.rect(0, 0, W, H).fill('#060d1a');
    // Decorative Side Bars
    doc.rect(0, 0, 14, H).fill('#6c63ff');
    doc.rect(W - 14, 0, 14, H).fill('#6c63ff');
    // Gold border
    doc.rect(24, 20, W - 48, H - 40).lineWidth(2).stroke('#c9a84c');
    doc.rect(30, 26, W - 60, H - 52).lineWidth(0.5).stroke('#c9a84c');
    // Stars at corners
    [40, W - 40].forEach(cx => [36, H - 36].forEach(cy => doc.circle(cx, cy, 5).fill('#c9a84c')));

    // Header band
    doc.rect(14, 52, W - 28, 80).fill('#0d2044');
    // Title
    doc.fillColor('#c9a84c').font('Helvetica-Bold').fontSize(32)
        .text('CERTIFICATE OF ACHIEVEMENT', 0, 68, { align: 'center', width: W });
    doc.fillColor('#90caf9').font('Helvetica').fontSize(12)
        .text('CSE Quiz Excellence Platform — Vel Tech Rangarajan Dr. Sagunthala R&D University', 0, 112, { align: 'center', width: W });

    // Body
    doc.fillColor('#cccccc').font('Helvetica').fontSize(13).text('This is to proudly certify that', 0, 165, { align: 'center', width: W });
    doc.fillColor('#ffd700').font('Helvetica-Bold').fontSize(40).text(userName, 0, 188, { align: 'center', width: W });
    const nw = 380;
    doc.moveTo((W - nw)/2, 240).lineTo((W + nw)/2, 240).lineWidth(1).stroke('#c9a84c');
    doc.fillColor('#cccccc').font('Helvetica').fontSize(12)
        .text('has demonstrated outstanding knowledge in Computer Science fundamentals', 0, 253, { align: 'center', width: W });

    // Stats
    const statsY = 285;
    const statBoxes = [
        { label: 'SCORE', value: `${score}/${total}` },
        { label: 'PERCENTAGE', value: `${percentage}%` },
        { label: 'GRADE', value: grade },
        { label: 'BEST STREAK', value: `${streak}🔥` }
    ];
    const bw = 130, gap = 18;
    const totalBW = statBoxes.length * bw + (statBoxes.length - 1) * gap;
    const startX = (W - totalBW) / 2;
    statBoxes.forEach((s, i) => {
        const bx = startX + i * (bw + gap);
        doc.rect(bx, statsY, bw, 58).fill('#0d2044').stroke('#c9a84c');
        doc.fillColor('#c9a84c').font('Helvetica-Bold').fontSize(9).text(s.label, bx, statsY + 7, { width: bw, align: 'center' });
        doc.fillColor('#fff').font('Helvetica-Bold').fontSize(20).text(s.value, bx, statsY + 24, { width: bw, align: 'center' });
    });

    // Footer
    doc.moveTo(60, H - 60).lineTo(W - 60, H - 60).lineWidth(0.5).stroke('#c9a84c');
    const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.fillColor('#888').font('Helvetica').fontSize(9)
        .text(`Date: ${date}`, 60, H - 48)
        .text(`Certificate ID: ${certCode}`, 0, H - 48, { align: 'center', width: W })
        .text('Authorized Signature', W - 200, H - 48, { width: 140, align: 'right' });

    doc.end();
});

app.listen(PORT, () => {
    console.log(`\n🚀 Quiz Platform → http://localhost:${PORT}`);
    console.log('Admin Login: admin@quiz.com / admin123\n');
});
