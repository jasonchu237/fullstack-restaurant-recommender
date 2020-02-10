const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var async = require('async');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.get('view engine', 'ejs');




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function displayResults_01(response, result) {

  response.setHeader('Content-Type', 'text/html');

  //  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<!DOCTYPE html>");
  response.write("<html>");
  response.write("<head>");
  response.write("<meta charset=utf-8>");
  response.write("<script src=" + "https://code.highcharts.com/highcharts.js" + ">" + "</script>");
  response.write("<script src=" + "https://code.highcharts.com/modules/series-label.js" + ">" + "</script>");
  response.write("<script src=" + "https://code.highcharts.com/modules/exporting.js" + ">" + "</script>");
  response.write("<script src=" + "https://code.highcharts.com.cn/highcharts/themes/dark-unica.js" + ">" + "</script>");
  response.write("</head>");
  response.write("<body>");
  response.write("<div id=" + "container" + " style=" + "min-width:400px;height:400px" + ">" + "</div>");
  response.write("<script>" + "var chart = Highcharts.chart('container', {chart: {type: 'spline'},title: {text: 'the trend of score by timeline'},");
  response.write("subtitle: {text: 'for certain name and zip'},");
  response.write("xAxis: {type: 'datetime',title: {text: 'Date'}},yAxis: {title: {text: 'score'},min: 80},tooltip: {headerFormat: '<b>{series.name}</b><br>',pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'},");
  response.write("plotOptions: {spline: {marker: {enabled: true}}},colors: ['#6CF', '#3AFF00', '#06C', '#036', '#ff0000','#637bf4'],");
  response.write("series: [");
  for (var row = 0; row < result.rows.length;) {
    if (row === 0) {
      response.write("{name: '" + result.rows[row][0] + "',data: [");
    } else {
      if (result.rows[row][0] !== result.rows[row - 1][0]) {
        response.write("]}, {name: '" + result.rows[row][0] + "',data: [");
        // console.log(10);
      }
    }
    let a = result.rows[row][1];
    //let a1= new Date(a);
    //console.log(a1);
    let y = a.getUTCFullYear();
    let m = a.getUTCMonth();
    let d = a.getUTCDate();
    // console.log(y,m,d);
    //console.log(row);   //console.log(result.rows[row][2]);
    response.write("[Date.UTC(" + y + ", " + m + " ," + d + ")," + result.rows[row][2] + "],");
    row = row + 1;
  }
  response.write("]}]});");
  response.write("</script>");
  response.write("</body>\n</html>");
  response.end();
}





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below Are Get Function For Each Page/////
//Basic SQL//
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/signup", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/general_search", function(req, res) {
  res.sendFile(__dirname + "/general_search.html");
});

app.get("/search", function(req, res) {
  res.sendFile(__dirname + "/search.html");
});

app.get("/general_search", function(req, res) {
  res.sendFile(__dirname + "/general_search.html");
});

app.get("/Performance", function(req, res) {
  res.sendFile(__dirname + "/Performance.html");
});

app.get("/Violation", function(req, res) {
  res.sendFile(__dirname + "/Violation.html");
});

app.get("/Name_score_interested", function(req, res) {
  res.sendFile(__dirname + "/Name_score_interested.html");
});

app.get("/Top_performance", function(req, res) {
  res.sendFile(__dirname + "/Top_performance.html");
});

app.get("/Search_score_range", function(req, res) {
  res.sendFile(__dirname + "/Search_score_range.html");
});

app.get("/Quality_operator", function(req, res) {
  res.sendFile(__dirname + "/Quality_operator.html");
});

app.get("/Prediction", function(req, res) {
  res.sendFile(__dirname + "/Prediction.html");
});

app.get("/Are_u_inspector", function(req, res) {
  res.sendFile(__dirname + "/Are_u_inspector.html");
});

//Inspectior SQL//

app.get("/stores_need_more_inspections", function(req, res) {
  res.sendFile(__dirname + "/stores_need_more_inspections.html");
});

app.get("/bad_performance_stores", function(req, res) {
  res.sendFile(__dirname + "/bad_performance_stores.html");
});

app.get("/inspectors_of_your_region", function(req, res) {
  res.sendFile(__dirname + "/inspectors_of_your_region.html");
});

app.get("/know_the_owner", function(req, res) {
  res.sendFile(__dirname + "/know_the_owner.html");
});


