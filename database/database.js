// monoose init

const monoose = require("mongoose");
const assert = require("assert");
const db_url = process.env.DB_URL;

// database connection here
monoose.connect(db_url, (error, link) => {
  // check connection if any Error
  assert.equal(error, null, "Somthing is Wrong With Database Connection.....");
  // if every thing is connect or proper
  console.log("Db Connected....");
  // console.log(link);
});
