"use strict";

const CANVAS = document.getElementById("canvas")
const CONTEXT = CANVAS.getContext("2d");

const FRAME_RATE = 60;

var frameCount = 0;

var cameraDistance = 10;
var canvasDistance = 7;

var stop = false;

//回転速度
var rotSpeed = 1;

//立方体の8つの頂点を立方体の中心を0, 0, 0とした相対座標
const CORNERS = [
    new Vector(1, 1, -1),
    new Vector(1, 1, 1),
    new Vector(1, -1, 1),
    new Vector(1, -1, -1),
    new Vector(-1, -1, -1),
    new Vector(-1, 1, -1),
    new Vector(-1, 1, 1),
    new Vector(-1, -1, 1),
];

//X,Y,Zとその反対方向にある面上にある頂点
const X_FACE = [CORNERS[3], CORNERS[2], CORNERS[1], CORNERS[0]];
const X_PRIME = [CORNERS[4], CORNERS[5], CORNERS[6], CORNERS[7]];
const Y_FACE = [CORNERS[0], CORNERS[1], CORNERS[6], CORNERS[5]];
const Y_PRIME = [CORNERS[2], CORNERS[3], CORNERS[4], CORNERS[7]];
const Z_FACE = [CORNERS[1], CORNERS[2], CORNERS[7], CORNERS[6]];
const Z_PRIME = [CORNERS[5], CORNERS[4], CORNERS[3], CORNERS[0]];

const FACES = [X_FACE, X_PRIME, Y_FACE, Y_PRIME, Z_FACE, Z_PRIME];

//背景色 chromaが有効な場合は使用されない
var backgroundColor = rgbToHex(parseInt(Math.random() * 256), parseInt(Math.random() * 256), parseInt(Math.random() * 256)).toUpperCase();

var cubeColor = "#FFFFFF";
var strokeColor = "#000000";

var stroke = false;

//chroma(虹色のグラデーション)が有効かどうか
var chroma = false;

var chromaRed = 0;
var chromaGreen = 0;
var chromaBlue = 0;

//chromaが有効なとき何色から何色に変化しているかを表す(0~6)
//red->yellow->green->cyan->blue->magenta->red...
var gradationMode = 0;

//キューブの回転軸
const axis = new Vector(0, 1, 0);

//毎フレームごとにdraw関数を呼ぶ
setInterval(draw, 1000 / FRAME_RATE);

//背景色を変更する
function background(color) {
    document.body.style.background = `linear-gradient(${addBright(color, 75)}, ${addBright(color, -75)}, ${addBright(color, 75)})`;
}

//chromaモードを切り替える
function setChroma(flag) {
    if (flag) {
        gradationMode = 0;
        chromaRed = 255;
        chromaGreen = 0;
        chromaBlue = 0;
    } else { 
        var chromaText = document.getElementById("chroma-text");
        chromaText.style.background = "";
        chromaText.style.webkitBackgroundClip = "";
        chromaText.style.webkitTextFillColor = "";
        background(backgroundColor);
    }
    chroma = flag;

}