//Advanced SQL//









//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////BASIC     QUERIES////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our Homepage/////

app.post("/", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {
      let userEmail = req.body.userEmail;
      let passWord = req.body.passWord;
      if (err) {
        console.error(err);
        return;
      }
      connection.execute(
        `SELECT email, user_password, zip
         FROM dbms_user where email = '${userEmail}' and user_password = '${passWord}'`, [],
        function(err, result) {
          // console.log(typeof(result.rows[0]))
          // console.log(result.rows[0] === null )
          if (result.rows[0] === undefined) {
            // res.sendFile(__dirname + "/index.html");
            res.redirect('/index')
          } else {
            console.log("Welcome back");
            res.redirect('/general_search')
            // res.sendFile(__dirname + "/search.html");
            // res.sendFile(__dirname + "/search.html");
          }
          // if (result.rows[0][0] === `${userEmail}` && result.rows[0][1] === `${passWord}`) {
          //   console.log("Welcome back");
          //   res.sendFile(__dirname + "/search.html");
          // }

          // if (err) { console.error(err); return; }
          // htmlHeader(
          //   res,
          //   "Oracle Database Driver for Node.js",
          //   "Example using node-oracledb driver"
          // );
          // displayResults(res, result);
          // console.log(result.rows);
        });
    });

})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our Sign Up Page/////

app.post("/signup", function(req, res) {
  let userID = req.body.userid
  let userEmail = req.body.email
  let region = req.body.region
  let passWord = req.body.passWord
  console.log(`user: ${userID}; userEmail: ${userEmail}; region: ${region}; password: ${passWord}`)

  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {
      if (err) {
        console.error(err);
        return;
      }
      connection.execute(
        "INSERT INTO dbms_user VALUES (:email, :user_password, :zip)",
        [userEmail, passWord, region], // Bind values
        {
          autoCommit: true
        }, // Override the default non-autocommit behavior
        function(err, result) {
          console.log(result)
          res.sendFile(__dirname + "/general_search.html");

          // if (err) {
          //   return cb(err, conn);
          // } else {
          //   console.log("Rows inserted: " + result.rowsAffected);  // 1
          //   return cb(null, conn);
          // }
        })
    })
})



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our Search Page/////

