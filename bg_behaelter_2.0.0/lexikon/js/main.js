// Globale Variablen
var aktuelles_verzeichnis;					// hier wird das aktuelle Verzeichnis der aktuell geöffneten Seite gespeichert
var kapitel_pfade = new Array();			// Array enthält die Pfade zu den einzelnen Modulen, wird von setPaths() gesetzt, Aufruf kommt von initialize.swf
var user_site = "";							// Seite die der User eventuell direkt geklickt hat
var user_chapter = "";						// beinhaltet das Kapitel von user_site
var user_modul = "";						// beinhaltet die Kapitel Nummer (index für kapitel_pfade), die z.B. geöffnet werden soll
var popup_open = 0;

// Window-Handles
var open_modul;								// Handle für das Hauptframeset
var lexikon;								// Handle für das Lexikonfenster
var notizfenster;							// Handle für das Notizfenster
var suchfenster;							// Handle für das Suchfenster
var bearbeitungsstand;						// Handle für das Bearbeitungsstandfenster
var impressum;								// Handle für das Impressumsfenster
// bei folgenden 2 Variablen prüfen wo und ob sie gebraucht werden, zur Not löschen

var dokumente_fenster;					//Handle für Dokumentfenster z.B. PDFs aus Querverweisen
var zusatz_fenster;						//Handle für Zusatzfenster z.B. für Grafiken, Tabellen


var prog_id = "bg_behaelter";

///////////////////////////////////////////////////////////////////////////////////
// zulässige Browser
//
// mögliche Attribute:
//		browser :( firefox | explorer | chrome | safari | ...)
//		vers, min_vers, max_vers : ein Zahl, z.B. 7.6
//		protocol : ( file | http )
var ok = [
	{ browser:"firefox", min_vers:3.6, os:"windows" },
	{ browser:"explorer", min_vers:7, os:"windows" }
];

///////////////////////////////////////////////////////////////////////////////////
// unzulässige Browser
//
// mögliche Attribute:
//		browser :( firefox | explorer | chrome | safari | ... )
//		vers, unter : ein Zahl, z.B. 7.6
//		protocol : ( file | http )
//		extra : wenn exisiert, wird eine extra Meldung ausgegeben

var ko = [
	{ browser:"firefox", unter:3.6, os:"windows" },
	{ browser:"explorer", unter:8, os:"windows" },
	{ browser:"chrome", os:"windows", protocol:"file", extra:true }
];


