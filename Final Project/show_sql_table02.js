const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// app.get('view engine', 'ejs');



app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/signup", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.get("/return", function(req, res){
  res.sendFile(__dirname + "/index.html");
});


app.post("/", function(req, res){
  oracledb.getConnection(
    {
      user          : "mqi",
      password      : "5211314Wny",
      connectString : "//oracle.cise.ufl.edu/orcl"
      // user          : "mqi",
      // password      : "Wny5211314",
      // connectString : "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(
        `SELECT email, user_password, zip FROM dbms_user`, [],
        function(err, result)
        {
          if (err) { console.error(err); return; }
          htmlHeader(
            res,
            "Oracle Database Driver for Node.js",
            "Example using node-oracledb driver"
          );
          displayResults(res, result);
          // console.log(result.rows);
        });
    });

})

function displayResults(response, result) {
  response.write("<h2>" + "Employees in Department " + "</h2>");
  response.write("<table>");

  // Column Title
  response.write("<tr>");
  for (var col = 0; col < result.metaData.length; col++) {
    response.write("<th>" + result.metaData[col].name + "</th>");
  }
  response.write("</tr>");

  // Rows
  for (var row = 0; row < result.rows.length; row++) {
    response.write("<tr>");
    for (col = 0; col < result.rows[row].length; col++) {
      response.write("<td>" + result.rows[row][col] + "</td>");
    }
    response.write("</tr>");
  }
  response.write("</table>");
}

function htmlHeader(response, title, caption) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<!DOCTYPE html>");
  response.write("<html>");
  response.write("<head>");
  response.write("<style>" +
    "body {background:#FFFFFF;color:#000000;font-family:Arial,sans-serif;margin:40px;padding:10px;font-size:12px;text-align:center;}" +
    "h1 {margin:0px;margin-bottom:12px;background:#FF0000;text-align:center;color:#FFFFFF;font-size:28px;}" +
    "table {border-collapse: collapse;   margin-left:auto; margin-right:auto;}" +
    "td, th {padding:8px;border-style:solid}" +
    "</style>\n");
  response.write("<title>" + caption + "</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("<h1>" + title + "</h1>");
}

// Prepare HTML footer
function htmlFooter(response) {
  response.write("</body>\n</html>");
  response.end();
}

app.listen(3000, function(){
  console.log("Servers is running on port 3000.");
});