app.post("/search", function(req, res) {

  res.send("Thanks")
  console.log(req.body)
  let p_Name = req.body.programName
  let z_Code = req.body.zipCode
  let s_Value = req.body.scoreValue
  let s_Date = req.body.startDate
  let e_Date = req.body.endDate
  let rest = req.body.restaurant
  let mark = req.body.market
  console.log(`Program Name: ${p_Name}; Zip Code: ${z_Code}; Score: ${s_Value}; Start Date: ${s_Date}; End Date: ${e_Date}; Restaurant :${rest}; Market: ${mark};`)
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our general_search Page/////



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our performance Page/////

app.post("/Performance", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {
      let program_Name = req.body.programName;
      let performance_Options = req.body.performance_options;
      console.log(`programName: ${program_Name}; performance_options: ${performance_Options}`)
      if (err) {
        console.error(err);
        return;
      }
      let sql = ''
      let message = ''
      if (performance_Options === 'Score') {
        sql = `SELECT score FROM dbms_inspection NATURAL JOIN dbms_program WHERE program_name LIKE '${program_Name}%' AND rownum <=30 order by score DESC`
        message = 'List 30 scores of your interested restaurant or market.'

      } else if (performance_Options === 'Average_score') {
        sql = `select zip, avg(score) from DBMS_PROGRAM, DBMS_REGION, DBMS_INSPECTION, DBMS_LIE_IN, DBMS_FACILITY
          where program_name LIKE '${program_Name}%' and DBMS_PROGRAM.RECORD_ID = DBMS_LIE_IN.RECORD_ID and DBMS_LIE_IN.FACILITY_ID = DBMS_FACILITY.FACILITY_ID and
          DBMS_FACILITY.FACILITY_ZIP = DBMS_REGION.ZIP and
          DBMS_INSPECTION.RECORD_ID = DBMS_PROGRAM.RECORD_ID
          group by zip`;
        message = 'The average score in each region of your interested restaurant or market'

      } else if (performance_Options === 'Highest_score') {
        sql = `select zip, score from DBMS_PROGRAM, DBMS_REGION, DBMS_FACILITY, DBMS_INSPECTION, DBMS_LIE_IN
          where program_name LIKE '${program_Name}%' and DBMS_PROGRAM.RECORD_ID = DBMS_LIE_IN.RECORD_ID
          AND DBMS_LIE_IN.FACILITY_ID = DBMS_FACILITY.FACILITY_ID
          AND DBMS_FACILITY.FACILITY_ZIP = DBMS_REGION.ZIP AND DBMS_INSPECTION.RECORD_ID = DBMS_PROGRAM.RECORD_ID
          and score >= all (
          select score from DBMS_PROGRAM, DBMS_REGION, DBMS_FACILITY, DBMS_INSPECTION, DBMS_LIE_IN
          where program_name LIKE'${program_Name}%' and DBMS_PROGRAM.RECORD_ID = DBMS_LIE_IN.RECORD_ID AND
          DBMS_LIE_IN.FACILITY_ID = DBMS_FACILITY.FACILITY_ID AND
          DBMS_FACILITY.FACILITY_ZIP = DBMS_REGION.ZIP) AND DBMS_INSPECTION.RECORD_ID = DBMS_PROGRAM.RECORD_ID`
        message = 'The highest score in each region of your interested restaurant or market.'

      } else if (performance_Options === 'Regions') {
        sql = `select zip, count (distinct dbms_program.record_id ) from DBMS_PROGRAM, DBMS_REGION, DBMS_FACILITY, DBMS_INSPECTION, DBMS_LIE_IN
          where program_name LIKE '${program_Name}%' AND DBMS_PROGRAM.RECORD_ID = DBMS_LIE_IN.RECORD_ID
          and DBMS_LIE_IN.FACILITY_ID = DBMS_FACILITY.FACILITY_ID and
          DBMS_FACILITY.FACILITY_ZIP = DBMS_REGION.ZIP  and
          DBMS_INSPECTION.RECORD_ID = DBMS_PROGRAM.RECORD_ID
          group by zip
          having count (*) > 1`
        message = 'The region that at least has more than one store of your interested restaurant or market.'

      } else {
        console.log("Something Wrong!")
      }
      console.log(sql)
      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          htmlHeader(
            res,
            "See What We Found For You !",
            "See what we found!"
          );
          displayResults_custom(res, result, message);
          // console.log(result.rows);
        });
    });

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our Violation Page/////

app.post("/Violation", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"

    },
    function(err, connection) {
      let program_Name = req.body.programName;
      let zip_Code = req.body.zipCode;
      let performance_Options = req.body.performance_options;
      console.log(`programName: ${program_Name}; zipCode: ${zip_Code} performance_options: ${performance_Options}`)
      if (err) {
        console.error(err);
        return;
      }
      let sql = ''
      let message = ''

      if (performance_Options === 'violation_items') {
        sql = `select DISTINCT violation_description from DBMS_VIOLATION natural join DBMS_INSPECTION natural join DBMS_PROGRAM NATURAL JOIN DBMS_FACILITY
          NATURAL JOIN DBMS_LIE_IN NATURAL JOIN DBMS_REGION
          where program_name LIKE '%${program_Name}%' AND ZIP LIKE '${zip_Code}'`

        message = 'These are the distinct violation catogories of your search in history.'

      } else if (performance_Options === 'detailed_report') {
        sql = `select dbms_program.record_id, program_name, dbms_inspection.serial_number, score, grade, activity_date, service_code, service_description,
          dbms_inspection.employee_id, dbms_violate.violation_code, violation_description, violation_status, program_status
          from dbms_inspection, dbms_violate, dbms_violation, dbms_program, DBMS_FACILITY, DBMS_LIE_IN
          where dbms_inspection.record_id = dbms_program.record_id and dbms_violation.violation_code = dbms_violate.violation_code
          and dbms_violate.serial_number = dbms_inspection.serial_number and DBMS_PROGRAM.RECORD_ID = DBMS_LIE_IN.RECORD_ID AND DBMS_FACILITY.FACILITY_ID = DBMS_LIE_IN.facility_id
          and dbms_program.program_name like '%${program_Name}%' AND DBMS_FACILITY.facility_zip LIKE '${zip_Code}%'`

        message = 'Below are the detailed inpection report of your search in history.'

      } else if (performance_Options === 'score_trend_plot') {
        sql = `select DBMS_PROGRAM.record_id,activity_date, score from DBMS_INSPECTION , DBMS_PROGRAM ,dbms_facility,dbms_lie_in
where DBMS_INSPECTION.record_id = DBMS_PROGRAM.record_id and dbms_facility.facility_id = dbms_lie_in.facility_id
and dbms_lie_in.record_id = dbms_program.record_id
and DBMS_PROGRAM.program_name like '%PANDA EXPRESS%' and dbms_facility.facility_zip = '91355'
order by DBMS_PROGRAM.record_id,activity_date
`

      } else {
        console.log("Something Wrong!")
      }


      console.log(sql)
      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          if (performance_Options === 'score_trend_plot') {
            displayResults_01(res, result);
          } else {

            htmlHeader(
              res,
              "See What We Found For You !",
              "See what we found!"
            );
            displayResults_custom(res, result, message);
          }
          // console.log(result.rows);
        });
    });

})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our Name_score_interested Page/////

