class Page {
    // 引数の lines は、1 エピソード分すべてを受け取る
    // ページごとに必要な行を保持し、余った分を次のページインスタンスに引き渡す（linesとして）

    constructor(num, str) {
        this.id = num;
        this.lines = this.encodeRuby(str).split("\n");
        this.evenAllocation = false;
        this.width = -1; // ページの幅
        this.height = -1; // ページの高さ
        this.createPage();
    }

    // 行の中にルビが存在する場合、最大文字数を<ruby>タグとフリガナ分延長する
    getExtendMaxChars(line) {
        // const max = this.getMaxChars();
        // const max = maxChars;
        let num = 0;
        let str = "";
        // console.log(line);
        if(line.indexOf("<ruby>") > -1){
            // console.log("hello");
            str = this.decodeRuby(line);
            // while(str.indexOf("｜") > -1 && str.indexOf("｜") < max){
            while(str.indexOf("｜") > -1){
                // ルビひとつにつき、51 + フリガナ文字数 を追加
                // const tempStr = str.substring(0, str.indexOf("｜"));
                // console.log("hello");
                // const bar = str.indexOf("｜");
                const start = str.indexOf("《"); // ｜堕天男《ルシファー》
                const end = str.indexOf("》");
                // num += bar; // ルビより前の文字数
                num += end - start - 1; // ふりがなの文字数
                num += 51; // <ruby><rb></rb><rp>(</rp><rt></rt><rp>)</rp></ruby>
                // num++; // 縦棒の分の補正値
                str = str.replace("｜", "‖");
                str = str.replace("《", "≪");
                str = str.replace("》", "≫");
            }
        }
        // return max + num;
        // console.log("maxChars: " + maxChars);
        // console.log("num: " + num);
        return maxChars + num;
        // return max + num + 1;
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
            // str = str.replace("<ruby><rb>", /｜/g);
            // str = str.replace("</rb><rp>(</rp><rt>", /《/g);
            // str = str.replace("</rt><rp>)</rp></ruby>", /》/g);
            str = str.replace(/<ruby><rb>/g, "｜");
            str = str.replace(/<\/rb><rp>\(<\/rp><rt>/g, "《");
            str = str.replace(/<\/rt><rp>\)<\/rp><\/ruby>/g, "》");
            // console.log("decode str: " + str);
            return str;
        }
    }

    getNextChar(line, i){
        // console.log("line, i");
        // console.log(line);
        // console.log(i);
        const char = line.substr(i, 6);
        // 次の文字がルビタグだった場合、ルビタグの後ろの indexOf を返す
        if(char === "<ruby>"){
            const str = line.substr(i);
            // console.log("line.substr(i): " + line.substr(i));
            // console.log("char === ruby, i: " + i);
            // const end = line.indexOf("</ruby>");
            const end = str.indexOf("</ruby>");
            // console.log("end: " + end);
            // const ruby = line.substring(i, end + 7);
            const ruby = str.substr(0, end + 7);
            return ruby.length;
            // return end + 7;
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
        // console.log("p.clientHeight : basicLineHeight");
        // console.log(p.clientHeight + " : " + basicLineHeight);
        // テスト用の<p>に一文字ないしルビタグを追加して行き、超えたらその手前の字の indexOf を返す
        let i = 0;
        let iNext = 0;
        while(iNext < line.length){
            // テスト<p>の高さが2行分以上になったら、1文字か1ルビ前の indexOf を返す
            if(p.clientHeight >= basicLineHeight * 2){
                // line.substr(0, nums[i - 1])
                // console.log("nums[i - 1]: " + nums[i - 1]);
                // console.log("nums:");
                // console.log(nums);
                // console.log(nums[]);
                // console.log("p.innerHTML: " + p.innerHTML);
                // console.log(p.clientHeight);
                // console.log("line: " + line);
                // console.log("line.substr(): " + line.substr(1));
                return nums[i - 1];
                // return iNext - 1;
            } else {
                const next = this.getNextChar(line, iNext);
                // console.log("next: " + next);
                nums.push(iNext);
                // p.innerText += line.substr(i, next);
                p.innerHTML += line.substr(iNext, next);
                console.log("line.substr(iNext, next): " + line.substr(iNext, next))
                i++;
                iNext += next;
                // console.log("i: " + i);
                // console.log("iNext: " + iNext);
            }
        }


        // for(let i = 0; i < line.length; i++){
        //     if(p.clientHeight > basicLineHeight){
        //         // line.substr(0, nums[i - 1])
        //         return nums[i - 1];
        //     } else {
        //         const next = this.getNextChar(line, i);
        //         nums.push(next);
        //         // p.innerText += line.substr(i, next);
        //         p.innerHTML += line.substr(i, next);
        //     }
        // }
        console.log("p.innerText: " + p.innerText);
    }

    // ページの最終行が1行分に収まらない場合、分割して配列で返す
    separateFinalLine(line){
        let p = document.getElementById("scale_p");
        const basicLineHeight = p.clientHeight;
        const str = line.substring(0, this.getExtendMaxChars(line));
        console.log("str: " + str);
        console.log("this.getExtendMaxChars(line): " + this.getExtendMaxChars(line));
        p.innerHTML = str;
        // 通常の最大文字数で 1 行に収まらない場合（特殊ルビなどで）、1 行に収まる文字数を算出
        if(p.clientHeight >= basicLineHeight * 2){
            // console.log("LineJs Over!!");
            // console.log("p.innerText: " + p.innerText);
            // console.log("maxChars: " + maxChars);
            // console.log("maxWidth: " + maxWidth);
            // console.log("fontSize: " + fontSize);
            // console.log("p.clientHeight : basicLineHeight * 2");
            // console.log(p.clientHeight + " : " + basicLineHeight * 2);
            const num = this.getIndexOfOversizedLine(line);
            console.log("num: " + num);
            return [line.substring(0, num), line.substring(num)];
        } else {
            // console.log("HELLOOOOOOOOOO");
            return [str, line.substr(this.getExtendMaxChars(line))];
        }
        // console.log("test p scale: " + p.clientHeight);
        // console.log("p font-size: " + p.style.fontSize);
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
                // console.log(page.clientHeight);
                let p = document.createElement("p");
                p.innerHTML = this.lines[i];
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
        finalP.innerHTML = array[0];
        page.appendChild(finalP);

        console.log("array[0]: " + array[0]);
        console.log("array[1]: " + array[1]);
        // console.log(this.lines[finalLine]);
        // console.log(page.clientHeight);
        // console.log(maxHeight);
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