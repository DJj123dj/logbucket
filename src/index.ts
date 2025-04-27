import nodepath from "path"
import fs from "fs"
import ansis, {Ansis} from "ansis"

/**All available default colors. */
export type LBDefaultColor = "white"|"red"|"orange"|"yellow"|"green"|"blue"|"gray"|"cyan"|"magenta"|"purple"|"pink"
/**A type-checker for hex-colors. */
export type LBHexColor = `#${string}`
/**All available default log types. */
export type LBDefaultType = "info"|"warning"|"error"|"system"|"database"|"debug"|"plugin"|"api"|"client"|"server"

/**A parameter to use in a message. */
export interface LBMessageParam {
    /**The key of this parameter. */
    key:string,
    /**The value of this parameter. */
    value:string,
    /**When enabled, this parameter will only be shown in the debug file. */
    hidden?:boolean
}

/**Get the ansis function for the specified color. */
function getAnsisColor(color:LBDefaultColor|LBHexColor): Ansis {
    if (color == "white") return ansis.white
    else if (color == "red") return ansis.red
    else if (color == "orange") return ansis.hex("#ff8800")
    else if (color == "yellow") return ansis.yellow
    else if (color == "green") return ansis.green
    else if (color == "blue") return ansis.blue
    else if (color == "gray") return ansis.gray
    else if (color == "cyan") return ansis.cyan
    else if (color == "magenta") return ansis.magenta
    else if (color == "purple") return ansis.hex("#8050ff")
    else if (color == "pink") return ansis.hex("#ff70b0")
    else if (color.startsWith("#")) return ansis.hex(color)
    else return ansis.white
}
const defaultColors: (LBDefaultColor|LBHexColor)[] = ["white","red","orange","yellow","green","blue","gray","cyan","magenta","purple","pink"]

/**A message template used to define a color scheme and prefix for a certain log message. */
export class LBMessageTemplate {
    /**The prefix of this message. (uppercase recommended) */
    prefix: string
    /**The color of the prefix. */
    prefixColor: LBDefaultColor|LBHexColor
    /**The color of the message. */
    msgColor: LBDefaultColor|LBHexColor
    /**The color of the message parameters. */
    paramsColor: LBDefaultColor|LBHexColor
    
