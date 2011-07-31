window.onload = function() {

    var state = document.getElementById('state').value,

        containers = {
            selecting: document.getElementById('selecting'),
            selected: document.getElementById('selected'),
            brewing: document.getElementById('brewing')
        },

        brew = document.getElementById('brew'),
        back = document.getElementById('back'),
        done = document.getElementById('done');

    function post(url) {
        var req = new XMLHttpRequest();
        req.open('POST', url, false);
        req.send(null);
    }

    function setContainerVisibility(state) {
        
        for (var name in containers) {
            containers[name].style.display = (name === state) ? 'block' : 'none';
        }
    }

    function setState(newState, idx) {

        setContainerVisibility(newState);

        post('/' + state + '-' + newState + (idx !== undefined ? ('/' + idx) : ''));

        state = newState;
    }

    window.selectTea = function(i) {
        setState('selected', i);
    };

    back.onclick = function() {
        setState('selecting');
    };

    brew.onclick = function() {
        setState('brewing');
    };

    done.onclick = function() {
        setState('selecting');
    };

    setContainerVisibility(state); // initialization
};
