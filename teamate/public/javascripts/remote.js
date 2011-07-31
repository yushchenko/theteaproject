window.onload = function() {

    var tea = document.getElementById('tea'),
        brew = document.getElementById('brew');


    function post(url) {
        var req = new XMLHttpRequest();
        req.open('POST', url, false);
        req.send(null);
    }

    tea.onchange = function() {
        var idx = tea.selectedIndex - 1;
        brew.disabled = (idx === -1);
        post('/select-tea/' + idx);
    };

    brew.onclick = function() {
        post('/start-brew');
    };
};
