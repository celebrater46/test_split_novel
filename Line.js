class Line {
    constructor(num, str) {
        this.id = num;
        this.original = str;
        this.lines = [];
        this.evenAllocation = false;
        this.rubyMax = 30; // ルビ漢字の最大文字数
        this.furiganaMax = 60; // フリガナの最大文字数
    }

    // 全体の流れ
    // まず、山括弧をそのまま表示する指定（例：｜《ルシファー》）をエスケープする
    // ルビ指定を<ruby>タグ化する（一度<p>タグに放り込んで幅を測定するため）
    // 1行に収まりきらない文章を、<p>タグに放り込んで実測した上で、規定幅に収まるように複数行に分割する
    // 各行に<p>タグを追加し、均等割り付けを施す（最終行以外）

    // エスケープした山括弧を元に戻す
    getBackMountBracket(line) {
        let str = line;
        str = str.replace("(((", "《");
        str = str.replace(")))", "》");
        return str;
    }

    // 「｜《」など、山括弧をそのまま使いたい場合のエスケープ処理
    // 《》をいったん ((( ))) に変換する
    escapeMountBracket() {
        let str = this.original;
        while(str.indexOf("｜《") > -1){
            const index = str.indexOf("｜《");
            let strAfterBar = str.substr(index);
            strAfterBar = strAfterBar.replace("｜《", "(((");
            strAfterBar = strAfterBar.replace("》", ")))");
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
            const start = tempStr.indexOf("《");
            const end = tempStr.indexOf("》");
            const ruby = tempStr.substring(start, end + 1);
            tempStr = tempStr.replace("｜", "");
            tempStr = tempStr.replace(ruby, "");
        }
        // return tempStr;
        this.original = tempStr;
    }

    // 1行に収まりきらない文字列を、収まるように分割し、<p>タグ内に入れる
    splitLine() {
        console.log("Hello World");
    }

    test() {
        console.log("Hello World from " + this.id);
        console.log("this.original: " + this.original);
        // this.escapeMountBracket();
        this.deleteRuby();
        console.log(this.original);
    }
}