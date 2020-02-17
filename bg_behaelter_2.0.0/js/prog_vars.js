// Datei beinhaltet alle Variablen die programmspezifisch sind, somit kann 
// "theoretisch" in allen Programmen dieselbe main.js verwendet werden
// ACHTUNG: Zugriff auf die hier gelisteten Variablen erfolgt �ber top.variablenname oder opener.top.variablenname

var prog_name = "bg_behaelter_2_0"; 				// wird zur Erzeugung des ini-LSO Namens benutzt
var ini_file = "bg_behaelter.ini"; 				// default-INI, kann bei Programmaufruf ge�ndert werden
var session_id = "-1"; 						// Session-ID wird bei Offline- und Netzwerkversion ben�tigt, default-Wert von -1 zur Pr�fung, falls nichts �bergeben wird
var media_quality = 1;						// 1 = hohe Qualit�t, 2 = geringe Qualit�t, in main_frameset.htm wird dadurch der media_path bestimmt

var allow_praxisteil = true;			// damit l��t sich der Praxisteil abschalten z.B. f�r Demoversion (SWFs sollten aber zus�tzlich entfernt werden)
var allow_reference = true;				// damit k�nnen in Demos oder je nach Bedarf die Querverweise abgeschaltet werden
var allow_lexikon = true;					// damit kann in Demos oder je nach Bedarf das Lexikon abgeschaltet werden
var allow_search = true;					// damit kann in Demos oder je nach Bedarf die Suche abgeschaltet werden

var deny_msg_praxisteil = "Die Praxisteile sind zur Zeit deaktiviert!";		// Nachricht, welche bei abgeschalteten Praxisteilen angezeigt wird, Ausgabe �ber Alert-Box
var deny_msg_reference 	= "Querverweise sind zur Zeit deaktiviert!";			// Nachricht, welche bei abgeschalteten Querverweisen angezeigt wird, Ausgabe �ber Alert-Box
var deny_msg_lexikon 		= "Das Lexikon ist zur Zeit deaktiviert!";				// Nachricht, welche bei abgeschaltetem Lexikon angezeigt wird, Ausgabe �ber Alert-Box
var deny_msg_search 		= "Die Suche ist zur Zeit deaktiviert!";					// Nachricht, welche bei abgeschalteter Suche angezeigt wird, Ausgabe �ber Alert-Box