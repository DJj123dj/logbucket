//@ts-check
const {LogBucket} = require("../dist/index")

///////////////////////
//// CONFIGURATION ////
///////////////////////

//create the logbucket instance
const log = LogBucket()

log.on("msgLog",(template,msg,params) => {
    console.log("A message was logged!")
})

log.on("errorLog",(template,err) => {
    console.log("An error was logged!")
})

///////////////////////
////     USAGE     ////
///////////////////////

//log an error to the console
log(new Error("This is an example error."))

//try different log types
log("system","Hello world!")
log("client","Hello world!")
log("info","Hello world!")