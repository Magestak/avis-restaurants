/**
 * Exécute un appel AJAX GET
 * @param { string } url cible
 * @param { function } callback = la fonction appelée en cas de succès
 */
function ajaxGet(url, callback) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            callback(this.responseText);
        }
    };
    req.open("GET", url);
    req.send(null);
}
