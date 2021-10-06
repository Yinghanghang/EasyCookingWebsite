// fix how to work with cloud database
const DATABASECONNECTION = "mongodb+srv://easycooking:nodejsweb@clusterecweb.ejflh.mongodb.net/easycookingDatabase?retryWrites=true&w=majority";
//working with local database mongodb
//const DATABASECONNECTION = "mongodb://localhost:27017/";

module.exports = { DATABASECONNECTION };  // use {} to enclose the DATABASECONNECTION so that we can see it in app.js when call params.DATABASECONNECTION