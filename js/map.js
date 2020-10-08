class Map {
    /**
     * Classe correspondant à la map
     * @constructor
     * @return { object }    // La map
     */
    constructor() {
        this.maCarte = {};
        this.positionDefault = { lat: 48.8534, lng: 2.3488}; //Position par défaut = Paris
        this.coordsFromBrowser = {
            lat: this.positionDefault.lat,
            lng: this.positionDefault.lng
        };
        this.marqueurUser = {};

    }

    /**
     * Initialise la map
     */
    initMap() {
        let that = this;

        // On récupère la latitude et la longitude de la position de l'utilisateur et on gère les erreurs
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            confirm("Geolocation is not supported by this browser.");
            this.marqueurUser = L.marker(L.latLng(this.coordsFromBrowser.lat, this.coordsFromBrowser.lng)).addTo(this.maCarte); // OK
        }

        /**
         * Récupère la latitude et la longitude
         * @param { number } position
         */
        function showPosition(position) {
            console.log(
                "position",
                position.coords.latitude,
                position.coords.longitude
            );
            that.coordsFromBrowser.lat = position.coords.latitude;
            that.coordsFromBrowser.lng = position.coords.longitude;

            that.maCarte.setView([that.coordsFromBrowser.lat, that.coordsFromBrowser.lng], 13);
            that.marqueurUser = L.marker(L.latLng(that.coordsFromBrowser.lat, that.coordsFromBrowser.lng)).addTo(that.maCarte); // OK
            that.marqueurUser.bindPopup("<p>Vous êtes ici</p>");
        }

        /**
         * Gère le refus de la géolocalisation par l'utilisateur et les erreurs possibles.
         * @param { number } error
         */
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    confirm("User denied the request for Geolocation.")
                    that.marqueurUser = L.marker(L.latLng(that.coordsFromBrowser.lat, that.coordsFromBrowser.lng)).addTo(that.maCarte);
                    that.marqueurUser.bindPopup("<p>Position par défaut</p>");
                    break;
                case error.POSITION_UNAVAILABLE:
                    confirm("Location information is unavailable.")
                    break;
                case error.TIMEOUT:
                    confirm("The request to get user location timed out.")
                    break;
                case error.UNKNOWN_ERROR:
                    confirm("An unknown error occurred.")
                    break;
            }
        }

        // On initialise la carte
        this.maCarte = L.map('map').setView([this.coordsFromBrowser.lat, this.coordsFromBrowser.lng], 13);


        // On charge les "tuiles"
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            minZoom: 1,
            maxZoom: 20,
            attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.maCarte);

        // Ajout d'un marqueur
        // TODO: Création d'un marqueur pour la position de l'utilisateur
        //  voir pour changer de style et couleur de marqueurs.
        //let marqueurUser = L.marker(L.latLng(43.7751634, -1.1833137)).addTo(this.maCarte); // OK
        //marqueurUser.bindPopup("<p>Vous êtes ici</p>");
        //[43.7751634, -1.1833137]

        // Appelle la méthode pour intégrer les restaurants à la map.
        this.getJson("../js/restaurants.json");

    }

    /**
     * Requète vers le fichier json
     * @param { string } url    // L'url de la requète
     */
    getJson (url) {
        let that = this;
        // Utilisation de la fonction XHR "ajaxGet"
        ajaxGet(url, function (results) {
            let result = JSON.parse(results);
            for (let i =0; i < result.length; i++) {
                let num1 = result[i].ratings[0].stars;
                let num2 = result[i].ratings[1].stars;
                let somme = num1 + num2;
                let x = Math.round(somme / result[i].ratings.length); // TODO: vérifier le résultat (virgule)

                // Création d'une instance de la classe restaurant
                let restaurant = new Restaurant(that.maCarte,
                    null,
                    null,
                    L.latLng(result[i].lat, result[i].long),
                    result[i].restaurantName,
                    result[i].address,
                    x,
                    null,
                    result[i].ratings,);
                restaurant.createMarker(); // Crée un marqueur pour chaque restaurant.
                restaurant.initHtml(); // Crée le contenu HTML pour chaque restaurant

            }

        });
    }
    // TODO: rajouter la méthode de geocoding
    // TODO: méthode pour n'afficher sur le côté que les restaurants visible sur la map
    // TODO: problème avec coordsFromBrowser pour marqueur position utilisateur et valeur par défaut si geoloc = KO
    // TODO: récup image google street view
}




