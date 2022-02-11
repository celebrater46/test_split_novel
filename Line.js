class Line {
    // Before:
    // 　勤務先は大手家電量販店ビックリカメラ｜六出那《ろくでな》支店。無論、正社員などではない。ここに｜《サラリーマン》は｜存在しない《ナッシング》。会社の都合でいつでも｜馘首《クビ》にされる百円ライターさながらの使い捨て｜非正規社員《イレギュラー》である。
    // After:
    // <p>勤務先は大手家電量販店ビックリカメラ</p>
    // <p><ruby><rb>六出那</rb><rp>(</rp><rt>ろくでな》支店。無論、正社員などではない。こ</p>
    // <p>こに<ruby><rb></rb><rp>(</rp><rt>サラリーマン</rt><rp>)</rp></ruby>は<ruby><rb>存在しない</rb><rp>(</rp><rt>ナッシング</rt><rp>)</rp></ruby>。会社の</p>
    // <p>都合でいつでも<ruby><rb>馘首</rb><rp>(</rp><rt>クビ</rt><rp>)</rp></ruby>にされる百円ライターさ</p>
    // <p>ながらの使い捨て<ruby><rb>非正規社員</rb><rp>(</rp><rt>イレギュラー</rt><rp>)</rp></ruby>である。</p>

    constructor(num, str) {
        this.id = num;
        this.original = str;
        this.lines = [];
        this.evenAllocation = false;
        this.rubyMax = 30; // ルビ漢字の最大文字数
        this.furiganaMax = 60; // フリガナの最大文字数
        this.maxChars = 40; // 1行あたりの最大文字数
        this.maxWidth = 1000; // 1行あたりの最大幅（px）
    }

    // １２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９｜堕天男《ルシファー》。

    // エスケープした山括弧を元に戻す
    getBackMountBracket() {
        let str = this.original;
        str = str.replace("〈〈", "《");
        str = str.replace("〉〉", "》");
        this.original = str;
    }

    // 「｜《」など、山括弧をそのまま使いたい場合のエスケープ処理
    // 《》をいったん〈〈　〉〉に変換する
    escapeMountBracket() {
        let str = this.original;
        while(str.indexOf("｜《") > -1){
            const index = str.indexOf("｜《");
            let strAfterBar = str.substr(index);
            strAfterBar = strAfterBar.replace("｜《", "〈〈");
            strAfterBar = strAfterBar.replace("》", "〉〉");
            str = str.substr(0, index) + strAfterBar;
        }
        this.original = str;
    }

    // ルビが規定文字数を超える場合、ルビを消滅させる
    deleteRuby() {
        let tempStr = this.original;
        while(tempStr.indexOf("｜") != -1){
            const bar = tempStr.indexOf("｜");
            const start = tempStr.indexOf("《");
            const end = tempStr.indexOf("》");
            const ruby = tempStr.substring(start, end + 1);
            if(start - bar - 1 > this.rubyMax || end - start - 1 > this.furiganaMax){
                tempStr = tempStr.replace("｜", "");
                tempStr = tempStr.replace(ruby, "");
            } else {
                // 規定文字内ならルビ指定をエスケープ
                tempStr = tempStr.replace("｜", "##");
                console.log("const ruby: " + ruby);
                console.log("const ruby.substring: " + ruby.substring(1, ruby.length - 1));
                tempStr = tempStr.replace(ruby, "＜＜" + ruby.substring(1, ruby.length - 1) + "＞＞");
            }
        }
        // エスケープした記号を戻す
        tempStr = tempStr.replace(/##/g, "｜");
        tempStr = tempStr.replace(/＜＜/g, "《");
        tempStr = tempStr.replace(/＞＞/g, "》");
        this.original = tempStr;
    }

    // ｜堕天男《ルシファー》 -> <ruby><rb>堕天男</rb><rp>(</rp><rt>ルシファー</rt><rp>)</rp></ruby>
    convertRuby() {
        let str = this.original;
        if(str.indexOf("｜") > -1 && str.indexOf("《") > -1 && str.indexOf("》") > -1){
            str = str.replace(/｜/g, "<ruby><rb>");
            str = str.replace(/《/g, "</rb><rp>(</rp><rt>");
            str = str.replace(/》/g, "</rt><rp>)</rp></ruby>");
            this.original = str;
        }
    }

    // 一行に収まらない文字列の最後から2番めの文字の index を取得する
    // 最後が </ruby> だった場合、<ruby> の先頭が何文字めかを数字で返す
    getPreviousBrPoint(line) {
        if(line.substr(-1) === ">" && line.match(/<ruby>/) !== null){
            let str = line;
            let index = -1;
            while(str.match(/<ruby>/) !== null){
                index = str.indexOf("<ruby>");
                str = str.replace("<ruby>", "<xxxx>");
            }
            return index;
        } else {
            return line.length - 1;
        }
    }

    checkStrWithinLine(str){
        const p = document.getElementById("stealth");
        p.innerText = str;
        if(p.clientWidth < this.maxWidth){
            return true;
        } else {
            return false;
        }
    }

    // 一行に収まらない文を分割する
    // ruby タグに変換した後の文章を使用（そうしないと正確な width が得られない）
    separateLine(prevChars) {
        // 最初は引数に this.original を入れる。
        let str = prevChars;
        let index = -1;
        while(this.checkStrWithinLine(str) === false){
            // ステルス<p>に表示して規定サイズオーバーなら 1 文字ずつ減らす
            index = this.getPreviousBrPoint(str);
            str = str.substr(0, index);
        }
        this.lines.push("<p>" + str + "</p>");
        if(index > -1){
            this.separateLine(prevChars.substr(index));
        }
    }

    test() {
        console.log("Hello World from " + this.id);
        console.log("this.original: " + this.original);
        this.escapeMountBracket();
        this.deleteRuby();
        this.convertRuby();
        this.getBackMountBracket();
        this.separateLine(this.original);
        console.log(this.lines);
    }
}