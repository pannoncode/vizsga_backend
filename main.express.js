const express = require("express");
const app = express();

const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


let jobName = (data, bool) => {

    let names = [];

    for (let i = 0; i < data.length; i++) {

        if (data[i].jobSeeker == bool) {
            names.push(data[i].name);
        }

    }
    return names;
}


app.get("/vizsga", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "dolgozat.html"));

});

app.get("/allaskeresok", (req, res) => {

    fs.readFile(path.join(__dirname, "users.json"), (err, userDatas) => {


        let data = JSON.parse(userDatas);
        res.json(jobName(data, true));


    });

});

app.get("/foglalkoztatottak", (req, res) => {

    fs.readFile(path.join(__dirname, "users.json"), (err, userDatas) => {


        let data = JSON.parse(userDatas);
        res.json(jobName(data, false));


    });

});

app.post("/newuser", (req, res) => {

    let newUser = req.body;

    fs.readFile(path.join(__dirname, "users.json"), (err, userDatas) => {

        let users = JSON.parse(userDatas);
        users.push(newUser);

        fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(users), () => {

            res.json({ saved: "OK", user: newUser });

        });

    });

});



app.listen(3000);