///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt den Array mit Browser kao/ok Kriterien zurück
//    Input: 
//   Output: 
// erstellt: 16.04.13
// geändert:
///////////////////////////////////////////////////////////////////////////////////////////
function browser_ok() { return ok; }
function browser_ko() { return ko; }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// falls ein Query-String existiert, werden hier die Variablen herausgefiltert und stehen somit im gesamten Programm 
// zur Verfügung, werden alle oder einzelne Variablen nicht übergeben, gelten die Startwerte aus der main.js
// Funktion: gibt je nach Browser das richtige Handle zur Ansprache des Flash-Films zurück
//    Input: 
//   Output: /
// erstellt: ausgelagert aus main_frameset 06.01.2012
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function get_query_vars() {
	if (window.location.search) {
		var var_string = window.location.search.substring(1, window.location.search.length);
		var var_array = var_string.split("&");
		var temp_var = [];
 	
		for (i = 0; i < var_array.length; i++) {
			temp_var = var_array[i].split("=");
			switch (temp_var[0].toLowerCase()) {
				case "session_id": session_id = temp_var[1]; break;
				case "ini_file": ini_file = temp_var[1]; break;
				case "media_quality": media_quality = temp_var[1]; break;
				case "user_site": user_site = temp_var[1]; break;
				case "user_chapter": user_chapter = temp_var[1]; break;
				case "user_modul": user_modul = temp_var[1]; break;
			}
		}
		//alert("var_string:"+var_string+"\nuser_chapter:"+this.user_chapter+"\nuser_site:"+this.user_site);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: liest alle übergebenen Parameter aus und übergibt sie an AC_FL_RunContent()
//    Input: newFlashObject:Array, beinhaltet alle Parameter
//   Output: /
// erstellt: 14.04.09
// geändert: 14.05.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
function insertFlashContent(newFlashObject) {
	// Initialisierung der benötigten Variablen
	var src = "";										// String:	Name der SWF-Datei inkl. Pfad, aber ohne Dateiendung ".swf"
	var base = "";										// String:	legt die Adresse eines Flash-Films für relative Pfade fest
	var id = "";										// String:	id (name), für Kommunktion mit der SWF
	var flashvars = "";									// String: 	Variablen in Form eines Query-Strings, aber ohne führendes "?"
	var width = null;									// Number: 	Breite des Flash-Films
	var height = null;									// Number: 	Höhe des Flash-Films
	var version = "8,0,0,0";							// String: 	benötigte Flash-Player-Version
	var bgcolor = "#ffffff";							// String: 	Hintergrundfarbe des Flash-Films
	var quality = "high";								// String: 	Qualität des Flash-Films, mögliche Werte: "low", "middle", "high"
	var allowFullScreen = false;						// Boolean:	Vollbildmodus, mögliche Werte: true, false
	var allowScriptAccess = "sameDomain";				// String:	Sicherheitseinstellung für Skripte,
														//          mögliche Werte:  "always", "never", "sameDomain"
	var play = true;									// Boolean:	setzt Autostart für Flash-Film, mögliche Werte: true, false
	var loop = false;									// Boolean:	setzt repeat für Flash-Film, mögliche Werte: true, false
	var devicefont = false;								// Boolean:	legt fest, ob die Texte in einem Flash Player-Film durch Geräteschriften oder die eingebetteten Schriftkonturen dargestellt werden sollen, mögliche Werte: true, false
	var menu = false;									// Boolean:	legt fest, ob das Kontextmenü bei der Wiedergabe eines Flash Player-Films komplett zur Verfügung steht, mögliche Werte: true, false
	var scale = "showall";								// String:	skaliert den Flash-Film, mögliche Werte: "showall", "noscale", "noborder", "exactfit"; weitere Infos: http://kb2.adobe.com/cps/141/tn_14149.html
	var wmode = "window";								// String:	Sichtbarkeit des Flash-Films in Website, mögliche Werte: "window", "opaque", "transparent"
	var align = "middle";								// String:	legt den Textfluss um den Flash-Film herum fest, mögliche Werte: "middle" (Standardwert), "t", "r", "b", "l"
	var salign = "";									// String:	legt fest, wie der Flash-Film innerhalb des durch WIDTH und HEIGHT festgelegten Bereiches platziert wird, mögl. Werte: "t", "r", "b", "l", "tr" etc.
	var style = "";										// String:	Inline-Styles können so einfach mit bei der Einbettung angegeben werden
	
	if (AC_FL_RunContent == 0) {
		alert("Diese Seite erfordert die Datei \"AC_RunActiveContent.js\".");
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

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: versucht den übergebenen string zu interpretieren
//    Input: javascript:String
//   Output: /
// erstellt: 04.01.2012
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function eval_string(my_string) {
//	alert("eval_message:"+my_string);
	eval(my_string);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: öffnet den entsprechenden Praxisteil aus dem Hauptmenü heraus
//    Input: praxisteil:String = Name des Praxisteils (Optionen: zugversuch, kerbschlag) 
//					 location:String = von wo Praxisteil gestartet wird (Optionen: menu, modul)
//   Output: /
// erstellt: 20.08.09
// geändert: 24.08.09 (location[Ort des Aufrufs] eingefügt)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function praxisteil_starten(praxisteil, location) {
	if (top.allow_praxisteil) {
		if (location == "menu") {
			praxisteil = window.open("praxisteil/"+praxisteil+"/praxisteil_"+praxisteil+".htm", "Praxisteil", "width=778,height=600,left=50,top=50");
		} 
		else if (location == "modul") {
			praxisteil = window.open("../praxisteil/"+praxisteil+"/praxisteil_"+praxisteil+".htm", "Praxisteil", "width=778,height=600,left=50,top=50");		
		}
		praxisteil.focus();
	} else {
		alert(top.deny_msg_praxisteil);
	}
}
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: öffnet das Impressum aus dem Hauptmenü heraus
//    Input: /
//   Output: /
// erstellt: 14.04.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function impressum_oeffnen() {
	top.impressum = window.open("impressum.htm", "impressum", "width=550,height=450,left=50,top=50,status=yes,scrollbars=yes,resizable=yes,menubar=no,dependent=yes");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: erzeugt Array mit den Pfaden zu den einzelnen Modulen, wird von initialize.swf aufgerufen
//    Input: path:String
//   Output: kapitel_pfade:Array
// erstellt: 14.04.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setPaths(path) {
	top.kapitel_pfade = path.split(",");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt Soundpfad an Flashfilm weiter, ob Off- oder Online Version
//    Input: /
//   Output: pfad_url:String (beinhaltet Pfad und Dateiname)
// erstellt: 01.01.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pfad_wiedergabe() {
	var pfad_url;
	var pfad_datei = get_url();
	pfad_datei = pfad_datei.substring(12, pfad_datei.length-3);
	pfad_url = top.media_path+pfad_datei;
	return pfad_url;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: blendet Popups ein oder aus, prüft vorher ob noch ein Popup offen ist, wenn ja wird es vorher geschlossen
//    Input: name_popup:String (Name, in dem Fall die ID des einzublendenden Popup-DIVs)
//   Output: /
// erstellt: 12.10.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var open_popup = ""; // speichert den Namen des aktuell geöffneten Popups
function showHidePopup(name_popup) {
	if(name_popup == "" || name_popup == undefined) { // Popup ausblenden und open_popup auf "" setzen
		if(open_popup != "") {
			document.getElementById(open_popup).style.visibility = "hidden";
			open_popup = "";
		}
	} else {
		if(open_popup != name_popup && open_popup != "") document.getElementById(open_popup).style.visibility = "hidden"; // evtl. geöffnetes Popup ausblenden
		showHideBubble(""); // evtl. geöffnetes Bubble ausblenden
		document.getElementById(name_popup).style.visibility = "visible"; // neues Popup einblenden
		open_popup = name_popup; // Wert für aktuell geöffnetes Popup neu setzen
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: blendet Bubbles ein oder aus, prüft vorher ob noch ein Bubble offen ist, wenn ja wird es vorher geschlossen
//    Input: name_bubble:String (Name, in dem Fall die ID des einzublendenden Bubble-DIVs)
//   Output: /
// erstellt: 13.10.09
// geändert: 14.10.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var open_bubble = ""; // speichert die Namen des aktuell geöffneten Bubble
function showHideBubble(name_bubble) {
	if(name_bubble == "" || name_bubble == undefined) { // wird kein Wert an Funktion übergeben soll Bubble ausgeblendet werden
		if(open_bubble != "") { // Bubble ausblenden und open_bubble auf "" setzen
			document.getElementById(open_bubble).style.visibility = "hidden";
			open_bubble = "";
		}
	} else {
		showHidePopup(); // evtl. geöffnetes Popup ausblenden
		if(open_bubble != name_bubble && open_bubble != "") document.getElementById(open_bubble).style.visibility = "hidden"; // evtl. geöffnetes Bubble ausblenden
		document.getElementById(name_bubble).style.visibility = "visible"; // neues Bubble einblenden
		open_bubble = name_bubble; // Wert für aktuell geöffnetes Bubble neu setzen
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: öffnet neues Fenster (dokument_container.htm) und lädt dort das angegebene Dokument z.B. Grafiken
//    Input: dok_url:String, z.B. "../pdf/xyz.pdf"
//   Output: neues Fenster (dokument_container.htm), Pfad + Dateiname d. Dokuments werden als Query-String angehängt
// erstellt: 23.02.09 (vorheriger Code dieser Funktion war älter und wurde überschrieben)
// geändert: 24.02.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function kleines_fenster(dok_url, breite, hoehe) {
  	var l = (screen.availWidth - breite) / 2;
  	var t = (screen.availHeight - hoehe) / 2;
  	if (l < 0) {l = 0;}
  	if (t < 0) {t = 0;}	
	
	if (top.zusatz_fenster && !top.zusatz_fenster.closed) {
		top.zusatz_fenster.close();	
	}
	top.zusatz_fenster = window.open(dok_url, "dokfenster", "width="+breite+",height="+hoehe+",screenX="+l+",screenY="+t+",left="+l+",top="+t+",status=yes,scrollbars=no,resizable=yes,menubar=no,dependent=yes");	
	top.zusatz_fenster.focus();
}

function isChrome() {
	if (navigator.userAgent) {
		if (navigator.userAgent.indexOf("Chrome") != -1)
			return true;
	}
	return false;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: öffnet das MainFrameset mit übergebener URL und Größen, ggf. wird eine Seite nachgeladen wenn im falschen Kontext geöffnet
//    Input: URL(Name der Datei inkl. Pfad, falls benötigt), Breite und Höhe des zu öffnenden Fenster, werden mit URL auch 
//			 Parameter übergeben werden diese beim öffnen d. Framesets mit übergeben, evtl. wird noch die session eingefügt
//   Output: neues Fenster
// erstellt: 10.03.09
// geändert: 25.05.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openMainFrameset(url, breite, hoehe, reload_url) {
	// Wenn Flash nicht installiert, dann Frameset nicht öffnen
	var l = (screen.availWidth - breite) / 2;
	var t = (screen.availHeight - hoehe) / 2;

	// Wird aufgerufen wenn Popups verboten sind (alle Browser)
	function popups_verboten() {
		open_modul && open_modul.close();
		alert("Das Programm kann nicht im richtigen Kontext angezeigt werden. Schalten Sie bitte ggf. den Popup-Blocker aus.");
	}

	if (l < 0) {
		l = 0;
	}
	if (t < 0) {
		t = 0;
	}	

	// ausführen, wenn aufrufende Seite schon Query-String enthält z.B. index.htm enthält session
	if (window.location.search) {
		location_param = window.location.search.split("?");
		// ausführen wenn die aufzurufende URL einen Query-String besitzt z.B. media_quality bzw. media_path etc.
		if (url.indexOf("?") > -1) {
			url_param = url.split("?");
			url = url_param[0] + "?" + location_param[1] + "&" + url_param[1];			
		} else {
			url = url + "?" + location_param[1];
		}
	}

	// Popupfenster oeffnen
	open_modul = window.open(url, "Hauptfenster_"+top.prog_name, "width="+breite+",height="+hoehe+",screenX="+l+",screenY="+t+",left="+l+",top="+t+",status=yes,scrollbars=no,resizable=yes,menubar=no,toolbar=no");



	//wenn das Nachladen des Framesets durch popupblocker verhindert wird, Hinweis zeigen
	if(!isChrome()) {
		if(!open_modul || open_modul.closed || parseInt(open_modul.innerWidth) == 0) {
			popups_verboten();
		}
		
		// falls ein Seite zum nachladen uebergeben wurde, wird sie nachgeladen
		if(reload_url && reload_url.length>0) {
			try {
				top.location.href = reload_url;
			} catch (e) {
				alert(e);	
			}
		}
	} else {
		// fuer Chrome
		// trotz popupblocker existiert zwar das handle open_modul, man kann aber nicht auf alle Eigenschaften zugreifen.
		// Zur Überprüfung wird die Funktion test() im Popup aufgerufen
		setTimeout(function() {
			if(open_modul)
			{
				if(!open_modul.test()) {
					popups_verboten();
				}
			}
			// falls ein Seite zum nachladen uebergeben wurde, wird sie nachgeladen
			if(reload_url && reload_url.length>0) {
				top.location.href = reload_url;
			}
		}, 600);
	}

	open_modul.focus();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: verlinkt Seiten untereinander und prüft ob möglich und überhaupt zugelassen, z.B. für Demos abschaltbar
//    Input: chapter:String (Kapitel in dem die Seite vorkommt, Name muss der Schreibweise aus der ini-Datei entsprechen)
//					 name_page:String (Name der HTML-Seite inkl. Dateiendung, z.B. X123.htm)
//   Output: /
// erstellt: 15.10.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var chapter = "";
var name_page = "";
function crossReference(chapter, name_page) {
	if(top.allow_reference) { // Querverweise sind aktiviert
		// wenn chapter und name_page übergeben wurden
		if((chapter != "") && (chapter != undefined) && (name_page != "") && (name_page != undefined)) { // Kapitel/Seite wurden übergeben
			// prüfen ob Kapitel im Programm existiert, bei Modulversionen evtl. nicht enhalten
			for(var i = 0; i < top.kapitel_pfade.length; i++) {
				if(top.kapitel_pfade[i].indexOf(chapter) != -1) { // Prüfung erfolgreich, Kapitel existiert, Seite aufrufen
					//parent.mainFrame.location.replace ("../"+chapter+"/"+name_page);
					top.Inhalt.mainFrame.location.href = "../"+chapter+"/"+name_page;
					break;
				}
			}
		} else { // Kapitel und/oder Seite fehlen
			alert("Das Kapitel und/oder die verlinkte Seite wurden nicht übergeben!");
		}
 	} else { // Querverweise sind deaktiviert
		alert(top.deny_msg_reference);
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: überprüft, ob Datei im Frameset geladen wurde. Wenn es kein Frameset gibt, dann wird die index.html Datei aufgerufen
//			 welche als Parameter die zu öffnende Seite erhält.
//    Input: aktuelles_verzeichnis:String, in welchem Ordner sich die aktuelle Datei befindet. wird benötigt, um festzustellen, 
//			 ob das Inhaltsverzeichnis und die Navigationsleiste zur aktuellen Seite passen
//   Output: /
// erstellt: 01.01.09
// geändert: 29.04.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function nav_aktualisieren(aktuelles_verzeichnis) {
	console.log('nav_aktualisieren( '+aktuelles_verzeichnis+' )');
	// Name der aktuellen Seite und des Kapitels werden extrahiert
	site = location.href.substring(location.href.lastIndexOf("/")+1, location.href.length);
	temp_chapter = location.href.substring(0, location.href.lastIndexOf("/"));
	chapter = temp_chapter.substring(temp_chapter.lastIndexOf("/")+1, temp_chapter.length)
	
	//überprüfen, ob die Datei im richtigen Frameset geladen wurde
	if (top.frames.length == 0 || parent.frames[2].name != "mainFrame")	{	// keine oder falsche Frames geladen
		openMainFrameset("../main_frameset.htm?user_site="+site+"&user_chapter="+chapter, 1010, 673,"../../index.htm");
		//top.location.href = "../../index.htm";
	} else {
		// NAV-frame überprüfen, welcher Kapitelname enthalten ist
		if (parent.leftFrame.location.href.indexOf(chapter) <= 0) {
			//parent.location.replace(aktuelles_verzeichnis+"frameset.htm?"+location.href.substring(location.href.lastIndexOf("/")+1, location.href.length));
			//parent.location.href = aktuelles_verzeichnis+"frameset.htm?"+location.href.substring(location.href.lastIndexOf("/")+1, location.href.length);
			// Damit history bei Querverweisen zwischen Kapiteln funktioniert, darf der Inhaltsframeset nicht ausgetauscht werden.
			parent.topFrame.location.replace("../"+chapter+"/top.htm");
			parent.leftFrame.location.replace("../"+chapter+"/nav.htm");
			parent.bottomFrame.location.replace("../"+chapter+"/subnav.htm");			
			
     	} else {
			//console.log('nav_aktualisiern: aufrufen()');
			try {
				//Inhalt synchronisieren
				parent.leftFrame.aufrufen();
			} catch (e) {
				console.log(e);	
			}
		}
		// aktuelle Seite und Kapitel abspeichern 
		try {
			parent.bottomFrame.saveCurPos(chapter, site);	
		} catch (e) {
			console.log(e);	
		}
	}
	
		// Notizfenster aktualisieren
	notizen_aktualisieren();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Aktualisiert das Fenster Bearbeitungsstand, wenn das Fenster geöffnet ist. Wird aus Flash z.B. beim Speichern der
// Übungsdaten in einer Übung aufgerufen.
//    Input: 
//   Output: /
// erstellt: 25.04.12
// geändert: 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bearbeitungsstand_aktualisieren() {
	if (top.bearbeitungsstand && !top.bearbeitungsstand.closed) {
		top.bearbeitungsstand.inhalte_aktualisieren(); //ruft callbackfunktion im Bearbeitungsstand auf
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: öffnet das Bearbeitungsstandfenster
//    Input: verzeichnis:String
//   Output: /
// erstellt: 01.01.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function bearbeitungsstand_sprung(verzeichnis) {
	if (top.bearbeitungsstand && !top.bearbeitungsstand.closed) {
			top.bearbeitungsstand.focus();
	} else {
		if( isChrome() ) {
			top.bearbeitungsstand = window.open("../bearbeitungsstand.htm?"+verzeichnis, "bearb_stand", "width=497,height=674,screenX=10,screenY=10,scrollbars=no,resizable=yes,status=yes,menubar=no");
		} else {
			top.bearbeitungsstand = window.open("../bearbeitungsstand.htm?"+verzeichnis, "bearb_stand", "width=481,height=674,screenX=10,screenY=10,scrollbars=no,resizable=yes,status=yes,menubar=no");
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt den aktuellen Dateinamen mit übergeordnetem Ordner + ".." davor, um ihn mit dem Dateinamen in der XML-Datei 
//			 vergleichen zu können
//    Input: /
//   Output: html_url:String
// erstellt: 01.01.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function get_url() {
	bis_letzter_slash = document.location.href.substring(0, document.location.href.lastIndexOf("/"));
	vorletzter_slash = bis_letzter_slash.lastIndexOf("/");
	html_url = ".."+document.location.href.substring(vorletzter_slash, document.location.href.length);
	if (html_url.indexOf("?") > -1) {
		html_url = html_url.slice(0, html_url.indexOf("?"));
	}
	return html_url;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Bei einem Kapitelwechsel andere Fenster und Titel aktualisieren
//    Input: modul_name:String (kommt aus modul.js in den jewiligen Kapiteln)
//   Output: Titel des anzeigenden Framsets wird angepaßt
// erstellt: 01.01.09
// geändert: 26.04.12
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function kapitel_synchronisieren(modul_name) {
	top.document.title = modul_name;

	//berarbeitungsstand und Notizen synchronisieren, wenn geöffnet
	if (top.bearbeitungsstand) {
		if (!top.bearbeitungsstand.closed) {
			top.bearbeitungsstand.location.href = "../bearbeitungsstand.htm?"+aktuelles_verzeichnis;
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: falls ein Fenster dass auf resizable=no gestellt ist, trotzdem skaliert wird (z.B. Netscape oder Firefox) wird das
//			 Fenster nach dem skalieren wieder auf seine ursprüngliche Größe zurückgesetzt
//    Input: breite:Number, hoehe:number
//   Output: /
// erstellt: 01.01.09 
// geändert: 11.05.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function new_size() {
	if (window.innerWidth) {
		window.innerWidth = top.breite;
		window.innerHeight = top.hoehe;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: nächsten Begriff suchen und Lexikon in den Vordergrund bringen
//    Input: aktuelleseite:String (beinhaltet die zu öffnende Lexikonseite)
//   Output: /
// erstellt: 01.01.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function naechster_begriff(aktuelleseite) {
	// wenn keine aktuelleseite übergeben wird, erhält das Lexikon-Fenster nur den Focus
	if (aktuelleseite == "") {
	  	lexikon.focus();
	} else {	// ansonsten wird der aktuelle Begriff mit oder ohne führende 0 aufgerufen
		if (aktuelleseite < 10) {
	    	sprungziel = "../lexikon/lex_zpv-0"+aktuelleseite+".htm";
		} else {
			sprungziel = "../lexikon/lex_zpv-"+aktuelleseite+".htm";
		}
		lexikon.frames[3].location.href = sprungziel;
		lexikon.focus();
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: überprüft, ob Lexikon schon offen ist
//    Input: seite:String (beinhaltet die zu öffnende Lexikonseite)
//   Output: /
// erstellt: 01.01.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lex_sprung(seite) {
	if (lexikon) {
		if (!lexikon.closed) {
			offen = true;
			this.begriff_suchen(seite, offen);
		} else {
			offen = false;
        	this.begriff_suchen(seite, offen);
		}
	} else {
		offen = false;
		this.begriff_suchen(seite, offen);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: öffnet die Suchseite
//    Input: /
//   Output: /
// erstellt: 01.01.09
// geändert: 16.12.09 geändert wie in BG Behälter: EinSuchfenster für alle Programmteile
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function suche_sprung(search_page, search_frameset_path) {
	search_frameset_path = search_frameset_path || '../../suche/';
	if (top.allow_search) {
		if (suchfenster) {
			if (!suchfenster.closed) { // das Suchfenster wurde noch nicht wieder geschlossen
				suchfenster.location.href = search_frameset_path+"search_frameset.htm?"+search_page;
				suchfenster.focus();
			} else {					// Suchfenster wurde vom Benutzer geschlossen
				suchfenster = window.open( search_frameset_path+"search_frameset.htm?"+search_page,"suchfenster","width=450,height=640,screenX=10,screenY=10,status=yes,scrollbars=auto,resizable=no,menubar=no");
			}
		} else {                        // Suchfenster war noch nicht offen
			suchfenster = window.open( search_frameset_path+"search_frameset.htm?"+search_page,"suchfenster","width=450,height=640,screenX=10,screenY=10,status=yes,scrollbars=auto,resizable=no,menubar=no");
		}
	} else {
		alert(top.deny_msg_search);
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: überprüft, ob Notizfenster schon offen ist
//    Input: seiten_id, seiten_titel, aktuelleseite, aktuelles_verzeichnis
//   Output: /
// erstellt: 01.01.09
// geändert: 23.04.09
// geändert: 13.03.13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function notiz_sprung(aktuelle_seite, aktuelles_kapitel) {
	var url = "../notiz.htm?prog_name="+top.prog_name+"&aktuelle_seite="+aktuelle_seite+"&aktuelles_kapitel="+aktuelles_kapitel;
	if( notizfenster && !notizfenster.closed ) {
	    notizfenster.location.href = url;
		notizfenster.focus();
	} else {
		if( isChrome() ) {
			notizfenster = window.open( url, "notiz_fenster", "width=416,height=500,screenX=10,screenY=10,status=yes,scrollbars=no,resizable=no,menubar=no");
		} else {
			notizfenster = window.open( url, "notiz_fenster", "width=400,height=500,screenX=10,screenY=10,status=yes,scrollbars=no,resizable=no,menubar=no");
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: öffnet Zusatzdokumente (z.B. PDF) in einem neuen Fenster
//    Input: /
//   Output: /
// erstellt: 01.01.09
// geändert: 09.04.13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// neu von 09.04.13
function dokumente_sprung( url ) {
	if( top.dokumente_fenster && !top.dokumente_fenster.closed ) {
//	    top.dokumente_fenster.location.href = url;
//		top.dokumente_fenster.focus();
		top.dokumente_fenster.close();
	}
//	else { top.dokumente_fenster = window.open( url, "dokumente_fenster" );	}
	
	top.dokumente_fenster = window.open( url, "dokumente_fenster" );
}


//function dokumente_sprung(dok_url, breite, hoehe) {
// verweis_art: 2 - PDF, 3 - internet
/*
function dokumente_sprung( url, verweis_art ) {

	if (dokumente_fenster && !dokumente_fenster.closed) {
		dokumente_fenster.close();	
	}
	if( verweis_art == 2 ){
		dokumente_fenster = window.open( url,"dokumente_fenster", "status=yes,scrollbars=yes,resizable=yes,menubar=no,dependent=yes");	
	} else {
		dokumente_fenster = window.open( url,"dokumente_fenster", "status=yes,scrollbars=yes,resizable=yes,menubar=yes,dependent=yes");	
	}

	//	dokumente_fenster = window.open("dokument_container.htm?"+dok_url,"dokfenster","width="+breite+",height="+hoehe+",screenX="+l+",screenY="+t+",left="+l+",top="+t+",status=yes,scrollbars=yes,resizable=yes,menubar=no,dependent=yes");	
}
*/


/*
	// alt
function dokumente_sprung() {
	if (top.dokumente) {
		if (!top.dokumente.closed) {
			top.dokumente.focus();
		} else {
           top.dokumente = window.open("dokumente/dok1.htm", "dokumente", "width=850,height=600,screenX=10,screenY=10,scrollbars=yes,resizable=yes,status=yes,menubar=no");
		}
	} else {
	  	top.dokumente = window.open("dokumente/dok1.htm", "dokumente", "width=850,height=600,screenX=10,screenY=10,scrollbars=yes,resizable=yes,status=yes,menubar=no");
	}
}

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: schliesst alle noch offenen Fenster (Notizen, Suche, Lexikon, Bearbeitungsstand)
//    Input: /
//   Output: /
// erstellt: 01.01.09
// geändert: 29.04.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function alles_schliessen() {
	if (notizfenster && !notizfenster.closed) {
		notizfenster.close();
	}
	if (suchfenster && !suchfenster.closed) {
	  	suchfenster.close();
	}
	if (bearbeitungsstand && !bearbeitungsstand.closed) {
	  	bearbeitungsstand.close();
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: schliesst Bearbeitungsstandfenster
//    Input: /
//   Output: /
// erstellt: 02.05.12
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function bearbeitungsstand_schliessen() {
	close();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: schliesst Bearbeitungsstandfenster
//    Input: /
//   Output: /
// erstellt: 02.05.12
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function reload_uebung() {
//	alert(opener.frames[0].frames[2].location);
//	opener.frames["Inhalt"].frames[2].location.reload();
//	alert(opener.Inhalt.mainFrame.location);
	opener.Inhalt.mainFrame.location.reload();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: schliesst alle noch offenen Fenster des Hauptmenüs, z.B. das Impressum
//    Input: /
//   Output: /
// erstellt: 25.05.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function closeMainMenuWindows() {
	if (top.impressum && !top.impressum.closed) {
		top.impressum.close();	
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: zu Popuptesten fuere Chrom.
// 				Die Funktion wird in einem geoeffnetem Popupfenster nach einige Zeit aufgerufen(z.B 600 ms)
//				damit man sicher ist, dass das Fenster aufgebaut wurde. Wenn innerHeight-Parameter immer noch 0 ist
// 				dann ..
//    Input: /
//   Output: /
// erstellt: 25.05.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function test() { if(window.innerHeight!=0){return true;} else return false; }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt eine Meldung aus, das ein Funktionalität nicht zu Verfuegung steht
//    Input: /
//   Output: /
// erstellt: 14.06.12
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function nichtVerfuegbar(meldung) {
	if(meldung) {
		alert(meldung)
	} else {
		alert('Diese Funktion steht erst in Kürze zur Verfügung.');
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: registriert Handler Ereignises von bestimmten Typ an einem Objekt
//			 funktioniert in IE
//    Input: ein DOM-Objekt(zB document), Eventtyp (zB keydown, mouseover), Funktion(ein Handler)
//   Output: /
// erstellt: 14.08.12
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addEvent( obj, type, fn )
{
//	console.log("addEvent");
	if (obj.addEventListener) {
		obj.addEventListener( type, fn, false );
	} else if (obj.attachEvent) {
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
		obj.attachEvent( "on"+type, obj[type+fn] );
	}
}


// loescht einen Handler
function removeEvent( obj, type, fn )
{
   if (obj.removeEventListener) {
      obj.removeEventListener( type, fn, false );
   } else if (obj.detachEvent) {
      obj.detachEvent( "on"+type, obj[type+fn] );
      obj[type+fn] = null;
      obj["e"+type+fn] = null;
   }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: ein Handler zum Navigieren mit Tastatur(Pfeiltasten links/rechts)
//    Input: 
//   Output: /
// erstellt: 14.08.12
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function navigiere(event)
{
	// den gedruckten Button bestimmen
	var key = event.keyCode;
	
	switch(key){
		case 37: // Pfeil nach links (Zurück)
			seitezur();
		break;
		case 39: // Pfeil nach rechts (Weiter)
			seitevor();
		break;
		default:
		break;
	}

	// Alle andere Events abschalten
	event.cancelBubble = true; //Eventauftauchen abschalten
	event.returnValue = false; //Standartverhalten abschalten
		//dasselbe für die Mozilla
	if(event.preventDefault) event.preventDefault(); 
	if(event.stopPropagation) event.stopPropagation();

}


///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt je nach Browser das richtige Handle zur Ansprache des Flash-Films zurück
//    Input: movieName:String
//   Output: 
// erstellt: 28.04.09
// geändert: 13.09.12
///////////////////////////////////////////////////////////////////////////////////////////
function getFlashMovie(frame, movieName) {
	var movie_element;
	if (navigator.appName.indexOf("Microsoft") != -1) {
		movie_element = frame.window[movieName];
	} else {
		movie_element = frame.document[movieName];
	}
	return movie_element;
}

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: lädt nächste Seite in mainFrame ( falls möglich )
//    Input: 
//   Output: 
// erstellt: 07.12.12
// geändert: 
///////////////////////////////////////////////////////////////////////////////////////////
function seitevor() {
	var movie = getFlashMovie(top.Inhalt.bottomFrame, "subnavi");
	if( movie && movie.seitevor ) {
		movie.seitevor();
	}
}

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: lädt vorherige Seite in mainFrame ( falls möglich )
//    Input: 
//   Output: 
// erstellt: 07.12.12
// geändert:
///////////////////////////////////////////////////////////////////////////////////////////
function seitezur() {
	var movie = getFlashMovie(top.Inhalt.bottomFrame, "subnavi");
	if( movie && movie.seitezur ) {
		movie.seitezur();
	}
}



///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: lädt vorherige Seite in mainFrame ( falls möglich )
//    Input: 
//   Output: 
// erstellt: 07.12.12
// geändert:
///////////////////////////////////////////////////////////////////////////////////////////
/*
function sprung_seite(seite) {
	top.opener.frames[2].location.href = seite;
}
*/


///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: öffnet das Notizenfenster für die aktuelle Seite in mainFrame
//    Input: 
//   Output: 
// erstellt: 18.03.13
// geändert:
///////////////////////////////////////////////////////////////////////////////////////////
function notiz_oeffnen() {
	var url = top.Inhalt.mainFrame.location.href;
	var temp_chapter = url.substring(0, url.lastIndexOf("/"));
	var aktuelles_kapitel = temp_chapter.substring(temp_chapter.lastIndexOf("/")+1, temp_chapter.length);
	aktuelle_seite = url.substring( url.lastIndexOf("/")+1, url.length );

//	alert( "aktuelle_seite:"+aktuelle_seite+"\naktuelles_kapitel:"+aktuelles_kapitel );
	
	// aus der Navigationsleiste heraus das Notizfenster öffnen
	top.notiz_sprung(aktuelle_seite, aktuelles_kapitel);
}


///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Notizenfenster nur öffnen, wenn es schon geöffnet ist 
//    Input: 
//   Output: 
// erstellt: 18.03.13
// geändert:
///////////////////////////////////////////////////////////////////////////////////////////
function notizen_aktualisieren(){
		// Falls Notizfenster geöffnet ist, dann aktualisieren
	if( top.notizfenster && !top.notizfenster.closed) {
		notiz_oeffnen();
	}
}


///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: laedt Hauptmenu in den aktuellen Frameset
//    Input: 
//   Output: 
// erstellt: 16.04.13
// geändert:
///////////////////////////////////////////////////////////////////////////////////////////
function hauptmenue_laden() {
//	alert("hauptmenue");
	top.document.getElementById('Inhalt').src = hauptmenue; // eine Konstante aus prog_vars.js
//	top.Inhalt.mainFrame.location.href = hauptmenu; // eine Konstante aus prog_vars.js
}

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: laedt eine Seite in den aktuellen Frameset
//    Input: 
//   Output: 
// erstellt: 16.04.13
// geändert:
///////////////////////////////////////////////////////////////////////////////////////////
function url_laden( url ) {
//	alert( url );
	top.document.getElementById('Inhalt').src = url;
//	top.Inhalt.mainFrame.location.href = url;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: zeigt bubble (x) bei mouseover und schließt alle popups (y)
//    Input: x = Pop-Up (Div) welches angezeigt werden soll, y = Anzahl der Pop-Ups im Dokument insgesamt
//   Output: /
// erstellt: 04.08.08
// geändert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function show_bubble(x,y) {
	if (popup_open == 1) {
		hide_popup(y);
	}
	document.getElementsByTagName("div")[x].style.visibility = "visible";
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: versteckt alle Bubbles, wenn kein popup offen ist. Notwendig, um in Bilder zu zoomen, da beim öffnen eines popups
//           hide_bubble durch OnMouseOut aufgerufen wird.
//    Input: n = Anzahl aller Popups im Dokument
//   Output: /
// erstellt: 04.08.08
// geändert: 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function hide_bubble(n) {       
	if (popup_open == 0) {
		hide_popup(n);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: zeigt Popup an
//    Input: x = Popup (Div) welches angezeigt werden soll, Zahl ergibt sich aus der Reihenfolge im Dokument (Div-Array des Browsers)
//   Output: /
// erstellt: 01.01.08
// geändert: 04.08.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function show_popup(x) {
	document.getElementsByTagName("div")[x].style.visibility = "visible";
	popup_open = 1;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: versteckt alle Popups
//    Input: n = maximale Anzahl aller Popups (Divs) im Dokument
//   Output: /
// erstellt: 01.01.08
// geändert: 04.08.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function hide_popup(n) {       
	for (x = 1; x < (n+1); x++){		
		document.getElementsByTagName("div")[x].style.visibility = "hidden";
	}
	popup_open = 0 ;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: öffnet Fenster ohne Scrollbars, Menü und nicht resizable, mit übergebenen Größen, Namen und Event Handler, wird
//           die Funktion ohne Sprungziel aufgerufen wir das Fenster, falls geöffnet, geschlossen
//    Input: sprungziel (Seite), Breite und Höhe des zu öffnenden Fenster und Name
//   Output:
// erstellt:
// geändert: 20.11.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function fenster_mit_handle(sprungziel, breite, hoehe, name) {
	if (sprungziel == undefined) {
		if (parent.window_handle && !parent.window_handle.closed) {
			parent.window_handle.close();
		}
	}
	else {
		// prüft ob schon ein Fenster geöffnet wurde und falls ja wird es geschlossen und das neue geöffnet
		if (parent.window_handle) {
			parent.window_handle.close();			
		}
		// schreibt das Window-Handle in den mainFrame, damit beim schließen des Framesets geprüft werden kann, ob ein Fenster offen ist und ggf. geschlossen wird
		parent.window_handle = window.open(sprungziel,name,"width="+breite+",height="+hoehe+",screenX=10,screenY=10,status=yes,scrollbars=no,resizable=no,menubar=no");
		parent.window_handle.focus();
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Seite mit Video öffnen, wird show_video ohne "url" aufgerufen wird das Videofenster, falls geöffnet, geschlossen
//    Input: URL der Seite, Höhe und Breite des Fensters
//   Output: öffnet neues Fenster mit der angegebenen Seite bzw. schließt dieses
// erstellt: 10.09.08
// geändert: 20.11.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function show_video( url, breite, hoehe ) {
	if ( url == undefined || url == "" || url == " " ) {
		if ( typeof videofenster !== "undefined" && !videofenster.closed ) {
			videofenster.close();
		}
	} else {
		if ( typeof videofenster !== "undefined" && !videofenster.closed ) {
			videofenster.close();
		}
		videofenster = window.open(url,"videofenster","width="+breite+",height="+hoehe+",screenX=100,screenY=100,status=no,scrollbars=no,resizable=no,menubar=no");
		videofenster.focus();
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: ändert den angezeigten Titel des Framesets
//    Input: var modul_name, kommt aus der modul.js des jeweiligen Kapitels und wird bei Aufruf der Inhaltsseiten ausgeführt
//   Output: Titel aus Modulname wird in Title des Hauptframesets geschrieben
// erstellt: 04.08.08
// geändert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function titel_anpassen(modul_name) {
	top.document.title = modul_name;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Schliesst aktuelles venster und geht zum opener
//    Input: 
//   Output: 
// erstellt: 04.08.08
// geändert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ins_hauptmenue() {
	if (top.opener) {
		if(!top.opener.closed) {
			top.opener.focus();	
		} else {
			window.open("../index.htm","startseite");	
		}				
	} else {
		window.open("../index.htm","startseite");	
	}
	top.close();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: wird im Flash-Popup des Screens 2.4 "Gefährdungen und Schutzmaßnahmen im Überblick" benutzt um in die einzelnen 
// 			 Kapitel der Fachinformationen zu springen
//    Input: var thisURL, enthält Seite in die gesprungen werden soll
//   Output: Aufruf der Funktion browser_sniffer_ohne_frameset() inkl. der frameset.htm
// erstellt: 01.05.08
// geändert: 01.12.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function kapitelsprung_fachinfo(thisURL){
	opener.location.href = thisURL;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Lexikon öffnen wenn es noch nicht offen ist
//    Input:
//   Output:
// erstellt:
// geändert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lex_oeffnen(aktuelleseite) {
//	alert('lexikon oeffnen');
	if (!aktuelleseite) { 
		sprungziel = "../../lexikon/frameset.htm";
	} else {
		if (aktuelleseite < 10) {
	    	sprungziel = "../../lexikon/frameset.htm?lex_bg-0"+aktuelleseite+".htm";
		} else {
	    	sprungziel = "../../lexikon/frameset.htm?lex_bg-"+aktuelleseite+".htm";
		}
	}
	lexikon = window.open(sprungziel,"lexikonfenster","width=900,height=600,screenX=10,screenY=10,status=yes,scrollbars=no,resizable=yes,menubar=no");
}

/*
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Lexikon öffnen wenn es noch nicht offen ist
//    Input: aktuelleseite:String (beinhaltet die zu öffnende Lexikonseite)
//   Output: /
// erstellt: 01.01.09
// geändert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lex_oeffnen(aktuelleseite) {
	if (top.allow_lexikon) {
		if (aktuelleseite == "") { 
				sprungziel = "../lexikon/frameset.htm";
		} else {
				if (aktuelleseite < 10) {
					sprungziel = "../lexikon/frameset.htm?lex_zpv-0"+aktuelleseite+".htm";
				} else {
					sprungziel = "../lexikon/frameset.htm?lex_zpv-"+aktuelleseite+".htm";
				}
		}
		lexikon = window.open(sprungziel, "lexikonfenster", "width=910,height=600,screenX=10,screenY=10,status=yes,scrollbars=no,resizable=yes,menubar=no");
	} else {
		alert(top.deny_msg_lexikon)
	}
}
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: nächsten Begriff suchen und Lexikon in den Vordergrund bringen
//    Input:
//   Output:
// erstellt:
// geändert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function naechster_begriff(aktuelleseite) {
	// wenn keine aktuelleseite übergeben wird, erhält das Lexikon-Fenster nur den Focus
	if (aktuelleseite == "") 	{
		lexikon.focus();
	}
	// ansonsten wird der aktuelle Begriff mit oder ohne führende 0 aufgerufen
	else 	{
		if (aktuelleseite < 10) {
			sprungziel="../lexikon/lex_bg-0"+aktuelleseite+".htm";
	  	}
	  	else {
	  	  	sprungziel="../lexikon/lex_bg-"+aktuelleseite+".htm";
	  	}
	  	lexikon.frames[3].location.href = sprungziel;
	  	lexikon.focus();
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: überprüft, ob Lexikon schon offen ist
//    Input:
//   Output:
// erstellt:
// geändert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lex_sprung(seite) {
	if (lexikon) {
		if (!lexikon.closed) {  // das Lexikon wurde noch nicht wieder geschlossen
			offen = true;
			// Funktion in lexikon.js
			this.begriff_suchen(seite, offen);
			// lexikon.frames[1].location.href=seite;
			// lexikon.focus();
		} else {					// Lexikon wurde vom Benutzer geschlossen
			offen = false;
			// Funktion in lexikon.js
        	this.begriff_suchen(seite, offen);
			// aktuelleseite=this.aktuelleseite;
			// lex_oeffnen(aktuelleseite);
		}
	} else {
		offen = false;
		// Funktion in lexikon.js
		this.begriff_suchen(seite, offen);
		// aktuelleseite=this.aktuelleseite;
		// lex_oeffnen();
		// lexikon.begriff_suchen(seite, offen);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////
// liefert den Verzeichnis mit den "printfiles"
///////////////////////////////////////////////////////////////////////////////////////////
function get_printfiles_dir( verzeichnis ){
	return '../../dokumente/'+verzeichnis+'/';
}

///////////////////////////////////////////////////////////////////////////////////////////
// Taste gedrückt-Event wird auf der Seite registriert,
// damit die Pfeiltastennavigation realisiert werden kann
addEvent( document, 'keydown', navigiere );
