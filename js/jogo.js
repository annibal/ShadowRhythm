
// Primeiro o som
$("<audio id='musicPlayer'><source src='musiquinha.mp3' /></audio>").appendTo($("body"))
$("<audio id='music_bomb' class='audioFX'><source src='audios/Bomb.mp3' /></audio>").appendTo($("body"))
// random close range attack
$("<audio id='cut0' class='audioFX'><source src='audios/Cut.wav' /></audio>").appendTo($("body"))
$("<audio id='cut1' class='audioFX'><source src='audios/Cut01.wav' /></audio>").appendTo($("body"))
$("<audio id='cut2' class='audioFX'><source src='audios/Cut02.wav' /></audio>").appendTo($("body"))
$("<audio id='cut3' class='audioFX'><source src='audios/Cut03.wav' /></audio>").appendTo($("body"))
// death
$("<audio id='dirt_sand' class='audioFX'><source src='audios/Dirt_Sand_09.wav' /></audio>").appendTo($("body"))
// bombs
$("<audio id='explosion_fast' class='audioFX'><source src='audios/Explosion_Fast.wav' /></audio>").appendTo($("body"))
// ranged attack
$("<audio id='heavy_walk' class='audioFX'><source src='audios/Heavy_walk.wav' /></audio>").appendTo($("body"))
// siege death
$("<audio id='wood1'  class='audioFX'><source src='audios/Wood_01.wav' /></audio>").appendTo($("body"))

$(".audioFX").each(function() {this.volume = 0.3;});



// Crio o Framework
canvazator.initialize("canv",500);
canvazator.bgColor = "#000";

// Digo as imagens ( pra não bugar enquanto carrega )
if (Units == undefined) throw "Erro - dados das unidades não encontrados"
imgCacheData = {
	stageLayout:"images/stage.png",
	manaIcon:"images/lightning.png",
};
for (var i=0; i<Units.length; i++) {
	imgCacheData[Units[i].slug+"_icon"] = "images/"+Units[i].data.icon;
	imgCacheData[Units[i].slug+"_avatar"] = "images/"+Units[i].data.avatar;
	imgCacheData[Units[i].slug+"_action"] = "images/"+Units[i].data.action;
}
for (var i=0; i<Enemies.length; i++) {
	imgCacheData[Enemies[i].slug+"_avatar"] = "images/"+Enemies[i].data.avatar;
	imgCacheData[Enemies[i].slug+"_action"] = "images/"+Enemies[i].data.action;
}
canvazator.cacheImages(imgCacheData);

// Mando esperar carregar
canvazator.waitForImageLoad();

var obj, enemy;
// Quando carregar inicializo os objetos (com parametros e tal) e chamo o .start() de cada um
canvazator.onImageLoad = function() {
	obj = MusicTest("red","musicPlayer");
	obj.start();
	enemy = Enemy("musicPlayer");
	enemy.start();
	enemy.bpm = obj.bpm;
}







// cria o helper
for (var i=0; i<Units.length; i++) {
	
	var imgContainer = $("<div class='img-container'></div>");
	var imgContainer2 = $("<div class='img-container2' style='float:right;'></div>");
	for (var j=0; j<Units[i].attributes.ritual.length; j++) {
		$("<img src='images/seta_"+Units[i].attributes.ritual[j]+".png' style='width:35px; height:35px; margin:2px;'/>").appendTo(imgContainer);
	}
	for (var j=0; j<Units[i].attributes.mana; j++) {
		$("<img src='images/lightning.png' style='width:30px; height:30px; margin:2px;' />").appendTo(imgContainer2);
	}
	var unitDiv = $("<div><br /><h4 style='margin:2px;'>"+Units[i].name
	+" (ATK : "+Units[i].attributes.atk+", "
	+" RNG : "+Units[i].attributes.range+", "
	+" ASP : "+Math.round((1/Units[i].attributes.recharge)*1000)+", "
	+" HP : "+Units[i].attributes.hp+", "
	+" DEF : "+Units[i].attributes.def+")"
	+"</h4>")
	imgContainer2.appendTo(unitDiv);
	imgContainer.appendTo(unitDiv);
	unitDiv.appendTo("#helper");
}