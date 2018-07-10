//META{"name":"Rot13","website":"https://github.com/comentarinformal/discord_plugins","source":"https://github.com/comentarinformal/discord_plugins/blob/master/Rot13.plugin.js"}*//

/*
 ====== Installation ======
 1. Save file as Rot13.js
 2. place file in %appdata%/BetterDiscord/plugins
 3. Refresh Discord (ctrl+R)
 4. Go to User Settings > BetterDiscord > Plugins
 5. Enable Rot13

**/

var Rot13 = function() {};

Rot13.prototype.getName = function() {return "Rot13 Thingamagicky";};
Rot13.prototype.getDescription = function() {return "You probably guess what it does. /rot13 or /rot <text>. Hold CTRL to avoid auto-sending the message, for 'decryption'. ";};
Rot13.prototype.getVersion = function() {return "1.9";};
Rot13.prototype.getAuthor = function() {return "Coment";};

Rot13.prototype.load = function() {this.attachHandler();};
Rot13.prototype.start = function() {this.attachHandler();this.handleChat()};
Rot13.prototype.onSwitch = function(){/*this.start();*/}


Rot13.prototype.observer = function (e) {
	if(e.addedNodes.length > 0 && typeof e.addedNodes[0].className == 'string' && e.addedNodes[0].className.indexOf('message') > -1){
		this.handleChat();
	}
}

Rot13.prototype.handleChat = function(){
	setTimeout(function() {
		
		$(".message-text .markup").each(function(z,elem) {
			var msgVal = elem.innerText;
			//console.log(msgVal);
			if(msgVal.startsWith('[rot13]')){
				$(elem).html("[ROT13] <i><b>"+rotate(msgVal.slice(7))+"</b></i>")
			}
		});
		
	},250);
}

Rot13.prototype.handleKeypress = function(e){
	var textAreaField,keycode, command, text;
	
	textAreaField = $("textarea")[0];
	if(textAreaField != document.activeElement) return;
	
	keycode = e.keyCode || e.which;
	if (keycode !== 13) return;
	
	command = textAreaField.value;
	if(!command.toLowerCase().startsWith('/rot ') && !command.toLowerCase().startsWith('/rot13 ')) return;
	command.toLowerCase().startsWith('/rot13 ') ? text = command.slice(7) : text = command.slice(5);
	
	var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
	nativeInputValueSetter.call(textAreaField, "[rot13]"+rotate(text));
	
	var ev2 = new Event('input', { bubbles: true});
	textAreaField.dispatchEvent(ev2);
	//if(e.ctrlKey === true){ yknowwhat, let's make that default. 
		e.preventDefault();
		e.stopPropagation();
	//}
}

Rot13.prototype.stop = function() {document.removeEventListener("keydown", this.handleKeypress, false);};
Rot13.prototype.unload = function() {this.stop();}

Rot13.prototype.attachHandler = function() {document.addEventListener("keydown", this.handleKeypress, false);}
function rotate(str){return str.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});}

//TOTALLY not stolen from https://stackoverflow.com/questions/617647/where-is-my-one-line-implementation-of-rot13-in-javascript-going-wrong
// and https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js 
