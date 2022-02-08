"use strict";

const novel = document.getElementById("novel");

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
novel.innerHTML = splitNovel40(sample);