//ヘロンの公式を使って三角形の面積を求める
function heron(a, b, c) {
    var s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

//入力されたnumがmin以下だった場合minを返し、max以上だった場合maxを返す
function clamp(num, min, max) { 
    return Math.max(min, Math.min(max, num));
}

//カメラ側を光源とし、面の明るさを計算する
function calcBright(vec1, vec2, vec3, vec4) {
    var vertexes = [vec1, vec2, vec3, vec4].map(vec => vec.clone().setZ(0));

    //正射影を計算する
    var a = vertexes[0].distance(vertexes[1]);
    var b = vertexes[1].distance(vertexes[2]);
    var c = vertexes[2].distance(vertexes[3]);
    var d = vertexes[3].distance(vertexes[0]);
    var e = vertexes[0].distance(vertexes[2]);
    var area = heron(a, b, e) + heron(c, d, e);

    //調整を行って値を返す
    return Math.min(0.9, area / 10 + 0.5);
}

//3次元座標をキャンバスに描くためのxとyだけの2次元座標に変換する
function convert2D(local) {
    var scale = canvasDistance / local.clone().setZ(cameraDistance + local.z).length;
    var x = local.x * scale;
    var y = local.y * scale;
    return new Vector(x, y, 0);
}

//16進数カラーコードかどうか確かめる
function isHexColorCode(colorCode) { 
    var matchResult;
    return (matchResult = colorCode.match(/#[0-9A-F]{6}/i)) && matchResult[0] === colorCode;
}

//16進数カラーコードをRGBに変換する
function hexToRGB(colorCode) { 
    if (isHexColorCode(colorCode)) { 
        return colorCode.match(/[0-9A-F]{2}/gi).map(hex => parseInt(hex, 16));
    }
}

//RGBを16進数カラーコードに変換する
function rgbToHex(r, g, b) {
    
    function toHex(i) { 
        i = Math.round(clamp(i, 0, 255));
        if (i < 16) {
            return `0${Number(i).toString(16)}`;
        } else { 
            return Number(i).toString(16);
        }
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

//色に明るさを足す
function addBright(color, bright) { 
    if (isHexColorCode(color)) { 
        var rgb = hexToRGB(color).map(i => Math.min(255, i + bright));
        return rgbToHex(rgb[0], rgb[1], rgb[2]);
    }
    return "#000000";
}

//色合いを取得
function getHue(color) { 
    var rgb;
    if (isHexColorCode(color) && (rgb = hexToRGB(color))) { 
        var min = Math.min(rgb[0], rgb[1], rgb[2]);
        var max = Math.max(rgb[0], rgb[1], rgb[2]);
        if (min == max) {
            return 0;
        }
        var hue = 0;
        if (max == rgb[0]) {
            hue = (rgb[1] - rgb[2]) / (max - min);
        } else if (max == rgb[1]) {
            hue = 2 + (rgb[2] - rgb[0]) / (max - min);
        } else {
            hue = 4 + (rgb[0] - rgb[1]) / (max - min);
        }
        hue *= 60;
        if (hue < 0) {
            hue += 360;
        }
        return Math.round(hue);
    }
}

//1フレームごとの処理
function draw() {
    if (!stop) {
        frameCount++;
    }

    //キャンバスのサイズをウィンドウのサイズに合わせて変更する
    CANVAS.width = document.body.clientWidth * 0.389;
    CANVAS.height = CANVAS.width;

    //UIの高さがキャンバスより低い場合に高さをそろえる
    var propertiesBackground = document.getElementById("properties-background");
    var propertiesHeight = parseFloat(getComputedStyle(propertiesBackground).height);
    if (propertiesHeight < CANVAS.height) {
        propertiesBackground.style.height = `${CANVAS.height - 1}px`;
    } else {
        propertiesBackground.style.height = "auto";
    }
    var propertyName = Array.prototype.slice.call(document.getElementsByClassName("property-name"));
    var propertyTag = Array.prototype.slice.call(document.getElementsByClassName("property-tag"));
    var buttons = Array.prototype.slice.call(document.getElementsByTagName("button"));
    var propertyItemsArr = Array.prototype.slice.call(document.getElementsByClassName("property-items"));
    var texts = propertyName.concat(propertyTag);
    if (chroma) {
        //チェックボックスのテキストと背景のスタイル、キューブの色を変化させる
        if (gradationMode == 0 && chromaGreen < 255 && (chromaGreen += 2.55) >= 255) {
            gradationMode++;
        } else if (gradationMode == 1 && chromaGreen >= 255 && (chromaRed -= 2.55) <= 0) {
            gradationMode++;
        } else if (gradationMode == 2 && chromaBlue < 255 && (chromaBlue += 2.55) >= 255) {
            gradationMode++;
        } else if (gradationMode == 3 && chromaBlue >= 255 && (chromaGreen -= 2.55) <= 0) {
            gradationMode++;
        } else if (gradationMode == 4 && chromaRed < 255 && (chromaRed += 2.55) >= 255) {
            gradationMode++;
        } else if (gradationMode == 5 && chromaRed >= 255 && (chromaBlue -= 2.55) <= 0) {
            gradationMode = 0;
        }
        var color = rgbToHex(chromaRed, chromaGreen, chromaBlue);
        //色合いを取得し、グラデーションを背景をチェックボックスのテキストに適用する
        var hue = getHue(color);
        var chromaText = document.getElementById("chroma-text");
        chromaText.style.background = `linear-gradient(270deg, hsl(${(hue + 315) % 360}, 100%, 60%), hsl(${(hue + 270) % 360}, 100%, 60%), hsl(${(hue + 225) % 360}, 100%, 60%), hsl(${(hue + 180) % 360}, 100%, 60%), hsl(${(hue + 135) % 360}, 100%, 60%), hsl(${(hue + 90) % 360}, 100%, 60%), hsl(${(hue + 45) % 360}, 100%, 60%), hsl(${hue}, 100%, 60%))`;
        chromaText.style.webkitBackgroundClip = "text";
        chromaText.style.webkitTextFillColor = "transparent";
        document.body.style.background = `radial-gradient(circle at 100% 0px, hsl(${(hue + 90) % 360}, 100%, 60%), hsl(${(hue + 45) % 360}, 100%, 60%), hsl(${hue}, 100%, 60%))`;
        texts.forEach(text => text.style.color = "black");
        buttons.forEach(button => {
            button.style.color = "black";
            button.style.border = "2px solid black";
        });
        propertyItemsArr.forEach(propertyItems => propertyItems.style.border = "2px solid black");
    } else {
        background(backgroundColor);

        //背景の明るさに合わせて文字の色を変更して見やすくする
        var rgb = hexToRGB(backgroundColor);
        if (Math.max(rgb[0], rgb[1], rgb[2]) / 255 < 0.6) {
            texts.forEach(text => text.style.color = "white");
            buttons.forEach(button => {
                button.style.color = "white";
                button.style.border = "2px solid white";
            });
            propertyItemsArr.forEach(propertyItems => propertyItems.style.border = "2px solid white");
        } else {
            texts.forEach(text => text.style.color = "black");
            buttons.forEach(button => {
                button.style.color = "black";
                button.style.border = "2px solid black";
            });
            propertyItemsArr.forEach(propertyItems => propertyItems.style.border = "2px solid black");
        }
    }

    //座標軸をキャンバスの中心にする
    CONTEXT.save();
    CONTEXT.translate(CANVAS.width / 2, CANVAS.height / 2);
    if (!stop) { 
        CORNERS.forEach(vec => vec.rotate(axis, rotSpeed));
    }
    FACES.forEach(face => {

        //浮遊感を出す
        face = face.map(vec => vec.clone().add(new Vector(0, Math.sin((frameCount + 90) % 360 * Math.PI / 180), 0)));

        //面の表裏判定
        var center = new Vector((face[0].x + face[2].x) / 2, (face[0].y + face[2].y) / 2, (face[0].z + face[2].z) / 2);
        var vec1 = face[1].clone().subtract(face[0]);
        var vec2 = face[2].clone().subtract(face[0]);
        if (0 < center.clone().setZ(center.z + 10).dotProduct(vec1.crossProduct(vec2))) {

            //座標を2次元に変換して面を描く
            CONTEXT.beginPath();
            var scale = Math.sqrt(CANVAS.width ** 2 + CANVAS.height ** 2) / 6;
            var pos = convert2D(face[0]).multiply(scale);
            CONTEXT.moveTo(pos.x, pos.y);
            for (var i = 1; i < 4; i++) {
                pos = convert2D(face[i]).multiply(scale);
                CONTEXT.lineTo(pos.x, pos.y);
            }
            CONTEXT.closePath();
            CONTEXT.fillStyle = chroma ? rgbToHex(chromaRed, chromaGreen, chromaBlue) : cubeColor;
            CONTEXT.fill();
            CONTEXT.fillStyle = `rgba(0, 0, 0, ${(1 - calcBright(face[0], face[1], face[2], face[3]))})`;
            CONTEXT.fill();
            if (stroke) {
                CONTEXT.strokeStyle = strokeColor;
                CONTEXT.lineWidth = 1;
                CONTEXT.stroke();
            }
        }
    });
    //座標軸を元に戻す
    CONTEXT.restore();
}