class MainLoader {
	/////////////////////////////////////////
	// allgemeine Eigenschften
	/////////////////////////////////////////
	public var	internal_error	= "";				//letzte Fehlermeldung, die z.B. Beim Laden aufgetreten ist
	public var	mc_loaded 		= false;				// externer movieclip erfolgreich geladen;
	
	private var mcListener :Object = new Object();
	private var mcLoader : Object;

	//Konstruktor der Klasse MainLoader
	function MainLoader(ob_container){
		var my_obj = this;

		//=====================================================================
		//MovieClipLoader für externe Movieclips (inifile, exercise_data) initialisieren
		//Der Moviecliploader steuert zentral den Ladevorgang (preloading, Fehler, etc.)
		//=====================================================================
	
		//start des Ladevorgangs
		my_obj.mcListener.onLoadStart = function(mc:MovieClip) {
			//trace("Starte laden:"+mc._name);
			my_obj.mc_loaded = false;
		};
		//fertig geladen
		my_obj.mcListener.onLoadInit = function (mc:MovieClip) {
			//trace("fertig geladen:"+mc._name);
			my_obj.mc_loaded = true;
		}

		//Fehler aufgetreten
		my_obj.mcListener.onLoadError = function (mc:MovieClip, errorCode:String, httpStatus:Number) {
			my_obj.mc_loaded = false;
			my_obj.internal_error ="Beim Laden von "+unescape(mc._url)+" ist ein Fehler aufgetreten! ("+errorCode+")";
		} 

		my_obj.mcLoader = new MovieClipLoader();
		my_obj.mcLoader.addListener(this.mcListener);
	}

///////////////////////////////////////////////////////////////////////
// clip mit mcLoader laden:
// -wenn geladen, dann ist this.mc_loaded=true
// -bei einem Fehler enthält this.internal_error die Fehlermeldung
///////////////////////////////////////////////////////////////////////
	public function load_movie (which_movie, container):Void{
		this.mc_loaded = false;
		if (!this.mcLoader.loadClip(which_movie, container)){
			this.internal_error="load_movie konnte nicht ausgeführt werden:"+which_movie;
		}
	}
} //Class