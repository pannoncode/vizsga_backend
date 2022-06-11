const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    txt: "text/plain",
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    ico: "image/x-ico",
    type: function(ext) {
        return this[ext] || this.txt;
    }
};

let jobName = (data, bool) => {

    let names = [];

    for (let i = 0; i < data.length; i++) {

        if (data[i].jobSeeker == bool) {
            names.push(data[i].name);
        }

    }
    return names;
}


http.createServer((req, res) => {

    switch (true) {
        //1. feladat
        case req.method == "GET" && req.url == "/vizsga":

            fs.readFile(path.join(__dirname, "public", "dolgozat.html"), (err, fileContent) => {

                res.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
                res.write(fileContent);
                res.end();

            });
            break;

            //2.feladat => álláskeresők
        case req.method == "GET" && req.url == "/allaskeresok":

            fs.readFile(path.join(__dirname, "users.json"), (err, usersData) => {

                let userDatas = JSON.parse(usersData);

                res.writeHead(200, { "Content-type": "application/json; charset=utf-8" });
                res.write(
                    JSON.stringify(
                        jobName(userDatas, true)
                    )
                );
                res.end();
            });
            break;

            //2.feladat => foglalkoztatottak
        case req.method == "GET" && req.url == "/foglalkoztatottak":

            fs.readFile(path.join(__dirname, "users.json"), (err, usersData) => {

                let userDatas = JSON.parse(usersData);

                res.writeHead(200, { "Content-type": "application/json; charset=utf-8" });
                res.write(
                    JSON.stringify(
                        jobName(userDatas, false)
                    )
                );
                res.end();
            });
            break;

            //3.feladat
        case req.method == "POST" && req.url == "/newuser":

            let postData = "";
            let newUser = {};

            req.on("data", (chunk) => {
                postData += chunk;
            });

            req.on("end", () => {

                newUser = JSON.parse(postData);
                fs.readFile(path.join(__dirname, "users.json"), (err, fileContent) => {

                    let users = JSON.parse(fileContent);
                    users.push(newUser);

                    fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(users), () => {

                        res.writeHead(200, { "Content-type": "application/json" });
                        res.write(JSON.stringify({ saved: "OK", user: newUser }));
                        res.end();

                    });
                });

            });

            break;

        default:

            var filePath = path.join(__dirname, "public", req.url.slice(1));
            var fileExt = path.extname(req.url).slice(1);

            fs.readFile(filePath, (err, fc) => {
                if (err) {
                    res.write("hiba");
                    res.end();
                } else {
                    res.writeHead(200, { "Content-type": MIME.type(fileExt) });
                    res.write(fc);
                    res.end();
                }
            });

            break;
    }


}).listen(3000);