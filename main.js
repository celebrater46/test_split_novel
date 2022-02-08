"use strict";

const novel = document.getElementById("novel");
const testLine = "　勤務先は大手家電量販店ビックリカメラ｜六出那《ろくでな》支店。無論、正社員などではない。ここに正社員という概念は存在しない。会社の都合でいつでも｜馘首《クビ》にされる百円ライターさながらの使い捨て非正規社員だ。\n";

const countCharsInRuby = (line) => {
    if(line.indexOf("｜") == -1){
        return 0;
    }
    let temp = line;
    let count = 0;
    while (temp.indexOf("｜") != -1){
        const start = temp.indexOf("《");
        const end = temp.indexOf("》");
        count += end - start - 1;
        temp = temp.substring(end + 1);
    }
    return count;
}

// const countCharsExceptRuby = (line) => {
//
// }

// No ruby
const splitNovel40 = (novel) => {
    const separated = novel.split("\n");
    let str = "";
    separated.map((line) => {
        let temp = line;
        while(temp.length > 40){
            str += "<p>" + temp.substring(0, 40) + "</p>";
            temp = temp.substring(41);
        }
        str += "<p>" + temp + "</p>";
    });
    return str;
}

const splitNovel = (novel) => {
    const separated = novel.split("\n");
    let str = "";
    separated.map((line) => {
        str += "<p>" + (line === "" ? "　" : line) + "</p>";
    });
    return str;
}

// novel.innerHTML = splitNovel(sample);
// novel.innerHTML = splitNovel40(sample);
// novel.innerText = testLine.length; // 107
// novel.innerText = countCharsExceptRuby(testLine);
// console.log(testLine.indexOf("｜")); // 19
console.log(countCharsInRuby(testLine));