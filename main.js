"use strict";

const novel = document.getElementById("novel");
const testLine = "　勤務先は大手家電量販店ビックリカメラ｜六出那《ろくでな》支店。無論、正社員などではない。ここに｜《サラリーマン》は｜存在しない《ノット・イクシスト》。会社の都合でいつでも｜馘首《クビ》にされる百円ライターさながらの使い捨て｜非正規社員《イレギュラー》である。";
const testLine2 = "　勤務先は大手家電量販店ビックリカメラ。\n";
const testLine3 = "１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９｜《ルシファー》。";

const rubyMax = 30; // ルビ漢字の最大文字数
const furiganaMax = 60; // フリガナの最大文字数
const maxWidth = 1000; // 1行あたりの最大幅（px） font 19px == 52 chars
// const maxChars = 40; // 1行あたりの最大文字数
// const fontSizeP = getFontSize();

// const getFontSize = () => {
//     const p = document.querySelector("p");
//     const size = window.getComputedStyle(p).getPropertyValue('font-size');
//     return parseFloat(size); // px
// };
//
// const getMaxChars = () => {
//     const fontSize = getFontSize();
//     return Math.floor(maxWidth / fontSize);
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


const line = new Line(1, testLine + testLine + testLine);
// console.log("testLine*3: ");
// console.log(testLine + testLine + testLine);
line.test();

// let ps = "";
// line.lines.map((line) => {
//     // const p = document.createTextNode(line);
//     // novel.appendChild(p);
//     ps += line;
// });
// novel.innerHTML = ps;

// console.log(getFontSize());
// const line2 = new Line(2, testLine2);
// line2.test();
