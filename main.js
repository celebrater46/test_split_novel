"use strict";
// import {Line} from "Line.js";

const rubyMax = 30; // ルビ漢字の最大文字数
const furiganaMax = 60; // フリガナの最大文字数

const novel = document.getElementById("novel");
const testLine = "　勤務先は大手家電量販店ビックリカメラ｜六出那《ろくでな》支店。無論、正社員などではない。ここに｜《サラリーマン》は｜存在しない《ナッシング》。会社の都合でいつでも｜馘首《クビ》にされる百円ライターさながらの使い捨て｜非正規社員《イレギュラー》";
const testLine2 = "　勤務先は大手家電量販店ビックリカメラ。\n";
const testLine3 = "１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９｜《ルシファー》。";

// const getBackMountBracket = (line) => {
//     let str = line;
//     str = str.replace("(((", "《");
//     str = str.replace(")))", "》");
//     return str;
// }
//
// // 「｜《」など、山括弧をそのまま使いたい場合のエスケープ処理
// // 《》をいったん ((( ))) に変換する
// const escapeMountBracket = (line) => {
//     let str = line;
//     while(str.indexOf("｜《") > -1){
//         const index = str.indexOf("｜《");
//         let strAfterBar = str.substr(index);
//         strAfterBar = strAfterBar.replace("｜《", "(((");
//         strAfterBar = strAfterBar.replace("》", ")))");
//         str = str.substr(0, index) + strAfterBar;
//     }
//     return str;
// }

// ルビを除いた文字数をカウントする
const countCharsExceptRuby = (line) => {
    let str = line;
    while(str.indexOf("《") > -1){
        const rt = str.substring(str.indexOf("《"), str.indexOf("》"))
        str = str.replace()
    }
}

// // ｜堕天男《ルシファー》 -> <ruby><rb>堕天男</rb><rp>(</rp><rt>ルシファー</rt><rp>)</rp></ruby>
// const convertRuby = (line) => {
//     if(line.indexOf("｜") > -1 && line.indexOf("《") > -1 && line.indexOf("》") > -1){
//         let str = line;
//         str = str.replace(/｜/g, "<ruby><rb>");
//         str = str.replace(/《/g, "</rb><rp>(</rp><rt>");
//         str = str.replace(/》/g, "</rt><rp>)</rp></ruby>");
//         return str;
//     } else {
//         return line;
//     }
// }

// // 一行に収まらない文字列の最後から2番めの文字の index を取得する
// // 最後が </ruby> だった場合、<ruby> の先頭が何文字めかを数字で返す
// const getPreviousBrPoint = (line) => {
//     if(line.substr(-1) === ">" && line.match(/<ruby>/) !== null){
//         let str = line;
//         let index = -1;
//         while(str.match(/<ruby>/) !== null){
//             index = str.indexOf("<ruby>");
//             str = str.replace("<ruby>", "<xxxx>");
//         }
//         return index;
//     } else {
//         return line.length - 1;
//     }
// }
//
// // 一行に収まらない文を分割する
// // ruby タグに変換した後の文章を使用（そうしないと正確な width が得られない）
// // いったん <ruby> を ｜<ruby> にしてみてはどうか
// const exceptionalReturn = (line, maxWidth) => {
//     let str = line;
//     const p = document.getElementById("stealth");
//     p.innerText = str;
//     while(p.clientWidth >= maxWidth){
//         // ステルス<p>に表示して規定サイズオーバーなら 1 文字ずつ減らす
//         const index = getPreviousBrPoint(str);
//         str = str.substr(0, index);
//         p.innerHTML = str;
//     }
//     if(str.length === line.length){
//         return [ line ];
//     } else {
//         return [ str, line.substring(str.length) ];
//     }
// }

// ルビを含めた文字列が1行に収まるかどうか（収まるなら true）
const checkWithinLine = (line, maxWidth) => {
    const p = document.getElementById("stealth");
    p.innerText = line;
    if(p.clientWidth < maxWidth){
        return true;
    } else {
        return false;
    }
}

const getWidth = (line) => {
    const p = document.getElementById("stealth");
    p.innerText = line;
    return p.clientWidth;
    // return p.clientHeight;
}

// 改行またぎルビの縦棒が何番目にあるか検出
const searchBar = (line, max) => {
    if(line.indexOf("｜") > -1){
        let i = max;
        // console.log(i);
        while(i >= 0){
            const char = line.substr(i, 1);
            console.log(char);
            if(char === "｜"){
                return i;
            }
            i--;
        }
    }
    return false;
}

