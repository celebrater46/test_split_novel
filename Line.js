class Line {
    constructor(num, str) {
        this.id = num;
        this.original = str;
        this.lines = [];
        this.evenAllocation = false;
    }

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
        return str;
    }

    // 1行に収まりきらない文字列を、収まるように分割し、<p>タグ内に入れる
    splitLine() {
        console.log("Hello World");
    }

    test() {
        console.log("Hello World from " + this.id);
        console.log("this.original: " + this.original);
    }
}