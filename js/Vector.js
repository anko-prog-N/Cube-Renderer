class Vector {

    x = 0;
    y = 0;
    z = 0;

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    //引数が有限数ではなかった場合にエラーを吐く
    #checkFinite(num) {
        if (!Number.isFinite(Number(num))) {
            throw new TypeError("有限数を指定してください");
        }
    }

    //引数がベクトルではなかった場合にエラーを吐く
    #checkVector(vec) {
        if (!vec instanceof Vector) {
            throw new TypeError("ベクトルを指定してください");
        }
    }

    /**
     * ベクトルの長さ
     */
    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    set length(newLength) {
        this.#checkFinite(newLength);
        this.normalize().multiply(newLength);
    }

    /**
     * 横軸の角度
     */
    get rotX() {
        return Math.atan2(this.y, Math.sqrt(this.x ** 2 + this.z ** 2)) * 180 / Math.PI;
    }

    set rotX(newRotX) {
        this.#checkFinite(newRotX);
        var div = Math.cos(newRotX / 180 * Math.PI);
        var newX = Math.cos(this.rotY / 180 * Math.PI) * this.length * div;
        var newY = Math.sin(newRotX / 180 * Math.PI) * this.length;
        var newZ = Math.sin(this.rotY / 180 * Math.PI) * this.length * div;
        this.setX(newX).setY(newY).setZ(newZ);
    }

    /**
     * 縦軸の角度
     */
    get rotY() {
        return Math.atan2(this.z, this.x) * 180 / Math.PI;
    }

    set rotY(newRotY) {
        this.#checkFinite(newRotY);
        var sqrt = Math.sqrt(this.x ** 2 + this.z ** 2);
        this.x = Math.cos(newRotY / 180 * Math.PI) * sqrt;
        this.z = Math.sin(newRotY / 180 * Math.PI) * sqrt;
    }

    /**
     * Xの値を変更し、このベクトルを返します
     * 
     * @param {Number} x 新しいXの値
     * @return このベクトル
     */
    setX(newX) {
        this.#checkFinite(newX);
        this.x = newX;
        return this;
    }

    /**
     * Yの値を変更し、このベクトルを返します
     * 
     * @param {Number} y 新しいYの値
     * @return このベクトル
     */
    setY(newY) {
        this.#checkFinite(newY);
        this.y = newY;
        return this;
    }

    /**
     * Zの値を変更し、このベクトルを返します
     * 
     * @param {Number} z 新しいZの値
     * @return このベクトル
     */
    setZ(newZ) {
        this.#checkFinite(newZ);
        this.z = newZ;
        return this;
    }

    /**
     * 長さを変更し、このベクトルを返します
     * 
     * @param {Number} newLength 
     * return このベクトル
     */
    setLength(newLength) {
        this.length = newLength;
        return this;
    }

    /**
     * 横軸の角度を変更し、このベクトルを返します
     * 
     * @param {Number} newRotX 
     * @return このベクトル
     */
    setRotX(newRotX) {
        this.rotX = newRotX;
        return this;
    }

    /**
     * 縦軸の角度を変更し、このベクトルを返します
     * 
     * @param {Number} newRotY
     * @return このベクトル
     */
    setRotY(newRotY) {
        this.rotY = newRotY;
        return this;
    }

    /**
     * このベクトルと他のベクトルを加算します
     * 
     * @param {Number} vec 
     * @return このベクトル
     */
    add(vec) {
        this.#checkVector(vec);
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    }

    /**
     * このベクトルと他のベクトルを減算します
     * 
     * @param {Number} vec 
     * @return このベクトル
     */
    subtract(vec) {
        this.#checkVector(vec);
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    }

    /**
     * ベクトルの長さを1にします
     * 
     * @return このベクトル
     */
    normalize() {
        var length = this.length;
        this.x /= length;
        this.y /= length;
        this.z /= length;
        return this;
    }

    /**
     * このベクトルに対して指定された値を乗算します
     * 
     * @param {Number} m
     * @return このベクトル
     */
    multiply(m) {
        this.#checkFinite(m);
        this.x *= m;
        this.y *= m;
        this.z *= m;
        return this;
    }

    /**
     * 同じ要素を持ったベクトルを作成します
     * 
     * @return 同じ値を持った別のベクトルオブジェクト
     */
    clone() {
        return new Vector(this.x, this.y, this.z);
    }

    /**
     * このベクトルと他のベクトルの距離を計算します
     * 
     * @param {Vector} vec 他のベクトル
     * @return 二つのベクトルの距離
     */
    distance(vec) {
        this.#checkVector(vec);
        return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2 + (vec.z - this.z) ** 2);
    }

    /**
     * このベクトルと他のベクトルの内積を計算します
     * 
     * @param {Number} vec 他のベクトル
     * @return 内積
     */
    dotProduct(vec) {
        this.#checkVector(vec);
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    /**
     * このベクトルと他のベクトルの外積を計算します
     * 
     * @param {Vector} vec 他のベクトル
     * @return このベクトル
     */
    crossProduct(vec) {
        this.#checkVector(vec);
        var newX = this.y * vec.z - vec.y * this.z;
        var newY = this.z * vec.x - vec.z * this.x;
        var newZ = this.x * vec.y - vec.x * this.y;
        return this.setX(newX).setY(newY).setZ(newZ);
    }

    /**
     * このベクトルを他のベクトルを回転軸として回転させます
     * 
     * @param {Vector} vec 軸となるベクトル
     * @return このベクトル
     */
    rotate(vec, deg) {
        this.#checkVector(vec);
        this.#checkFinite(deg);
        var cos = Math.cos(deg / 180 * Math.PI);
        var sin = Math.sin(deg / 180 * Math.PI);
        var vec = vec.clone().normalize();
        var vecX = vec.x;
        var vecY = vec.y;
        var vecZ = vec.z;
        var rotX = new Vector(cos + vecX ** 2  * (1.0 - cos), vecX * vecY * (1.0 - cos) - vecZ * sin, vecX * vecZ * (1.0 - cos) + vecY * sin);
        var rotY = new Vector(vecY * vecX * (1.0 - cos) + vecZ * sin, cos + vecY ** 2 * (1.0 - cos), vecY * vecZ * (1.0 - cos) - vecX * sin);
        var rotZ = new Vector(vecZ * vecX * (1.0 - cos) - vecY * sin, vecZ * vecY * (1.0 - cos) + vecX * sin, cos + vecZ ** 2 * (1.0 - cos));
        var newX = rotX.dotProduct(this);
        var newY = rotY.dotProduct(this);
        var newZ = rotZ.dotProduct(this);
        return this.setX(newX).setY(newY).setZ(newZ);
    }

}