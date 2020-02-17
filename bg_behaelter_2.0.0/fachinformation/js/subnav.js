/////////////////////////////////////////////////////////////////////////////////////////////////
// beinhaltet alle Funktionen, welche sich die Subnavigationen der einzelnen Kapitel teilen
/////////////////////////////////////////////////////////////////////////////////////////////////

var new_opener;

// Funktion ermittelt den Dateinamen der aktuellen HTML-Seite und gibt ihn (an Flash) zurück
function get_current_page() { 
	var datei_endung = ".htm";
	dateiname = top.Inhalt.mainFrame.location.href.slice(top.Inhalt.mainFrame.location.href.lastIndexOf("/")+1);
//	dateiname = parent.mainFrame.location.href.slice(parent.mainFrame.location.href.lastIndexOf("/")+1);
	dateiname = dateiname.slice(0, dateiname.indexOf(datei_endung)+datei_endung.length);
	//alert(dateiname);
	return dateiname;
}

// aus der Navigationsleiste heraus die Suche öffnen
function suche_oeffnen() {
	var url = top.Inhalt.mainFrame.location.href;
	// Name der aktuellen Seite und des Kapitels werden extrahiert
	var site = url.substring( url.lastIndexOf("/")+1, url.length);
	var temp_chapter = url.substring(0, url.lastIndexOf("/"));
	var chapter = temp_chapter.substring(temp_chapter.lastIndexOf("/")+1, temp_chapter.length);
//	var searchpage = "search_"+chapter+".htm";
	var searchpage = "search_fachinfo.htm";
	
	top.suche_sprung(searchpage,"../");
}


function drucken() {
//	var	dateiname = top.Inhalt.mainFrame.location.href.slice(top.Inhalt.mainFrame.location.href.lastIndexOf("/")+1);
//	dateiname = dateiname.slice(0, dateiname.lastIndexOf('.'));
	var site = top.Inhalt.mainFrame.location.href.substring(top.Inhalt.mainFrame.location.href.lastIndexOf("/")+1, top.Inhalt.mainFrame.location.href.length);
	var temp_chapter = top.Inhalt.mainFrame.location.href.substring(0, top.Inhalt.mainFrame.location.href.lastIndexOf("/"));
	var chapter = temp_chapter.substring(temp_chapter.lastIndexOf("/")+1, temp_chapter.length);

	// aus der Navigationsleiste heraus das Notizfenster öffnen
	document.location.href=("../../dokumente/ausdrucke/fachinformationen_a.pdf");
}

/*
function notiz_oeffnen() {
	var url = top.Inhalt.mainFrame.location.href;
	var temp_chapter = url.substring(0, url.lastIndexOf("/"));
	var aktuelles_kapitel = temp_chapter.substring(temp_chapter.lastIndexOf("/")+1, temp_chapter.length);
	aktuelle_seite = url.substring( url.lastIndexOf("/")+1, url.length );

//	alert( "aktuelle_seite:"+aktuelle_seite+"\naktuelles_kapitel:"+aktuelles_kapitel );
	
	// aus der Navigationsleiste heraus das Notizfenster öffnen
	top.notiz_sprung(aktuelle_seite, aktuelles_kapitel);
}
*/


function zur_startseite(webpage) {
	if (top.window.opener && !top.window.opener.closed) {
		top.window.opener.location.href = webpage;
		top.window.opener.focus();
	} else {
		if (new_opener && !new_opener.closed) {
			new_opener.location.href = webpage;
		} else {
			new_opener = window.open(webpage, "new_opener");
		}
	}
}

function ins_hauptmenue() {
	top.alles_schliessen();
	top.Inhalt.location.href = "../hauptmenue.htm";
}

function history_back() {
	parent.mainFrame.history.go(-1);
	//history.back();
}

function ende_button() {
	top.alles_schliessen();
	top.close();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: übergibt die VARs user_chapter und user_site an subnav.swf und ruft dann die Funktion saveCurPos() in der subnav.swf 
//			 auf, Trennung von Variablenübergabe und Funktionsaufruf wegen Laufzeitproblemen beim erstmaligen Kapitelaufruf
//    Input: user_chapter:String, user_site:String
//   Output: /
// erstellt: 28.04.09
// geändert: 25.05.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function saveCurPos(user_chapter, user_site) {
	var movie;
	user_chapter = user_chapter || "";
	user_site = user_site || "";
//	console.log('saveCurPos( '+user_chapter+', '+ user_site+' )' );
	if (user_chapter != "" && user_site != "") {
		try{
			movie = getFlashMovie(top.Inhalt.bottomFrame,"subnavi");
			movie.saveCurSite( user_chapter, user_site );
		} catch (e) {
//			console.log('fehler in saveCurPos():'+e);
		}
	}
}

// aus der Navigationsleiste heraus das Lexikon öffnen
function lexikon_oeffnen() {
	top.lex_sprung('','');
}
// aus der Navigationsleiste heraus den Bearbeitungsstand öffnen
function bearbeitungsstand_oeffnen() {
	top.bearbeitungsstand_sprung(aktuelles_verzeichnis);
}

//überprüfen, ob benötigt????
function bearbeitungsstand_neuladen() {
//	alert("bearbeitungsstand_neuladen wurde aufgerufen");
	if (top.bearbeitungsstand && !top.bearbeitungsstand.closed) {
		top.bearbeitungsstand.inhalte_aktualisieren()
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Function: wird aus Flash heraus aufgerufen, wenn bei einer Übungsaufgabe Auswertung, Lösung oder Reset gedrückt wurde
//			schließt das Bearbeitungsstand Fenster wenn es offen ist
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function bearbeitungsstand_schliessen() {
	if (top.bearbeitungsstand && !top.bearbeitungsstand.closed) {
		top.bearbeitungsstand.close();
	}
}

