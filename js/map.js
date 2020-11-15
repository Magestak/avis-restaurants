class Map {
    /**
     * Classe correspondant à la map
     * @constructor
     * @return { object }    // La map
     */
    constructor() {
        this.maCarte = {}; // La carte
        this.positionDefault = {lat: 48.8534, lng: 2.3488}; //Position par défaut = Paris
        this.coordsFromBrowser = {
            lat: this.positionDefault.lat,
            lng: this.positionDefault.lng
        };
        this.marqueurUser = {}; // Le marqueur de la position géolocalisée de l'utilisateur
        this.restaurants = []; // La liste des restaurants
        this.magic = "AIzaSyDLGGNHkcJlMUPGCeneagK5ar6lHWJ7UqU";
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
            iconUrl: 'img/map-marker-alt-solid-purple.png',
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

        }

        /**
         * Gère le refus de la géolocalisation par l'utilisateur et les erreurs possibles.
         * @param { number } error
         */
        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    confirm("User denied the request for Geolocation.")
                    that.marqueurUser = L.marker(L.latLng(that.positionDefault.lat, that.positionDefault.lng), {icon: iconUser}).addTo(that.maCarte);
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
        this.maCarte = L.map('map').setView([that.coordsFromBrowser.lat, that.coordsFromBrowser.lng], 14);

        // On charge les "tuiles"
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            minZoom: 1,
            maxZoom: 20,
            attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.maCarte);

        // On met à jour la liste des restaurants sur le côté en fonction de la map visible
        this.restaurantUpdate();

        // Méthode pour ajouter un nouveau restaurant
        this.addRestaurant();

    }

    /**
     * Récupère les restaurants du fichier json
     * @param { string } url    // L'url de la requète
     */
    getJson(url) {
        let that = this;
        // Utilisation de la fonction XHR "ajaxGet"
        ajaxGet(url, function (results) {
            let result = JSON.parse(results);
            for (let i = 0; i < result.length; i++) {
                let num1 = result[i].ratings[0].stars;
                let num2 = result[i].ratings[1].stars;
                let somme = num1 + num2;
                let x = Math.round(somme / result[i].ratings.length);

                // Création d'une instance de la classe restaurant
                let restaurant = new Restaurant(that.maCarte,
                    null,
                    L.latLng(result[i].lat, result[i].long),
                    result[i].restaurantName,
                    result[i].address,
                    x,
                    result[i].ratings,);

                // On récupère les restaurants crées dans "this.restaurants"
                that.restaurants.push(restaurant);
            }
        });
    }

    /**
     * Récupère les restaurants provenant de l'api google places
     * @param { string } mapCenter    // Le centre de la carte
     */
    getPlaces(mapCenter) {
        let that = this;
        // Utilisation de la fonction XHR "ajaxGet"
        ajaxGet(
            "https://blooming-sierra-85473.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+mapCenter.lat+","+mapCenter.lng+"&radius=15000&type=restaurant&language=fr&key="+this.magic,
            function (results) {
            let result = JSON.parse(results);
            for (let i = 0; i < result.results.length; i++) {
                // Création d'une instance de la classe restaurant
                let restaurant = new Restaurant(that.maCarte,
                    result.results[i].place_id,
                    L.latLng(result.results[i].geometry.location.lat, result.results[i].geometry.location.lng),
                    result.results[i].name,
                    result.results[i].vicinity,
                    Math.round(result.results[i].rating),
                    null,
                );

                // On récupère les restaurants crées crées dans "that.restaurants"
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

        // On supprime les doublons entre les nouveaux restaurants et ceux déjà présent dans this.restaurants
        let newArray = [];
        let uniqueObject = {};

        for (let i in this.restaurants) {
            let itemName = this.restaurants[i]['name'];
            uniqueObject[itemName] = this.restaurants[i];
        }
        for (let j in uniqueObject) {
            newArray.push(uniqueObject[j]);
        }

        // Après élimination des doublons, on réaffecte le tableau filtré à "that.restaurants"
        this.restaurants = newArray;
        console.log("THAT RESTAURANTS: ", that.restaurants);

        // Pour chaque restaurant
        this.restaurants.forEach(restaurant => {
            restaurant.removeMarker(); // TODO: voir si nécessaire de garder
            // On crée le contenu Html
            restaurant.initHtml();

            // On récupère les valeurs des filtres sur les étoiles
            let starsMin = document.getElementById('etoiles-mini');
            let starsMax = document.getElementById('etoiles-maxi');

            // Pour chaque restaurant, on vérifie si il correspond aux critères du filtre sur les étoiles
            if ((restaurant.rating < starsMin.value) || (restaurant.rating > starsMax.value)) {
                // Le restaurant n'est pas dans les critères
                restaurant.resultats.style.display = "none";
            } else {
                // Le restaurant est dans les critères, alors on vérifie si il est bien visible sur la map affichée
                if (!(that.maCarte.getBounds().contains(restaurant.location))) {
                    // Le restaurant n'est pas visible
                    restaurant.resultats.style.display = "none";
                } else {
                    // Le restaurant est dans les critères et, est visible sur la map
                    restaurant.resultats.style.display = "block";
                    restaurant.createMarker();
                }
            }
            // Filtre les restaurants selon le choix utilisateur
            that.filterRestaurants(restaurant);
        })
    }

    /**
     * Met à jour la liste des restaurants sur le côté de la map, à chaque mouvement de la carte
     */
    restaurantUpdate() {
        let that = this;

        this.maCarte.on('moveend', function () {
            // On supprime les marqueurs de chaque restaurant sur la map
            that.restaurants.forEach(restaurant => {
                restaurant.removeMarker();
            })

            // On vide la liste pour accueillir les nouveaux restaurants géolocalisés
            let listRestaurants = document.getElementById('restaurants-list');
            listRestaurants.innerHTML = '';

            // On charge les restaurants du fichier json
            that.getJson("js/restaurants.json");

            // On charge les restaurants de l'api google places, et on affiche uniquement ceux visibles sur la map en récupérant
            // les coordonnées du centre de la carte
            let mapCenter = that.maCarte.getCenter();
            that.getPlaces(mapCenter);

        });
    }

    /**
     * Ecoute et applique le filtre sur les restaurants demandé par l'utilisateur
     */
    filterRestaurants(restaurant) {
        let that = this;
        let starsMin = document.getElementById('etoiles-mini');
        let starsMax = document.getElementById('etoiles-maxi');

        // On écoute les changements des select pour le filtre sur les étoiles
        starsMin.addEventListener('change', userChoice);
        starsMax.addEventListener('change', userChoice);

        function userChoice() {
            // On efface le marqueur
            restaurant.removeMarker();

            // On compare la note moyenne du restaurant au filtre demandé par l'utilisateur
            if ((restaurant.rating < starsMin.value) || (restaurant.rating > starsMax.value)) {
                // Le restaurant n'est pas dans la cible
                restaurant.resultats.style.display = 'none';
            } else {
                // Le restaurant est dans la cible, alors on vérifie si il est bien visible sur la map affichée
                if (!(that.maCarte.getBounds().contains(restaurant.location))) {
                    // Le restaurant n'est pas visible
                    restaurant.resultats.style.display = 'none';
                } else {
                    // Le restaurant est dans la cible et est visible sur la map
                    restaurant.resultats.style.display = 'block';
                    restaurant.createMarker();
                }
            }
        }
    }

    /**
     * Ajoute de nouveaux restaurants sur la map
     */
    addRestaurant() {
        let that = this;
        let coordNewResto = {};
        this.maCarte.on('click', ajoutResto);

        function ajoutResto(e) {
            coordNewResto = e.latlng;

            // On ouvre la modale d'ajout de restaurant
            document.getElementById('myModal1').style.display = "block";

            // On récupère le bouton d'envoi du formulaire
            let boutonValidModal1Resto = document.getElementById('bouton-valid-modal1-resto');

            // On récupère le formulaire
            let formResto = document.getElementById('form-resto');

            // Pour activer le bouton d'envoi du formulaire, on s'assure que les input sont bien remplis
            formResto.nom.addEventListener('change', verifInput);
            formResto.address.addEventListener('change', verifInput);
            formResto.note.addEventListener('change', verifInput);

            function verifInput() {
                if ((formResto.nom.value !== '') &&
                    (formResto.address.value !== '') &&
                    (formResto.note.value !== '')) {
                    boutonValidModal1Resto.disabled = false;
                }
            }
            // On écoute la validation du bouton d'envoi du formulaire
            boutonValidModal1Resto.addEventListener('click', function (event){
                // On bloque l'envoi du formulaire
                event.preventDefault();

                // On utilise sessionStorage pour stocker la création du nouveau resto le temps de la visite
                if (typeof sessionStorage != 'undefined') {
                    // On enregistre les données saisies par l'utilisateur
                    sessionStorage.setItem('nom-modal1-resto', document.getElementById('nom-modal1-resto').value);
                    sessionStorage.setItem('address-modal1-resto', document.getElementById('address-modal1-resto').value);
                    sessionStorage.setItem('note-modal1-resto', document.getElementById('note-modal1-resto').value);

                    // On récupère les données stockées dans "session storage"
                    let nomNouveauResto = sessionStorage.getItem("nom-modal1-resto");
                    let adresseNouveauResto = sessionStorage.getItem("address-modal1-resto");
                    let noteNouveauResto = sessionStorage.getItem("note-modal1-resto");

                    // Création du nouveau restaurant avec les données recueillies
                    // Création d'une instance de la classe restaurant
                    let nouveauRestaurant = new Restaurant(that.maCarte,
                        null,
                        L.latLng(coordNewResto.lat, coordNewResto.lng),
                        nomNouveauResto,
                        adresseNouveauResto,
                        noteNouveauResto,
                        null);

                    // Si le nouveau restaurant est crée
                    if (nouveauRestaurant) {
                        nouveauRestaurant.createMarker(); // Crée un marqueur pour chaque restaurant
                        nouveauRestaurant.initHtml(); // Crée le contenu HTML pour chaque restaurant

                        // On ajoute le restaurant crée à la liste des restaurants
                        that.restaurants.push(nouveauRestaurant);
                        console.log("THAT RESTAURANTS: ", that.restaurants);

                        // On ferme la modale
                        document.getElementById('myModal1').style.display = "none";

                        // On stoppe l'évent pour ajouter un restaurant
                        that.maCarte.off('click', ajoutResto);
                    }
                } else {
                    alert("sessionStorage n'est pas supporté");
                }
            })
        }
    }


    // TODO: Voir problème des comments user qui s'efface lors du move de la map
    // TODO: Empêcher ajout d'autres restos sans marqueur (unbind sur bouton valid)
    // TODO: voir pour empêcher message d'erreur quand ouverture commentaires d'un resto ajouté (puisque vide) avec "placeId"??
    // TODO: Voir pour cacher clé API dans une variable? Regarder doc places
    // TODO: css à faire
    // TODO: amélioration: voir pour ouverture commentaires du resto en cliquant sur le marker (dans méthode create marker?)
    // TODO: page "mentions-légales" à faire
}




