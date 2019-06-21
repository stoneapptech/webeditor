// Dev 2.0
// (c) Copyright 2015-2019 Stone App Technology Studio.

let $ = (selector) => { 
    let elements = document.querySelectorAll(selector);
    if (elements.length == 1) return document.querySelector(selector);
    else return elements;
}

function click(el, listener) {
    return el.addEventListener('click', (e) => {
        try {
            listener(e);
        } catch (error) {
            console.error(error);
        }
    });
}

async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

// initialize the variable
let editors = {};

let previewFrame = $("#preview iframe");
let titleLabel = $('#label');
let dimmer = $('.ts.dimmer');

const languages = ["html","css","javascript"];

const exampleContent = `<!DOCTYPE html>\n<html>\n    <head>\n        <title>Title</title>\n    </head>\n    <body>\n        <p>試試看，雖然我覺得不行。</p>\n    </body>\n</html>`;

// initialize the environment    
languages.forEach((lang) => {
    let editor = ace.edit(lang);
    editors[lang] = editor;

    editor.setTheme("ace/theme/chrome");
    editor.getSession().setMode(`ace/mode/${lang}`);
    editor.getSession().setUseWrapMode(true);
    editor.$blockScrolling = Infinity;
});

ts('.menu .item').tab(); // ts menu tab
ts('.left.sidebar').sidebar({
        dimPage: true,
        closeable: false
});

// setup menu listener
languages.forEach((lang) => {
    click($(`a[data-tab="${lang}"]`), (e) => {
        editors[lang].renderer.updateFull();
    });
});

click($('#sidebarMenu'), (e) => {
    ts('.ts.sidebar').sidebar('toggle');
});

click($('#run'), render);

window.addEventListener('message', async (e) => {
    console.log('onmessage');
    let data = e.data;
    titleLabel.textContent = data.title;
    await sleep(300);
    dimmer.classList.toggle('active', false);
});

click($('#reset'), (e) => {
    editors.html.setValue(exampleContent);
    editors.css.setValue("");
    editors.javascript.setValue("");
});

editors.html.setValue(exampleContent);

render();

function combinePage(HTMLSource, cssSource, jsSource) {
    let parser = new DOMParser();
    let shadowDOM = parser.parseFromString(HTMLSource, 'text/html');

    if (cssSource.trim() != "") {
        let stylesheet = document.createElement('style');
        stylesheet.textContent = cssSource;
        shadowDOM.querySelector('head').appendChild(stylesheet);
    }

    if (jsSource.trim() != "") {
        let script = document.createElement('script');
        script.textContent = jsSource;
        shadowDOM.querySelector('body').appendChild(script);
    }

    // post process to disable dimmer and update title
    let postSource = `(() => {
        console.log('iframe ready');
        parent.postMessage({"status": "ready", "title": (document.title || "No title")}, "*");
    })()`;
    let postScript = document.createElement('script');
    postScript.textContent = postSource;
    shadowDOM.querySelector('body').appendChild(postScript);

    return shadowDOM;
}

function render(...args) {
    console.log('render')
    dimmer.classList.toggle("active", true);

    let source = languages.map((lang, _i) => {
        return editors[lang].getValue();
    });

    let newDocument = combinePage(...source);

    previewFrame.setAttribute("srcdoc", newDocument.documentElement.outerHTML);
    previewFrame.srcdoc = previewFrame.srcdoc;
}

// welcome
if (!localStorage.getItem("visited")) {
    welcomeMessage();
}

function setState() {
    localStorage.setItem('visited','true');
}

function welcomeMessage() {
    swal({
        html: '<h1 class="ts center aligned header">歡迎!第一次使用!</h1>',
        type: "success"
    });
    setState();
}

function info() {
    swal({
        type: "info",
        html: '<h2 class="ts center aligned header">About</h2>'+'<a target="_blank" href="https://tocas-ui.com/">TocasUI</a>'+' / '+'<a target="_blank" href="https://ace.c9.io/">Ace Editor</a>'
              +'<p>(c) Copyright 2015-2019 Stone App Technology Studio.</p>',
        showConfirmButton: false
    });
}