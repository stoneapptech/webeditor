// Dev 1.1
// (c) Copyright 2015-2017 Stone App Technology Studio.

// initialize the variable
var html = ace.edit("html");
var css = ace.edit("css");
var js = ace.edit("javascript");
var frame = document.getElementById("frame");
var label = document.getElementById("label");
var dimmer = document.getElementById("dimmer");
var list = ["html","css","javascript"];
var object = [html,css,js];
var content = `<!DOCTYPE html>\n<html>\n    <head>\n        <title>Title</title> \n    </head>\n    <body>\n        <p>試試看，雖然我覺得不行。</p>\n    </body>\n</html>`;
var stylesheet,script,page;

// initialize the environment    
function startace(lang,editor) {
    var setmode = "ace/mode/" + lang;
    editor.setTheme("ace/theme/chrome");
    editor.getSession().setMode(setmode);
    editor.getSession().setUseWrapMode(true);
}

for (i = 0; i< list.length ; i++) {
    startace(list[i],object[i]);
}
ts('.menu .item').tab(); // ts menu tab
ts('.left.sidebar').sidebar({
        dimPage: true,
        closeable: false
});
update();

html.setValue(content);
load();
// finish

// welcome
if (!localStorage.getItem("visited")) {
    welcome();
}

function load() {
    dimmer.classList.add("active");
    page = html.getValue();
    addcss();
    addjs();
    frame.setAttribute("srcdoc",page);
    frame.srcdoc = frame.srcdoc;
    setTimeout('label.innerHTML = frame.contentWindow.document.title;',300);
    setTimeout('dimmer.classList.remove("active");',500);
}

function clear() {
    html.setValue(content);
    css.setValue("");
    js.setValue("");
    editorResize();
    load();
}

function addcss() {
    stylesheet = '<style>' + css.getValue() + '</style>' + '</head>';
    page = page.replace('</head>', stylesheet);
}

function addjs() {
    script = '<script>' + js.getValue() + '<' + '/script>' + '</head>';
    page = page.replace('</head>', script);
}

function side_bar() {
    ts('.left.sidebar').sidebar('toggle');
}

function update() {
    document.querySelector('a[data-tab="html"]').addEventListener("click", function(){ html.renderer.updateFull(); });
    document.querySelector('a[data-tab="css"]').addEventListener("click", function(){ css.renderer.updateFull(); });
    document.querySelector('a[data-tab="javascript"]').addEventListener("click", function(){ js.renderer.updateFull(); });
}

function setStorage() {
    localStorage.setItem('visited','true');
}

function welcome() {
    swal({
        html: '<h1 class="ts center aligned header">歡迎!第一次使用!</h1>',
        type: "success"
    });
    setStorage();
}

function info() {
    swal({
        type: "info",
        html: '<h2 class="ts center aligned header">About</h2>'+'<a target="_blank" href="https://tocas-ui.com/">TocasUI</a>'+' / '+'<a target="_blank" href="https://ace.c9.io/">Ace Editor</a>'
              +'<p>(c) Copyright 2015-2017 Stone App Technology Studio.</p>',
        showConfirmButton: false
    });
}