app.post("/Name_score_interested", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {
      let program_Name = req.body.programName;
      let score_Value = req.body.scoreValue;
      score_Value_object = score_Value.replace(' - ', ',').replace('$', '').replace('$', '')
      a = score_Value_object.split(",")
      let min = a[0]
      let max = a[1]


      console.log(`programName: ${program_Name}; score_range: ${score_Value}; Min score:  ${min}, Max score: , ${max}`)
      if (err) {
        console.error(err);
        return;
      }
      let sql = `select DBMS_PROGRAM.program_name from DBMS_PROGRAM, DBMS_REGION, DBMS_FACILITY, DBMS_INSPECTION, DBMS_LIE_IN
                    where program_name LIKE '${program_Name}%' and DBMS_PROGRAM.RECORD_ID = DBMS_LIE_IN.RECORD_ID and
                    DBMS_LIE_IN.FACILITY_ID = DBMS_FACILITY.FACILITY_ID and
                    DBMS_FACILITY.FACILITY_ZIP = DBMS_REGION.ZIP and DBMS_INSPECTION.RECORD_ID = DBMS_PROGRAM.RECORD_ID and
                    score >= ${min} and score <= ${max}
                    group by DBMS_PROGRAM.program_name`
      let message = 'Here are the stores met your requirements!'
      console.log(sql)
      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          htmlHeader(
            res,
            "See What We Found For You !",
            "See what we found!"
          );
          displayResults_custom(res, result, message);
          // console.log(result.rows);
        });
    });

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our Top_performance Page/////

