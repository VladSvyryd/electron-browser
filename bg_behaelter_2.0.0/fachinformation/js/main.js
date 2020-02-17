// Globale Variablen
var aktuelles_verzeichnis; // hier wird das aktuelle Verzeichnis der aktuell ge�ffneten Seite gespeichert
var kapitel_pfade = new Array(); // Array enth�lt die Pfade zu den einzelnen Modulen, wird von setPaths() gesetzt, Aufruf kommt von initialize.swf
var user_site = ""; // Seite die der User eventuell direkt geklickt hat
var user_chapter = ""; // beinhaltet das Kapitel von user_site
var user_modul = ""; // beinhaltet die Kapitel Nummer (index f�r kapitel_pfade), die z.B. ge�ffnet werden soll
var popup_open = 0;

// Window-Handles
var open_modul; // Handle f�r das Hauptframeset
var lexikon; // Handle f�r das Lexikonfenster
var notizfenster; // Handle f�r das Notizfenster
var suchfenster; // Handle f�r das Suchfenster
var bearbeitungsstand; // Handle f�r das Bearbeitungsstandfenster
var impressum; // Handle f�r das Impressumsfenster
// bei folgenden 2 Variablen pr�fen wo und ob sie gebraucht werden, zur Not l�schen

var dokumente_fenster; //Handle f�r Dokumentfenster z.B. PDFs aus Querverweisen
var zusatz_fenster; //Handle f�r Zusatzfenster z.B. f�r Grafiken, Tabellen

var prog_id = "bg_behaelter";

///////////////////////////////////////////////////////////////////////////////////
// zul�ssige Browser
//
// m�gliche Attribute:
//		browser :( firefox | explorer | chrome | safari | ...)
//		vers, min_vers, max_vers : ein Zahl, z.B. 7.6
//		protocol : ( file | http )
var ok = [
  { browser: "firefox", min_vers: 3.6, os: "windows" },
  { browser: "explorer", min_vers: 7, os: "windows" }
];

///////////////////////////////////////////////////////////////////////////////////
// unzul�ssige Browser
//
// m�gliche Attribute:
//		browser :( firefox | explorer | chrome | safari | ... )
//		vers, unter : ein Zahl, z.B. 7.6
//		protocol : ( file | http )
//		extra : wenn exisiert, wird eine extra Meldung ausgegeben

