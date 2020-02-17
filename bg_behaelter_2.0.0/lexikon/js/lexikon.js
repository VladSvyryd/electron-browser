var lexikon_opener;
lex_inhalt = new Array();
lex_inhalt[0]='Lexikon';
lex_inhalt[1]='Aerosole';
lex_inhalt[2]='Anschlagpunkt';
lex_inhalt[3]='Arbeitsmedizinische Vorsorge';
lex_inhalt[4]='Arbeitsplatzgrenzwert (AGW)';
lex_inhalt[5]='Atemschutzgeraete';
lex_inhalt[6]='ATEX';
lex_inhalt[7]='Auffanggurt';
lex_inhalt[8]='Auffangsystem';
lex_inhalt[9]='Aufsichtfuehrender';
lex_inhalt[10]='Befahren';
lex_inhalt[11]='Behaelter und enge Raeume';
lex_inhalt[12]='Bemessungsdifferenzstrom';
lex_inhalt[13]='Biologische Arbeitsstoffe';
lex_inhalt[14]='Brennbare Stoffe';
lex_inhalt[15]='Desinfektion';
lex_inhalt[16]='Elektrische Felder';
lex_inhalt[17]='Elekrtomagnetische Felder';
lex_inhalt[18]='Elektrostatische Auf- und Entladung';
lex_inhalt[19]='Erlaubnisschein';
lex_inhalt[20]='Explosionsfaehige Atmosphaere';
lex_inhalt[21]='Explosionsgrenzen';
lex_inhalt[22]='Explosionspunkte';
lex_inhalt[23]='Falldaempfer';
lex_inhalt[24]='Fangstosskraft';
lex_inhalt[25]='Fehlerstromschutzeinrichtung';
lex_inhalt[26]='Feld';
lex_inhalt[27]='Flammpunkt';
lex_inhalt[28]='Freimessen';
lex_inhalt[29]='Gefaehrliche Medien';
lex_inhalt[30]='Gefaehrliche Arbeiten';
lex_inhalt[31]='Gefaehrliche explosionsfaehige Atmosphaere';
lex_inhalt[32]='Gefahrstoffe';
lex_inhalt[33]='Geraetegruppen';
lex_inhalt[34]='Geraetekategorien';
lex_inhalt[35]='Hitzearbeit';
lex_inhalt[36]='Hoehensicherungsgeraet';
lex_inhalt[37]='Inertgase';
lex_inhalt[38]='Inertisierung';
lex_inhalt[39]='Isolierend';
lex_inhalt[40]='Kaeltearbeit';
lex_inhalt[41]='Kleinspannung';
lex_inhalt[42]='Leitfaehiger Bereich mit begrenzter Bewegungsfreiheit';
lex_inhalt[43]='Magnetische Felder';
lex_inhalt[44]='Mindestzuendenergie';
lex_inhalt[45]='Mitlaufendes Auffanggeraet';
lex_inhalt[46]='Orthostatischer Schock';
lex_inhalt[47]='Persoenliche Schutzausruestung';
lex_inhalt[48]='Personenaufnahmemittel';
lex_inhalt[49]='Personenaufnahmemittel, hochziehbare';
lex_inhalt[50]='Personennotsignalanlagen';
lex_inhalt[51]='Positionierungsverfahren';
lex_inhalt[52]='Potentialausgleich';
lex_inhalt[53]='PSA gegen Absturz';
lex_inhalt[54]='PSA zum Retten';
lex_inhalt[55]='Pyrophore Stoffe';
lex_inhalt[56]='Querempfindlichkeit';
lex_inhalt[57]='Rettungsgurt';
lex_inhalt[58]='Rettungshubgerät';
lex_inhalt[59]='Rettungsschlaufen';
lex_inhalt[60]='Sauerstoffgrenzkonzentration';
lex_inhalt[61]='Sauerstoffmangel';
lex_inhalt[62]='Sauerstoffueberschuss';
lex_inhalt[63]='Schutzarten';
lex_inhalt[64]='Schutzklassen';
lex_inhalt[65]='Schutztrennung';
lex_inhalt[66]='Seilunterstuetzte Zugangsverfahren';
lex_inhalt[67]='Sicherungsposten';
lex_inhalt[68]='Silos';
lex_inhalt[69]='Siloeinfahreinrichtung';
lex_inhalt[70]='Sonstiger leitfaehiger Bereich';
lex_inhalt[71]='Sterilisieren';
lex_inhalt[72]='Stickgase';
lex_inhalt[73]='Stoerlichtbogen';
lex_inhalt[74]='Strahlung';
lex_inhalt[75]='Trenntransformator';
lex_inhalt[76]='Untere Explosionsgrenze (UEG)';
lex_inhalt[77]='Unterer Explosionspunkt (UEP)';
lex_inhalt[78]='Unternehmer';
lex_inhalt[79]='Verbindungsmittel und -elemente';
lex_inhalt[80]='Zonen';
lex_inhalt[81]='Zugangsverfahren';
lex_inhalt[82]='Zuendquellen';
lex_inhalt[83]='Zuendtemperatur';
lex_inhalt[84]='Quellenverzeichnis';



