class Page {
    // 引数の lines は、1 エピソード分すべてを受け取る
    // ページごとに必要な行を保持し、余った分を次のページインスタンスに引き渡す（linesとして）

    constructor(num, str) {
        this.id = num;
        this.lines = str.split("\n");
        this.evenAllocation = false;
        this.width = -1; // ページの幅
        this.height = -1; // ページの高さ
        this.createPage();
    }

    separateFinalLine(line){
        let p = document.getElementById("scale_p");
        const basicLineHeight = p.clientHeight;
        const str = line.substring(0, maxChars);
        p.innerText = str;
        if(p.clientHeight > basicLineHeight){
            console.log("Line Over!!");
            console.log("p.innerText: " + p.innerText);
            console.log("maxChars: " + maxChars);
            console.log("maxWidth: " + maxWidth);
            console.log("fontSize: " + fontSize);
        } else {
            return [str, line.substr(maxChars)];
        }
        console.log("test p scale: " + p.clientHeight);
        console.log("p font-size: " + p.style.fontSize);
    }

    createPage(){
        let container = document.getElementById("containter");
        let page = document.createElement("div");
        container.appendChild(page);
        const pHeight = document.getElementById("scale_p").clientHeight;
        page.id = "p-" + this.id;
        page.classList.add("page");
        let currentHeight = 0;
        let finalLine = 0;
        for(let i = 0; i < this.lines.length; i++){
            if(page.clientHeight < maxHeight){
                console.log(page.clientHeight);
                let p = document.createElement("p");
                p.innerText = this.lines[i];
                page.appendChild(p);
                // console.log(pHeight);
                // console.log(page.clientHeight);
                currentHeight += pHeight;
                // currentHeight = page.clientHeight;
            } else {
                if(finalLine === 0){
                    finalLine = i;
                }
            }
        }
        let finalP = document.createElement("p");
        const array = this.separateFinalLine(this.lines[finalLine]);
        finalP.innerText = array[0];
        page.appendChild(finalP);
        console.log("array[1]: " + array[1]);
        console.log(this.lines[finalLine]);
        console.log(page.clientHeight);
        console.log(maxHeight);
        this.separateFinalLine(this.lines[finalLine]);


        // let i = 0;
        // this.lines.map((line) => {
        //     // if(page.clientHeight < maxHeight){
        //     //     console.log(page.clientHeight);
        //     //     let p = document.createElement("p");
        //     //     p.innerText = line;
        //     //     page.appendChild(p);
        //     //     // console.log(pHeight);
        //     //     // console.log(page.clientHeight);
        //     //     currentHeight += pHeight;
        //     //     // currentHeight = page.clientHeight;
        //     // }
        //     // while(currentHeight < maxHeight){
        //     //     let p = document.createElement("p");
        //     //     p.innerText = line;
        //     //     page.appendChild(p);
        //     //     currentHeight = page.clientHeight;
        //     // }
        // });
        // container.appendChild(page);
        // console.log(pHeight);
    }

    test(){

    }
}