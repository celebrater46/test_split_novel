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

    // 横幅が変化するルビタグかどうかの判別
    isOversizedRuby(str){
        const bar = str.indexOf("｜");
        if(bar > -1){
            const start = str.indexOf("《");
            const end = str.indexOf("》");
            const rb = start - bar - 1;
            const rt = end - start - 1;
            if(rt > rb * 2) {
                return true;
            }
        }
        return false;
    }

    testRubyWidth(str){
        const p = document.getElementById("stealth");
        p.innerHTML = this.encodeRuby(str);
        return p.clientWidth;
    }

    // 行の中にルビが存在した場合、新しい改行ポイントを数字で返す
    // getBreakPointWithRuby(line, max){
    //     const ruby = line.indexOf("<ruby>");
    //     if(ruby > -1 && ruby < max){
    //         let num = ruby;
    //         let str = line.substring(0, ruby);
    //         while(this.checkStrWithinLine(str)){
    //             num +
    //         }
    //     } else {
    //         return max;
    //     }
    // }

    // separateLine(line) {
    //     const max = this.getMaxChars();
    //     const index = this.getBreakPointWithRuby(line, max);
    //     // const ruby = line.indexOf("<ruby>");
    //     this.lines.push(line.substring(0, index));
    //     if(line.length > index){
    //         this.separateLine(line.substring(index));
    //     }
    // }


    // 行の中にルビが存在する場合、最大文字数を<ruby>タグとフリガナ分延長する（return は加算値）


    // ルビ文字の幅を予め計測して出した方がいいんじゃない？


    // 漢字1文字に対してルビ2文字以下の場合、横幅の変化はない。


    // 課題。ルビタグまで文字数に含まれてしまうので、最大文字数で substr する場合、
    // ルビタグが含まれていると本来のはるか手前の位置で改行されてしまうバグの解決

    // 一行に収まらない文を分割する
    // ruby タグに変換した後の文章を使用（そうしないと正確な width が得られない）


    test() {
        // console.log("Hello World from " + this.id);
        // console.log("this.original: " + this.original);
        // this.escapeMountBracket();
        // this.original = this.deleteRuby(this.original, true);
        // this.original = this.encodeRuby(this.original);
        // this.getBackMountBracket();
        // this.separateLine(this.original);
        // console.log(this.lines);
        // console.log(this.testRubyWidth("｜堕天男《ルシファー》"));
        console.log(this.isOversizedRuby("｜堕天男《ルシファードル》"));
    }
}