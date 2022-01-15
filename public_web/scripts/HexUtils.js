window.HexUtils={NTR:0,TWL:1,getHexNumber(byteArray){var string=HexUtils.getHexString(byteArray);return parseInt("0x"+string)},getCRCFlippedPairBytes(value){var bytes=this.getByteArrayFromNumber(value);bytes=this.reverseArray(bytes);var c=bytes.slice(0,2);return c},getCRC16(bytes){var result="0x"+crc16(bytes),number=parseInt(result);console.log("RESULT CRC16!",result,number);return number},arrayCopy(src,srcIndex,dest,destIndex,length){dest.splice(destIndex,length,...src.slice(srcIndex,srcIndex+length))},getCharString(array){for(var result="",i=0;i<array.length;i++){result+=String.fromCharCode(parseInt(array[i],2))}return result},hex2bin(hex){return parseInt(hex,16).toString(2).padStart(8,"0")},getBytesFromFile(file,start,end){if(!file){return null}if(null==start&&null==end){start=0;end=file.size;//     console.log("FILE SIZE",file.size);
}var blob=file.slice(start,end),reader=new FileReader;//end+0x01
return new Promise(function(resolve,reject){// on success
try{reader.onload=function(result){//  console.log("RESULT",reader.result);
for(var fileByteArray=[],array=new Uint8Array(reader.result),i=0;i<array.length;i++){fileByteArray.push(array[i])}resolve(fileByteArray)};reader.readAsArrayBuffer(blob)}catch(err){// on failure
reject(err)}})},downloadUrlAsByteArray(url,fileName,callback){// read text from URL location
return new Promise(function(resolve,reject){var request=new XMLHttpRequest;request.open("GET",url,!0);request.send(null);request.responseType="blob";request.onreadystatechange=function(){if(4===request.readyState&&200===request.status){//var type = request.getResponseHeader('Content-Type');
console.log("REQUEST",request);var blob=request.response;blob.lastModifiedDate=new Date;blob.name=fileName+".nds";HexUtils.getBytesFromFile(blob).then(function(byteArray){resolve(byteArray)});//var objectUrl = URL.createObjectURL(blob);
//window.open(objectUrl);
/*if (type.indexOf("text") !== 1) {
                    if(callback){
                        callback(request.responseText);
                    }
                    return request.responseText;
                }*/}}})},downloadUrlAsBlob(url,fileName,callback){// read text from URL location
var request=new XMLHttpRequest;request.open("GET",url,!0);request.send(null);request.responseType="blob";request.onreadystatechange=function(){if(4===request.readyState&&200===request.status){//var type = request.getResponseHeader('Content-Type');
console.log("REQUEST",request);var blob=request.response;blob.lastModifiedDate=new Date;blob.name=fileName+".nds";if(callback){callback(blob)}//var objectUrl = URL.createObjectURL(blob);
//window.open(objectUrl);
/*if (type.indexOf("text") !== 1) {
                        if(callback){
                            callback(request.responseText);
                        }
                        return request.responseText;
                    }*/}}},getWordFromHexTwoBytes(bytes){var result="";try{for(var i=0,newHex;i<bytes.length;i+=2){newHex=this.getHexString([bytes[i+1]])+this.getHexString([bytes[i]]);result+=String.fromCharCode(parseInt("0x"+newHex))}}catch(err){console.error("error word",err)}return result},hexToRgbA(hex){var c;if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){c=hex.substring(1).split("");if(3==c.length){c=[c[0],c[0],c[1],c[1],c[2],c[2]]}c="0x"+c.join("");return[255&c>>16,255&c>>8,255&c];//return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
}throw new Error("Bad Hex")},getBytesFromWord(s){for(var encoder=new TextEncoder,array=encoder.encode(s),byteArray=[],i=0;i<array.length;i++){byteArray.push(array[i])}return byteArray},getWordFromHexOneByte(bytes){var result="";try{for(var i=0,newHex;i<bytes.length;i+=1){newHex=this.getHexString([bytes[i]]);result+=String.fromCharCode(parseInt("0x"+newHex))}}catch(err){console.error("error word",err)}return result},reverseArray(original){for(var reversed=[],counter=0,i=original.length-1;0<=i;i--){reversed[counter]=original[i];counter++}return reversed},getByteArrayFromNumber(number){var hexString=this.getHexStringFromNumber(Math.floor(number));console.log("HEX STRING FROM NUMBER",number,hexString);for(var byteArray=[],i=0,pair;i<hexString.length;i+=2){pair=hexString[i]+hexString[i+1];byteArray.push(parseInt("0x"+pair))}console.log("byte Array from number!",byteArray);return byteArray},getHexStringFromNumber(number){var hexString=number.toString(16);console.log("HHHHHHHHHHHHH",hexString);while(0!=hexString.length%2){hexString="0"+hexString}return hexString},getHexString(byteArray){return Array.from(byteArray,function(byte){return("0"+(255&byte).toString(16)).slice(-2)}).join("")}};