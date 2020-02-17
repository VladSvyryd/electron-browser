//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// spezielle Funktionen für die nav.htm / nav.swf
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Funktion stellt die größe des Inhaltsverzeichnisses ein (für Querverweise zwischen Modulen) und setzt den Titel
function nav_loaded(framewidth,modul_name){   
	var aframeset = parent.document.getElementById("nav_set");
	if (aframeset){
		aframeset.cols = framewidth;
		top.document.title = modul_name;
		//alert(aframeset.cols);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: übergibt VAR filename an navi und setzt SWF auf den 2. Frame
//    Input: dateiname:String
//   Output: dateiname:String
// erstellt: 01.01.09
// geändert: 01.05.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
function interactive(dateiname) {
	//alert('interactive()');
	var movie;
//	console.log('interactive( '+dateiname+' )' );
	try {
		movie = getFlashMovie(top.Inhalt.leftFrame,"navi");
		movie.sync_toc(dateiname);
	} catch (e) {
//		console.log('fehler in Funktion interactive:'+e);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Funktion ermittelt den Dateinamen der aktuellen HTML-Seite
//    Input: parent.mainFrame.location.href:String
//   Output: dateiname:String
// erstellt: 01.01.09
// geändert: 14.05.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
// 
function aufrufen() {
	var datei_endung = ".htm";
	dateiname = parent.mainFrame.location.href.slice(parent.mainFrame.location.href.lastIndexOf("/")+1);
	dateiname = dateiname.slice(0, dateiname.indexOf(datei_endung)+datei_endung.length);
	interactive(dateiname);
}