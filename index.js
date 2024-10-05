const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Route to render the index.ejs file
app.get("/", (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        if (err) {
            console.error("Error reading files:", err);
            files = [];
        }
        res.render('index', { files: files });
    });
});

// Route to read a specific file
app.get("/file/:heading", (req, res) => {
    fs.readFile(`./files/${req.params.heading}`, "utf-8", function (err, content) {
       res.render('show',{filename:req.params.heading , filedata: content});
    });
});

// Route to create a new file
app.post("/create", (req, res) => {
    const fileName = req.body.heading.split(' ').join('');  // Remove spaces from the heading
    fs.writeFile(`./files/${fileName}.txt`, req.body.content, function (err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Server Error");
        }
        res.redirect("/");  
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is working on port 3000');
});
