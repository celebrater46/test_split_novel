"use strict";

// console.log(sample);

const novel = document.getElementById("novel");

const splitNovel = (novel) => {
    const separated = novel.split("\n");
    let str = "";
    separated.map((line) => {
        // return "<p>" + line + "</p>";
        str += "<p>" + (line === "" ? "　" : line) + "</p>";
    });
    return str;
}

const convertToHtml = (array) => {

}

// novel.innerText = sample;
// console.log(splitNovel(sample));
// novel.innerHTML = splitNovel(sample); // Unexpected ","
novel.innerHTML = splitNovel(sample);