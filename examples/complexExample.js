//@ts-check
const {LogBucket, LBMessageTemplate, LBDebugFile, LBErrorTemplate} = require("../dist/index")

///////////////////////
//// CONFIGURATION ////
///////////////////////

//create a debug file with a history length of 100 lines.
const debugFile = new LBDebugFile("./debug.txt",100,{
    enabled:true,title:"MY DEBUG FILE:",
    showLastStartup:true,
    showNodeVersion:true,
    properties:[{key:"Sentence Of The Day",value:"Hello World!"}]
})

//create a custom color scheme for error logs (new Error(...)) 
const customErrType = new LBErrorTemplate("blue","blue","WEIRD ERROR")

//create the logbucket instance with custom types (replacing the default types)
const log = LogBucket(true,{
    //register custom log types (with its own color scheme)
    custom1:new LBMessageTemplate("CUSTOM1","blue","red","green"),
    custom2:new LBMessageTemplate("CUSTOM2","cyan","yellow","magenta"),
},customErrType,debugFile)

///////////////////////
////     USAGE     ////
///////////////////////

//log an error to the console. This should now be blue.
log(new Error("This is an example error."))

//try one of our custom log types
log("custom1","Hello world!",[{key:"lorem",value:"ipsum"}])
log("custom2","Hello world!",[{key:"lorem",value:"ipsum"}])