app.post("/Top_performance", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {

      let zip_Code = req.body.zipCode;
      let start_Date = req.body.startDate
      let end_Date = req.body.endDate

      console.log(`zip_Code: ${zip_Code}; start_Date: ${start_Date}; end_Date: ${end_Date}`)
      if (err) {
        console.error(err);
        return;
      }
      let sql = ''
      let message = ''

      start_Date_object = start_Date.split("/")
      let start_mon = start_Date_object[0]
      let start_day = start_Date_object[1]
      let start_year = start_Date_object[2]
      console.log(start_mon, start_day, start_year)

      end_Date_object = end_Date.split("/")
      let end_mon = end_Date_object[0]
      let end_day = end_Date_object[1]
      let end_year = end_Date_object[2]

      let new_start_mon = ""
      let new_end_mon = ""
      if (start_mon === '01') {
        new_start_mon = 'JAN'
      } else if (start_mon === '02') {
        new_start_mon = 'FEB'
      } else if (start_mon === '03') {
        new_start_mon = 'Mar'
      } else if (start_mon === '04') {
        new_start_mon = 'APR'
      } else if (start_mon === '05') {
        new_start_mon = 'MAY'
      } else if (start_mon === '06') {
        new_start_mon = 'JUN'
      } else if (start_mon === '07') {
        new_start_mon = 'JUL'
      } else if (start_mon === '08') {
        new_start_mon = 'AUG'
      } else if (start_mon === '09') {
        new_start_mon = 'SEP'
      } else if (start_mon === '10') {
        new_start_mon = 'OCT'
      } else if (start_mon === '11') {
        new_start_mon = 'NOV'
      } else if (start_mon === '12') {
        new_start_mon = 'DEC'
      } else {
        console.log("Something Wrong!")
      }
      console.log(new_start_mon)

      if (end_mon === '01') {
        new_end_mon = 'JAN'
      } else if (end_mon === '02') {
        new_end_mon = 'FEB'
      } else if (end_mon === '03') {
        new_end_mon = 'Mar'
      } else if (end_mon === '04') {
        new_end_mon = 'APR'
      } else if (end_mon === '05') {
        new_end_mon = 'MAY'
      } else if (end_mon === '06') {
        new_end_mon = 'JUN'
      } else if (end_mon === '07') {
        new_end_mon = 'JUL'
      } else if (end_mon === '08') {
        new_end_mon = 'AUG'
      } else if (end_mon === '09') {
        new_end_mon = 'SEP'
      } else if (end_mon === '10') {
        new_end_mon = 'OCT'
      } else if (end_mon === '11') {
        new_end_mon = 'NOV'
      } else if (end_mon === '12') {
        new_end_mon = 'DEC'
      } else {
        console.log("Something Wrong!")
      }

      sql = `select * from (select program_name, score from DBMS_PROGRAM, DBMS_REGION, DBMS_INSPECTION, DBMS_LIE_IN, DBMS_FACILITY
                where DBMS_PROGRAM.RECORD_ID = DBMS_LIE_IN.RECORD_ID and DBMS_LIE_IN.FACILITY_ID = DBMS_FACILITY.FACILITY_ID and
                DBMS_FACILITY.FACILITY_ZIP = DBMS_REGION.ZIP AND
                DBMS_REGION.ZIP = '${zip_Code}' and
                DBMS_INSPECTION.RECORD_ID = DBMS_PROGRAM.RECORD_ID and
                activity_date >= '${start_day}-${new_start_mon}-${start_year}' and activity_date <= '${end_day}-${new_end_mon}-${end_year}'
                order by score desc) where rownum <=10
                `
      console.log(sql)

      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          htmlHeader(
            res,
            "See What We Found For You !",
            "See what we found!"
          );
          displayResults_custom(res, result, message);
          // console.log(result.rows);
        });
    });

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our Search_score_range Page/////

app.post("/Search_score_range", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {
      let score_Value = req.body.scoreValue;
      let zip_Code = req.body.zipCode;
      score_Value_object = score_Value.replace(' - ', ',').replace('$', '').replace('$', '')
      a = score_Value_object.split(",")
      let min = a[0]
      let max = a[1]

      console.log(`Zip Code: ${zip_Code}; score_range: ${score_Value}; Min score:  ${min}, Max score: , ${max}`)

      if (err) {
        console.error(err);
        return;
      }
      let sql = `select program_name, facility_address from DBMS_PROGRAM natural join DBMS_FACILITY natural join DBMS_INSPECTION natural join DBMS_REGION natural join DBMS_LIE_IN
                     where zip = '${zip_Code}' and score >= ${min} and score <= ${max}`
      let message = 'Here are the stores met your requirements!'
      console.log(sql)
      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          htmlHeader(
            res,
            "See What We Found For You !",
            "See what we found!"
          );
          displayResults_custom(res, result, message);
          // console.log(result.rows);
        });
    });

})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our Quality_operator Page/////

