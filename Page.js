class Page {
    // 引数の lines は、1 エピソード分すべてを受け取る
    // ページごとに必要な行を保持し、余った分を次のページインスタンスに引き渡す（linesとして）

    constructor(num, str) {
        this.id = num;
        // console.log("str: " + str);
        this.lines = this.encodeRuby(str).split("\n");
        this.evenAllocation = false;
        this.width = -1; // ページの幅
        this.height = -1; // ページの高さ
        this.remainStr = this.createPage(); // join() によって結合された文字列
    }

    // 行の中にルビが存在する場合、最大文字数を<ruby>タグとフリガナ分延長する
    getExtendMaxChars(line) {
        let num = 0;
        let str = "";
        if(line.indexOf("<ruby>") > -1){
            str = this.decodeRuby(line);
            while(str.indexOf("｜") > -1){
                // ルビひとつにつき、51 + フリガナ文字数 を追加
                const start = str.indexOf("《"); // ｜堕天男《ルシファー》
                const end = str.indexOf("》");
                num += end - start - 1; // ふりがなの文字数
                num += 51; // <ruby><rb></rb><rp>(</rp><rt></rt><rp>)</rp></ruby>
                str = str.replace("｜", "‖");
                str = str.replace("《", "≪");
                str = str.replace("》", "≫");
            }
        }
        return maxChars + num;
    }

    encodeRuby(line) {
        let str = line;
        if(str.indexOf("｜") > -1 && str.indexOf("《") > -1 && str.indexOf("》") > -1){
            str = str.replace(/｜/g, "<ruby><rb>");
            str = str.replace(/《/g, "</rb><rp>(</rp><rt>");
            str = str.replace(/》/g, "</rt><rp>)</rp></ruby>");
        }
        return str;
    }

    // encodeRuby() の逆
    decodeRuby(line) {
        let str = line;
        if(str.indexOf("<ruby><rb>") > -1
            && str.indexOf("</rb><rp>(</rp><rt>") > -1
            && str.indexOf("</rt><rp>)</rp></ruby>") > -1)
        {
            str = str.replace(/<ruby><rb>/g, "｜");
            str = str.replace(/<\/rb><rp>\(<\/rp><rt>/g, "《");
            str = str.replace(/<\/rt><rp>\)<\/rp><\/ruby>/g, "》");
            return str;
        }
    }

    getNextChar(line, i){
        const char = line.substr(i, 6);
        // 次の文字がルビタグだった場合、ルビタグの後ろの indexOf を返す
        if(char === "<ruby>"){
            const str = line.substr(i);
            const end = str.indexOf("</ruby>");
            const ruby = str.substr(0, end + 7);
            return ruby.length;
        } else {
            return 1;
        }
    }

    // 特殊ルビなどで文字数を減らさなければならない場合、一行で収まる文字数を返す
    getIndexOfOversizedLine(line){
        let p = document.getElementById("scale_p");
        p.innerHTML = "テスト";
        const basicLineHeight = p.clientHeight;
        p.innerHTML = "";
        let nums = []; // 追加した文字の indexOf を都度記録する配列
        let i = 0;
        let iNext = 0;
        // テスト用の<p>に一文字ないしルビタグを追加して行き、超えたらその手前の字の indexOf を返す
        while(iNext < line.length){
            // テスト<p>の高さが2行分以上になったら、1文字か1ルビ前の indexOf を返す
            if(p.clientHeight >= basicLineHeight * 2){
                return nums[i - 1];
            } else {
                const next = this.getNextChar(line, iNext);
                nums.push(iNext);
                p.innerHTML += line.substr(iNext, next);
                i++;
                iNext += next;
            }
        }
    }

    // ページの最終行が1行分に収まらない場合、分割して配列で返す
    separateFinalLine(line){
        let p = document.getElementById("scale_p");
        const basicLineHeight = p.clientHeight;
        const str = line.substring(0, this.getExtendMaxChars(line));
        p.innerHTML = str;
        // 通常の最大文字数で 1 行に収まらない場合（特殊ルビなどで）、1 行に収まる文字数を算出
        if(p.clientHeight >= basicLineHeight * 2){
            const num = this.getIndexOfOversizedLine(line);
            return [line.substring(0, num), line.substring(num)];
        } else {
            return [str, line.substr(this.getExtendMaxChars(line))];
        }
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
                let p = document.createElement("p");
                p.innerHTML = this.lines[i];
                page.appendChild(p);
                currentHeight += pHeight;
            } else {
                if(finalLine === 0){
                    finalLine = i;
                }
            }
        }
        if(finalLine > 0){
            let finalP = document.createElement("p");
            const array = this.separateFinalLine(this.lines[finalLine]);
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