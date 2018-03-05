window.stb = {};
window.stbEvent = {
    onEvent : function(data) {
        AppStore.dispatch('onStbEvent', data);
    },
    event : 0
};

function init(detail) {
    // netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    window.stb = gSTB;
    window.stb.InitPlayer();
    window.stb.SetStereoMode(1);
    window.stb.SetAspect(2);
    window.stb.SetVolume(50);
    window.stb.Play(detail);
    // window.stb.SetTopWin(1);
    // setInterval('checkstatus(detail);', 120000);
}

function checkstatus() {
    if ((stbEvent.event === 1) || (stbEvent.event === 5)) window.stb.Play(detail);
    else {}
}

AppStore.subscribe('playVideo', function(event) { init(event); });
AppStore.subscribe('pause', function(event) { window.stb.Pause(); });
AppStore.subscribe('continue', function(event) { window.stb.Continue(); });
AppStore.subscribe('stop', function(event) { window.stb.Stop(); window.stb.DeinitPlayer(); });