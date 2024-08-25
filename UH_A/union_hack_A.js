const character = {
    x: 50,            // x座標
    y: 100,           // y座標
    width: 50,        // キャラクターの幅
    height: 100,       // キャラクターの高さ
    move_x: 0,
    move_y: 0,
    image: new Image() // キャラクターの画像
};

character.image.src = 'file/test.png'; // 画像ファイルのパス


const canvas = document.getElementById('first_battle');
const ctx = canvas.getContext('2d');

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
    else if(character.y > 400){
        character.y = 400;
        character.move_y =0;
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
    ctx.drawImage(character.image, character.x, character.y, character.width, character.height); // キャラクターを描画
}

// ゲームループで描画を繰り返す
function gameLoop() {
    character_move();
    drawCharacter();

    requestAnimationFrame(gameLoop);
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
        if(character.move_y>=0){
        character.move_y -= 10; // 上に移動
        }
        else {
            character.move_y -= 10; // 落下中の二段ジャンプはバウンドっぽい工夫加えたい
        }
    }
});