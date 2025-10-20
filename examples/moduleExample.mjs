//@ts-check
import {LogBucket} from "../dist/index.js"
import logbucket from "../dist/index.js"

///////////////////////
//// CONFIGURATION ////
///////////////////////

//create the logbucket instance
const log = LogBucket()
const log2 = logbucket.LogBucket()

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

//log something to the console with array parameters
log("debug","Testing parameters:",[
    {key:"lorem",value:"ipsum"},
    {key:"foo",value:"bar"}
])

//log something to the console with object parameters
log("debug","Testing object-based parameters:",{
    lorem:"ipsum",
    foo:"bar",
    test:"it works!"
})

//log something to the console with a hidden parameter
log("debug","Testing parameters:",[
    {key:"lorem",value:"ipsum",hidden:true},
    {key:"info",value:"you will only see this parameter",hidden:false},
])

//INFO: A hidden parameter will only be logged to the debug file. The debug file is disabled by default. (more info in complexExample.js)