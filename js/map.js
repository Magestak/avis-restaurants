class Map {
    constructor() {
        //this.carte = {};
        //this.coordsFromBrowser = {};
    }

    initMap() {
        // On détermine une position par défaut sur la carte
        const coordsParis = { lat: 48.866667, lng: 2.333333 };
        let coordsFromBrowser = {
            lat: coordsParis.lat,
            lng: coordsParis.lng
        };

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

            coordsFromBrowser.lat = position.coords.latitude;
            coordsFromBrowser.lng = position.coords.longitude;
            console.log("COORDSFROMBROWSER: ", coordsFromBrowser);

            carte.setView([coordsFromBrowser.lat, coordsFromBrowser.lng], 13);
        }

        /**
         * Gère le refus de la géolocalisation par l'utilisateur et les erreurs possibles.
         * @param { number } error
         */
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    confirm("User denied the request for Geolocation.")
                    carte.setView([coordsFromBrowser.lat, coordsFromBrowser.lng], 13);
                    console.log("POSITION DEFAUT: ")
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
        const carte = L.map('maCarte').setView([coordsFromBrowser.lat, coordsFromBrowser.lng], 13);

        // On charge les "tuiles"
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            minZoom: 1,
            maxZoom: 20,
            attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(carte);

        // Ajout d'un marqueur
        // TODO: voir pour changer de style et couleur de marqueurs.
        //      voir pour mettre les coords de l'utilisateur.
        var marqueur = L.marker([43.765938, -1.1794394]).addTo(carte);
        console.log("MARQUEUR: ", typeof(marqueur))
        marqueur.bindPopup("<p>Ma position</p>");

    }
}




