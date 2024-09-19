import fs from "fs";
import { parse } from "csv-parse";
import path from "node:path";

let filePath = path.join(path.dirname(new URL('.', import.meta.url).pathname), 'China-City-List-latest.csv')
filePath = filePath.slice(1)

export let cityMap = {
    北京: '101010100',
    海淀: "101010200",
    上海: "101020100",
    天津: "101030100",
    湛江: "101281009"
}


// 替换为你的 CSV 文件路径



export let cityM = ReadCSV(filePath)

function ReadCSV(filePath) {
    console.log(filePath)
    const records = new Map();
    const data = fs.readFileSync(filePath,
        { encoding: 'utf8'});
    const parser = parse( data,{ skip_empty_lines:true, columns:true, trim:true})
    parser.on('readable', function(){
        let record;
        while ((record = parser.read()) !== null) {
            records.set(record.Location_Name_ZH,record.Location_ID)
        }
    });
// Catch any error
    parser.on('error', function(err){
        console.error(err.message);
    });
// Test that the parsed records matched the expected records
    parser.on('end', function(){
        console.log(records + '123')
        return records
    });
}

