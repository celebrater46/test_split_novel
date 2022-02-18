"use strict";

const novel = document.getElementById("novel");
const testLine = "　勤務先は大手家電量販店ビックリカメラ｜六出那《ろくでな》支店。無論、正社員などではない。ここに｜《サラリーマン》は｜存在しない《ノット・イクシスト》。会社の都合でいつでも｜馘首《クビ》にされる百円ライターさながらの使い捨て｜非正規社員《イレギュラー》である。";
const testLine2 = "　勤務先は大手家電量販店ビックリカメラ。\n";
const testLine3 = "１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９｜《ルシファー》。";
const scale = document.getElementById("scale");
const lineHeight = document.getElementById("scale_p").clientHeight; // 一行の高さ（ルビなし）
const rubyLineHeight = document.getElementById("scale_p_ruby").clientHeight; // 一行の高さ（ルビあり）

const furiganaMax = 60; // フリガナの最大文字数
const maxWidth = scale.clientWidth;
const maxHeight = scale.clientHeight;
const fontSize = 20; // px
const maxChars = Math.floor(maxWidth / fontSize); // 1行あたりの最大文字数
const rubyMax = 30; // ルビ漢字の最大文字数

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

const encodeRuby = (line) => {
    if(line.indexOf("｜") > -1){
        return line.replace(
            /｜([^《]+)《([^》]+)》/g,
            "<ruby><rb>$1</rb><rp>(</rp><rt>$2</rt><rp>)</rp></ruby>"
        );
    }
    return line;
}

const decodeRuby = (line) => {
    let str = line;
    if(str.indexOf("<ruby><rb>") > -1) {
        str = str.replace(
            /<ruby><rb>([^\x01-\x7E]+)<\/rb><rp>\(<\/rp><rt>([^\x01-\x7E]+)<\/rt><rp>\)<\/rp><\/ruby>/g,
            "｜$1《$2》"
        );
        return str;
    }
}

const getIndexOfLineBreak = (encodedLine) => {
    let scaleTest = document.getElementById("scale_test");
    scaleTest.innerHTML = "";
    let str = encodedLine;
    let num = 0;
    while(true){
        if(str.substr(num, 6) === "<ruby>") {
            // ルビタグの抽出
            const ruby = str.match(/<ruby><rb>([^\x01-\x7E]+)<\/rb><rp>\(<\/rp><rt>([^\x01-\x7E]+)<\/rt><rp>\)<\/rp><\/ruby>/);
            scaleTest.innerHTML += ruby[0];
            if(scaleTest.clientHeight > rubyLineHeight){
                return Math.floor(num);
            } else {
                num += ruby[0].length; // 本来一文字先に進むところを、ルビならルビタグ全体分進める
            }
            str = str.replace("<ruby>", "<xxxx>"); // 現在のルビタグの無効化
        } else {
            scaleTest.innerHTML += str.substr(num, 1);
            if(scaleTest.clientHeight > rubyLineHeight){
                return Math.floor(num);
            } else {
                num++;
            }
        }
        if(num > 5000){
            return -1; // 無限ループエラー対策
        }
    }
}

const separateFinalLine = (line) => {
    const hasRuby = line.indexOf("｜");
    if(hasRuby > -1 && hasRuby < maxChars){
        const encoded = encodeRuby(line);
        // ルビが１行内にあるなら、新しい改行ポイント indexOf を取得
        const lineBreak = getIndexOfLineBreak(encoded);
        // console.log("lineBreak: " + lineBreak);
        // １行で収まりきらない場合は分割
        if(encoded.length > lineBreak){
            return [encoded.substr(0, lineBreak), encoded.substr(lineBreak)];
        }
    } else {
        if(line.length > maxChars){
            const line1 = line.substr(0, maxChars);
            const line2 = line.substr(maxChars);
            return [encodeRuby(line1), encodeRuby(line2)];
        }
    }
    return [this.encodeRuby(line), null];
}

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

let pages = [];
let i = 0;
const createPage = (remainText) => new Promise((resolve, reject) => {
    pages.push(new Page(i));
    pages[i].lines = encodeRuby(remainText).split("\n");
    let container = document.getElementById("containter");
    let page = document.createElement("div");
    container.appendChild(page);
    const pHeight = document.getElementById("scale_p").clientHeight;
    page.id = "p-" + i;
    page.classList.add("page");
    let currentHeight = 0;
    let finalLine = 0;
    // console.log("maxHeight" + maxHeight);
    for(let j = 0; j < pages[i].lines.length; j++){
        if(page.clientHeight < maxHeight){
            let p = document.createElement("p");
            p.innerHTML = pages[i].lines[j];
            page.appendChild(p);
            currentHeight += pHeight;
        } else {
            if(finalLine === 0){
                finalLine = j - 1;
                // page.pop(); // はみ出した最後の一行を削除
            }
        }
    }

    // page.lastElementChild.remove(); // はみ出した最後の一行を削除
    if(finalLine > 0){
        page.lastElementChild.remove(); // はみ出した最後の一行を削除
        const remainHeight = maxHeight - page.clientHeight;
        // let array = [];
        // console.log("remainHeight: " + remainHeight);
        // console.log("rubyLineHeight: " + rubyLineHeight);
        let lines = pages[i].lines.slice(finalLine + 1);
        if(remainHeight >= rubyLineHeight){
            const array = separateFinalLine(pages[i].lines[finalLine]);
            let finalP = document.createElement("p");
            finalP.innerHTML = array[0];
            page.appendChild(finalP);
            if(array[1] !== null){
                lines.unshift(array[1]);
            }
            // console.log("remainStr: " + lines.join("\n"));
            // return lines.join("\n");
            // resolve(lines.join("\n"));
        }
        console.log(page.clientHeight);
        resolve(lines.join("\n"));
    } else {
        // console.log("remainStr: null");
        // console.log("pages[i].lines: ");
        // console.log(pages[i].lines);
        // return null;
        resolve("");
    }
// }).then((str) => {
//     if(str.length > 0){
//         createPage(str);
//     }
    //
    // const page = new Page(i, remainText);
    // // if(page.remainStr !== false){
    // // }
    // while(true){
    //     if(page.remainStr !== false){
    //         return(page);
    //     }
    // }
// }).then((page) => {
//     console.log("page in promise: ");
//     console.log(page);
//     pages.push(page);
//     // console.log(`then1: ${val}`);
//     return page;
// }).then((page) => {
//     if(page.remainStr !== null && page.remainStr !== false){
//         createPage(page.remainStr);
//     }
});

let remains = "";
const awaitFunc = async(str) => {
    // console.log("start");
    // remains = str;
    remains = await createPage(str);
    if(remains.length > 0){
        awaitFunc(remains);
    }
     // Promise が返ってくるまで awaitで 処理停止
    // console.log(result);
}

awaitFunc(sampleTexts[0]);

console.log("maxHeight: " + maxHeight);
