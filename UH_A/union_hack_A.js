//キャラの変数
const character = {
    x: 50,            // x座標
    y: 400,           // y座標
    width: 50,        // キャラクターの幅
    height: 100,       // キャラクターの高さ
    hp: 100,           //キャラクターのヒットポイント
    move_x: 0,
    move_y: 0,
    jump_count: 0, //ジャンプ回数の記録
    spear_flag: true, //槍投げ解禁以前かどうか
    image: new Image() // キャラクターの画像
};

const spear = {
    x: character.x + character.width, //槍のx座標
    y: character.y, //槍のy座標
    width: 20, //槍の幅
    height: 10, //槍の高さ
}

const enemy = {
  x: 600, //敵のx座標
  y: 400, //敵のy座標
  width: 100, //敵の幅
  height: 100, //敵の高さ
  image: new Image(), //もし敵も画像使うのであれば利用。不要なら消しても問題なし
};

character.image.src = 'file/chara.png'; // 画像ファイルのパス
let count =0;

const canvas = document.getElementById('first_battle');
const ctx = canvas.getContext('2d');
let existFlag = false;
let t = 0;
let rightFlag = false;
let leftFlag = false;

function character_move() {
    character.x += character.move_x;
    character.y += character.move_y;
    if (character.move_x <0){
        character.move_x += 1;
    }
    else if(character.move_x >0){
        character.move_x -= 1;
    }
    if (character.y < 400
    ){
        character.move_y += 0.5;
    }
    else if(character.y >= 400){
        character.y = 400;
        character.move_y =0;
        character.jump_count = 0; //キャラクターが地面にいるときはジャンプ回数を0に
    }
    if (character.y <0){
        character.move_y = 1;
    }
    if(character.x <0){
        character.move_x=1
    }
    if(character.x>700){
        character.move_x=-1
    }
}
// キャラクターを描画する関数
function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面をクリア
    if(character.hp > 0){
        ctx.drawImage(character.image, character.x, character.y, character.width, character.height); // キャラクターを描画(hpが0以上ならば)
    }

    //下二行、よくあるhpバーの全体表示
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 100, 30);
    
    //hp残量をオレンジで表記
    if(character.hp > 0){
        ctx.fillStyle = "Orange";
        character.hp = Math.max(character.hp, 0);
        ctx.fillRect(0, 0, character.hp, 30);
    }

    //槍の描画。緑色で表記
    if(existFlag & character.hp > 0){
        ctx.fillStyle = "Green";
        ctx.fillRect(spear.x, spear.y, spear.width, spear.height);
    }

    //ゲームオーバー画面
    if(character.hp <= 0){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 900, 500);

        ctx.fillStyle = "white";
        ctx.font = "75px arial black";
        ctx.fillText("Game Over", 150, 250);
        count +=1;
        if(count==1){
        const rink = document.getElementById('s1rink');
        rink.style.display = "inline";
        }
    }

    //以下二行敵の仮表示。
    ctx.fillStyle = "black";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}


//槍の動き関連
function spearMove(){
    if(!existFlag){ //槍がないとき
        //以下槍の発射位置コントロール...よくバグります
        if (character.move_x >= 0) {
            spear.x = character.x + character.width;
        } else {
            spear.x = character.x - 20;
        }
        spear.y = character.y-1000;
        leftFlag = false;
        rightFlag = false;
        t = 0;
    }else if(spear.x >= 750 | spear.y >= 500){
        //槍が範囲外に行ったらの処理。
        existFlag = false;
        spear.x = character.x + character.width;
        spear.y = character.y;
    }else if(existFlag){
        //槍が存在している時の処理
        t += 0.05;
        /**
         * 単なる斜方投射で処理をしてます。
         * 式最初の10は初速度10です。
         * 時間は毎フレーム+0.05されます(変数t)(間違ってたらごめんなさい)
         */
        if(rightFlag){
            spear.x += 10 * Math.cos((45 * Math.PI) / 180) * t;
        }else{
            spear.x -= 10 * Math.cos((45 * Math.PI) / 180) * t;
        }
        spear.y += -10 * (Math.sin((45 * Math.PI) / 180) * t) + (4.9 * (t ** 2));
    }
}

gameLoop(); // ゲームループの開始

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        character.move_x += 10; // 右に移動
    }
    if (event.key === 'ArrowLeft') {
        character.move_x -= 10; // 左に移動
    }
    if (event.key === 'ArrowUp') {
        if ((character.move_y >= 0) & (character.jump_count == 1)) {
          character.y += 10; // 落下中の二段ジャンプはバウンドっぽい工夫加えたい
          character.move_y -= 10.5;
          character.jump_count += 1;
        }else if ((character.move_y >= 0) & (character.jump_count < 3)) {
          character.move_y -= 10; // 上に移動
          character.jump_count += 1;
        }
    }
    if (event.key === " " & character.spear_flag === true){
        if(character.x-enemy.x <= 0 & existFlag == false){
            spear.y = character.y;
            rightFlag = true;//右に飛ばす時
        }else if ((character.x-enemy.x > 0) & (existFlag == false)) {
            spear.y = character.y;
            leftFlag = true;//左に飛ばす時
        }
        existFlag = true;
    }
});


//矩形同士の判定を使って判定するだけ
function checkCollision(character, enemy){
    if (character.x <= enemy.x + enemy.width && enemy.x <= character.x + character.width) {
        if (character.y <= enemy.y + enemy.height && enemy.y <= character.y + character.height) {
            return true
        }
    }
    return false
}


//checkCollisionメソッドを使ってHPを判定する
function reduceHP(){
    if(checkCollision(character, enemy)){
        character.hp -= 10; //10ダメージは仮置き。
    }
    if(checkCollision(spear, enemy)){
        //多分もっといいやり方はあると思います。敵が一体だけならば多分これでも...?
        count +=1;
        if(count==1){
        const rink = document.getElementById('s2rink');
        rink.style.display = "inline";
        }
        enemy.x = -100000;
        enemy.y = 100000;
        existFlag = false;
    }
}

/**
 * 敵の移動に関するメソッド
 * x座標しか見ていないです。
 */
function enemyMove(){
    if(enemy.x > character.x){
        enemy.x -= 1;
    }else{
        enemy.x += 1;
    }
}

// ゲームループで描画を繰り返す
function gameLoop() {
    character_move();
    drawCharacter();
    spearMove();
    enemyMove();
    reduceHP();
    requestAnimationFrame(gameLoop);
}