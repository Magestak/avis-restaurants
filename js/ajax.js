/**
 * Permet d'activer automatiquement les demandes XHR inter-domaines en cas de besoin
 *//*
(function() {
    let cors_api_host = 'cors-anywhere.herokuapp.com';
    let cors_api_url = 'https://' + cors_api_host + '/';
    let slice = [].slice;
    let origin = window.location.protocol + '//' + window.location.host;
    let open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        let args = slice.call(arguments);
        let targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();*/
/**
 * Exécute un appel AJAX GET
 * @param { string } url cible
 * @param { function } callback = la fonction appelée en cas de succès
 */
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}
