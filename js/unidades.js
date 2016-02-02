var Units = [
	{//0
		name:"Guerreiro",
		slug:"warrior",
		attributes:{
			atk:20,
			range:1,
			recharge:500,
			dmgArea:[{x:0,y:0}],
			hp:50,
			ammo:0,
			speed:2,
			def:10,
			mana:1,
			ritual:["U","U","D","U"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0001.png",
			avatar:"Guerreiro.png",
			action:"Guerreiro.png"
		}
	},
	{//1
		name:"Mago",
		slug:"mage",
		attributes:{
			atk:50,
			range:3,
			recharge:1000,
			dmgArea:[{x:0,y:0}],
			hp:30,
			ammo:0,
			speed:1,
			def:0,
			mana:2,
			ritual:["L","D","R","U"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0002.png",
			avatar:"Mago.png",
			action:"Mago.png"
		}
	},
	{//2
		name:"Arqueiro",
		slug:"archer",
		attributes:{
			atk:7,
			range:5,
			recharge:500,
			dmgArea:[{x:0,y:0}],
			hp:30,
			ammo:15,
			speed:0.15,
			def:0,
			mana:2,
			ritual:["U","U","R","R"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0003.png",
			avatar:"Arqueiro.png",
			action:"Arqueiro.png"
		}
	},
	{//3
		name:"Guard",
		slug:"guard",
		attributes:{
			atk:10,
			range:1,
			recharge:2000,
			dmgArea:[{x:0,y:0}],
			hp:120,
			ammo:0,
			speed:1,
			def:60,
			mana:3,
			ritual:["L","L","R","D"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0004.png",
			avatar:"Guard.png",
			action:"Guard.png"
		}
	},
	{//4
		name:"Escudeiro",
		slug:"shielder",
		attributes:{
			atk:0,
			range:0,
			recharge:0,
			dmgArea:[{x:0,y:0}],
			hp:50,
			ammo:0,
			speed:2,
			def:90,
			mana:1,
			ritual:["D","U","D","U"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0005.png",
			avatar:"Escudeiro.png",
			action:"Escudeiro.png"
		}
	},
	{//5
		name:"Kamikaze",
		slug:"kamikaze",
		attributes:{
			atk:100,
			range:1,
			recharge:0,
			dmgArea:[{x:0,y:0},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1} ],
			hp:40,
			ammo:1,
			speed:3,
			def:100,
			mana:1,
			ritual:["U","D","U","R","U","L","U","U"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0006.png",
			avatar:"Kamikaze.png",
			action:"Kamikaze.png"
		}
	},
	{//6
		name:"Buraco Negro",
		slug:"blackhole",
		attributes:{
			atk:0,
			range:0,
			recharge:0,
			dmgArea:[{x:0,y:0},{x:-1,y:-1},{x:-1,y:1},{x:1,y:-1},{x:1,y:1}],
			hp:10,
			ammo:1,
			speed:3,
			def:100,
			mana:1,
			ritual:["R","D","L","U","L","D","U"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0007.png",
			avatar:"Buraco_negro.png",
			action:"Buraco_negro.png"
		}
	},
	{//7
		name:"Ceifador",
		slug:"reaper",
		attributes:{
			atk:60,
			range:2,
			recharge:180,
			dmgArea:[{x:0,y:0}],
			hp:60,
			ammo:30,
			speed:2.8,
			def:50,
			mana:4,
			ritual:["D","R","R","U","D","R","D","L"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0008.png",
			avatar:"Ceifador.png",
			action:"Ceifador.png"
		}
	},
	{//8
		name:"Sombra",
		slug:"shadow",
		attributes:{
			atk:0.8,
			range:1,
			recharge:50,
			dmgArea:[{x:0,y:0}],
			hp:10,
			ammo:9550,
			speed:3,
			def:20,
			mana:3,
			ritual:["U","U","U","D","L","U","U","D"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0009.png",
			avatar:"Sombra.png",
			action:"Sombra.png"
		}
	},
	{//9
		name:"Bombardeiro",
		slug:"bomber",
		attributes:{
			atk:10,
			range:3,
			recharge:1000,
			dmgArea:[{x:0,y:0},{x:-1,y:-1},{x:1,y:-1},{x:-1,y:1},{x:1,y:1}],
			hp:80,
			ammo:10,
			speed:0.8,
			def:20,
			mana:4,
			ritual:["R","R","L","L","U","D","L","R"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0010.png",
			avatar:"Bombardeiro.png",
			action:"Bombardeiro.png"
		}
	},
	{//10
		name:"Zumbi",
		slug:"zombie",
		attributes:{
			atk:20,
			range:1,
			recharge:1200,
			dmgArea:[{x:0,y:0}],
			hp:100,
			ammo:210,
			speed:0.9,
			def:35,
			mana:3,
			ritual:["U","L","U","D"],
			effect:function() {
				return false;
			}   
		},
		data:{
			icon:"icon0011.png",
			avatar:"Zumbi.png",
			action:"Zumbi.png"
		}
	}
];




var Enemies = [
	{//0
		name:"Aldeão Tridente",
		slug:"villager_trident",
		attributes: {
			atk:30,
			range:2,
			recharge:1700,
			dmgArea:[{x:0,y:0}],
			hp:30,
			ammo:0,
			speed:2,
			def:20,
			mana:2,
			level:1,
			effect:function() {
				return false;
			}
		},
		data: {
			icon:"bolinha1.png",
			avatar:"Aldeao_tridente.png",
			action:"Aldeao_tridente.png"
		}
	},
	{//1
		name:"Aldeão Tocha",
		slug:"villager_torch",
		attributes: {
			atk:10,
			range:1,
			recharge:1000,
			dmgArea:[{x:0,y:0}],
			hp:30,
			ammo:2,
			speed:1,
			def:0,
			mana:2,
			level:2,
			effect:function() {
				return false;
			}
		},
		data: {
			icon:"bolinha2.png",
			avatar:"Aldeao_tocha.png",
			action:"Aldeao_tocha.png"
		}
	},
	{//2
		name:"Arremessador de Pedras",
		slug:"villager_rock",
		attributes: {
			atk:10,
			range:3,
			recharge:500,
			dmgArea:[{x:0,y:0}],
			hp:10,
			ammo:20,
			speed:3,
			def:0,
			mana:3,
			level:1,
			effect:function() {
				return false;
			}
		},
		data: {
			icon:"bolinha4.png",
			avatar:"Aldeao_machado.png",
			action:"Aldeao_machado.png"
		}
	},
	{//3
		name:"Catapulta",
		slug:"catapult",
		attributes: {
			atk:20,
			range:6,
			recharge:2000,
			dmgArea:[{x:0,y:0},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1} ],
			hp:100,
			ammo:5,
			speed:3,
			def:30,
			mana:4,
			level:3,
			effect:function() {
				return false;
			}
		},
		data: {
			icon:"bolinha5.png",
			avatar:"catapulta.png",
			action:"catapulta.png"
		}
	},
	{//4
		name:"Cavalaria",
		slug:"chivalry",
		attributes: {
			atk:50,
			range:1,
			recharge:650,
			dmgArea:[{x:0,y:0}],
			hp:85,
			ammo:0,
			speed:1.75,
			def:42,
			mana:2,
			level:4,
			effect:function() {
				return false;
			}
		},
		data: {
			icon:"bolinha6.png",
			avatar:"Cavalaria.png",
			action:"Cavalaria.png"
		}
	},
	{//5
		name:"Alchemista",
		slug:"alchemist",
		attributes: {
			atk:40,
			range:5,
			recharge:4000,
			dmgArea:[{x:0,y:0},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1} ],
			hp:30,
			ammo:5,
			speed:1,
			def:0,
			mana:3,
			level:4,
			effect:function() {
				return false;
			}
		},
		data: {
			icon:"bolinha7.png",
			avatar:"Alquimista.png",
			action:"Alquimista.png"
		}
	}, /*
	{//6
		name:"Molotov",
		slug:"molotov",
		attributes: {
			atk:50,
			range:3,
			recharge:2000,
			dmgArea:[{x:0,y:0},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1} ],
			hp:50,
			ammo:5,
			speed:2,
			def:10,
			mana:3,
			level:6,
			effect:function() {
				return false;
			}
		},
		data: {
			icon:"bolinha8.png",
			avatar:"bolinha8.png",
			action:"bolinha8.png"
		}
	}, */
	{//7
		name:"Caçador",
		slug:"hunter",
		attributes: {
			atk:30,
			range:2,
			recharge:600,
			dmgArea:[{x:0,y:0}],
			hp:70,
			ammo:0,
			speed:2,
			def:30,
			mana:3,
			level:5,
			effect:function() {
				return false;
			}
		},
		data: {
			icon:"bolinha9.png",
			avatar:"Cacadora.png",
			action:"Cacadora.png"
		}
	},
	{//8
		name:"Paladino",
		slug:"paladine",
		attributes: {
			atk:100,
			range:1,
			recharge:2000,
			dmgArea:[{x:0,y:0}],
			hp:15,
			ammo:0,
			speed:.4,
			def:99,
			mana:4,
			level:7,
			effect:function() {
				return false;
			}
		},
		data: {
			icon:"bolinha10.png",
			avatar:"Paladino.png",
			action:"Paladino.png"
		}
	},
]