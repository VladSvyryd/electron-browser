// Datei beinhaltet alle Variablen die programmspezifisch sind, somit kann 
// "theoretisch" in allen Programmen dieselbe main.js verwendet werden
// ACHTUNG: Zugriff auf die hier gelisteten Variablen erfolgt über top.variablenname oder opener.top.variablenname

var prog_name = "bg_behaelter_2_0"; 				// wird zur Erzeugung des ini-LSO Namens benutzt
var ini_file = "bg_behaelter.ini"; 				// default-INI, kann bei Programmaufruf geändert werden
var session_id = "-1"; 						// Session-ID wird bei Offline- und Netzwerkversion benötigt, default-Wert von -1 zur Prüfung, falls nichts übergeben wird
var media_quality = 1;						// 1 = hohe Qualität, 2 = geringe Qualität, in main_frameset.htm wird dadurch der media_path bestimmt

var allow_praxisteil = true;			// damit läßt sich der Praxisteil abschalten z.B. für Demoversion (SWFs sollten aber zusätzlich entfernt werden)
var allow_reference = true;				// damit können in Demos oder je nach Bedarf die Querverweise abgeschaltet werden
var allow_lexikon = true;					// damit kann in Demos oder je nach Bedarf das Lexikon abgeschaltet werden
var allow_search = true;					// damit kann in Demos oder je nach Bedarf die Suche abgeschaltet werden

var deny_msg_praxisteil = "Die Praxisteile sind zur Zeit deaktiviert!";		// Nachricht, welche bei abgeschalteten Praxisteilen angezeigt wird, Ausgabe über Alert-Box
var deny_msg_reference 	= "Querverweise sind zur Zeit deaktiviert!";			// Nachricht, welche bei abgeschalteten Querverweisen angezeigt wird, Ausgabe über Alert-Box
var deny_msg_lexikon 		= "Das Lexikon ist zur Zeit deaktiviert!";				// Nachricht, welche bei abgeschaltetem Lexikon angezeigt wird, Ausgabe über Alert-Box
var deny_msg_search 		= "Die Suche ist zur Zeit deaktiviert!";					// Nachricht, welche bei abgeschalteter Suche angezeigt wird, Ausgabe über Alert-Box