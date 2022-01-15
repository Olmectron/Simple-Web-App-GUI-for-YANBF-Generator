class NDSFile{constructor(file,updatesCallback){var context=this;this.file=file;this.finalFileName=file.name;console.log("FILE!",file);this.name=file.name;this.updatesCallback=updatesCallback;this.iconData=null;this.colores=null;this.loadGamePath(file);this.getCardMode().then(function(cardMode){context.cardMode=cardMode;console.log("CARD MODE",cardMode)});if("true"==LocalStoreQuery.get("autoRandomTid")){this.overrideTid=MiscUtils.getRandomTid();console.log("RANDOM!",this.overrideTid);// this.tid=this.overrideTid;
//   console.log("TID!",this.tid,this.overrideTid);
}this.getTIDString().then(function(tidString){context.tid=tidString;if(!context.overrideTid){context.overrideTid=context.tid}context.notifyChanges()});this.getBytesFromFile(0,11).then(function(result){console.log("HEADER",HexUtils.getWordFromHexOneByte(result))});//        0x00,0x0B
this.getEnglishNameLocation().then(function(res){// console.log("english name location",res);
context.getBytesFromFile(res,res+256).then(function(gameTitleBytes){//     console.log("Bytes:",gameTitleBytes);  
//     console.log("Name:",);
var string=HexUtils.getWordFromHexTwoBytes(gameTitleBytes),gameTitleArray=string.split("\n"),publisher=gameTitleArray[gameTitleArray.length-1];gameTitleArray.splice(gameTitleArray.length-1,1);var gameTitle=gameTitleArray.join(" ");//    console.log("Final name",publisher,gameTitle);
context.name=gameTitle.trim().replace(/\u0000/g,"");context.publisher=publisher.trim().replace(/\u0000/g,"");//    console.log("sssss",context);
context.notifyChanges()})});this.getFullGameTitleString().then(function(gameTitle){context.gameTitle=gameTitle;context.notifyChanges()});LocalStoreQuery.addFieldCallback("folderForGames",function(folder){context.loadGamePath(file);context.notifyChanges()});this.createCanvas()}loadGamePath(file){var gameFolder=LocalStoreQuery.get("folderForGames");if(!gameFolder){gameFolder="Games/NDS"}if(gameFolder.endsWith("/")){gameFolder=gameFolder.substring(0,gameFolder.length-1)}this.gamePath=file.name;//console.log("FILE FILE FILE",file);
//this.gamePath=gameFolder+"/"+file.name;
}reloadTid(){this.overrideTid=MiscUtils.getRandomTid();this.notifyChanges()}getTID(){return this.getBytesFromFile(12,16).then(function(tid){return tid})}getTIDString(){return this.getTID().then(function(tid){return HexUtils.getWordFromHexOneByte(tid)})}getFullGameTitleString(){return this.getFullGameTitleBytes().then(function(tid){return HexUtils.getWordFromHexOneByte(tid).trim().replace(/\u0000/g,"")})}getFullGameTitleBytes(){var context=this;// console.log("english name location",res);
return context.getBytesFromFile(0,12).then(function(gameTitleBytes){//     console.log("smmas",gameTitleBytes.length);
return gameTitleBytes})}getEnglishNameData(){var context=this;return this.getEnglishNameLocation().then(function(res){// console.log("english name location",res);
return context.getBytesFromFile(res,res+256).then(function(gameTitleBytes){return{bytes:gameTitleBytes,location:res}})})}kill(){this.killed=!0;this.file=null}notifyChanges(){if(this.killed){return}if(this.updatesCallback)this.updatesCallback({name:this.name,publisher:this.publisher,canvasObject:this.canvasObject,tid:this.tid,gamePath:this.gamePath,gameTitle:this.gameTitle,overrideTid:this.overrideTid})}createCanvas(){var context=this;context.getIconData().then(function(iconData){context.getPaletteColors().then(function(paletteColors){//  console.log("DATA canvas",iconData,paletteColors);
var canvas=document.createElement("canvas");canvas.style.width="66px";canvas.style.height="66px";canvas.width=32;canvas.height=32;var ctx=canvas.getContext("2d");ctx.createImageData(32,32);for(var i=0;32>i;i++){for(var j=0;32>j;j++){//image.getPixelWriter().setArgb(i, j, base.getPixelReader().getArgb(i, j));
//if(hair.getPixelReader().getArgb(i, j)){
//int hairARGB=hair.getPixelReader().getArgb(i,j);
var pixel=ctx.getImageData(i,j,1,1),dataPixel=pixel.data;//      console.log("PIXEL",pixel);
if(0==iconData[i][j]||null==iconData[i][j]){dataPixel[0]=255;dataPixel[1]=255;dataPixel[2]=255;dataPixel[3]=0;ctx.putImageData(pixel,i,j);//     image.getPixelWriter().setColor(i, j,Color.TRANSPARENT);
//    ctx.putImageData( id, x, y );     
}else{var rgbaData=HexUtils.hexToRgbA(paletteColors[iconData[i][j]]);dataPixel[0]=rgbaData[0];dataPixel[1]=rgbaData[1];dataPixel[2]=rgbaData[2];dataPixel[3]=255;ctx.putImageData(pixel,i,j);//     console.log("data pixel",dataPixel);
//   image.getPixelWriter().setColor(i, j,Color.web(palette.get(values[i][j])));
}//System.out.println(Integer.toBinaryString(i));
}//image.getPixelWriter().setArgb(i,j,hairARGBimage.getPixelReader().getArgb(i, j));
//}
}context.canvasObject=canvas;context.notifyChanges();// this.setImage(image);
// this.setFitHeight(64);
// this.setFitWidth(64);
})})}getPaletteColors(){var context=this;return this.getPalleteBytes().then(function(bites){if(null==context.colores){context.colores=[];//Lista de Strings
for(var i=0;32>i;i+=2){var reversed=HexUtils.reverseArray(bites.slice(i,i+2)),normalColor=HexUtils.getHexString(reversed),bits=HexUtils.hex2bin(normalColor);//var /*String*/  normalColor=Hex.getHexString(Arrays.copyOfRange(bites,i,i+2));
while(16>bits.length){bits="0"+bits}var r=parseInt(bits.substring(11,16),2),g=parseInt(bits.substring(6,11),2),b=parseInt(bits.substring(1,6),2),R=255*r/31,G=255*g/31,B=255*b/31,color=HexUtils.getHexString([R])+HexUtils.getHexString([G])+HexUtils.getHexString([B]);context.colores.push("#"+color)}}return context.colores})}getIconData(){//returns var /*int*/ [][]
var context=this;return this.getIconBytes().then(function(bytes){if(null==context.iconData){context.iconData=[];//new var /*int*/ [32][32];
for(var z=0,arrMe;32>z;z++){arrMe=[];//                    context.iconData.push([]);
for(var k=0;32>k;k++){arrMe.push(0)}context.iconData.push(arrMe)}//new var /*int*/ [1024];
for(var/*int*/counter=0,/*int*/vCounter=0,/*int[] */v=[],/*int*/j=0;16>j;j++){for(var/*int*/i=0,val;32>i;i++){val=bytes[counter];if(!val){val=0}if(0>val){val=255&val}var/*String*/bits=val.toString(2);while(8>bits.length){bits="0"+bits}//                            console.log("bits",bits);
var/*int*/val1=parseInt(bits.substring(0,4),2),/*int*/val2=parseInt(bits.substring(4,8),2);v[vCounter]=val2;v[vCounter+1]=val1;// v.push(val2);
// v.push(val1);
vCounter+=2;counter++}}//                    console.log("VVVV",v);
for(var/*int*/contador=0,/*int*/tile=0;16>tile;tile++){for(var/*int*/i=0;64>i;i++){var/*int*/posI=i%8+8*(tile%4),/*int*/posJ=context.getPosJ(tile,i);// console.log("v",v);
context.iconData[posI][posJ]=v[contador];if(30==posI){//console.log("valores["+posI+","+posJ+"]="+v[contador]);
}contador++;//console.log(counter+"");
}}}return context.iconData})}getPosJ(tile,i){//returns int
var/*int*/posJ=Math.floor(+i/8);if(4>tile){posJ+=0}else if(8>tile){posJ+=8}else if(12>tile){posJ+=16}else if(16>tile){posJ+=24}return posJ}getIconBytes(){var context=this;return this.getIconDataLocation().then(function(iconLocation){return context.getBytesFromFile(iconLocation,iconLocation+512)})}getPalleteBytes(){var context=this;return this.getPalleteLocation().then(function(location){return context.getBytesFromFile(location,location+32)})}getPalleteLocation(){return this.getBannerLocation().then(function(bannerLocation){return bannerLocation+544})}getIconDataLocation(){return this.getBannerLocation().then(function(bannerLocation){return bannerLocation+32})}getBannerLocation(){return this.getBytesFromFile(104,104+4).then(function(result){return HexUtils.getHexNumber(HexUtils.reverseArray(result))})}getEnglishNameLocation(){return this.getBannerLocation().then(function(bannerLocation){return bannerLocation+832})}getBytesFromFile(start,end){if(!this.file){return null}var blob=this.file.slice(start,end),reader=new FileReader;//end+0x01
return new Promise(function(resolve,reject){// on success
try{reader.onload=function(result){//  console.log("RESULT",reader.result);
for(var fileByteArray=[],array=new Uint8Array(reader.result),i=0;i<array.length;i++){fileByteArray.push(array[i])}resolve(fileByteArray)};reader.readAsArrayBuffer(blob)}catch(err){// on failure
reject(err)}})}getCardMode(){//returns int
return this.getBytesFromFile(18,19).then(function(arr){var b=arr[0];if(0==b){return HexUtils.NTR}else if(2==b||3==b){return HexUtils.TWL}return 0})}getBannerIconBytes(){var context=this;return this.getBannerLocation().then(function(location){if(context.cardMode==HexUtils.NTR){console.log("IS NTR!",context.name);return context.getBytesFromFile(location,location+2112)}else if(context.cardMode==HexUtils.TWL){console.log("IS TWL!",context.name);return context.getBytesFromFile(location,location+9152)}else return null})}getImportedBanner(){return null}writeBanner(templateBytes,card){var/*int*/start=0;/*if(cardType==CardType.DSTT_R4i_SHDC){
              start=0x11000;
          }
          else if(cardType==CardType.R4_ORIGINAL){
              start= 0x5F800;
          }
          else if(cardType==CardType.R4IDSN){
              start= 0x5FC00;
          }
          else if(cardType==CardType.ACEKARD_RPG){
              start=0x65400;
          }
          */start=+card.banner_location;if(null==this.getImportedBanner()){return this.getBannerIconBytes().then(function(banner){//   var banner=this.getBannerIconBytes(); //byte[]
var/*int*/counter=0;//while(counter<banner.length){
if(!1)//banner.length==0x840)
{var/*int*/startInit=start;while(9152>counter){templateBytes[startInit]=banner[counter];if(null==templateBytes[startInit]||isNaN(+templateBytes[startInit])){templateBytes[startInit]=0}counter++;startInit++}startInit=start+2112;for(var/*byte[]*/japaneseName=banner.slice(576,576+256),/*int*/i=0;i<japaneseName.length;i++){templateBytes[startInit]=japaneseName[i];if(null==templateBytes[startInit]||isNaN(+templateBytes[startInit])){templateBytes[startInit]=0}startInit++}for(var/*int*/i=0;i<japaneseName.length;i++){templateBytes[startInit]=japaneseName[i];if(null==templateBytes[startInit]||isNaN(+templateBytes[startInit])){templateBytes[startInit]=0}startInit++}var/*byte[]*/startByte=[3,1];templateBytes[start]=startByte[0];templateBytes[start+1]=startByte[1];var/*int*/tileStart=start+4672,/*int*/bannerCounter=0;while(8>bannerCounter){for(var/*int*/i=32;544>i;i++){templateBytes[tileStart]=banner[i];tileStart++}bannerCounter++}var/*int*/palleteStart=start+8768,/*int*/paletteCounter=0;while(8>paletteCounter){for(var/*int*/i=544;576>i;i++){templateBytes[palleteStart]=banner[i];palleteStart++}paletteCounter++}var/*byte[]*/endByte=[1,0,0,1];templateBytes[start+9024]=endByte[0];templateBytes[start+9025]=endByte[1];templateBytes[start+9026]=endByte[2];templateBytes[start+9027]=endByte[3];var/*byte[]*/firstCRC=HexUtils.getCRCFlippedPairBytes(HexUtils.getCRC16(templateBytes.slice(start+32,start+2111+1))),/*byte[]*/secondCRC=HexUtils.getCRCFlippedPairBytes(HexUtils.getCRC16(templateBytes.slice(start+32,start+2367+1))),/*byte[]*/thirdCRC=HexUtils.getCRCFlippedPairBytes(HexUtils.getCRC16(templateBytes.slice(start+32,start+2623+1))),/*byte[]*/fourthCRC=HexUtils.getCRCFlippedPairBytes(HexUtils.getCRC16(templateBytes.slice(start+4672,start+9151+1)));//var /*byte[]*/  ra=Arrays.copyOfRange(this.templateBytes,0x20,0x83F+0x01);
console.log(HexUtils.getCRC16(templateBytes.slice(4672,9151))+" CRC");//Hex.arrayCopy(firstCRC, 0, this.templateBytes, start+0x02, 2);
HexUtils.arrayCopy(secondCRC,0,templateBytes,start+4,2);HexUtils.arrayCopy(thirdCRC,0,templateBytes,start+6,2);HexUtils.arrayCopy(fourthCRC,0,templateBytes,start+8,2)}else{while(9152>counter){templateBytes[start]=banner[counter];if(null==templateBytes[start]||isNaN(+templateBytes[start])){templateBytes[start]=0}counter++;start++}}//  return "Finished write banner!";
});//END BANNER ICON BYTES
}else{var/*int*/counter=0;while(9152>counter){try{this.templateBytes[start]=this.getImportedBanner()[counter];console.log("Byte "+counter+": "+this.getImportedBanner()[counter])}catch(ex){this.templateBytes[start]=0}counter++;start++}}return this.templateBytes}writeGamePath(templateBytes,/*int*/offset,/*int*/length){var/*byte[]*/gamePath=HexUtils.getBytesFromWord(this.gamePath),/*int*/counter=0,/*int*/i=offset;while(counter<length){//if(i>=0x22DE7 && i<=0x22EE8){
if(gamePath[counter]){templateBytes[i]=gamePath[counter]}else{templateBytes[i]=0}counter++;i++}//}
}}