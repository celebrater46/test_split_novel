class OldLine {
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
        // this.rubyMax = 30; // ルビ漢字の最大文字数
        // this.furiganaMax = 60; // フリガナの最大文字数
        // this.maxChars = 40; // 1行あたりの最大文字数
        // this.maxWidth = 1000; // 1行あたりの最大幅（px）
    }

    // １２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９｜堕天男《ルシファー》。

    getFontSize() {
        const p = document.querySelector("p");
        const size = window.getComputedStyle(p).getPropertyValue('font-size');
        return parseFloat(size); // px
    };

    getMaxChars() {
        const fontSize = this.getFontSize();
        return Math.floor(maxWidth / fontSize);
    }

    // エスケープした山括弧を元に戻す
    getBackMountBracket() {
        let str = this.original;
        str = str.replace(/〈〈/g, "《");
        str = str.replace(/〉〉/g, "》");
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

    // ルビが規定文字数を超える場合、ルビを消滅させる（bool = false なら、すべてのルビを消滅させる）
    deleteRuby(line, bool) {
        let tempStr = line;
        while(tempStr.indexOf("｜") != -1){
            const bar = tempStr.indexOf("｜");
            const start = tempStr.indexOf("《");
            const end = tempStr.indexOf("》");
            const ruby = tempStr.substring(start, end + 1);
            if(bool === false || start - bar - 1 > rubyMax || end - start - 1 > furiganaMax){
                tempStr = tempStr.replace("｜", "");
                tempStr = tempStr.replace(ruby, "");
            } else {
                // 規定文字内ならルビ指定をエスケープ
                tempStr = tempStr.replace("｜", "##");
                // console.log("const ruby: " + ruby);
                // console.log("const ruby.substring: " + ruby.substring(1, ruby.length - 1));
                tempStr = tempStr.replace(ruby, "＜＜" + ruby.substring(1, ruby.length - 1) + "＞＞");
            }
        }
        // エスケープした記号を戻す
        tempStr = tempStr.replace(/##/g, "｜");
        tempStr = tempStr.replace(/＜＜/g, "《");
        tempStr = tempStr.replace(/＞＞/g, "》");
        return tempStr;
    }

    // ｜堕天男《ルシファー》 -> <ruby><rb>堕天男</rb><rp>(</rp><rt>ルシファー</rt><rp>)</rp></ruby> 10+19+22+フリガナ
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
            str = str.replace("<ruby><rb>", /｜/g);
            str = str.replace("</rb><rp>(</rp><rt>", /《/g);
            str = str.replace("</rt><rp>)</rp></ruby>", /》/g);
            return str;
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

    // Pタグに文字を入れてみて最大幅より小さければ true
    checkStrWithinLine(str){
        const p = document.getElementById("stealth");
        p.innerHTML = str;
        if(p.clientWidth < maxWidth){
            return true;
        } else {
            return false;
        }
    }

    // ルビタグとフリガナを除いた文字数を計測
    // countCharsExceptRuby(line) {
    //     let str = this.decodeRuby(line);
    //     while(str.indexOf("《") > -1){
    //         const start = str.indexOf("《");
    //         const end = str.indexOf("》");
    //         const rt = str.substring(start, end + 1);
    //         str = str.replace(rt, "");
    //     }
    //     return str.length;
    // }

    // 行の中にルビが存在する場合、最大文字数を<ruby>タグとフリガナ分延長する（return は加算値）
    getExtendMaxChars(line) {
        const max = this.getMaxChars();
        let num = 0;
        let str = "";
        console.log(line);
        if(line.indexOf("<ruby>") > -1){
            // console.log("hello");
            str = this.decodeRuby(line);
            while(str.indexOf("｜") > -1 && str.indexOf("｜") < max){
                // ルビひとつにつき、51 + フリガナ文字数 を追加
                // const tempStr = str.substring(0, str.indexOf("｜"));
                // console.log("hello");
                // const bar = str.indexOf("｜");
                const start = str.indexOf("《");
                const end = str.indexOf("》");
                // num += bar; // ルビより前の文字数
                num += end - start - 1; // ルビ漢字の文字数
                num += 51; // <ruby><rb></rb><rp>(</rp><rt></rt><rp>)</rp></ruby>
                str = str.replace("｜", "‖");
            }
        }
        return max + num;
    }

    // 課題。ルビタグまで文字数に含まれてしまうので、最大文字数で substr する場合、
    // ルビタグが含まれていると本来のはるか手前の位置で改行されてしまうバグの解決

    // 一行に収まらない文を分割する
    // ruby タグに変換した後の文章を使用（そうしないと正確な width が得られない）
    separateLine(line) {
        // 最初は引数に this.original を入れる。
        // const maxChars = this.getMaxChars();
        const maxChars = this.getExtendMaxChars(line); // 最大文字数＋ルビ
        // const noRuby = this.deleteRuby(line);
        // const threeChars = noRuby.substr(maxChars - 3, 3); // 最大文字数手前の3文字
        // console.log("maxChars: " + maxChars);
        let str = line.substring(0, maxChars);
        // console.log("str: " + str);
        let index = maxChars;
        while(this.checkStrWithinLine(str) === false){
            // ステルス<p>に表示して規定サイズオーバーなら 1 文字ずつ減らす
            index = this.getPreviousBrPoint(str);
            str = str.substr(0, index);
            console.log("Hello");
        }
        this.lines.push("<p>" + str + "</p>");
        const nextStr = line.substring(index + 1);
        if(nextStr.length > 0){
            this.separateLine(nextStr);
        }
    }

    test() {
        // console.log("Hello World from " + this.id);
        // console.log("this.original: " + this.original);
        this.escapeMountBracket();
        this.original = this.deleteRuby(this.original, true);
        this.original = this.encodeRuby(this.original);
        this.getBackMountBracket();
        this.separateLine(this.original);
        console.log(this.lines);
        // const encoded = this.encodeRuby(this.original);
        // console.log(this.getExtendMaxChars(encoded));
        // console.log(maxWidth);
    }
}