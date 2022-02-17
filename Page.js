class Page {
    // 引数の lines は、1 エピソード分すべてを受け取る
    // ページごとに必要な行を保持し、余った分を次のページインスタンスに引き渡す（linesとして）

    constructor(num, str) {
        this.id = num;
        // console.log("str: " + str);
        this.lines = encodeRuby(str).split("\n");
        this.evenAllocation = false;
        this.width = -1; // ページの幅
        this.height = -1; // ページの高さ
        this.remainStr = this.createPage(); // join() によって結合された文字列
    }

    getExcessType(page, finalLine){
        // createPage() で行がはみ出すのは3つのパターンがあるので、そのうちのどれかを返す
        // 1: 5行のページとして、1行追加、その後に5行追加
        // 2: 5行のページとして、5行分の文章追加、その後に行追加
        // 3: 5行のページとして、4行分の文章追加、 その後に複数行分の追加
        const lastLineHeight = page.lastElementChild.clientHeight; // 最終行の高さ
        const withoutLastLinesHeight = page.clientHeight - lastLineHeight; // 最終行以外の行の合計
        if(maxHeight - withoutLastLinesHeight)
        page.lastElementChild.remove();
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
        // console.log("maxHeight" + maxHeight);
        for(let i = 0; i < this.lines.length; i++){
            if(page.clientHeight < maxHeight){
                let p = document.createElement("p");
                p.innerHTML = this.lines[i];
                page.appendChild(p);
                currentHeight += pHeight;
            } else {
                if(finalLine === 0){
                    finalLine = i - 1;
                    // page.pop(); // はみ出した最後の一行を削除
                }
            }
        }
        // page.lastElementChild.remove(); // はみ出した最後の一行を削除
        // page.lastElementChild.remove(); // はみ出した最後の一行を削除
        if(finalLine > 0){
            let finalP = document.createElement("p");
            const array = separateFinalLine(this.lines[finalLine]);
            finalP.innerHTML = array[0];
            page.appendChild(finalP);
            // console.log("array[1]: " + array[1]);
            let lines = this.lines.slice(finalLine + 1);
            lines.unshift(array[1]) ;
            // console.log("remainLines: ");
            // console.log(lines);
            // return array[1];
            return lines.join("\n");
        } else {
            return null;
        }

    }
}