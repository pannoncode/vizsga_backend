function $s(sel) {
    return document.querySelector(sel);
}

const Request = {

    http: function(success) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200)
                success(this.responseText);

        }

        return xhttp;
    },

    get: function(url, success) {

        let xhttp = Request.http(success);

        xhttp.open("GET", url);
        xhttp.send();

    },

    post: function(url, params, success) {

        let xhttp = Request.http(success);

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Content-type", "application/json")
        xhttp.send(JSON.stringify(params || {}));

    }
}

$s("#jobseeker").onclick = function() {

    Request.get("/allaskeresok", function(res) {
        location = "/allaskeresok";
    });

};

$s("#job").onclick = function() {

    Request.get("/foglalkoztatottak", function(res) {
        location = "/foglalkoztatottak";
    });

};

$s("#save").onclick = function() {
    let name = $s("#name").value.trim();
    let age = parseInt($s("#age").value.trim());
    let jobSeeker = $s("#jobseeker > option").value;
    let gender = $s("#gender").value;
    let profession = $s("#profession").value.trim();

    let datas = { name, age, jobSeeker, gender, profession };
    console.log(datas);


    Request.post("/newuser", datas, function(res) {
        console.log(res);
        $s("#name").value = "";
        $s("#age").value = "";
        $s("#profession").value = "";

    });

}