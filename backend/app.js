const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());


const visitsRouter = require('./routes/visits')
app.use('/visits', visitsRouter);
const bookingRouter = require('./routes/book')
app.use('/book', bookingRouter);
const borrowRouter = require('./routes/borrow')
app.use('/borrow', borrowRouter);
const adminRouter = require('./routes/admin')
app.use('/admin', adminRouter);
const roomRouter = require('./routes/room')
app.use('/room', roomRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});