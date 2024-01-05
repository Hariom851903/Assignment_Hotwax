const express = require('express');
const bodyParser = require('body-parser');

const db=require('./database/connection');


const router=require('./router');

const app = express();
const port = 4000;



// Middleware
app.use(bodyParser.json());
app.use('/api',router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
