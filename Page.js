class Page {
    // 引数の lines は、1 エピソード分すべてを受け取る
    // ページごとに必要な行を保持し、余った分を次のページインスタンスに引き渡す（linesとして）

    constructor(num, lines) {
        this.id = num;
        this.lines = lines;
        this.evenAllocation = false;
        this.width = -1; // ページの幅
        this.height = -1; // ページの高さ
        this.createPage();
    }

    createPage(){
        let container = document.getElementById("containter");
        let page = document.createElement("div");
        page.id = "p-" + this.id;
        page.classList.add("page");
        this.lines.map((line) => {
            let p = document.createElement("p");
            p.innerText = line;
            page.appendChild(p);
        });
        container.appendChild(page);
    }

    test(){

    }
}