app.post("/Quality_operator", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {
      // ROUTINE INSPECTION, OWNER INITIATED ROUTINE INSPECT.
      let zip_Code = req.body.zipCode;
      let performance_Options = req.body.performance_options;
      console.log(`zipCode: ${zip_Code} performance_options: ${performance_Options}`)
      if (err) {
        console.error(err);
        return;
      }
      let sql = ''
      let message = ''
      if (performance_Options === 'initiative_owner') {
        sql = `select DBMS_OWNER.owner_name, DBMS_PROGRAM.program_name ,facility_address from DBMS_OWNER, DBMS_PROGRAM, DBMS_INSPECTION, DBMS_FACILITY, DBMS_LIE_IN
                    where DBMS_INSPECTION.service_description = 'OWNER INITIATED ROUTINE INSPECT.' and
                    DBMS_OWNER.owner_id = DBMS_FACILITY.owner_id and
                    DBMS_PROGRAM.record_id = DBMS_LIE_IN.record_id and
                    DBMS_INSPECTION.record_id = DBMS_PROGRAM.record_id and
                    DBMS_LIE_IN.facility_id = DBMS_FACILITY.facility_id and dbms_facility.facility_zip = '${zip_Code}'
                    `

      } else if (performance_Options === 'lazy_owner') {
        sql = `select DBMS_OWNER.owner_name, DBMS_PROGRAM.program_name ,facility_address from DBMS_OWNER, DBMS_PROGRAM, DBMS_INSPECTION, DBMS_FACILITY, DBMS_LIE_IN
                  where DBMS_INSPECTION.service_description = 'ROUTINE INSPECTION' and
                  DBMS_OWNER.owner_id = DBMS_FACILITY.owner_id and
                  DBMS_PROGRAM.record_id = DBMS_LIE_IN.record_id and
                  DBMS_INSPECTION.record_id = DBMS_PROGRAM.record_id and
                  DBMS_LIE_IN.facility_id = DBMS_FACILITY.facility_id and dbms_facility.facility_zip = '${zip_Code}'`

        message = 'These are the store information of the relatively lazier owner.'

      } else {
        console.log("Something Wrong!")
      }
      console.log(sql)
      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          htmlHeader(
            res,
            "See What We Found For You !",
            "See what we found!"
          );
          displayResults_custom(res, result, message);
          // console.log(result.rows);
        });
    });

})



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////INSPECTOR     QUERIES////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our inspectors_of_your_region Page/////

app.post("/inspectors_of_your_region", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {

      let zip_Code = req.body.zipCode;
      let min_Count = req.body.min_inspection_time
      console.log(`zipCode: ${zip_Code} min_Count: ${min_Count}`)
      if (err) {
        console.error(err);
        return;
      }
      let sql = ''
      let message = ''
      sql = `select DBMS_EMPLOYEE.employee_id from DBMS_EMPLOYEE, DBMS_INSPECTION, DBMS_FACILITY, DBMS_LIE_IN
                    where DBMS_EMPLOYEE.employee_id = DBMS_INSPECTION.employee_id and
                    DBMS_FACILITY.facility_id = DBMS_LIE_IN.facility_id and
                    DBMS_LIE_IN.record_id = DBMS_INSPECTION.record_id and
                    DBMS_FACILITY.facility_zip = '${zip_Code}'
                    group by DBMS_EMPLOYEE.employee_id
                    having count(distinct DBMS_INSPECTION.record_id) > ${min_Count}`

      message = 'Inspectors that conduct inspections in region and at least more than the number of times you provided.'

      console.log(sql)
      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          htmlHeader(
            res,
            "See What We Found For You !",
            "See what we found!"
          );
          displayResults_custom(res, result, message);
          // console.log(result.rows);
        });
    });

})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our stores_need_more_inspections Page/////

app.post("/stores_need_more_inspections", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {

      let zip_Code = req.body.zipCode;
      let max_Count = req.body.max_inspection_time
      console.log(`zipCode: ${zip_Code} min_Count: ${max_Count}`)
      if (err) {
        console.error(err);
        return;
      }
      let sql = ''
      let message = ''
      sql = `select * from (select DBMS_PROGRAM.program_name from DBMS_PROGRAM, DBMS_INSPECTION, DBMS_FACILITY, DBMS_LIE_IN
                  where DBMS_PROGRAM.record_id = DBMS_LIE_IN.record_id and
                  DBMS_INSPECTION.record_id = DBMS_PROGRAM.record_id and
                  DBMS_LIE_IN.facility_id = DBMS_FACILITY.facility_id AND
                  DBMS_FACILITY.facility_zip = '${zip_Code}'
                  group by DBMS_PROGRAM.program_name
                  having count(distinct DBMS_INSPECTION.serial_number) < ${max_Count})
                  where rownum <= 30
                  `

      message = 'Stores in chosen region that have been inspected less than the time you expected.'

      console.log(sql)
      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          htmlHeader(
            res,
            "See What We Found For You !",
            "See what we found!"
          );
          displayResults_custom(res, result, message);
          // console.log(result.rows);
        });
    });

})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For bad_performance_stores in Are_u_inspector Page/////

