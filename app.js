const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//Set uses
app.use(express.static(path.join(__dirname,'public')));


// Server Run on local env port or localhost:3000
app.listen(port,() =>
    {
        console.log(`Server running on port : ${port}`);
    });
