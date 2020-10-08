class Map {
    /**
     * Classe correspondant à la map
     * @constructor
     * @return { object }    // La map
     */
    constructor() {
        this.maCarte = {};
        this.positionDefault = { lat: 48.866667, lng: 2.333333 }; //Position par défaut = Paris
        this.coordsFromBrowser = {
            lat: this.positionDefault.lat,
            lng: this.positionDefault.lng
        };
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
        }

        /**
         * Gère le refus de la géolocalisation par l'utilisateur et les erreurs possibles.
         * @param { number } error
         */
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    confirm("User denied the request for Geolocation.")
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
        var marqueur = L.marker(L.latLng(43.7751634, -1.1833137)).addTo(this.maCarte); // OK
        marqueur.bindPopup("<p>Vous êtes ici</p>");
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
                let moy = Math.round(somme / result[i].ratings.length); // TODO: vérifier le résultat (virgule)

                // Création d'une instance de la classe restaurant
                let restaurant = new Restaurant(that.maCarte,
                    null,
                    null,
                    L.latLng(result[i].lat, result[i].long),
                    result[i].restaurantName,
                    result[i].address,
                    moy,
                    null,
                    result[i].ratings,);
                restaurant.createMarker();
                //let marqueur = L.marker(L.latLng(result[i].lat, result[i].long)).addTo(that.maCarte); // OK
                // TODO: Rattachement de la méthode de création html d'un restaurant
            }

        });
    }
}




