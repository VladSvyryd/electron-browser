// Flash Player Version Detection - Rev 1.5
// Detect Client Browser type
// Copyright(c) 2005-2006 Adobe Macromedia Software, LLC. All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
var browser_message="";
var flash_message="";
var versionStr="";

//erforderliche Flashversion
var requiredMajorVersion = 8;
var requiredMinorVersion = 0;
var requiredRevision = 0;

// true wenn die erforderliche Flashversion installiert
var check_f = null;


// gibt die Flashplayerversion zurück
function ControlVersion()
{
	var version;
	var axo;
	var e;

	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}

	if (!version)
	{
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful. 
			
			// default to the first public version
			version = "WIN 6,0,21,0";

			// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
			axo.AllowScriptAccess = "always";

			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");

		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer(){
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;			
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			if ( descArray[3] != "" ) {
				tempArrayMinor = descArray[3].split("r");
			} else {
				tempArrayMinor = descArray[4].split("r");
			}
			var versionRevision = tempArrayMinor[1] > 0 ? tempArrayMinor[1] : 0;
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}	
	return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];

        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: prüft die Flash Version
//    Input: requiredMajorVersion, requiredMinorVersion, requiredRevision (stehen in der HTML-Seite im Kopf, damit sie leicht zu 
//			 finden und ändern sind)
//   Output: var flash_message:String; true/false
// erstellt: 11.03.09
// geändert: 17.04.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkFlash() {
	var tempArray;
	var tempString;

	// Flash Detection starten
	if (DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision)) {
		// Flash Detection war erfolgreich
		flash_message = "Version "+versionStr+" ist installiert!";
		return true;
	}
	else {
		// die vorhandene Flash Version ist zu niedrig
		if (versionStr != -1) {
			tempArray = versionStr.split(' ');
			tempString = tempArray[1];
			tempArray = tempString.split(',');
			tempString = tempArray.join('.');
			flash_message = 'Sie haben <strong class="warning_red">Flashplayer '+tempString+'</strong> installiert. Sie ben&ouml;tigen jedoch mindestens Version '+requiredMajorVersion+'.'+requiredMinorVersion+'.'+requiredRevision+'.0! Bitte laden Sie sich den aktuellen Flashplayer herunter.<br /><a target="_blank" class="quer" href="http://get.adobe.com/de/flashplayer/?promoid=DAFZC"><img alt="FlashPlayer" src="./img/get_adobe_flash_player.png"></a><div  style="clear:left"></div>';
			return false;
		}
		// es wurde keine Flash Version gefunden
		else {
			flash_message = 'Sie haben <strong class="warning_red">keinen Flashplayer</strong> installiert. Bitte laden Sie sich den aktuellen Flashplayer herunter.<br /><a target="_blank" class="quer" href="http://get.adobe.com/de/flashplayer/?promoid=DAFZC"><img alt="FlashPlayer" src="./img/get_adobe_flash_player.png"></a><div  style="clear:left"></div>';
			return false;
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: überprüft die Browserart und Version 
//    Input: /
//   Output: var browser_message:String, true/false
// erstellt: 10.03.09
// geändert: 17.04.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkBrowser(){
	var check = 0;
	//alert(BrowserDetect.browser+ " " +BrowserDetect.version);
	browser_message="Sie verwenden "+BrowserDetect.browser+ " " +BrowserDetect.version;
	
	if(BrowserDetect.browser.toLowerCase() =="explorer"){
		if (!(Number(BrowserDetect.version)>6)){
			browser_message = "Sie verwenden den Internet Explorer Version "+BrowserDetect.version+". Das Lernmodul benötigt für die richtige Funktion und Darstellung mindestens die Version 7. Bei Problemen mit der Navigation oder der Darstellung benutzen Sie bitte den Internet Explorer ab Version 7 oder Firefox ab Version 3.5!";
			check=-1;
		}else{
			check=1;
		}
	}

  	if (navigator.userAgent.indexOf("Mac") != -1) 
	{
    	isMac = 1;
  	}

	// ab hier erfolgen die Aufrufe
/*  	if (op) 
	{
    	browser_message = "Sie verwenden den Browser Opera. Sollte es Probleme mit der Navigation im Lernmodul kommen, benutzen Sie bitte den Internet Explorer oder Firefox!";
		return true;
  	}
	
  	if (ie4) 
	{
		browser_message = "Sie verwenden den Internet Explorer 4. Um das Lernmodul starten zu k&ouml;nnen, ben&ouml;tigen Sie mindestens Version 7!";
		return false;
  	} 
	
  	if (ie5) 
	{ 
    	if (isMac == 1) 
		{ 
	  		browser_message = "Der Internet Explorer wird für den Mac nicht unterst&uuml;tzt. Um das Lernmodul starten zu k&ouml;nnen, benutzen Sie bitte den Internet Explorer oder Firefox!";
			return false;
		}	
		else 
		{
			browser_message = "Internet Explorer f&uuml;r Windows Version 5 oder h&ouml;her erkannt!";
			return true;
		}
  	} 
	
  	if (nn4) 
	{
    	browser_message = "Sie benutzen Netscape 4. Um das Lernmodul starten zu k&ouml;nnen, ben&ouml;tigen Sie mindestens Version 7.0!";
		return false;
  	} 
 	
	if (nn6) 
	{ 
		browser_message = "basierend auf der Gecko-Engine erkannt!";
    	return true;
  	}
	
  	if (aol) 
	{ 
		browser_message = "AOL Browser nicht getestet!";
		return true;
  	}
	
  	if (v3) 
	{ 
    	browser_message = "veraltet. Um das Lernmodul starten zu k&ouml;nnen, ben&ouml;tigen Sie eine neuere Version des Internet Explorers oder Firefox";
		return false;
  	}
*/
			return true;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: prüft ob die Frames "Inhalt" und "blindFrame" existieren
//    Input: /
//   Output: true/false
// erstellt: 11.03.09
// geändert: 17.04.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkTopFrameset() {
	if (top.document.getElementById("Inhalt") && top.document.getElementById("blindFrame")) {
		return true;		// die erforderlichen Frames existieren
	}
	else {
		return false;		// Frameset wurde nicht korrekt geladen
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: ermittelt Browser, Version und OS , Quelle http://www.quirksmode.org/js/detect.html
//    Input: /
//   Output: true/false
// erstellt: 11.03.09
// geändert: 17.04.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

//
BrowserDetect.init();