var ko = [
  { browser: "firefox", unter: 3.6, os: "windows" },
  { browser: "explorer", unter: 7, os: "windows" },
  { browser: "chrome", os: "windows", protocol: "file", extra: true }
];

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt den Array mit Browser kao/ok Kriterien zur�ck
//    Input:
//   Output:
// erstellt: 16.04.13
// ge�ndert:
///////////////////////////////////////////////////////////////////////////////////////////
function browser_ok() {
  return ok;
}
function browser_ko() {
  return ko;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// falls ein Query-String existiert, werden hier die Variablen herausgefiltert und stehen somit im gesamten Programm
// zur Verf�gung, werden alle oder einzelne Variablen nicht �bergeben, gelten die Startwerte aus der main.js
// Funktion: gibt je nach Browser das richtige Handle zur Ansprache des Flash-Films zur�ck
//    Input:
//   Output: /
// erstellt: ausgelagert aus main_frameset 06.01.2012
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function get_query_vars() {
  if (window.location.search) {
    var var_string = window.location.search.substring(
      1,
      window.location.search.length
    );
    var var_array = var_string.split("&");
    var temp_var = [];

    for (i = 0; i < var_array.length; i++) {
      temp_var = var_array[i].split("=");
      switch (temp_var[0].toLowerCase()) {
        case "session_id":
          session_id = temp_var[1];
          break;
        case "ini_file":
          ini_file = temp_var[1];
          break;
        case "media_quality":
          media_quality = temp_var[1];
          break;
        case "user_site":
          user_site = temp_var[1];
          break;
        case "user_chapter":
          user_chapter = temp_var[1];
          break;
        case "user_modul":
          user_modul = temp_var[1];
          break;
      }
    }
    //alert("var_string:"+var_string+"\nuser_chapter:"+this.user_chapter+"\nuser_site:"+this.user_site);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: versucht den �bergebenen string zu interpretieren
//    Input: javascript:String
//   Output: /
// erstellt: 04.01.2012
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function eval_string(my_string) {
  //	alert("eval_message:"+my_string);
  eval(my_string);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ffnet den entsprechenden Praxisteil aus dem Hauptmen� heraus
//    Input: praxisteil:String = Name des Praxisteils (Optionen: zugversuch, kerbschlag)
//					 location:String = von wo Praxisteil gestartet wird (Optionen: menu, modul)
//   Output: /
// erstellt: 20.08.09
// ge�ndert: 24.08.09 (location[Ort des Aufrufs] eingef�gt)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function praxisteil_starten(praxisteil, location) {
  if (top.allow_praxisteil) {
    if (location == "menu") {
      praxisteil = window.open(
        "praxisteil/" + praxisteil + "/praxisteil_" + praxisteil + ".htm",
        "Praxisteil",
        "width=778,height=600,left=50,top=50"
      );
    } else if (location == "modul") {
      praxisteil = window.open(
        "../praxisteil/" + praxisteil + "/praxisteil_" + praxisteil + ".htm",
        "Praxisteil",
        "width=778,height=600,left=50,top=50"
      );
    }
    praxisteil.focus();
  } else {
    alert(top.deny_msg_praxisteil);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ffnet das Impressum aus dem Hauptmen� heraus
//    Input: /
//   Output: /
// erstellt: 14.04.09
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function impressum_oeffnen() {
  top.impressum = window.open(
    "impressum.htm",
    "impressum",
    "width=550,height=450,left=50,top=50,status=yes,scrollbars=yes,resizable=yes,menubar=no,dependent=yes"
  );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: erzeugt Array mit den Pfaden zu den einzelnen Modulen, wird von initialize.swf aufgerufen
//    Input: path:String
//   Output: kapitel_pfade:Array
// erstellt: 14.04.09
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setPaths(path) {
  top.kapitel_pfade = path.split(",");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt Soundpfad an Flashfilm weiter, ob Off- oder Online Version
//    Input: /
//   Output: pfad_url:String (beinhaltet Pfad und Dateiname)
// erstellt: 01.01.09
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function pfad_wiedergabe() {
  var pfad_url;
  var pfad_datei = get_url();
  pfad_datei = pfad_datei.substring(12, pfad_datei.length - 3);
  pfad_url = top.media_path + pfad_datei;
  return pfad_url;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: blendet Popups ein oder aus, pr�ft vorher ob noch ein Popup offen ist, wenn ja wird es vorher geschlossen
//    Input: name_popup:String (Name, in dem Fall die ID des einzublendenden Popup-DIVs)
//   Output: /
// erstellt: 12.10.09
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var open_popup = ""; // speichert den Namen des aktuell ge�ffneten Popups
function showHidePopup(name_popup) {
  if (name_popup == "" || name_popup == undefined) {
    // Popup ausblenden und open_popup auf "" setzen
    if (open_popup != "") {
      document.getElementById(open_popup).style.visibility = "hidden";
      open_popup = "";
    }
  } else {
    if (open_popup != name_popup && open_popup != "")
      document.getElementById(open_popup).style.visibility = "hidden"; // evtl. ge�ffnetes Popup ausblenden
    showHideBubble(""); // evtl. ge�ffnetes Bubble ausblenden
    document.getElementById(name_popup).style.visibility = "visible"; // neues Popup einblenden
    open_popup = name_popup; // Wert f�r aktuell ge�ffnetes Popup neu setzen
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: blendet Bubbles ein oder aus, pr�ft vorher ob noch ein Bubble offen ist, wenn ja wird es vorher geschlossen
//    Input: name_bubble:String (Name, in dem Fall die ID des einzublendenden Bubble-DIVs)
//   Output: /
// erstellt: 13.10.09
// ge�ndert: 14.10.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var open_bubble = ""; // speichert die Namen des aktuell ge�ffneten Bubble
function showHideBubble(name_bubble) {
  if (name_bubble == "" || name_bubble == undefined) {
    // wird kein Wert an Funktion �bergeben soll Bubble ausgeblendet werden
    if (open_bubble != "") {
      // Bubble ausblenden und open_bubble auf "" setzen
      document.getElementById(open_bubble).style.visibility = "hidden";
      open_bubble = "";
    }
  } else {
    showHidePopup(); // evtl. ge�ffnetes Popup ausblenden
    if (open_bubble != name_bubble && open_bubble != "")
      document.getElementById(open_bubble).style.visibility = "hidden"; // evtl. ge�ffnetes Bubble ausblenden
    document.getElementById(name_bubble).style.visibility = "visible"; // neues Bubble einblenden
    open_bubble = name_bubble; // Wert f�r aktuell ge�ffnetes Bubble neu setzen
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ffnet neues Fenster (dokument_container.htm) und l�dt dort das angegebene Dokument z.B. Grafiken
//    Input: dok_url:String, z.B. "../pdf/xyz.pdf"
//   Output: neues Fenster (dokument_container.htm), Pfad + Dateiname d. Dokuments werden als Query-String angeh�ngt
// erstellt: 23.02.09 (vorheriger Code dieser Funktion war �lter und wurde �berschrieben)
// ge�ndert: 24.02.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function kleines_fenster(dok_url, breite, hoehe) {
  var l = (screen.availWidth - breite) / 2;
  var t = (screen.availHeight - hoehe) / 2;
  if (l < 0) {
    l = 0;
  }
  if (t < 0) {
    t = 0;
  }

  if (top.zusatz_fenster && !top.zusatz_fenster.closed) {
    top.zusatz_fenster.close();
  }
  top.zusatz_fenster = window.open(
    dok_url,
    "dokfenster",
    "width=" +
      breite +
      ",height=" +
      hoehe +
      ",screenX=" +
      l +
      ",screenY=" +
      t +
      ",left=" +
      l +
      ",top=" +
      t +
      ",status=yes,scrollbars=no,resizable=yes,menubar=no,dependent=yes"
  );
  top.zusatz_fenster.focus();
}

function isChrome() {
  if (navigator.userAgent) {
    if (navigator.userAgent.indexOf("Chrome") != -1) return true;
  }
  return false;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ffnet das MainFrameset mit �bergebener URL und Gr��en, ggf. wird eine Seite nachgeladen wenn im falschen Kontext ge�ffnet
//    Input: URL(Name der Datei inkl. Pfad, falls ben�tigt), Breite und H�he des zu �ffnenden Fenster, werden mit URL auch
//			 Parameter �bergeben werden diese beim �ffnen d. Framesets mit �bergeben, evtl. wird noch die session eingef�gt
//   Output: neues Fenster
// erstellt: 10.03.09
// ge�ndert: 25.05.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openMainFrameset(url, breite, hoehe, reload_url) {
  // Wenn Flash nicht installiert, dann Frameset nicht �ffnen
  var l = (screen.availWidth - breite) / 2;
  var t = (screen.availHeight - hoehe) / 2;

  // Wird aufgerufen wenn Popups verboten sind (alle Browser)
  function popups_verboten() {
    open_modul && open_modul.close();
    alert(
      "Das Programm kann nicht im richtigen Kontext angezeigt werden. Schalten Sie bitte ggf. den Popup-Blocker aus."
    );
  }

  if (l < 0) {
    l = 0;
  }
  if (t < 0) {
    t = 0;
  }

  // ausf�hren, wenn aufrufende Seite schon Query-String enth�lt z.B. index.htm enth�lt session
  if (window.location.search) {
    location_param = window.location.search.split("?");
    // ausf�hren wenn die aufzurufende URL einen Query-String besitzt z.B. media_quality bzw. media_path etc.
    if (url.indexOf("?") > -1) {
      url_param = url.split("?");
      url = url_param[0] + "?" + location_param[1] + "&" + url_param[1];
    } else {
      url = url + "?" + location_param[1];
    }
  }

  // Popupfenster oeffnen
  open_modul = window.open(
    url,
    "",
    "width=" +
      breite +
      ",height=" +
      hoehe +
      ",screenX=" +
      l +
      ",screenY=" +
      t +
      ",left=" +
      l +
      ",top=" +
      t +
      ",status=yes,scrollbars=no,resizable=yes,menubar=no,toolbar=no"
  );

  //wenn das Nachladen des Framesets durch popupblocker verhindert wird, Hinweis zeigen
  if (!isChrome()) {
    if (
      !open_modul ||
      open_modul.closed ||
      parseInt(open_modul.innerWidth) == 0
    ) {
      popups_verboten();
    }

    // falls ein Seite zum nachladen uebergeben wurde, wird sie nachgeladen
    if (reload_url && reload_url.length > 0) {
      try {
        top.location.href = reload_url;
      } catch (e) {
        alert(e);
      }
    }
  } else {
    // fuer Chrome
    // trotz popupblocker existiert zwar das handle open_modul, man kann aber nicht auf alle Eigenschaften zugreifen.
    // Zur �berpr�fung wird die Funktion test() im Popup aufgerufen
    setTimeout(function() {
      if (open_modul) {
        if (!open_modul.test()) {
          popups_verboten();
        }
      }
      // falls ein Seite zum nachladen uebergeben wurde, wird sie nachgeladen
      if (reload_url && reload_url.length > 0) {
        top.location.href = reload_url;
      }
    }, 600);
  }

  //open_modul.focus();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: verlinkt Seiten untereinander und pr�ft ob m�glich und �berhaupt zugelassen, z.B. f�r Demos abschaltbar
//    Input: chapter:String (Kapitel in dem die Seite vorkommt, Name muss der Schreibweise aus der ini-Datei entsprechen)
//					 name_page:String (Name der HTML-Seite inkl. Dateiendung, z.B. X123.htm)
//   Output: /
// erstellt: 15.10.09
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var chapter = "";
var name_page = "";
function crossReference(chapter, name_page) {
  if (top.allow_reference) {
    // Querverweise sind aktiviert
    // wenn chapter und name_page �bergeben wurden
    if (
      chapter != "" &&
      chapter != undefined &&
      name_page != "" &&
      name_page != undefined
    ) {
      // Kapitel/Seite wurden �bergeben
      // pr�fen ob Kapitel im Programm existiert, bei Modulversionen evtl. nicht enhalten
      for (var i = 0; i < top.kapitel_pfade.length; i++) {
        if (top.kapitel_pfade[i].indexOf(chapter) != -1) {
          // Pr�fung erfolgreich, Kapitel existiert, Seite aufrufen
          //parent.mainFrame.location.replace ("../"+chapter+"/"+name_page);
          top.Inhalt.mainFrame.location.href =
            "../" + chapter + "/" + name_page;
          break;
        }
      }
    } else {
      // Kapitel und/oder Seite fehlen
      alert("Das Kapitel und/oder die verlinkte Seite wurden nicht �bergeben!");
    }
  } else {
    // Querverweise sind deaktiviert
    alert(top.deny_msg_reference);
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �berpr�ft, ob Datei im Frameset geladen wurde. Wenn es kein Frameset gibt, dann wird die index.html Datei aufgerufen
//			 welche als Parameter die zu �ffnende Seite erh�lt.
//    Input: aktuelles_verzeichnis:String, in welchem Ordner sich die aktuelle Datei befindet. wird ben�tigt, um festzustellen,
//			 ob das Inhaltsverzeichnis und die Navigationsleiste zur aktuellen Seite passen
//   Output: /
// erstellt: 01.01.09
// ge�ndert: 29.04.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function nav_aktualisieren(aktuelles_verzeichnis) {
  // console.log('nav_aktualisieren( '+aktuelles_verzeichnis+' )');
  // Name der aktuellen Seite und des Kapitels werden extrahiert
  site = location.href.substring(
    location.href.lastIndexOf("/") + 1,
    location.href.length
  );
  temp_chapter = location.href.substring(0, location.href.lastIndexOf("/"));
  chapter = temp_chapter.substring(
    temp_chapter.lastIndexOf("/") + 1,
    temp_chapter.length
  );

  //�berpr�fen, ob die Datei im richtigen Frameset geladen wurde
  if (top.frames.length == 0 || parent.frames[2].name != "mainFrame") {
    // keine oder falsche Frames geladen
    openMainFrameset(
      "../main_frameset.htm?user_site=" + site + "&user_chapter=" + chapter,
      1010,
      673,
      "../../index.htm"
    );
    //top.location.href = "../../index.htm";
  } else {
    // NAV-frame �berpr�fen, welcher Kapitelname enthalten ist
    if (parent.leftFrame.location.href.indexOf(chapter) <= 0) {
      //parent.location.replace(aktuelles_verzeichnis+"frameset.htm?"+location.href.substring(location.href.lastIndexOf("/")+1, location.href.length));
      //parent.location.href = aktuelles_verzeichnis+"frameset.htm?"+location.href.substring(location.href.lastIndexOf("/")+1, location.href.length);
      // Damit history bei Querverweisen zwischen Kapiteln funktioniert, darf der Inhaltsframeset nicht ausgetauscht werden.
      parent.topFrame.location.replace("../" + chapter + "/top.htm");
      parent.leftFrame.location.replace("../" + chapter + "/nav.htm");
      parent.bottomFrame.location.replace("../" + chapter + "/subnav.htm");
    } else {
      //console.log('nav_aktualisiern: aufrufen()');
      try {
        //Inhalt synchronisieren
        parent.leftFrame.aufrufen();
      } catch (e) {
        // console.log(e);
      }
    }
    // aktuelle Seite und Kapitel abspeichern
    try {
      parent.bottomFrame.saveCurPos(chapter, site);
    } catch (e) {
      //console.log(e);
    }
  }

  // Notizfenster aktualisieren
  notizen_aktualisieren();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Aktualisiert das Fenster Bearbeitungsstand, wenn das Fenster ge�ffnet ist. Wird aus Flash z.B. beim Speichern der
// �bungsdaten in einer �bung aufgerufen.
//    Input:
//   Output: /
// erstellt: 25.04.12
// ge�ndert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bearbeitungsstand_aktualisieren() {
  if (top.bearbeitungsstand && !top.bearbeitungsstand.closed) {
    top.bearbeitungsstand.inhalte_aktualisieren(); //ruft callbackfunktion im Bearbeitungsstand auf
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ffnet das Bearbeitungsstandfenster
//    Input: verzeichnis:String
//   Output: /
// erstellt: 01.01.09
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function bearbeitungsstand_sprung(verzeichnis) {
  if (top.bearbeitungsstand && !top.bearbeitungsstand.closed) {
    top.bearbeitungsstand.focus();
  } else {
    if (isChrome()) {
      top.bearbeitungsstand = window.open(
        "../bearbeitungsstand.htm?" + verzeichnis,
        "bearb_stand",
        "width=497,height=674,screenX=10,screenY=10,scrollbars=no,resizable=yes,status=yes,menubar=no"
      );
    } else {
      top.bearbeitungsstand = window.open(
        "../bearbeitungsstand.htm?" + verzeichnis,
        "bearb_stand",
        "width=481,height=674,screenX=10,screenY=10,scrollbars=no,resizable=yes,status=yes,menubar=no"
      );
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt den aktuellen Dateinamen mit �bergeordnetem Ordner + ".." davor, um ihn mit dem Dateinamen in der XML-Datei
//			 vergleichen zu k�nnen
//    Input: /
//   Output: html_url:String
// erstellt: 01.01.09
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function get_url() {
  bis_letzter_slash = document.location.href.substring(
    0,
    document.location.href.lastIndexOf("/")
  );
  vorletzter_slash = bis_letzter_slash.lastIndexOf("/");
  html_url =
    ".." +
    document.location.href.substring(
      vorletzter_slash,
      document.location.href.length
    );
  if (html_url.indexOf("?") > -1) {
    html_url = html_url.slice(0, html_url.indexOf("?"));
  }
  return html_url;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Bei einem Kapitelwechsel andere Fenster und Titel aktualisieren
//    Input: modul_name:String (kommt aus modul.js in den jewiligen Kapiteln)
//   Output: Titel des anzeigenden Framsets wird angepa�t
// erstellt: 01.01.09
// ge�ndert: 26.04.12
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function kapitel_synchronisieren(modul_name) {
  top.document.title = modul_name;

  //berarbeitungsstand und Notizen synchronisieren, wenn ge�ffnet
  if (top.bearbeitungsstand) {
    if (!top.bearbeitungsstand.closed) {
      top.bearbeitungsstand.location.href =
        "../bearbeitungsstand.htm?" + aktuelles_verzeichnis;
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: falls ein Fenster dass auf resizable=no gestellt ist, trotzdem skaliert wird (z.B. Netscape oder Firefox) wird das
//			 Fenster nach dem skalieren wieder auf seine urspr�ngliche Gr��e zur�ckgesetzt
//    Input: breite:Number, hoehe:number
//   Output: /
// erstellt: 01.01.09
// ge�ndert: 11.05.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function new_size() {
  if (window.innerWidth) {
    window.innerWidth = top.breite;
    window.innerHeight = top.hoehe;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �berpr�ft, ob Lexikon schon offen ist
//    Input: seite:String (beinhaltet die zu �ffnende Lexikonseite)
//   Output: /
// erstellt: 01.01.09
// ge�ndert: 28.05.13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lex_sprung(seite) {
  offen = false;
  if (lexikon && !lexikon.closed) {
    offen = true;
  }
  this.begriff_suchen(seite, offen);
}

/*
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �berpr�ft, ob Lexikon schon offen ist
//    Input:
//   Output:
// erstellt:
// ge�ndert:
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
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ffnet die Suchseite
//    Input: /
//   Output: /
// erstellt: 01.01.09
// ge�ndert: 16.12.09 ge�ndert wie in BG Beh�lter: EinSuchfenster f�r alle Programmteile
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function suche_sprung(search_page, search_frameset_path) {
  search_frameset_path = search_frameset_path || "../suche/";
  if (top.allow_search) {
    if (suchfenster) {
      if (!suchfenster.closed) {
        // das Suchfenster wurde noch nicht wieder geschlossen
        suchfenster.location.href =
          search_frameset_path + "search_frameset.htm?" + search_page;
        suchfenster.focus();
      } else {
        // Suchfenster wurde vom Benutzer geschlossen
        suchfenster = window.open(
          search_frameset_path + "search_frameset.htm?" + search_page,
          "suchfenster",
          "width=450,height=640,screenX=10,screenY=10,status=yes,scrollbars=auto,resizable=no,menubar=no"
        );
      }
    } else {
      // Suchfenster war noch nicht offen
      suchfenster = window.open(
        search_frameset_path + "search_frameset.htm?" + search_page,
        "suchfenster",
        "width=450,height=640,screenX=10,screenY=10,status=yes,scrollbars=auto,resizable=no,menubar=no"
      );
    }
  } else {
    alert(top.deny_msg_search);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �berpr�ft, ob Notizfenster schon offen ist
//    Input: seiten_id, seiten_titel, aktuelleseite, aktuelles_verzeichnis
//   Output: /
// erstellt: 01.01.09
// ge�ndert: 23.04.09
// ge�ndert: 13.03.13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function notiz_sprung(aktuelle_seite, aktuelles_kapitel) {
  var url =
    "../notiz.htm?prog_name=" +
    top.prog_name +
    "&aktuelle_seite=" +
    aktuelle_seite +
    "&aktuelles_kapitel=" +
    aktuelles_kapitel;
  if (notizfenster && !notizfenster.closed) {
    notizfenster.location.href = url;
    notizfenster.focus();
  } else {
    if (isChrome()) {
      notizfenster = window.open(
        url,
        "notiz_fenster",
        "width=416,height=500,screenX=10,screenY=10,status=yes,scrollbars=no,resizable=no,menubar=no"
      );
    } else {
      notizfenster = window.open(
        url,
        "notiz_fenster",
        "width=400,height=500,screenX=10,screenY=10,status=yes,scrollbars=no,resizable=no,menubar=no"
      );
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ffnet Zusatzdokumente (z.B. PDF) in einem neuen Fenster
//    Input: /
//   Output: /
// erstellt: 01.01.09
// ge�ndert: 09.04.13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// neu von 09.04.13
function dokumente_sprung(url) {
  if (top.dokumente_fenster && !top.dokumente_fenster.closed) {
    //	    top.dokumente_fenster.location.href = url;
    //		top.dokumente_fenster.focus();
    top.dokumente_fenster.close();
  }
  //	else { top.dokumente_fenster = window.open( url, "dokumente_fenster" );	}

  top.dokumente_fenster = window.open(url, "dokumente_fenster");
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
// ge�ndert: 29.04.09
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function alles_schliessen() {
  if (lexikon && !lexikon.closed) {
    lexikon.close();
  }
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

/*
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: schliesst alle noch offenen Fenster (Notizen, Suche, Lexikon) und zus�tzliche Fenster z.B. mit Flash Inhalten
//    Input: Handles der einzelnen Fenster
//   Output:
// erstellt: 01.01.08
// ge�ndert: 20.11.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function alles_schliessen() {
	if (window_handle) {
		if (!window_handle.closed) { // das zus�tzlich ge�ffnete Fenster wird geschlossen
			window_handle.close();
		}
	}
	if (notizfenster) {
		if (!notizfenster.closed) { // das Notzifenster wurde noch nicht wieder geschlossen
		  notizfenster.close();
		}
	}
	if (lexikon) {
		if (!lexikon.closed) { // das Lexikonfenster wurde noch nicht wieder geschlossen
		  lexikon.close();
		}
	}
	if (suchfenster) {
		if (!suchfenster.closed) { // das Suchfenster wurde noch nicht wieder geschlossen
		  suchfenster.close();
		}
	}	
	if (dok_fenster) {
		if (!dok_fenster.closed) { // das Dokumentefenster wurde noch nicht wieder geschlossen
		  dok_fenster.close();
		}
	}
}
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: schliesst Bearbeitungsstandfenster
//    Input: /
//   Output: /
// erstellt: 02.05.12
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function bearbeitungsstand_schliessen() {
  close();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: schliesst Bearbeitungsstandfenster
//    Input: /
//   Output: /
// erstellt: 02.05.12
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function reload_uebung() {
  //	alert(opener.frames[0].frames[2].location);
  //	opener.frames["Inhalt"].frames[2].location.reload();
  //	alert(opener.Inhalt.mainFrame.location);
  opener.Inhalt.mainFrame.location.reload();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: schliesst alle noch offenen Fenster des Hauptmen�s, z.B. das Impressum
//    Input: /
//   Output: /
// erstellt: 25.05.09
// ge�ndert: /
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
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function test() {
  if (window.innerHeight != 0) {
    return true;
  } else return false;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt eine Meldung aus, das ein Funktionalit�t nicht zu Verfuegung steht
//    Input: /
//   Output: /
// erstellt: 14.06.12
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function nichtVerfuegbar(meldung) {
  if (meldung) {
    alert(meldung);
  } else {
    alert("Diese Funktion steht erst in K�rze zur Verf�gung.");
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: registriert Handler Ereignises von bestimmten Typ an einem Objekt
//			 funktioniert in IE
//    Input: ein DOM-Objekt(zB document), Eventtyp (zB keydown, mouseover), Funktion(ein Handler)
//   Output: /
// erstellt: 14.08.12
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addEvent(obj, type, fn) {
  //	console.log("addEvent");
  if (obj.addEventListener) {
    obj.addEventListener(type, fn, false);
  } else if (obj.attachEvent) {
    obj["e" + type + fn] = fn;
    obj[type + fn] = function() {
      obj["e" + type + fn](window.event);
    };
    obj.attachEvent("on" + type, obj[type + fn]);
  }
}

// loescht einen Handler
function removeEvent(obj, type, fn) {
  if (obj.removeEventListener) {
    obj.removeEventListener(type, fn, false);
  } else if (obj.detachEvent) {
    obj.detachEvent("on" + type, obj[type + fn]);
    obj[type + fn] = null;
    obj["e" + type + fn] = null;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: ein Handler zum Navigieren mit Tastatur(Pfeiltasten links/rechts)
//    Input:
//   Output: /
// erstellt: 14.08.12
// ge�ndert: /
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function navigiere(event) {
  // den gedruckten Button bestimmen
  var key = event.keyCode;

  switch (key) {
    case 37: // Pfeil nach links (Zur�ck)
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
  //dasselbe f�r die Mozilla
  if (event.preventDefault) event.preventDefault();
  if (event.stopPropagation) event.stopPropagation();
}

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: gibt je nach Browser das richtige Handle zur Ansprache des Flash-Films zur�ck
//    Input: movieName:String
//   Output:
// erstellt: 28.04.09
// ge�ndert: 13.09.12
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
// Funktion: l�dt n�chste Seite in mainFrame ( falls m�glich )
//    Input:
//   Output:
// erstellt: 07.12.12
// ge�ndert:
///////////////////////////////////////////////////////////////////////////////////////////
function seitevor() {
  var movie = getFlashMovie(top.Inhalt.bottomFrame, "subnavi");
  if (movie && movie.seitevor) {
    movie.seitevor();
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: l�dt vorherige Seite in mainFrame ( falls m�glich )
//    Input:
//   Output:
// erstellt: 07.12.12
// ge�ndert:
///////////////////////////////////////////////////////////////////////////////////////////
function seitezur() {
  var movie = getFlashMovie(top.Inhalt.bottomFrame, "subnavi");
  if (movie && movie.seitezur) {
    movie.seitezur();
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: l�dt vorherige Seite in mainFrame ( falls m�glich )
//    Input:
//   Output:
// erstellt: 07.12.12
// ge�ndert:
///////////////////////////////////////////////////////////////////////////////////////////
/*
function sprung_seite(seite) {
	top.opener.frames[2].location.href = seite;
}
*/

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ffnet das Notizenfenster f�r die aktuelle Seite in mainFrame
//    Input:
//   Output:
// erstellt: 18.03.13
// ge�ndert:
///////////////////////////////////////////////////////////////////////////////////////////
function notiz_oeffnen() {
  var url = top.Inhalt.mainFrame.location.href;
  var temp_chapter = url.substring(0, url.lastIndexOf("/"));
  var aktuelles_kapitel = temp_chapter.substring(
    temp_chapter.lastIndexOf("/") + 1,
    temp_chapter.length
  );
  aktuelle_seite = url.substring(url.lastIndexOf("/") + 1, url.length);

  //	alert( "aktuelle_seite:"+aktuelle_seite+"\naktuelles_kapitel:"+aktuelles_kapitel );

  // aus der Navigationsleiste heraus das Notizfenster �ffnen
  top.notiz_sprung(aktuelle_seite, aktuelles_kapitel);
}

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Notizenfenster nur �ffnen, wenn es schon ge�ffnet ist
//    Input:
//   Output:
// erstellt: 18.03.13
// ge�ndert:
///////////////////////////////////////////////////////////////////////////////////////////
function notizen_aktualisieren() {
  // Falls Notizfenster ge�ffnet ist, dann aktualisieren
  if (top.notizfenster && !top.notizfenster.closed) {
    notiz_oeffnen();
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: laedt Hauptmenu in den aktuellen Frameset
//    Input:
//   Output:
// erstellt: 16.04.13
// ge�ndert:
///////////////////////////////////////////////////////////////////////////////////////////
function hauptmenue_laden() {
  //	alert("hauptmenue");
  top.document.getElementById("Inhalt").src = hauptmenue; // eine Konstante aus prog_vars.js
  //	top.Inhalt.mainFrame.location.href = hauptmenu; // eine Konstante aus prog_vars.js
}

///////////////////////////////////////////////////////////////////////////////////////////
// Funktion: laedt eine Seite in den aktuellen Frameset
//    Input:
//   Output:
// erstellt: 16.04.13
// ge�ndert:
///////////////////////////////////////////////////////////////////////////////////////////
function url_laden(url) {
  //	alert( url );
  top.document.getElementById("Inhalt").src = url;
  //	top.Inhalt.mainFrame.location.href = url;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: zeigt bubble (x) bei mouseover und schlie�t alle popups (y)
//    Input: x = Pop-Up (Div) welches angezeigt werden soll, y = Anzahl der Pop-Ups im Dokument insgesamt
//   Output: /
// erstellt: 04.08.08
// ge�ndert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function show_bubble(x, y) {
  if (popup_open == 1) {
    hide_popup(y);
  }
  document.getElementsByTagName("div")[x].style.visibility = "visible";
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: versteckt alle Bubbles, wenn kein popup offen ist. Notwendig, um in Bilder zu zoomen, da beim �ffnen eines popups
//           hide_bubble durch OnMouseOut aufgerufen wird.
//    Input: n = Anzahl aller Popups im Dokument
//   Output: /
// erstellt: 04.08.08
// ge�ndert:
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
// ge�ndert: 04.08.08
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
// ge�ndert: 04.08.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function hide_popup(n) {
  for (x = 1; x < n + 1; x++) {
    document.getElementsByTagName("div")[x].style.visibility = "hidden";
  }
  popup_open = 0;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ffnet Fenster ohne Scrollbars, Men� und nicht resizable, mit �bergebenen Gr��en, Namen und Event Handler, wird
//           die Funktion ohne Sprungziel aufgerufen wir das Fenster, falls ge�ffnet, geschlossen
//    Input: sprungziel (Seite), Breite und H�he des zu �ffnenden Fenster und Name
//   Output:
// erstellt:
// ge�ndert: 20.11.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function fenster_mit_handle(sprungziel, breite, hoehe, name) {
  if (sprungziel == undefined) {
    if (parent.window_handle && !parent.window_handle.closed) {
      parent.window_handle.close();
    }
  } else {
    // pr�ft ob schon ein Fenster ge�ffnet wurde und falls ja wird es geschlossen und das neue ge�ffnet
    if (parent.window_handle) {
      parent.window_handle.close();
    }
    // schreibt das Window-Handle in den mainFrame, damit beim schlie�en des Framesets gepr�ft werden kann, ob ein Fenster offen ist und ggf. geschlossen wird
    parent.window_handle = window.open(
      sprungziel,
      name,
      "width=" +
        breite +
        ",height=" +
        hoehe +
        ",screenX=10,screenY=10,status=yes,scrollbars=no,resizable=no,menubar=no"
    );
    parent.window_handle.focus();
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Seite mit Video �ffnen, wird show_video ohne "url" aufgerufen wird das Videofenster, falls ge�ffnet, geschlossen
//    Input: URL der Seite, H�he und Breite des Fensters
//   Output: �ffnet neues Fenster mit der angegebenen Seite bzw. schlie�t dieses
// erstellt: 10.09.08
// ge�ndert: 20.11.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function show_video(url, breite, hoehe) {
  if (url == undefined || url == "" || url == " ") {
    if (typeof videofenster !== "undefined" && !videofenster.closed) {
      videofenster.close();
    }
  } else {
    if (typeof videofenster !== "undefined" && !videofenster.closed) {
      videofenster.close();
    }
    videofenster = window.open(
      url,
      "videofenster",
      "width=" +
        breite +
        ",height=" +
        hoehe +
        ",screenX=100,screenY=100,status=no,scrollbars=no,resizable=no,menubar=no"
    );
    videofenster.focus();
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: �ndert den angezeigten Titel des Framesets
//    Input: var modul_name, kommt aus der modul.js des jeweiligen Kapitels und wird bei Aufruf der Inhaltsseiten ausgef�hrt
//   Output: Titel aus Modulname wird in Title des Hauptframesets geschrieben
// erstellt: 04.08.08
// ge�ndert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function titel_anpassen(modul_name) {
  top.document.title = modul_name;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Schliesst aktuelles venster und geht zum opener
//    Input:
//   Output:
// erstellt: 04.08.08
// ge�ndert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ins_hauptmenue() {
  if (top.opener) {
    if (!top.opener.closed) {
      top.opener.focus();
    } else {
      window.open("../index.htm", "startseite");
    }
  } else {
    window.open("../index.htm", "startseite");
  }
  top.close();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: wird im Flash-Popup des Screens 2.4 "Gef�hrdungen und Schutzma�nahmen im �berblick" benutzt um in die einzelnen
// 			 Kapitel der Fachinformationen zu springen
//    Input: var thisURL, enth�lt Seite in die gesprungen werden soll
//   Output: Aufruf der Funktion browser_sniffer_ohne_frameset() inkl. der frameset.htm
// erstellt: 01.05.08
// ge�ndert: 01.12.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function kapitelsprung_fachinfo(thisURL) {
  opener.location.href = thisURL;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Lexikon �ffnen wenn es noch nicht offen ist
//    Input:
//   Output:
// erstellt:
// ge�ndert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lex_oeffnen(aktuelleseite) {
  // console.log( 'aktuelles_verzeichnis:'+aktuelles_verzeichnis );
  if (!aktuelleseite) {
    sprungziel = "../../lexikon/frameset.htm";
  } else {
    if (aktuelleseite < 10) {
      sprungziel =
        "../../lexikon/frameset.htm?lex_bg-0" + aktuelleseite + ".htm";
    } else {
      sprungziel =
        "../../lexikon/frameset.htm?lex_bg-" + aktuelleseite + ".htm";
    }
  }
  lexikon = window.open(
    sprungziel,
    "lexikonfenster",
    "width=900,height=600,screenX=10,screenY=10,status=yes,scrollbars=no,resizable=yes,menubar=no"
  );
}

/*
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funktion: Lexikon �ffnen wenn es noch nicht offen ist
//    Input: aktuelleseite:String (beinhaltet die zu �ffnende Lexikonseite)
//   Output: /
// erstellt: 01.01.09
// ge�ndert: /
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
// Funktion: n�chsten Begriff suchen und Lexikon in den Vordergrund bringen
//    Input:
//   Output:
// erstellt:
// ge�ndert:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function naechster_begriff(aktuelleseite) {
  // wenn keine aktuelleseite �bergeben wird, erh�lt das Lexikon-Fenster nur den Focus
  if (aktuelleseite == "") {
    lexikon.focus();
  }
  // ansonsten wird der aktuelle Begriff mit oder ohne f�hrende 0 aufgerufen
  else {
    if (aktuelleseite < 10) {
      sprungziel = "../../lexikon/lex_bg-0" + aktuelleseite + ".htm";
    } else {
      sprungziel = "../../lexikon/lex_bg-" + aktuelleseite + ".htm";
    }
    lexikon.frames[3].location.href = sprungziel;
    lexikon.focus();
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
// liefert den Verzeichnis mit den "printfiles"
///////////////////////////////////////////////////////////////////////////////////////////
function get_printfiles_dir(verzeichnis) {
  return "../../dokumente/" + verzeichnis + "/";
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function: �ffnet zum angeklickten Link das passende Frameset und �bergibt auch den zur�ck verweisenden Link zur aktuellen Seite
//    Input: Zielframeset inkl. Pfad und Name der Zielseite
//   Output: /
// erstellt: 04.08.08
// ge�ndert: 08.12.08
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function link_modul(frameset, seite) {
  alert("link_modul aufgerufen! Das muss ersetzt werden...");
  parent.document.location.href = frameset + "?" + seite;
}

///////////////////////////////////////////////////////////////////////////////////////////
// Taste gedr�ckt-Event wird auf der Seite registriert,
// damit die Pfeiltastennavigation realisiert werden kann
addEvent(document, "keydown", navigiere);
