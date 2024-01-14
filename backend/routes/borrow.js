const express = require('express');
const router= express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_lkeylog',
  });
  
  // Connect to MySQL
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
  });
  router.use(bodyParser.json());

  router.post('/', (req, res) => {
    const {
      date,
      room_id,
      name_borrower,
      time_borrowed,
      time_returned,
      status,
      admin_assigned
    } = req.body;
  
    const sql =
      'INSERT INTO tbl_borrowers (date, room_id, name_borrower, time_borrowed, time_returned, status, admin_assigned) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
    db.query(
      sql,
      [date, room_id, name_borrower, time_borrowed, time_returned, status, admin_assigned],
      (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).send('Internal Server Error');
        } else {
          res.json({
            id: results.insertId,
            date,
            room_id,
            name_borrower,
            time_borrowed,
            time_returned,
            status,
            admin_assigned
          });
        }
      }
    );
  });

  
  router.put('/:id', (req, res) => {
    const borrowId = req.params.id;
    const { date, room_id, name_borrower, time_borrowed, time_returned, status, admin_assigned } = req.body;

    db.query(
        'UPDATE tbl_borrowers SET date = ?, room_id = ?, name_borrower = ?, time_borrowed = ?, time_returned = ?, status = ?, admin_assigned = ? WHERE id = ?',
        [date, room_id, name_borrower, time_borrowed, time_returned, status, admin_assigned, borrowId],
        (err, results) => {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).send('Internal Server Error');
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ error: 'Borrow record not found' });
                } else {
                    res.json({ id: borrowId, message: 'Borrow record updated successfully' });
                }
            }
        }
    );
});

  // view
  router.get('/', (req, res) => {
    db.query('SELECT * FROM tbl_borrowers', (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });

module.exports = router;