// ルビ漢字の途中で改行されるか（｜堕天<br>男《ルシファー》）
const rubyWithinRange = (line, max, bar) => {
    if(bar === false){ // そもそもルビが存在しない
        // console.log("ruby is nothing");
        return true;
    } else {
        let i = bar;
        while(i <= max + 1){ // 規定文字数内に《 が見つかれば true
            const char = line.substr(i, 1);
            console.log(char);
            if(char === "《"){
                return true;
            }
            i++;
        }
        return false;
    }
}

// 改行コードの手前の文字がルビ漢字の途中だった場合、ルビタグごと改行する
const returnRuby = (line, max) => {
    const bar = searchBar(line, max); // num or false
    console.log("bar: " + bar);
    let array = [];
    if(bar > 0){
        return [
            "<p>" + line.substring(0, bar) + "</p>",
            "<p>" + line.substring(bar)
        ];
    } else {
        // bar が 0 なら改行しない
        return "<p>" + line + "</p>";
    }
}

// // ルビが規定文字数を超える場合、ルビを消滅させる
// const deleteRuby = (line) => {
//
//     // let str = "";
//     let temp = line;
//     while(temp.indexOf("｜") != -1){
//         const start = temp.indexOf("《");
//         const end = temp.indexOf("》");
//         const ruby = temp.substring(start, end + 1);
//         temp = temp.replace("｜", "");
//         temp = temp.replace(ruby, "");
//     }
//     return temp;
// }

const testSeparateLineHasRuby = (line, max) => {
    // testLine3、｜が40文字目にくる場合だと、漢字一文字のルビなら普通に合法
    // 逆にもっと手前に｜があっても、漢字が多いと違法
    // ルビ漢字が一行の文字数に収まる範囲でも、フリガナの文字数が多い場合は、スケールで実測
    const bar = line.indexOf("｜");
    const start = line.indexOf("《");
    const end = line.indexOf("》");


    if(start - bar - 1 > max){ return false; } // 一行の最大文字数を超える場合は自動的にエラーとする
    if(bar > -1){

    }
}

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

// まず、ルビ記号とフリガナを除いた文字数をカウントし、一行の最大文字数までのワードを切り抜いてステルスPに入れる。
// width < max ならば、そのまま改行させる。
// width >= max ならば、何らかのルビが含まれている可能性がある。
// ので、一文字前で改行して、ステルスPに入れてみる。
// 一文字前に》が存在する場合、ルビ漢字ごと次の行に持っていく。
// まだ width >= max の場合、その前の文字で改行して……


// 全体の流れ
// まず、山括弧をそのまま表示する指定（例：｜《ルシファー》）をエスケープする
// ルビ指定を<ruby>タグ化する（一度<p>タグに放り込んで幅を測定するため）
// 1行に収まりきらない文章を、<p>タグに放り込んで実測した上で、規定幅に収まるように複数行に分割する
// 各行に<p>タグを追加し、均等割り付けを施す（最終行以外）


// 各行に必要なプロパティ
// id
// 本文
// 均等割り付けを行うか否か
//


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
        if(rubyExists(temp)) {
            return;
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
// console.log(convertToEvenAllocation(testLine2));
// novel.innerHTML = convertToEvenAllocation(testLine2); // 107
// console.log(deleteRuby(testLine));
// console.log(returnRuby(testLine3, 40));
// console.log(rubyWithinRange(testLine2, 40, searchBar(testLine2, 40)));
// console.log(getWidth(testLine));
// console.log(convertRuby(testLine));
// novel.innerHTML = "<p>" + convertRuby(testLine) + "</p>";
// console.log(checkWithinLine(testLine3, 1000));
// console.log(convertRuby(testLine));
// console.log(getPreviousBrPoint(convertRuby(testLine)));
// console.log(exceptionalReturn(convertRuby(testLine), 1000));
// console.log(escapeMountBracket(testLine3));
// console.log(getBackMountBracket(escapeMountBracket(testLine)));
// const escape = escapeMountBracket(testLine);
// console.log(escape);
// const converted = convertRuby(escape);
// const gotBack = getBackMountBracket(converted);
// console.log(gotBack)

const line = new Line(1, testLine);
line.test();

const line2 = new Line(2, testLine2);
line2.test();
