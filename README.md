<img src="https://apis.dj-dj.be/cdn/logbucket/logo.png" alt="Logbucket Logo" width="600px">

[![discord](https://img.shields.io/badge/discord-join%20our%20server-5865F2.svg?style=flat-square&logo=discord)](https://discord.com/invite/26vT9wt3n3)  [![version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg?style=flat-square)](https://github.com/DJj123dj/logbucket/releases/tag/v1.0.0)  [![license](https://img.shields.io/badge/license-MIT-important.svg?style=flat-square)](https://github.com/DJj123dj/logbucket/blob/main/LICENSE) [![stars](https://img.shields.io/github/stars/DJj123dj/logbucket?color=yellow&label=stars&logo=github&style=flat-square)](https://www.github.com/DJj123dj/logbucket)

### Logbucket
Logbucket is a lightweight and customizable logging library for Node.js featuring **beautiful logs with configurable colors, prefixes and the ability to be saved to a debug file in real-time.** If you're having trouble configuring the library, feel free to join our support server and we will help you further! 

### [Installation using npm ⬇️](https://www.npmjs.com/package/logbucket)
```
npm install logbucket
```

> ### ❤️ Sponsors
> We're still searching for sponsors! Would you like to sponsor us?

## 📌 Features

- ⚖️ **Lightweight** — Minimal footprint, maximum performance.
- 🚨 **Built with TypeScript** — Enjoy full type safety and intelligent autocompletion.
- ⭐️ **Beautiful Logs** — Quickly create clean, stylish, and readable logs.
- ⚙️ **Highly Customizable** — Fine-tune styles, templates and more.
- 📄 **Custom Log Types** — Define your own log categories and behaviors.
- 🎨 **Full RGB Color Support** — Powered by [`ansis`](https://www.npmjs.com/package/ansis) for vibrant, customizable colors.
- 📝 **Real-Time Log Saving** — Automatically save all logs to a debug file as they happen.
- 🎯 **Event-Driven** — Listen to events and define your own custom reactions.
- 🧽 **Automatic Cleaning** — Automatically clear logs in the debug file to make sure it won't exceed a certain limit.

## 📸 Examples
<img src="https://apis.dj-dj.be/cdn/logbucket/example-marketing.png" width="700px">
<img src="https://apis.dj-dj.be/cdn/logbucket/example-error.png" width="700px">
<img src="https://apis.dj-dj.be/cdn/logbucket/example-customisation.png" width="700px">

## 🛠️ Quick Usage
> **TIP:** Detailed examples are available in the `./examples/` directory in the [Github repository](https://github.com/DJj123dj/logbucket/tree/main/examples).
```ts
const {LogBucket} = require("logbucket")
//import {LogBucket} from "logbucket"

//create a Logbucket instance
const log = LogBucket()

/////////////////////////
//// READY FOR USAGE ////
/////////////////////////

//try different log types
log("error","Hello world!")
log("warning","Hello world!")
log("info","Hello world!")

//try logging with parameters
log("debug","Hello world!",[
    {key:"lorem",value:"ipsum"},
    {key:"foo",value:"bar"}
])

//log an error to the console (e.g. from a try-catch)
log(new Error("This is an example error."))
```

## 🧩 API Reference
> [View full examples in Github Repository](https://github.com/DJj123dj/logbucket/tree/main/examples)
### function `LogBucket()`: `LogBucketInstance`
<details>
<summary>
Create a Logbucket instance.  
</summary>

> **Parameters (Optional):**
> - **`disableDefault?`** (`boolean`): Disable the built-in templates (to replace them with your own)
> - **`templates?`** (`object`): An object containing additional/custom templates (`LBMessageTemplate`)
> - **`errTemplate?`** (`LBErrorTemplate`): Add a custom template for logging JS errors (`new Error(...)`)
> - **`debugFile?`** (`LBDebugFile`): Add a debug file to write all logs to. (Disabled by default)
</details>

### function `LogBucketInstance()`: `void`
<details>
<summary>
Log messages to the console using a specified log type/category.
</summary>

> **Parameters (Message):**
> - **`type`** (`string`): The type to use for this message. Must be a custom or default registered type.
> - **`message`** (`string`): The message to log to the console.
> - **`params?`** (`LBMessageParam[]`): Add custom parameters to the message.
>   - format: `{key:string, value:string, hidden:boolean}`
>
> **Parameters (Error):**
> - **`error`** (`Error`): The error to log to the console.
>
> **Listen for events:**
> - Use `LogBucketInstance.on(eventName,callback)` to listen for events.
</details>

### class `new LBMessageTemplate()`: `void`
<details>
<summary>
Create a message template to create a custom log type/category.
</summary>

> **Constructor Parameters:**
> - **`prefix`** (`string`): The prefix to use (uppercase recommended)
> - **`prefixColor`** (`LBDefaultColor|LBHexColor`): The color of the prefix.
> - **`msgColor`** (`LBDefaultColor|LBHexColor`): The color of the message.
> - **`paramsColor`** (`LBDefaultColor|LBHexColor`): The color of the parameters.
</details>

### class `new LBErrorTemplate()`
<details>
<summary>
Create an error template to display the errors differently.
</summary>

> **Constructor Parameters:**
> - **`titleColor`** (`LBDefaultColor|LBHexColor`): The color of the title.
> - **`descriptionColor`** (`LBDefaultColor|LBHexColor`): The color of the description.
> - **`title?`** (`string`): The title/prefix to use (uppercase recommended)
> - **`description?`** (`string`): An optional description to display below the error for additional information or bug reporting.
</details>

### class `new LBDebugFile()`
<details>
<summary>
Create a debug file instance to write all logs to.
</summary>

> **Constructor Parameters:**
> - **`path`** (`string`): The location of the debug file relative to the current directory. (`process.cwd()`)
> - **`maxHistoryLength?`** (`number`): The maximum length of the debug file. It will start to scroll once the limit has been reached.
> - **`metadata?`** (`LBDebugFileMetadata`): Customise the metadata of the debug file. (top of file)
</details>

### type `LBDefaultColor`
A collection of all available default colors:  
`white`,`red`,`orange`,`yellow`,`green`,`blue`,`gray`,`cyan`,`magenta`,`purple`,`pink`

### type `LBDefaultType`
A collection of all available log types/categories:  
`info`,`warning`,`error`,`system`,`database`,`debug`,`plugin`,`api`,`client`,`server`

### type `LBHexColor`
A utility type for hex-colors.

### interface `LBMessageParam`
A parameter in the `LogBucketInstance(type,message,params)` method.

### interface `LBDebugFileMetadata`
All settings for the debug file metadata.

## 🛠️ Contributors
> All contributions are welcome! Feel free to create a pull-request or issue in the [Github repository](https://github.com/DJj123dj/logbucket).
<table>
<tr>
<td align="center"><img src="https://github.com/DJj123dj.png" alt="Profile Picture" width="80px"></td>
</tr>
<tr>
<th><a href="https://github.com/DJj123dj">💻 DJj123dj</a></th>
</tr>
</table>

## ⭐️ Star History
> Spread the beauty of clean logs — support our simple package by sharing it! 😁

<a href="https://star-history.com/#DJj123dj/logbucket&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=DJj123dj/logbucket&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=DJj123dj/logbucket&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=DJj123dj/logbucket&type=Date" />
 </picture>
</a>

---
<img src="https://apis.dj-dj.be/cdn/logbucket/logo.png" alt="Open Ticket Logo" width="170px">

**v1.0.0 - README.md**<br>
© 2025 - [DJdj Development](https://www.dj-dj.be) - [Discord](https://discord.dj-dj.be) - [Terms](https://www.dj-dj.be/terms) - [Privacy Policy](https://www.dj-dj.be/privacy) - [Support Us](https://github.com/sponsors/DJj123dj) - [License](./LICENSE.md)