class Map {
    /**
     * Classe correspondant à la map
     * @constructor
     * @return { object }    // La map
     */
    constructor() {
        this.maCarte = {}; // La carte
        this.positionDefault = { lat: 48.8534, lng: 2.3488}; //Position par défaut = Paris
        this.coordsFromBrowser = {
            lat: this.positionDefault.lat,
            lng: this.positionDefault.lng
        };
        this.marqueurUser = {}; // Le marqueur de la position géolocalisée de l'utilisateur
        this.restaurants = []; // La liste des restaurants
    }

    /**
     * Initialise la map
     */
    initMap() {
        let that = this;

        // On récupère la latitude et la longitude de la position de l'utilisateur et on gère les erreurs si nécessaire
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            confirm("Geolocation is not supported by this browser.");
            //this.marqueurUser = L.marker(L.latLng(this.coordsFromBrowser.lat, this.coordsFromBrowser.lng)).addTo(this.maCarte);
            this.marqueurUser = L.marker(L.latLng(this.positionDefault.lat, this.positionDefault.lng)).addTo(this.maCarte);
        }

        // On crée un icône personnalisé pour la librairie leaflet qui sera utilisé pour marquer la position de l'utilisateur
        let iconUser = L.icon({
            iconUrl: '../img/map-marker-alt-solid-purple.png',
            iconSize: [25, 38],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
        });

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
            // On récupère les coordonnées de la position de l'utilisateur
            that.coordsFromBrowser.lat = position.coords.latitude;
            that.coordsFromBrowser.lng = position.coords.longitude;

            that.maCarte.setView([that.coordsFromBrowser.lat, that.coordsFromBrowser.lng], 14);

            // On insère un marqueur sur la position de l'utilisateur
            that.marqueurUser = L.marker(L.latLng(that.coordsFromBrowser.lat, that.coordsFromBrowser.lng), {icon: iconUser},
                ).bindPopup("Vous êtes ici !").addTo(that.maCarte);

            // Appelle la méthode pour intégrer les restaurants du fichier JSON à la map.
            //that.getJson("../js/restaurants.json");

        }

        /**
         * Gère le refus de la géolocalisation par l'utilisateur et les erreurs possibles.
         * @param { number } error
         */
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    confirm("User denied the request for Geolocation.")
                    // TODO: voir pour mettre le draggable sur marqueur par défaut sur Paris, comme pour position user
                    that.marqueurUser = L.marker(L.latLng(that.positionDefault.lat, that.positionDefault.lng), {icon: iconUser}).addTo(that.maCarte);
                    that.marqueurUser.bindPopup("<p>Position par défaut</p>");
                    that.getJson("../js/restaurants.json");
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
        this.maCarte = L.map('map').setView([that.coordsFromBrowser.lat, that.coordsFromBrowser.lng], 14);

        // On charge les "tuiles"
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            minZoom: 1,
            maxZoom: 20,
            attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.maCarte);

        //////////////////////////



        //////////////////////////
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
                let x = Math.round(somme / result[i].ratings.length);

                // Création d'une instance de la classe restaurant
                let restaurant = new Restaurant(that.maCarte,
                    null,
                    null,
                    L.latLng(result[i].lat, result[i].long),
                    result[i].restaurantName,
                    result[i].address,
                    x,
                    result[i].ratings,);
                restaurant.createMarker(); // Crée un marqueur pour chaque restaurant
                restaurant.initHtml(); // Crée le contenu HTML pour chaque restaurant

                // On récupère les restaurants crées
                that.restaurants.push(restaurant);
            }
            // On affiche sur le côté de la map, les restaurants uniquement visibles sur la carte
            that.onlyVisibleRestaurants();
        });
    }

    /**
     * Affiche la liste des restaurants uniquement visibles sur la carte
     */
    onlyVisibleRestaurants() {
        let that = this;
        that.restaurants.forEach(restaurant => {
            if (!(that.maCarte.getBounds().contains(restaurant.location))) {
                restaurant.resultats.style.display = "none";
            }
        })
    }

    /**
     * Met à jour la liste des restaurants sur le côté de la map, à chaque mouvement de la carte
     */
    restaurantUpdate() {
        let that = this;
        this.maCarte.on('moveend', function() {
            let listRestaurants = document.getElementById('restaurants-list');
            listRestaurants.innerHTML = "";
            that.getJson("../js/restaurants.json");
        });
    }

    // TODO: 1- Finir méthode restaurant,initHtml (méthode getDetails (mettre un console log dans le else), puis init)
    // TODO: 2- rajouter la méthode de geocoding pour localisation des restaurants autour de sa position
    // TODO: 3- ajouter outil de filtre sur étoiles de restaurant dans une barre menu en haut de la page
    // TODO: 4- ajouter affichage du restaurant au clic du marker sur la map
    // TODO: 5- Voir problème du clic sur nom du resto qui efface le contenu des autres restos ouverts = bloquer l'ouverture d'autres restos
    // TODO: 6- Voir problème des comments user qui ne peuvent être mis que dans un seul resto?
}




