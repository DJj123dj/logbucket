//@ts-check
const {LogBucket} = require("../dist/index")

///////////////////////
//// CONFIGURATION ////
///////////////////////

//create the logbucket instance
const log = LogBucket()

///////////////////////
////     USAGE     ////
///////////////////////

//log an error to the console
log(new Error("This is an example error."))

//try different log types
log("error","Hello world!")
log("api","Hello world!")
log("warning","Hello world!")
log("system","Hello world!")
log("client","Hello world!")
log("info","Hello world!")
log("database","Hello world!")
log("plugin","Hello world!")
log("server","Hello world!")
log("debug","Hello world!")

//log something to the console with parameters
log("debug","Testing parameters:",[
    {key:"lorem",value:"ipsum"},
    {key:"foo",value:"bar"}
])

//log something to the console with a hidden parameter
log("debug","Testing parameters:",[
    {key:"lorem",value:"ipsum",hidden:true},
])

//INFO: A hidden parameter will only be logged to the debug file. The debug file is disabled by default. (more info in complexExample.js)