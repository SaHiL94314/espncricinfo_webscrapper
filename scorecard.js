//venue date result 
const request=require("request");
const cheerio=require("cheerio");
const path=require("path");
const fs=require("fs");
const xlsx=require("xlsx");
//accessing the first page
function cb3(url1){
    request(url1,cb4);
    function cb4(err,response,html){
        if(err){
            console.log(err);
        }
        else{
            extractscorepage(html);
        }
    }
}


function extractscorepage(html){
    let $=cheerio.load(html);
    let description=$(".ds-grow>.ds-text-tight-m.ds-font-regular.ds-text-typo-mid3");
    let descriptionArr=$(description).text().split(",");
    let venue=descriptionArr[1].trim();
    let date=descriptionArr[2].trim()+" "+descriptionArr[3].trim();
    
    description=$(".ds-text-compact-xxs.ds-p-2.ds-px-4>div>p>span");
    let result=$(description).text();
    
    let inningsArr=$(".ds-rounded-lg.ds-mt-2");
    for(let i=0;i<inningsArr.length;i++){
        let teamName=$(inningsArr[i]).find(".ds-text-title-xs.ds-font-bold.ds-text-typo").text().split("(")[0].trim();
        let teampath=path.join(__dirname,"ipl",teamName);
        createDir(teampath);
        let opponentIdx=i==0?1:0;
        let opponenetTeamName=$(inningsArr[opponentIdx]).find(".ds-text-title-xs.ds-font-bold.ds-text-typo").text().split("(")[0].trim();
        // console.log(`${teamName} vs ${opponenetTeamName}`);

        let allbattertats=$(inningsArr[i]).find(".ci-scorecard-table>tbody>tr");
        for(let j=0;j<allbattertats.length;j++){
            let ishidden=$(allbattertats[j]).hasClass(".ds-hidden");
            if(ishidden==false){
                let allcols=$(allbattertats[j]).find("td");
                if(allcols.length<=4) continue;
                let pname=$(allcols[0]).find("a>span>span").text().trim();
                let runs =$(allcols[2]).find("strong").text().trim();
                let balls=$(allcols[3]).text().trim();
                let fours=$(allcols[5]).text().trim();
                let sixes=$(allcols[6]).text().trim();
                let sr=$(allcols[7]).text().trim();
                
                console.log(`${pname} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processData(teamName,pname,runs,balls,fours,sixes,sr,date,venue,result);
            }
        }

    }
}

function processData(teamName,pname,runs,balls,fours,sixes,sr,date,venue,result){
    let teampath=path.join(__dirname,"ipl",teamName);
    createDir(teampath);
    let filepath=path.join(teampath,pname+".xlsx");
    let content=readExcel(filepath,pname);
    let playerObj={
        pname,
        teamName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        date,
        venue,
        result
    }
    content.push(playerObj);
    excelWriter(filepath,content,pname);
}

function createDir(dirpath){
    if(fs.existsSync(dirpath)==false){
        fs.mkdirSync(dirpath);
    }
}
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
module.exports={
    scorecardobj:cb3
}