app.post("/bad_performance_stores", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {

      let score_Requied = req.body.score_requirement;
      let violation_type = req.body.num_violation_categories
      let start_Date = req.body.startDate
      let end_Date = req.body.endDate
      console.log(`score_Requied: ${score_Requied}; violation_type: ${violation_type}; start_Date: ${start_Date}; end_Date: ${end_Date}`)
      start_Date_object = start_Date.split("/")
      let start_mon = start_Date_object[0]
      let start_day = start_Date_object[1]
      let start_year = start_Date_object[2]
      console.log(start_mon, start_day, start_year)

      end_Date_object = end_Date.split("/")
      let end_mon = end_Date_object[0]
      let end_day = end_Date_object[1]
      let end_year = end_Date_object[2]

      let new_start_mon = ""
      let new_end_mon = ""
      if (start_mon === '01') {
        new_start_mon = 'JAN'
      } else if (start_mon === '02') {
        new_start_mon = 'FEB'
      } else if (start_mon === '03') {
        new_start_mon = 'Mar'
      } else if (start_mon === '04') {
        new_start_mon = 'APR'
      } else if (start_mon === '05') {
        new_start_mon = 'MAY'
      } else if (start_mon === '06') {
        new_start_mon = 'JUN'
      } else if (start_mon === '07') {
        new_start_mon = 'JUL'
      } else if (start_mon === '08') {
        new_start_mon = 'AUG'
      } else if (start_mon === '09') {
        new_start_mon = 'SEP'
      } else if (start_mon === '10') {
        new_start_mon = 'OCT'
      } else if (start_mon === '11') {
        new_start_mon = 'NOV'
      } else if (start_mon === '12') {
        new_start_mon = 'DEC'
      } else {
        console.log("Something Wrong!")
      }
      console.log(new_start_mon)

      if (end_mon === '01') {
        new_end_mon = 'JAN'
      } else if (end_mon === '02') {
        new_end_mon = 'FEB'
      } else if (end_mon === '03') {
        new_end_mon = 'Mar'
      } else if (end_mon === '04') {
        new_end_mon = 'APR'
      } else if (end_mon === '05') {
        new_end_mon = 'MAY'
      } else if (end_mon === '06') {
        new_end_mon = 'JUN'
      } else if (end_mon === '07') {
        new_end_mon = 'JUL'
      } else if (end_mon === '08') {
        new_end_mon = 'AUG'
      } else if (end_mon === '09') {
        new_end_mon = 'SEP'
      } else if (end_mon === '10') {
        new_end_mon = 'OCT'
      } else if (end_mon === '11') {
        new_end_mon = 'NOV'
      } else if (end_mon === '12') {
        new_end_mon = 'DEC'
      } else {
        console.log("Something Wrong!")
      }
      console.log(new_end_mon)
      // score_Value_object = score_Value.replace(' - ',',').replace('$', '').replace('$', '')
      // a = score_Value_object.split(",")
      // let min = a[0]
      // let max = a[1]
      // console.log()
      // ${start_day}-${start_mon}-${start_year}
      if (err) {
        console.error(err);
        return;
      }
      let sql = ''
      let message = ''
      sql = `SELECT * FROM (select owner_name, owner_id, count (DISTINCT VIOLATION_CODE) AS "TOTAL NUMBER OF VIOLATION TYPES", avg (score) from DBMS_OWNER natural join DBMS_VIOLATE natural join DBMS_FACILITY natural join DBMS_LIE_IN natural join DBMS_INSPECTION m
                WHERE ACTIVITY_DATE >= '${start_day}-${new_start_mon}-${start_year}' AND ACTIVITY_DATE <= '${end_day}-${new_end_mon}-${end_year}'
                group by owner_name, owner_id
                having count (DISTINCT VIOLATION_CODE) > ${violation_type} AND avg (score) < ${score_Requied}  ORDER BY avg (score)
                )WHERE ROWNUM <=10
                `
      message = 'Owner Whose Stores Not Perfoming Well'

      console.log(sql)
      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          htmlHeader(
            res,
            "See What We Found For You !",
            "See what we found!"
          );
          displayResults_custom(res, result, message);
          // console.log(result.rows);
        });
    });

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////Below is For Our know_the_owner Page/////

