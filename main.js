"use strict";

// const novel = document.getElementById("novel");
const testLine = "　勤務先は大手家電量販店ビックリカメラ｜六出那《ろくでな》支店。無論、正社員などではない。ここに｜《サラリーマン》は｜存在しない《ノット・イクシスト》。会社の都合でいつでも｜馘首《クビ》にされる百円ライターさながらの使い捨て｜非正規社員《イレギュラー》である。";
const testLine2 = "　勤務先は大手家電量販店ビックリカメラ。\n";
const testLine3 = "１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９｜《ルシファー》。";
const scale = document.getElementById("scale");
// const lineHeight = document.getElementById("scale_p").clientHeight; // 一行の高さ（ルビなし）
const rubyLineHeight = document.getElementById("scale_p_ruby").clientHeight; // 一行の高さ（ルビあり）

// const furiganaMax = 60; // フリガナの最大文字数
const maxWidth = scale.clientWidth;
const maxHeight = scale.clientHeight;
const fontSize = 20; // px
const maxChars = Math.floor(maxWidth / fontSize); // 1行あたりの最大文字数
// const rubyMax = 30; // ルビ漢字の最大文字数

// console.log("lineHeight: " + lineHeight);
// console.log("rubyLineHeight: " + rubyLineHeight);

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

const getIndexOfLineBreak = (encodedLine, remainLines) => {
    let scaleTest = document.getElementById("scale_test");
    scaleTest.innerHTML = "";
    const maxHeight = rubyLineHeight * remainLines;
    console.log("maxHeight: " + maxHeight);
    let str = encodedLine;
    let num = 0;
    while(true){
        if(str.substr(num, 6) === "<ruby>") {
            // ルビタグの抽出
            const ruby = str.match(/<ruby><rb>([^\x01-\x7E]+)<\/rb><rp>\(<\/rp><rt>([^\x01-\x7E]+)<\/rt><rp>\)<\/rp><\/ruby>/);
            scaleTest.innerHTML += ruby[0];
            if(scaleTest.clientHeight > maxHeight){
                console.log(scaleTest.innerHTML);
                return Math.floor(num);
            } else {
                num += ruby[0].length; // 本来一文字先に進むところを、ルビならルビタグ全体分進める
            }
            str = str.replace("<ruby>", "<xxxx>"); // 現在のルビタグの無効化
        } else {
            scaleTest.innerHTML += str.substr(num, 1);
            if(scaleTest.clientHeight > maxHeight){
                console.log(scaleTest.innerHTML);
                return Math.floor(num);
            } else {
                num++;
            }
        }
        if(num > 5000){
            console.log("endless loop occurred")
            return -1; // 無限ループエラー対策
        }
    }
}

// 禁則処理によって排除される文字数を算出
const getNumOfDeletedCharsByKinsokuOneLine = (line) => {
    const char = line.substr(maxChars - 1, 1);
    const next = line.substr(maxChars, 1);
    if(char.search(/[「『（《〈【〚［〔｛]/) > -1){
        return 1;
    } else if(char === "―") {
        if(line.substr(maxChars, 1) === "―"){
            return 1;
        }
    } else if(char === "…") {
        if(line.substr(maxChars, 1) === "…"){
            return 1;
        } else if(line.substr(maxChars - 1, 1) === "…"){
            return 2;
        }
    } else if(next.search(/[、。」』）》〉】〛］〕｝]/) > -1){
        return 1;
    }
    return 0;
}

const getNumOfDeletedCharsBykinsoku = (line) => {
    let sum = 0;
    let remains = line;
    let i = 0;
    while(remains.length > 0){
        const num = getNumOfDeletedCharsByKinsokuOneLine(remains);
        remains = remains.substr(maxChars - num);
        sum += num;

        // 無限ループ対策
        if(i > 1000){
            alert("endless loop occurred");
        }
    }
    console.log("sum: " + sum);
    return sum;
}

const separateFinalLine = (line, remainLines) => {
    const hasRuby = line.indexOf("｜");
    const max = maxChars * remainLines;
    console.log("max: " + max);
    if(hasRuby > -1 && hasRuby < max){
        const encoded = encodeRuby(line);
        // ルビが１行内にあるなら、新しい改行ポイント indexOf を取得
        const lineBreak = getIndexOfLineBreak(encoded, remainLines);
        console.log("lineBreak: " + lineBreak);
        // １行で収まりきらない場合は分割
        if(encoded.length > lineBreak){
            return [encoded.substr(0, lineBreak), encoded.substr(lineBreak)];
        }
    } else {
        if(line.length > max){
            const kinsoku = getNumOfDeletedCharsBykinsoku(line);
            const line1 = line.substr(0, max - kinsoku);
            const line2 = line.substr(max - kinsoku);
            return [encodeRuby(line1), encodeRuby(line2)];
        }
    }
    return [this.encodeRuby(line), null];
}

// 最終行が複数行の場合、一度テスト用のPタグに入れて実測
const getTruePHeight = (line) => {
    let scaleP = document.getElementById("scale_p");
    scaleP.innerHTML = line;
    return scaleP.clientHeight;
}

// 実測した最終行が空きスペースより1行以上少ない場合、追加分を再取得
const getAdditionalStr = (remainHeight, array) => {
    const trueHeight = getTruePHeight(array[0]);
    const remainLines = remainHeight - trueHeight;
    if(remainLines > rubyLineHeight
        && array[1].length > 0)
    {
        // 実測した最終行が空きスペースより1行以上少ない場合、追加分を再取得
        return separateFinalLine(
            array[1],
            Math.floor(remainLines / rubyLineHeight)
        );
    } else {
        return ["", array[1]];
    }
}

let pages = [];
const createPage = (i, remainText) => new Promise((resolve, reject) => {
    pages.push(new Page(i));
    pages[i].lines = encodeRuby(remainText).split("\n");
    let container = document.getElementById("containter");
    let outer = document.createElement("div");
    outer.classList.add("page");
    let page = document.createElement("div");
    outer.appendChild(page);
    container.appendChild(outer);
    const pHeight = document.getElementById("scale_p").clientHeight;
    page.id = "p-" + i;
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
            }
        }
    }

    if(finalLine > 0){
        page.lastElementChild.remove(); // はみ出した最後の一行を削除
        const remainHeight = maxHeight - page.clientHeight;
        let lines = pages[i].lines.slice(finalLine + 1);
        if(remainHeight >= rubyLineHeight){
            const array = separateFinalLine(
                pages[i].lines[finalLine],
                Math.floor(remainHeight / rubyLineHeight)
            );
            const additionalArray = getAdditionalStr(remainHeight, array);
            let finalP = document.createElement("p");
            finalP.innerHTML = array[0] + additionalArray[0];
            page.appendChild(finalP);
            if(additionalArray[1] !== null){
                lines.unshift(additionalArray[1]);
            }
        }
        console.log("page.clientHeight: " + page.clientHeight);
        resolve(lines.join("\n"));
    } else {
        resolve("");
    }
});

let i = 0;
let remains = "";
const awaitFunc = async(str) => {
    remains = await createPage(i, str);
    if(remains.length > 0){
        i++;
        awaitFunc(remains);
    }
}

awaitFunc(sampleTexts[0]);

console.log("maxHeight: " + maxHeight);
