const request=require("request");
const cheerio=require("cheerio");
const path=require("path");
const fs=require("fs");
const scoreobj=require("./scorecard.js");

function getAllMatch(fulllink){
    request(fulllink,cb2);
    function cb2(err,response,html){
        if(err){
            console.log(err);
        }
        else{
            findAllMatches(html);
        }
    }
}

//find all matches one by one
function findAllMatches(html){
    let $=cheerio.load(html);
    let allMatchArr=$(".ds-mb-4 .ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line .ds-p-0 .ds-p-4");
    
    // console.log(allMatchArr.length);
    //finding scorecard link of all matches one by one
    for(let i=0;i<allMatchArr.length;i++){
        let score_page_link=$(allMatchArr[i]).find(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent a").attr("href");
        score_page_link = "https://www.espncricinfo.com/"+score_page_link;
        console.log(score_page_link);
        scoreobj.scorecardobj(score_page_link);
    }
}

module.exports={
    getAllMatchobj:getAllMatch
}