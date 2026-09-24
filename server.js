const express = require("express");
const path = require("path");
const sqlite3 = require("@appthreat/sqlite3");


const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database(path.join(__dirname, "database.db"));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service TEXT NOT NULL,
      barber TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+\$/.test(email);
}

app.post("/api/bookings", (req, res) => {
  const { service, barber, date, time, name, email, phone, notes = "" } = req.body;

  if (!service || !barber || !date || !time || !name || !email || !phone) {
    return res.status(400).json({ success:false, message:"Please complete all required fields." });
  }

  if (!validEmail(email)) {
    return res.status(400).json({ success:false, message:"Please enter a valid email address." });
  }

  const check = `
    SELECT id FROM bookings
    WHERE barber = ? AND date = ? AND time = ?
  `;

  db.get(check, [barber, date, time], (err, row) => {
    if (err) return res.status(500).json({ success:false, message:"Database error." });

    if (row) {
      return res.status(409).json({
        success:false,
        message:"That barber is already booked for the selected time. Please choose another slot."
      });
    }

    const insert = `
      INSERT INTO bookings
      (service, barber, date, time, name, email, phone, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insert, [service, barber, date, time, name, email, phone, notes], function(err) {
      if (err) return res.status(500).json({ success:false, message:"Could not save your booking." });

      res.json({
        success:true,
        bookingId:this.lastID,
        message:"Your appointment has been confirmed."
      });
    });
  });
});

app.get("/api/bookings", (req, res) => {
  db.all(`SELECT * FROM bookings ORDER BY date ASC, time ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ success:false, message:"Could not retrieve bookings." });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`The Gentlemen's Cut running on http://localhost:${PORT}`);
});
