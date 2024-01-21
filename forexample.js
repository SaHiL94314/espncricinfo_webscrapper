const fs=require("fs");
const path=require("path");
const xlsx=require("xlsx");
//reading first way
// const buffer=fs.readFileSync("./example.json");
// console.log(buffer);
// console.log("''''''''''''''");
// const data=JSON.parse(buffer);

// reading second way
const data=require("./example.json");

//writing in file
// data.push({
//     "first_name":"ayush",
//     "last_name":"sinha",
//     "is_good":true
// })
// const stringdata=JSON.stringify(data);
// fs.writeFileSync("./example.json",stringdata);
// console.log(data);

// creating excel file
// let newWB = xlsx.utils.book_new();
// let newWS = xlsx.utils.json_to_sheet(data);
// xlsx.utils.book_append_sheet(newWB, newWS,"info");

// let filepath=path.join(__dirname,"abc.xlsx");

// xlsx.writeFile(newWB, filepath);


//reading excel file
// let wb = xlsx.readFile(filepath);
// let excelData = wb.Sheets["info"];
// let ans = xlsx.utils.sheet_to_json(excelData);
// console.log(ans);


function excelWriter(filepath,json,sheet_name){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS,sheet_name);
    xlsx.writeFile(newWB, filepath);
}
function readExcel(filepath,sheet_name){
    if(fs.existsSync(filepath)==false){
        return [];
    }
    let wb = xlsx.readFile(filepath);
    let excelData = wb.Sheets[sheet_name];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}