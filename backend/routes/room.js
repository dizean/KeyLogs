const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_lkeylog',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

router.use(bodyParser.json());

// Create a new room
router.post('/', (req, res) => {
  const { room, location, status } = req.body;
  const sql = 'INSERT INTO tbl_rooms (room, location, status) VALUES (?, ?, ?)';

  db.query(sql, [room, location, status], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ id: results.insertId, room, location, status });
    }
  });
});

// View all rooms
router.get('/', (req, res) => {
  db.query('SELECT * FROM tbl_rooms', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// Update room by ID
router.put('/:id', (req, res) => {
  const roomId = req.params.id;
  const { status } = req.body;

  db.query(
    'UPDATE tbl_rooms SET status = ? WHERE id = ?',
    [status, roomId],
    (err, results) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Room not found' });
        } else {
          res.json({ id: roomId, message: 'Room updated successfully' });
        }
      }
    }
  );
});

router.post('/search', (req, res) => {
  const searchTerm = req.body.searchTerm;
  const sql = `
    SELECT * FROM tbl_rooms
    WHERE room LIKE ?`; 

  const params = [`%${searchTerm}%`];

  db.query(sql, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
module.exports = router;