app.post("/know_the_owner", function(req, res) {
  oracledb.getConnection({
      user: "chsing",
      password: "Taiwan2019",
      connectString: "//oracle.cise.ufl.edu/orcl"
    },
    function(err, connection) {
      let owner_Name = req.body.owner_name;

      console.log(`Owner Name: ${owner_Name}`)

      if (err) {
        console.error(err);
        return;
      }
      let sql = `select program_name from DBMS_PROGRAM, DBMS_FACILITY , DBMS_LIE_IN , DBMS_OWNER
                        where DBMS_OWNER.owner_name = '${owner_Name}' AND DBMS_OWNER.OWNER_ID = dbms_facility.owner_id AND dbms_facility.facility_id = dbms_lie_in.facility_id
                        AND dbms_lie_in.record_id = dbms_program.record_id
                        `
      let message = 'The stores owned by someone you provided'
      console.log(sql)
      connection.execute(
        sql, [],
        function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
          htmlHeader(
            res,
            "See What We Found For You !",
            "See what we found!"
          );
          displayResults_custom(res, result, message);
          // console.log(result.rows);
        });
    });

})









//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////Advanced    QUERIES////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// var doconnect = function(cb) {
//   oracledb.getConnection(
//     {
//       user          : dbConfig.user,
//       password      : dbConfig.password,
//       connectString : dbConfig.connectString
//     },
//     cb);
// };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// var dorelease = function(conn) {
//   conn.close(function (err) {
//     if (err)
//       console.error(err.message);
//   });
// };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Insert with autoCommit enabled
// var doinsert_autocommit = function (conn, cb) {
//   conn.execute(
//     "INSERT INTO test VALUES (:id, :nm)",
//     [1, 'Chris'],  // Bind values
//     { autoCommit: true},  // Override the default non-autocommit behavior
//     function(err, result) {
//       if (err) {
//         return cb(err, conn);
//       } else {
//         console.log("Rows inserted: " + result.rowsAffected);  // 1
//         return cb(null, conn);
//       }
//     });
// };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// async.waterfall(
//   [
//     doconnect,
//     doinsert_autocommit
//   ],
//   function (err, conn) {
//     if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
//     if (conn)
//       dorelease(conn);
//   });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//   oracledb.getConnection(
//     {
//       user          : "mqi",
//       password      : "5211314Wny",
//       connectString : "//oracle.cise.ufl.edu/orcl"
//     },
//     function(err, connection)
//     {
//       let userID = req.body.userid
//       let userEmail = req.body.email
//       let region = req.body.region
//       let passWord = req.body.passWord
//
//       console.log(`user: ${userID}; userEmail: ${userEmail}; region: ${region}; password: ${passWord}`)
//
//       connection.execute(
//     "INSERT INTO dbms_user VALUES(:email, :user_password, :zip)",
//     {email: `'${userEmail}'`, user_password: `${passWord}`, zip: `${region}`},  // Bind values
//     { autoCommit: true},  // Override the default non-autocommit behavior
//     function(err, result) {
//       if (err) {
//         return cb(err, conn);
//       } else {
//         console.log("Rows inserted: " + result.rowsAffected);  // 1
//         return cb(null, conn);
//       }
//     });
//       //
//       //
//       //
//       //
//       //
//       // if (err) { console.error(err); return; }
//       // connection.execute(
//       //   `INSERT INTO dbms_user(EMAIL, USER_PASSWORD, ZIP) VALUES('${userEmail}','${passWord}','${region}')`, [],
//       //   function(err, result)
//       //   {
//       //     console.log(result.rows);
//
//           // if (err) { console.error(err); return; }
//           // htmlHeader(
//           //   res,
//           //   "Oracle Database Driver for Node.js",
//           //   "Example using node-oracledb driver"
//           // );
//           // displayResults(res, result);
//           // console.log(result.rows);
//         });
//     })
// });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayResults(response, result) {
  // response.write("<h2>" + "See What We Find For You " + "</h2>");
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayResults_custom(response, result, message) {
  response.write("<h2>" + message + "</h2>");
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function htmlHeader(response, title, caption) {
  response.writeHead(200, {
    "Content-Type": "text/html"
  });
  response.write("<!DOCTYPE html>");
  response.write("<html>");
  response.write("<head>");
  response.write("<style>" +
    "body {background:#FFFFFF;color:#000000;font-family:Arial,sans-serif;margin:40px;padding:10px;font-size:12px;text-align:center;}" +
    "h1 {margin:0px;margin-bottom:12px;background:#385170;text-align:center;color:#FFFFFF;font-size:55px;}" +
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









app.listen(3000, function() {
  console.log("Servers is running on port 3000.")
});
