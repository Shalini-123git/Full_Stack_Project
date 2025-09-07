const fs = require("fs");
const archiver = require("archiver");
const {exec} = require("child_process");
const path = require("path");

function runBackup(uri) {
    try {
        const dumpFolder = "dump";
        const terminalCmd = `mongodump --uri="${uri}" --out=${dumpFolder}`
        const zipFilePath = path.join(__dirname, "..", "backup.zip");
        exec(terminalCmd, (error, stdout, stderr) => {
            if(error){
                console.log("backup error", stderr);
                return 
            }else{
                console.log("backup successfull");
            }
            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver("zip", {zlib: {
                level: 9
            }});
            output.on("close", () => {
                console.log("event closed");
            })
            archive.on("error", err => {
                console.log(err);
            })
            archive.pipe(output)
            archive.directory(dumpFolder, false)
            archive.finalize();
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = runBackup;