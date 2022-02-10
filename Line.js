class Line {
    // Before:
    // 　勤務先は大手家電量販店ビックリカメラ｜六出那《ろくでな》支店。無論、正社員などではない。ここに｜《サラリーマン》は｜存在しない《ナッシング》。会社の都合でいつでも｜馘首《クビ》にされる百円ライターさながらの使い捨て｜非正規社員《イレギュラー》である。
    // After:
    // <p>勤務先は大手家電量販店ビックリカメラ</p>
    // <p>｜六出那《ろくでな》支店。無論、正社員などではない。こ</p>
    // <p>こに｜《サラリーマン》は｜存在しない《ナッシング》。会社の</p>
    // <p>都合でいつでも｜馘首《クビ》にされる百円ライターさ</p>
    // <p>ながらの使い捨て｜非正規社員《イレギュラー》である。</p>

    constructor(num, str) {
        this.id = num;
        this.original = str;
        this.lines = [];
        this.evenAllocation = false;
        this.rubyMax = 4; // ルビ漢字の最大文字数
        this.furiganaMax = 60; // フリガナの最大文字数
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
    // 《》をいったん ((( ))) に変換する
    escapeMountBracket() {
        // console.log("this.original in escapeMouuntBracket: ");
        // console.log(this.original);
        let str = this.original;
        while(str.indexOf("｜《") > -1){
            const index = str.indexOf("｜《");
            let strAfterBar = str.substr(index);
            strAfterBar = strAfterBar.replace("｜《", "〈〈");
            strAfterBar = strAfterBar.replace("》", "〉〉");
            str = str.substr(0, index) + strAfterBar;
        }
        // return str;
        this.original = str;
    }

    // 規定文字数オーバーのルビ指定を取得
    getOversizedRuby(str){
        if(str.indexOf("｜") > -1){
            return true;
        } else {
            return null;
        }
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

    // 1行に収まりきらない文字列を、収まるように分割し、<p>タグ内に入れる
    splitLine() {
        // まず、山括弧をそのまま表示する指定（例：｜《ルシファー》）をエスケープする
        // ルビ指定を<ruby>タグ化する（一度<p>タグに放り込んで幅を測定するため）
        // 1行に収まりきらない文章を、<p>タグに放り込んで実測した上で、規定幅に収まるように複数行に分割する
        // 各行に<p>タグを追加し、均等割り付けを施す（最終行以外）
        console.log("Hello World");
        this.escapeMountBracket();
        this.deleteRuby();
        this.convertRuby();
        this.getBackMountBracket();
    }

    test() {
        console.log("Hello World from " + this.id);
        console.log("this.original: " + this.original);
        // this.escapeMountBracket();
        this.splitLine();
        console.log(this.original);
    }
}