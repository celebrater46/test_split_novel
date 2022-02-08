"use strict";

const novel = document.getElementById("novel");

const splitNovel = (novel) => {
    const separated = novel.split("\n");
    let str = "";
    separated.map((line) => {
        str += "<p>" + (line === "" ? "　" : line) + "</p>";
    });
    return str;
}

novel.innerHTML = splitNovel(sample);