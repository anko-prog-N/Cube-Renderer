var cubeColorPalette = document.getElementById("cube-color-palette");
var cubeColorCode = document.getElementById("cube-color-code");
//ブラウザの戻るボタンなどを使用してページに移動してきたときに初期化できないので遅延を入れる
setTimeout(() => {
    cubeColorPalette.value = cubeColor;
    cubeColorCode.value = cubeColor;
}, 10);
cubeColorPalette.oninput = () => {
    cubeColorCode.value = cubeColorPalette.value.toUpperCase();
    cubeColor = cubeColorCode.value;
}
cubeColorCode.addEventListener("change", () => {
    if (isHexColorCode(cubeColorCode.value)) {
        cubeColorPalette.value = cubeColorCode.value;
        cubeColor = cubeColorCode.value;
        cubeColorCode.value = cubeColor.toUpperCase();
    } else {
        cubeColorCode.value = cubeColor.toUpperCase();
    }
});

var strokeColorPalette = document.getElementById("stroke-color-palette");
var strokeColorCode = document.getElementById("stroke-color-code");
var strokeCheckbox = document.getElementById("stroke-checkbox");
setTimeout(() => {
    strokeColorPalette.value = strokeColor;
    strokeColorCode.value = strokeColor;
    strokeCheckbox.checked = stroke;
}, 10);
strokeColorPalette.oninput = () => {
    strokeColorCode.value = strokeColorPalette.value.toUpperCase();
    strokeColor = strokeColorCode.value;
}
strokeColorCode.addEventListener("change", () => {
    if (isHexColorCode(strokeColorCode.value)) {
        strokeColorPalette.value = strokeColorCode.value;
        strokeColor = strokeColorCode.value;
        strokeColorCode.value = strokeColor.toUpperCase();
    } else {
        strokeColorCode.value = strokeColor.toUpperCase();
    }
});
strokeCheckbox.oninput = () => {
    stroke = strokeCheckbox.checked;
}

var backgroundColorPalette = document.getElementById("background-color-palette");
var backgroundColorCode = document.getElementById("background-color-code");
var chromaCheckbox = document.getElementById("chroma-checkbox");
setTimeout(() => {
    backgroundColorPalette.value = backgroundColor;
    backgroundColorCode.value = backgroundColor;
    chromaCheckbox.checked = chroma;
}, 10);
backgroundColorPalette.oninput = () => {
    backgroundColorCode.value = backgroundColorPalette.value.toUpperCase();
    backgroundColor = backgroundColorCode.value;
}
backgroundColorCode.addEventListener("change", () => {
    if (isHexColorCode(backgroundColorCode.value)) {
        backgroundColorPalette.value = backgroundColorCode.value;
        backgroundColor = backgroundColorCode.value;
        backgroundColorCode.value = backgroundColor.toUpperCase();
    } else {
        backgroundColorCode.value = backgroundColor.toUpperCase();
    }
});
chromaCheckbox.oninput = () => {
    setChroma(chromaCheckbox.checked);
}

var rotSpeedSlider = document.getElementById("rot-speed-slider");
var rotSpeedInput = document.getElementById("rot-speed-input");
setTimeout(() => {
    rotSpeedSlider.value = rotSpeed * 100;
    rotSpeedInput.value = Math.floor(rotSpeed * 100) / 100;
}, 10);
rotSpeedSlider.oninput = () => {
    rotSpeed = rotSpeedSlider.value / 100;
    rotSpeedInput.value = rotSpeedSlider.value / 100;
}
//typeをnumberにすると入力完了時に値取得がうまくいかなかったのでtextにして少し強引に数値を取得している
rotSpeedInput.addEventListener("change", () => {
    var value;
    if (!Number.isNaN(value = Number(rotSpeedInput.value))) {
        rotSpeedInput.value = clamp(value, 0, 10);
        rotSpeed = rotSpeedInput.value;
        rotSpeedSlider.value = rotSpeedInput.value * 100;
    } else { 
        rotSpeedInput.value = rotSpeed;
    }
})

var rotYSlider = document.getElementById("rot-y-slider");
var rotYInput = document.getElementById("rot-y-input");
setTimeout(() => {
    rotYSlider.value = axis.rotY * 100;
    rotYInput.value = Math.floor(axis.rotY * 100) / 100;
}, 10);
rotYSlider.oninput = () => {
    axis.rotY = rotYSlider.value / 100;
    rotYInput.value = rotYSlider.value / 100;
}
rotYInput.addEventListener("change", () => {
    var value;
    if (!Number.isNaN(value = Number(rotYInput.value))) {
        rotYInput.value = clamp(value, -180, 1080);
        axis.rotY = rotYInput.value;
        rotYSlider.value = rotYInput.value * 100;
    } else { 
        rotYInput.value = axis.rotY;
    }
});

var rotXSlider = document.getElementById("rot-x-slider");
var rotXInput = document.getElementById("rot-x-input");
setTimeout(() => {
    rotXSlider.value = axis.rotX * 100;
    rotXInput.value = Math.floor(axis.rotX * 100) / 100;
}, 10);
rotXSlider.oninput = () => {
    axis.rotX = rotXSlider.value / 100;
    rotXInput.value = rotXSlider.value / 100;
} 
rotXInput.addEventListener("change", () => {
    var value;
    if (!Number.isNaN(value = Number(rotXInput.value))) {
        rotXInput.value = clamp(value, -90, 90);
        axis.rotX = rotXInput.value;
        rotXSlider.value = rotXInput.value * 100;
    } else { 
        rotXInput.value = axis.rotX;
    }
});

var stopButton = document.getElementById("stop-button");
stopButton.onclick = () => { 
    stop = !stop;
    if (stop) {
        stopButton.innerText = "スタート";
    } else { 
        stopButton.innerText = "ストップ";
    }
}
document.getElementById("reset-button").onclick = () => {
    //リセット処理
    frameCount = 0;
    CORNERS[0].setX(1).setY(1).setZ(-1);
    CORNERS[1].setX(1).setY(1).setZ(1);
    CORNERS[2].setX(1).setY(-1).setZ(1);
    CORNERS[3].setX(1).setY(-1).setZ(-1);
    CORNERS[4].setX(-1).setY(-1).setZ(-1);
    CORNERS[5].setX(-1).setY(1).setZ(-1);
    CORNERS[6].setX(-1).setY(1).setZ(1);
    CORNERS[7].setX(-1).setY(-1).setZ(1);
    if (stop) {
        draw();
    }
}