"use strict";

const novel = document.getElementById("novel");
const testLine = "　勤務先は大手家電量販店ビックリカメラ｜六出那《ろくでな》支店。無論、正社員などではない。ここに正社員という概念は存在しない。会社の都合でいつでも｜馘首《クビ》にされる百円ライターさながらの使い捨て非正規社員だ。\n";
const testLine2 = "　勤務先は大手家電量販店ビックリカメラ。\n";

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

const removeFirstSpace = (line) => {
    if(line.substring(0, 1) === "　"){
        return line.substring(1);
    } else {
        return line;
    }
}

const convertToEvenAllocation = (line) => {
    const noFirstSpaceLine = removeFirstSpace(line);
    let str = "";
    let temp = noFirstSpaceLine.replace(/\n/g, "");
    console.log(temp);
    while (temp.length > 0){
        str += '<span>' + temp.substring(0, 1) + '</span>';
        temp = temp.substring(1);
    }
    console.log(str);
    return "<div class='first_space'>　</div><div class='even'>" + str + "</div>";
}

// const convertToEvenAllocation = (line) => {
//     let str = "";
//     let temp = line.replace(/\n/g, "");
//     while (temp.length > 0){
//         str += '<span>' + temp.substring(0, 1) + '</span>';
//         temp = temp.substring(1);
//     }
//     return str;
// }

// If found Ruby, the sum of line that includes the Ruby word is over 40 chars?
// If so, it needs to split the line in front of Ruby word.
// It wants to make the sentence in front of the Ruby word, even allocation.
const rubyExists = (line) => {
    if(line.indexOf("｜") == -1){
        return false;
    } else {
        return true;
    }
}

// The char in front of \n is in Ruby?
// const lineBreakInRuby = (line, brPoint) => {
//     // 勤務先は大手家電量販店ビックリカメラ｜六出那《ろくでな》支店
//     const start = line.indexOf("｜");
//     const end = line.indexOf("《");
//     if(start == -1){
//         return false;
//     } else if(start == brPoint) {
//         return true;
//     } else if(end == -1){
//         return true;
//     }
// }

// 必要事項
// 改行コード手前の文字がルビワードの途中だったら、ルビタグの手前で改行しなければならない（その場合、改行前のラインには均等割り付けを適用）
// ルビワードが改行前にすべて収まっていても、フリガナの長さによってはルビワードを改行する必要がある（その場合も均等割り付け）


// 解決案
// とりあえず規定文字数で行を切り出して、ルビという不確定要素の含まれる行は
// 一度隠し div（body直下で、width が縛られないように）に出力して width を計測し、
// 規定幅を上回るようなら手前の文字を次の行に送って、という方法はどうか。


// フリガナは漢字の文字数の 2 倍以下か？（return は倍率）
const rubyPerWord = (ruby) => {
    // ruby == ｜堕天男《ルシファー》
    const start = ruby.indexOf("《");
    // const end = ruby.indexOf("《");
    const wordChars = start - 1;
    const rubyChars = ruby.length - start - 2;
    const ratio = rubyChars / wordChars;
    if(ratio > 2){
        return Math.ceil(ratio);
    } else {
        return 2;
    }
}

const splitRubyLine = (line, brPoint) => {
    let temp = line;
    let str = "";
    while(temp.indexOf("｜") != -1){
        const bar = temp.indexOf("｜");
        const start = temp.indexOf("《");
        const end = temp.indexOf("》");
        if(bar >= brPoint){
            // end of the line is "｜"
            str += "<p>" + temp.substring(0, bar) + "</p>";
            temp = temp.substring(bar + 1);
        } else if(start <= brPoint + 1){
            // Ruby word falls in the range
            if(rubyPerWord(bar, end + 1) > 2){
                // ルビが 1 文字に対して 2 以上ある場合の特別措置

            };
        }
    }

}

const splitNovel40_includeRuby = (novel) => {
    const separated = novel.split("\n");
    let str = "";
    separated.map((line) => {
        let temp = line;
        if(rubyExists(temp){

        } else {
            while(temp.length > 40){
                str += "<p>" + temp.substring(0, 40) + "</p>";
                temp = temp.substring(41);
            }
            str += "<p>" + temp + "</p>";
        }
    });
    return str;
}

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
// console.log(countCharsInRuby(testLine));
console.log(convertToEvenAllocation(testLine2));
novel.innerHTML = convertToEvenAllocation(testLine2); // 107