    constructor(prefix:string,prefixColor:LBDefaultColor|LBHexColor,msgColor:LBDefaultColor|LBHexColor,paramsColor:LBDefaultColor|LBHexColor){
        this.prefix = prefix

        if (defaultColors.includes(prefixColor) || /^#[0-9a-f]{6}$/.test(prefixColor)) this.prefixColor = prefixColor
        else this.prefixColor = "white"
        if (defaultColors.includes(msgColor) || /^#[0-9a-f]{6}$/.test(msgColor)) this.msgColor = msgColor
        else this.msgColor = "white"
        if (defaultColors.includes(paramsColor) || /^#[0-9a-f]{6}$/.test(paramsColor)) this.paramsColor = paramsColor
        else this.paramsColor = "white"
    }

    /**Renders a message using the configured template. Returns `true` on success. */
    render(message:string,params:LBMessageParam[]=[]){
        const prefixColor = getAnsisColor(this.prefixColor)
        const msgColor = getAnsisColor(this.msgColor)
        const paramsColor = getAnsisColor(this.paramsColor)
        
        try{
            const pstrings: string[] = []
            params.forEach((p) => {
                if (!p.hidden) pstrings.push(p.key+": "+p.value)
            })
            const prefix = prefixColor("["+this.prefix+"] ")
            const parameters = (pstrings.length > 0) ? paramsColor("  ("+pstrings.join(", ")+")") : ""
            const msg = msgColor(message)

            console.log(prefix+msg+parameters)
            return true
        }catch{
            return false
        }
    }
    /**Returns a message formatted to be added to the debug file using the configured template. */
    renderDebug(message:string,params:LBMessageParam[]=[]){
        const date = new Date()
        const dstring = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        const pstrings: string[] = []
        params.forEach((p) => {
            pstrings.push(p.key+": "+p.value)
        })
        const prefix = "["+dstring+" "+this.prefix+"] "
        const parameters = (pstrings.length > 0) ? "  ("+pstrings.join(", ")+")" : ""
        
        return prefix+message+parameters
    }
    /**A string representation of this message template. */
    toString(){
        return "[LBMessageTemplate: "+this.prefix+"]"
    }
}

/**A message template used to define a color scheme and prefix for unknown errors thrown by the process. */
export class LBErrorTemplate {
    /**The color of the error title/prefix. */
    titleColor:LBDefaultColor|LBHexColor
    /**The color of the error description. */
    descriptionColor:LBDefaultColor|LBHexColor
    /**The title/prefix displayed before the name of the error (uppercase recommended, `UNKNOWN ERROR` by default) */
    title: string
    /**The description displayed before below the error (`Additional details of this error can be found in the debug file.` by default) */
    description: string

    constructor(titleColor:LBDefaultColor|LBHexColor,descriptionColor:LBDefaultColor|LBHexColor,title?:string,description?:string){
        if (defaultColors.includes(titleColor) || /^#[0-9a-f]{6}$/.test(titleColor)) this.titleColor = titleColor
        else this.titleColor = "white"
        if (defaultColors.includes(descriptionColor) || /^#[0-9a-f]{6}$/.test(descriptionColor)) this.descriptionColor = descriptionColor
        else this.descriptionColor = "white"
        this.title = title ?? "UNKNOWN ERROR"
        this.description = description ?? "Additional details of this error can be found in the debug file."
    }
    /**Renders an error using the configured template. Returns `true` on success. */
    render(error:Error){
        const titleColor = getAnsisColor(this.titleColor)
        const descriptionColor = getAnsisColor(this.descriptionColor)

        try{
            //render error message + stacktrace + description
            console.log(titleColor("["+this.title+"]: ")+error.message)
            if (error.stack) console.log(ansis.gray(error.stack))
            console.log(descriptionColor.bold("\n"+this.description+"\n"))
            return true
        }catch{
            return false
        }
    }
    /**Returns an error formatted to be added to the debug file using the configured template. */
    renderDebug(error:Error){
        const date = new Date()
        const dstring = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const prefix = "["+dstring+" "+this.title+"] "
        
        return prefix+error.message+"\n"+(error.stack ?? "<error does not have a stacktrace>")
    }
}

/**All settings for the debug metadata. */
export interface LBDebugFileMetadata {
    /**Enable/disable metadata. */
    enabled:boolean,
    /**Set the title of the metadata. */
    title:string,
    /**Show the date and time the process was started. */
    showLastStartup:boolean,
    /**Show the node.js version used. */
    showNodeVersion:boolean,
    /**Add additional properties to show in the metadata (e.g. project version). */
    properties:{
        /**The key/name of the property. */
        key:string,
        /**The value/description of the property. */
        value:string
    }[]
}

/**The manager responsible for logging all errors and logs to a debug file. */
export class LBDebugFile {
    /**The relative location to the debug file from `process.cwd()` */
    path: string
    /**The maximum lines of the debug file. It will automatically scroll and remove the oldest logs when exceeding the limit. */
    maxHistoryLength: number
    /**All settings for the debug metadata. */
    metadata: LBDebugFileMetadata
    
    constructor(path:string,maxHistoryLength?:number,metadata?:LBDebugFileMetadata){
        this.path = nodepath.join(process.cwd(),path)
        this.maxHistoryLength = maxHistoryLength ?? 5000
        this.metadata = metadata ?? {
            enabled:true,
            title:"DEBUG FILE:",
            showLastStartup:true,
            showNodeVersion:true,
            properties:[]
        }

        this.#writeStartup()
    }

    /**Create the metadata text which will be shown in the top of the manager. */
    #createMetadata(): string[] {
        if (!this.metadata.enabled) return []
        const date = new Date()
        const dstring = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        
        const metadata = [
            "==================================================",
            this.metadata.title
        ]

        if (this.metadata.showLastStartup) metadata.push("Last Startup: "+dstring)
        if (this.metadata.showNodeVersion) metadata.push("Node.js Version: "+process.version)
        metadata.push(...this.metadata.properties.map((p) => p.key+": "+p.value))

        metadata.push("==================================================","","")
        return metadata
    }
    /**Read the current debug file. */
    #readDebugFile(){
        try{
            if (fs.existsSync(this.path)) return fs.readFileSync(this.path).toString()
            else return false
        }catch{
            return false
        }
    }
    /**Append new text to the debug file. */
    #writeDebugFile(text:string){
        const currentText = this.#readDebugFile()
        if (currentText){
            //append lines to file
            const lines = currentText.split("\n")
            lines.push(...text.split("\n"))

            //remove first lines when exceeding history (behind metadata)
            if (lines.length > this.maxHistoryLength){
                const metadata = this.#createMetadata()
                const diff = metadata.length + (lines.length - this.maxHistoryLength)
                lines.splice(0,diff)
                lines.unshift(...metadata) //re-add the removed metadata
            }

            fs.writeFileSync(this.path,lines.join("\n"))
        }else{
            fs.writeFileSync(this.path,this.#createMetadata().join("\n")+text)
        }
    }
    /**Write the startup header to the debug file (and initialize it). */
    #writeStartup(){
        this.#writeDebugFile("\n---------------------------------------------------------\n-------------------------STARTUP-------------------------\n")
    }
    /**Append new text to the debug file. Can also be used manually. */
    writeText(text:string){
        this.#writeDebugFile(text)
    }
}

/**Construct a LogBucket instance. It will return a function to use for logs in your project. */
export function LogBucket<CustomTemplates extends Record<string,LBMessageTemplate>,DefaultTemplatesDisabled extends boolean = false>(disableDefault?:DefaultTemplatesDisabled,templates?:CustomTemplates,errTemplate?:LBErrorTemplate,debugFile?:LBDebugFile){
    const defaultTemplates: Record<string,LBMessageTemplate> = disableDefault ? {} : {
        error:new LBMessageTemplate("ERROR","red","white","gray"), //red
        api:new LBMessageTemplate("API","orange","white","gray"), //orange
        warning:new LBMessageTemplate("WARNING","yellow","white","gray"), //yellow
        system:new LBMessageTemplate("SYSTEM","green","white","gray"), //green
        client:new LBMessageTemplate("CLIENT","cyan","white","gray"), //cyan
        info:new LBMessageTemplate("INFO","blue","white","gray"), //blue
        database:new LBMessageTemplate("DATABASE","purple","white","gray"), //purple
        plugin:new LBMessageTemplate("PLUGIN","magenta","white","gray"), //magenta
        server:new LBMessageTemplate("SERVER","pink","white","gray"), //pink
        debug:new LBMessageTemplate("DEBUG","gray","white","gray"), //gray
    }
    const instanceTemplates = Object.assign(defaultTemplates,(templates ?? {}))
    const instanceErrTemplate: LBErrorTemplate = errTemplate ? errTemplate : new LBErrorTemplate("red","red")

    /**Log a message or `Error` to the console and debug file using a colored prefix template and nice styling. */
    function LogBucketInstance(type:keyof CustomTemplates,message:string,params?:LBMessageParam[]): void
    function LogBucketInstance(type:DefaultTemplatesDisabled extends false ? LBDefaultType : never,message:string,params?:LBMessageParam[]): void
    function LogBucketInstance(err:Error): void
    function LogBucketInstance(type:string|Error|keyof CustomTemplates,message?:string,params?:LBMessageParam[]): void {
        if (typeof type == "string" && message){
            //render string
            let template = LogBucketInstance._templates[type]
            if (!template) template = new LBMessageTemplate("UNKNOWN","white","white","white")
            const debugFile = LogBucketInstance._debugFile
            template.render(message,params)
            if (debugFile) debugFile.writeText(template.renderDebug(message,params))
            LogBucketInstance._msgListeners.forEach((cb) => cb(template,message,params ?? []))

        }else if (type instanceof Error){
            //render error
            const errTemplate = LogBucketInstance._errTemplate
            const debugFile = LogBucketInstance._debugFile
            errTemplate.render(type)
            if (debugFile) debugFile.writeText(errTemplate.renderDebug(type))
            LogBucketInstance._errListeners.forEach((cb) => cb(errTemplate,type))

        }else{
            //no message found
            throw new Error("LogBucketInstance() => Invalid syntax! Correct syntax: (type, message, params?) OR (error)")
        }
    }
    /****❌ Please do not modify.** Instance of the LogBucket system. */
    LogBucketInstance._templates = instanceTemplates
    /****❌ Please do not modify.** Instance of the LogBucket system. */
    LogBucketInstance._errTemplate = instanceErrTemplate
    /****❌ Please do not modify.** Instance of the LogBucket system. */
    LogBucketInstance._debugFile = debugFile ?? null
    /****❌ Please do not modify.** Instance of the LogBucket system. */
    LogBucketInstance._msgListeners = [] as ((template:LBMessageTemplate,message:string,params:LBMessageParam[]) => void)[]
    /****❌ Please do not modify.** Instance of the LogBucket system. */
    LogBucketInstance._errListeners = [] as ((template:LBErrorTemplate,err:Error) => void)[]

    //event handling
    function on(event:"msgLog",callback:(template:LBMessageTemplate,message:string,params:LBMessageParam[]) => void): void
    function on(event:"errorLog",callback:(template:LBErrorTemplate,err:Error) => void): void
    function on(event:string,callback:Function): void {
        if (event == "msgLog") LogBucketInstance._msgListeners.push(callback as any)
        else if (event == "errorLog") LogBucketInstance._errListeners.push(callback as any)
        else throw new Error("LogBucketInstance.on(event,callback) => Invalid event type! Choose between 'msgLog' and 'errorLog'")
    }
    /**Listen for an event and define a custom behaviour. (e.g. `msgLog` or `errorLog`) */
    LogBucketInstance.on = on

    return LogBucketInstance
}