function begriff_suchen(begriff, offen)
{
var aBegriff;
 
  begriff= begriff.toLowerCase();
  //wenn kein Begriff mit übergeben wurde wird das Lexikon im Urzustand geöffnet
  //bzw. nur in den Vordergrung geholt
  if (begriff=="")
  {
          //wenn das Lexikon geschlossen ist
		  if (offen==false)
		  { 
		    this.lex_oeffnen('');
		  }
		  else
		  {
		    this.naechster_begriff('');
		  }
  }
  else
  {
    for(var i = 0; i <= lex_inhalt.length-1; i++)
    {
      aBegriff = lex_inhalt[i].toLowerCase();
      Ergebnis = aBegriff.search(begriff);
      //wenn ein passender Begriff gefunden wurde
	  if(Ergebnis != -1)
	  {
	    //wenn der gesuchte Begriff mit dem gefundenen Begriff in der Länge der Zeichen übereinstimmt
	    //weil nur nach den Wortanfängen gesucht werden kann						
  	    if (lex_inhalt[i].length == begriff.length)
	    {
	      //wenn das Lexikon geschlossen ist
		  if (offen==false)
		  { 
		    this.lex_oeffnen(i);
		  }
		  else
		  {
		    this.naechster_begriff(i);
		  }
	    }
      }
	}
  }
}

//Funktion für das Springen zum Seitenanfang
function top_of_page()
{
	a = parent.frames["Frame-Body"].location.href;
	if (a.indexOf("#")>-1)
	{
	a = a.substring(0,a.lastIndexOf("#"))
	}
	parent.frames["Frame-Body"].location.href = a+"#";
}

function vorzurueck(richtung)
{
	a = parent.frames["Frame-Body"].location.href;
	a = a.substring(a.lastIndexOf("/")+1,a.length);
	
	//vor
	if (richtung == 1){
		//ist die aufgerufene Seite die erste
		if (a.indexOf("-") > -1){
			extrahierte_zahl = a.substring(a.indexOf("-")+1, a.indexOf(".htm"));
			extrahierte_zahl = extrahierte_zahl*1;
			
			//ist es die letzte Seite
			if (extrahierte_zahl+1 == lex_inhalt.length){
			
			} else {
				extrahierte_zahl = extrahierte_zahl+1
				extrahierte_zahl = extrahierte_zahl.toString();
				//alert(extrahierte_zahl);
				if (extrahierte_zahl.length == 1) {
					extrahierte_zahl = "0"+extrahierte_zahl;
				}
				parent.frames["Frame-Body"].location.href = "lex_bg-"+extrahierte_zahl+".htm";
			}
			
		} else {
		  parent.frames["Frame-Body"].location.href = "lex_bg-01.htm";
		}	
	}
	
	//zurück
	if (richtung == 2){
		//ist die aufgerufene Seite die erste
		if (a.indexOf("-") > -1){
			extrahierte_zahl = a.substring(a.indexOf("-")+1, a.indexOf(".htm"));
			extrahierte_zahl = extrahierte_zahl*1;
			if (extrahierte_zahl > 1){
				extrahierte_zahl = extrahierte_zahl-1
				extrahierte_zahl = extrahierte_zahl.toString();
				//alert(extrahierte_zahl);
				if (extrahierte_zahl.length == 1){
					extrahierte_zahl = "0"+extrahierte_zahl;
				}
				parent.frames["Frame-Body"].location.href = "lex_bg-"+extrahierte_zahl+".htm";
			} else {
				parent.frames["Frame-Body"].location.href = "lex_bg.htm";
			}
		} else {
		  //alert("erste Seite");
		}	
	}
}

function startseite_oeffnen(){
	if (top.window.opener && !top.window.opener.closed){
		top.window.opener.frames[2].zur_startseite();
	} else {
		if (lexikon_opener && !lexikon_opener.closed){
			lexikon_opener.location.href = "http://www.tm-online.de";
		} else {
			lexikon_opener = window.open("http://www.tm-online.de", "lexikon_opener");
		}
	}
}

//////////////////////////////////////////////////////////////////////////
//Function: überprüft, ob Datei im Frameset geladen wurde. Wenn es kein 
//			Frameset gibt, dann wird die frameset.htm Datei aufgerufen
//			welche als Parameter die zu öffnende Seite erhält.
////////////////////////////////////////////////////////////////////////// 
function nav_aktualisieren()
{
	//überprüfen, ob die Datei im richtigen Frameset geladen wurde
	if(top.frames.length==0 || top.frames[2].name!="Frame-Body")
	{
		//Keine oder falsche Frames geladen
		top.location.href="frameset.htm?"+location.href.substring(location.href.lastIndexOf("/")+1,location.href.length);
	}
}


