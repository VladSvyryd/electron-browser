//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: liest alle übergebenen Parameter aus und übergibt sie an AC_FL_RunContent()
//    Input: newFlashObject:Array, beinhaltet alle Parameter
//   Output: /
// erstellt: 14.04.09
// geändert: 14.05.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function insertFlashContent(newFlashObject) {
	// Initialisierung der benötigten Variablen
	var src = "";													// String:	Name der SWF-Datei inkl. Pfad, aber ohne Dateiendung ".swf"
	var base = "";												// String:	legt die Adresse eines Flash-Films für relative Pfade fest
	var id = "";													// String:	id (name), für Kommunktion mit der SWF
	var flashvars = "";										// String: 	Variablen in Form eines Query-Strings, aber ohne führendes "?"
	var width = null;											// Number: 	Breite des Flash-Films
	var height = null;										// Number: 	Höhe des Flash-Films
	var version = "8,0,0,0";							// String: 	benötigte Flash-Player-Version
	var bgcolor = "#ffffff";							// String: 	Hintergrundfarbe des Flash-Films
	var quality = "high";									// String: 	Qualität des Flash-Films, mögliche Werte: "low", "middle", "high"
	var allowFullScreen = false;					// Boolean:	Vollbildmodus, mögliche Werte: true, false
	var allowScriptAccess = "sameDomain";	// String:	Sicherheitseinstellung für Skripte, mögliche Werte:  "always", "never", "sameDomain"
	var play = true;											// Boolean:	setzt Autostart für Flash-Film, mögliche Werte: true, false
	var loop = false;											// Boolean:	setzt repeat für Flash-Film, mögliche Werte: true, false
	var devicefont = false;								// Boolean:	legt fest, ob die Texte in einem Flash Player-Film durch Geräteschriften oder die eingebetteten Schriftkonturen dargestellt werden sollen, mögliche Werte: true, false
	var menu = false;											// Boolean:	legt fest, ob das Kontextmenü bei der Wiedergabe eines Flash Player-Films komplett zur Verfügung steht, mögliche Werte: true, false
	var scale = "showall";								// String:	skaliert den Flash-Film, mögliche Werte: "showall", "noscale", "noborder", "exactfit"; weitere Infos: http://kb2.adobe.com/cps/141/tn_14149.html
	var wmode = "window";									// String:	Sichtbarkeit des Flash-Films in Website, mögliche Werte: "window", "opaque", "transparent"
	var align = "middle";									// String:	legt den Textfluss um den Flash-Film herum fest, mögliche Werte: "middle" (Standardwert), "t", "r", "b", "l"
	var salign = "";											// String:	legt fest, wie der Flash-Film innerhalb des durch WIDTH und HEIGHT festgelegten Bereiches platziert wird, mögl. Werte: "t", "r", "b", "l", "tr" etc.
	var style = "";												// String:	Inline-Styles können so einfach mit bei der Einbettung angegeben werden
	
	if (AC_FL_RunContent == 0) {
		alert("Dieser Fehler kann eigentlich nicht auftreten.");
	} else {
		for (var i = 0; i < newFlashObject.length; i += 2) {
			var curArg = newFlashObject[i+1];
			switch (newFlashObject[i]) {
				case "src": src = curArg; break;
				case "base": base = curArg; break;
				case "id": id = curArg; break;						
				case "flashvars": flashvars = curArg; break;
				case "width": width = curArg; break;
				case "height": height = curArg; break;
				case "version": version = curArg; break;
				case "bgcolor": bgcolor = curArg; break;
				case "allowFullScreen": allowFullScreen = curArg; break;
				case "allowScriptAccess": allowScriptAccess = curArg; break;						
				case "quality": quality = curArg; break;
				case "play": play = curArg; break;
				case "loop": loop = curArg; break;	
				case "devicefont": devicefont = curArg; break;
				case "menu": menu = curArg; break;
				case "scale": scale = curArg; break;
				case "wmode": wmode = curArg; break;
				case "align": align = curArg; break;
				case "salign": salign = curArg; break;
				case "style": style = curArg; break;
			}
		} 
		AC_FL_RunContent(
			'codebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+version,
			'width', width,
			'height', height,
			'src', src,
			'flashvars', flashvars,
			'base', base,
			'quality', quality,
			'pluginspage', 'http://www.macromedia.com/go/getflashplayer',
			'align', align,
			'play', play,
			'loop', loop,
			'scale', scale,
			'wmode', wmode,
			'devicefont', devicefont,
			'id', id,
			'bgcolor', bgcolor,
			'name', id,
			'menu', menu,
			'allowFullScreen', allowFullScreen,
			'allowScriptAccess', allowScriptAccess,
			'movie', src,
			'salign', salign,
			'style', style
		)
	}
}


// v1.7
// Flash Player Version Detection
// Detect Client Browser type
// Copyright 2005-2007 Adobe Systems Incorporated.  All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

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
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
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

function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
  var str = '';
  if (isIE && isWin && !isOpera)
  {
    str += '<object ';
    for (var i in objAttrs)
    {
      str += i + '="' + objAttrs[i] + '" ';
    }
    str += '>';

    for (var i in params)
    {
      str += '<param name="' + i + '" value="' + params[i] + '" /> ';
    }
    str += '</object>';
  }
  else
  {
    str += '<embed ';
    for (var i in embedAttrs)
    {
      str += i + '="' + embedAttrs[i] + '" ';
    }
    str += '> </embed>';
  }
  //alert(str);
  document.write(str);
}

function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_SW_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000"
     , null
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){	
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":	
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblclick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":	
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
      case "id":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "style":
				ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];	  
        break;					
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}
