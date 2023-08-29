const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "covid19India.db");
const app = express();

let db = null;

const initializeDbAndServer = async () => {
    try {
        db = await open({

            filename: dbPath,
            driver: sqlite3.Database,

        });

        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/");
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();

//Get States
app.get("/states/", async (request, response) => {

    const getStatesQuery = `
    SELECT * FROM state ORDER BY state_id;`;
    const getstatesArray = await db.all(getStatesQuery);
    response.send(getstatesArray);

});

//Get Sates based on stateId
app.get("/states/:stateId/",async (request,response) =>{
    const getStateQuery= `SELECT * FROM states WHERE state_id = ${stateId};`;
    const state = await db.get(getStateQuery);
    response.send(state);
});


    //Add District Table 
app.put("/districs/", async (request, response) => {
    const districtDetails = request.body;
    const {
        distictName,
        stateId,
        cases,
        cured,
        active,
        deaths,
    } = districtDetails;

    const addStateQuery = `INSERT INTO district 
    (distict_name,
    state_id,
    cases,
    cured,
    active,
    deaths) 
    VALUES('${distictName}',
    '${stateId}',
    '${cases}',
    '${cured}',
    '${active}',
    '${deaths}';)`;
    const dbResponse = await db.run(addStateQuery);
    const districtId = dbResponse.lastID;
    response.send({ districtId: districtId });
    response.send("District Successfully Added");

});

//ADD Districts 
app.post("/districts/", async (request,response) =>{
    const stateDetails = request.body;
    const {
        districtName,
        stateId,
        cases,
        cured,
        active,
        deaths
        } = stateDetails;
        const addDistrictsQuery = `INSERT INTO district
        (district_name,
        state_id,
        cases,
        cured,
        active,
        deaths
        ) VALUES(
            '${districtName}',
            '${stateId}',
            '${cases}',
            '${cured}',
            '${active}',
            '${deaths}',
        );`;
        const dbResponse = db.run(addDistrictsQuery);
        const stateId =  dbResponse.lastID;
        response.send({stateId:stateId});
        response.send("District Successfully Added");
    

});

//Get Districts based on district Id
app.get("/districts/:districtId", async (request,response)=>{
    const {districtId} = request.params;
    const getDistrictQuery = `SELECT * FROM districts WHERE district_id = ${districtId}`;
    const districtsArray = await db.all(getDistrictQuery);
    response.send(districtsArray);
});

//Delete Districts
app.delete("/districts/:districtId", async (request,response)=>{
      const {districtId} = request.params;
      const deleteDistrictQuery =  `DELETE FROM district 
      WHERE district_id = ${districtId};`;
      await db.run(deleteDistrictQuery);
      response.send("District Removed");
});

//Update districts
app.put("/districts/:districtId", async(request,response) =>{
    const {districtId} = request.params;
    const districtDetails = request.body;
    const {
        distictName,
        stateId,
        cases,
        cured,
        active,
        deaths,
    } = districtDetails;
    const updateDistrictQuery = `UPDATE district
        SET 
        district_name = '${distictName}',
        state_id = '${stateId}',
        cases = '${cases}',
        cured = '${cured}',
        active = '${active}',
        deaths = '${deaths}' 
        WHERE district_id = ${districtId};`;
        await db.run(updateDistrictQuery);
        response.send("District Details Updated");
});

//Get States
app.get("/states/:stateId/stats/", async(request,response)=>{
    const {stateId} = request.params;
    const getStatesQuery = `SELECT * FROM state WHERE state_id = ${stateId};`;
    const statesArray = await db.all(getStatesQuery);
    response.send(statesArray);
    
});

//Get DistrictIds
app.get("/districts/:districtId/details/", async(request,response)=>{
    const {districtId} = request.params;
    const getStatesQuery = `SELECT * FROM district WHERE district_id = ${districtId};`;
    const statesArray = await db.all(getStatesQuery);
    response.send(statesArray);
    
});

module.exports = app;