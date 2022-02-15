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
                    finalLine = i - 1;
                }
            }
        }
        console.log(this.lines[finalLine]);
        console.log(page.clientHeight);
        console.log(maxHeight);


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