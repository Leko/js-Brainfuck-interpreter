(function(code) {
  "use strict";

  // １文字取り出す
  function getToken() {
    return code[ip];
  }

  function isntJump(t) {
    // ループによるジャンプが行われない条件
    // '[',']'以外、もしくは'['だけどデータが0のとき、もしくは']'だけど0以外のとき
    return ( t !== '[' && t !== ']' ) || t === '[' && data[dp] != 0 || t === ']' && data[dp] == 0;
  }

  function execute() {
    var out = '',
        token = '';
    while ( ip < len ) {
      token = getToken();
      switch(token) {
        // increment: intaraction pointer
        case '>':
          dp++;
          break;

        // decrement: intaraction pointer
        case '<':
          dp--;
          break;

        // increment: data value
        case '+':
          data[dp]++;
          break;

        // decrement: data value
        case '-':
          data[dp]--;
          break;

        // output
        case '.':
          out += String.fromCharCode(data[dp]);
          break;

        // input
        case ',':
          // 未実装
          break;

        // loop start
        case '[':
          // interaction pointerを記憶
          gotos.push(ip);
          if ( data[dp] == 0 ) {
            // 対応する括弧まで読み飛ばす
            var cp = [];
            while (true) {
              var t = getToken();
              if ( t === ']' ) {
                cp.pop();
                if ( cp.length === 0 ) {
                  break;    // []の入れ子が無くなったら脱出
                }
              } else if ( t === '[' ) {
                cp.push(t); // []が入れ子になっていたらpush
              }
              ip++;
            }
          }
          break;

        // loop end
        case ']':
          jump = gotos.pop();
          if ( data[dp] != 0 ) {
            ip = jump;  // 継続条件ならループの先頭に戻る
          }
          break;
      }
      // ループによるジャンプをしないなら
      if ( isntJump(token) ) {
        ip++;
      }
    }
    return out;
  }

  var DATA_SIZE = 30000,
      output = '',
      data = [],
      gotos = [],    // loopの復帰に使用
      jump,          // loopの復帰用pointer
      len,
      ip = 0,        // interaction pointer
      dp = 0,        // data pointer
      n = 0;

  // コードの空白を削除して長さを記録
  code = code.replace(/\s/g, '');
  len = code.length;

  // データを0で初期化
  while ( n++ < DATA_SIZE ) {
    data.push(0);
  }

  // コードの最期まで実行
  output = execute();

  console.log(output);

})(require("fs").readFileSync("/dev/stdin", "utf8"));
