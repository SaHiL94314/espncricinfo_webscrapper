const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
const allmatchobj=require("./allmatch.js")


let dirpath=path.join(__dirname,"ipl");
createDir(dirpath);
//accessing the first page
const url1="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url1,cb);
function cb(err,response,html){
    if(err){
        console.log(err);
    }
    else{
        findnextpage(html);
    }
}
//accessing next page link
function findnextpage(html){
    let $=cheerio.load(html);
    let contentArr=$(".ds-block .ds-border-t.ds-border-line.ds-text-center.ds-py-2");
    let nexturl = $(contentArr[0]).find("a").attr("href");
    let fulllink="https://www.espncricinfo.com"+nexturl;
    
    //now we have to deal with second link
    allmatchobj.getAllMatchobj(fulllink);
}

function createDir(dirpath){
    if(fs.existsSync(dirpath)==false){
        fs.mkdirSync(dirpath);
    }
}
