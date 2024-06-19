
let sn8Rssi = {
  "22040013": -51
}

export default class Common {

  static getRandomString(length) {
    var randomChars = 'ABCDEF0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  static fromHexString(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  }

  static toHexString(bytes) {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  }

  static uintArray2String(array) {
    array = new Uint8Array(array)
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(parseInt(array[i], 10));
    }
    return result;
  }

  static string2Uint8Array(str) {
    var utf8 = unescape(encodeURIComponent(str));
    var u8a = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
      u8a[i] = utf8.charCodeAt(i);
    }
    return u8a;
  }
 

  static concatUint8Array(myArrays) {
    let length = 0;
    myArrays.forEach(item => {
      length += new Uint8Array(item).length;
    });
    let mergedArray = new Uint8Array(length);
    let offset = 0;
    myArrays.forEach(item => {
      item = new Uint8Array(item);
      mergedArray.set(item, offset);
      offset += item.length;
    });
    return mergedArray;
  }

  /**
   * 生成随机数， 包含min max
   * @param {*} min 
   * @param {*} max 
   */
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  }

  static asiiCode2Str(assiiCodeArr) {
      let strArr = [];
      for (let index = 0; index < assiiCodeArr.length; index++) {
          let item = String.fromCharCode(assiiCodeArr[index]);
          strArr.push(item)
      }
      return strArr.join('');      
  }

  
  static getRssiBySn8(sn8) {
    return sn8Rssi[sn8] || -60;
  }
}