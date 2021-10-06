// fix how to work with cloud database
//const DATABASECONNECTION = "mongodb+srv://dbAladin:<Aladin87!1>@clusterecweb.molx3.mongodb.net/easycookingdb?retryWrites=true&w=majority";
//working with local database mongodb
//const DATABASECONNECTION = "mongodb://localhost:27017/";

const DATABASECONNECTION = "mongodb+srv://ying:parrot@cluster0.1lj4j.mongodb.net/test?retryWrites=true&w=majority"

module.exports = { DATABASECONNECTION };  // use {} to enclose the DATABASECONNECTION so that we can see it in app.js when call params.DATABASECONNECTION