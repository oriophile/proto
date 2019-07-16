window.onload = function() {
    editor.init();
}
const browserCapabilitiesRequired = [
    XMLHttpRequest
];
const editor = (function() {
    const getSelector = (elSrc) => {
        if (!(elSrc instanceof Element)) return;
        var sSel,
        aAttr = ['name', 'value', 'title', 'placeholder', 'data-*'],
        aSel = [],
        getSelector = function(el) {
            if (el.id) {
                aSel.unshift('#' + el.id);
                return true;
            }
            aSel.unshift(sSel = el.nodeName.toLowerCase());
            if (el.className) {
                aSel[0] = sSel += '.' + el.className.trim().replace(/ +/g, '.');
                if (uniqueQuery()) return true;
            }
            for (var i=0; i<aAttr.length; ++i) {
                if (aAttr[i]==='data-*') {
                    var aDataAttr = [].filter.call(el.attributes, function(attr) {
                        return attr.name.indexOf('data-')===0;
                    });
                    for (var j=0; j<aDataAttr.length; ++j) {
                        aSel[0] = sSel += '[' + aDataAttr[j].name + '="' + aDataAttr[j].value + '"]';
                        if (uniqueQuery()) return true;
                    }
                } else if (el[aAttr[i]]) {
                    aSel[0] = sSel += '[' + aAttr[i] + '="' + el[aAttr[i]] + '"]';
                    if (uniqueQuery()) return true;
                }
            }
            var elChild = el,
            sChild,
            n = 1;
            while (elChild = elChild.previousElementSibling) {
                if (elChild.nodeName===el.nodeName) ++n;
            }
            aSel[0] = sSel += ':nth-of-type(' + n + ')';
            if (uniqueQuery()) return true;
            elChild = el;
            n = 1;
            while (elChild = elChild.previousElementSibling) ++n;
            aSel[0] = sSel = sSel.replace(/:nth-of-type\(\d+\)/, n>1 ? ':nth-child(' + n + ')' : ':first-child');
            if (uniqueQuery()) return true;
            return false;
        },
        uniqueQuery = function() {
            return document.querySelectorAll(aSel.join('>')||null).length===1;
        };
        while (elSrc.parentNode) {
            if (getSelector(elSrc)) return aSel.join(' > ');
            elSrc = elSrc.parentNode;
        }
    }
    const editorClass = "incogtech_wysiwyg_editor";
    const disableBackspaceNavigation = function() {
        document.body.onkeydown = function(e) {
            let code = e.keyCode;
            if(((code == 8) || (code == 46)) && (e.target.nodeName == "BODY")) {
                e.preventDefault();
                return false;
            }
        }
        //console.log("Disabled navigation from backspace to prevent accidental navigation.");
    }

    const removeEditor = () => {
        let oldTarget = document.querySelectorAll("." + editorClass);
        oldTarget.forEach(function(node) {
            let txtNode = document.createTextNode(node.innerHTML);
            node.parentNode.replaceChild(txtNode, node);
        });
    }

    const removeEditorsExcept = function(target) {
        let oldTarget = document.querySelectorAll("." + editorClass);
        oldTarget.forEach(function(node) {
            if(!node.isSameNode(target)) {
                let txtNode = document.createTextNode(node.innerHTML);
                node.parentNode.replaceChild(txtNode, node);
            }
        });
    }

    const addEditor = (target) => {
        target.childNodes.forEach(function(cn) {
            if((cn.nodeType == Node.TEXT_NODE) && (target.nodeName != "IT-WRAPPER") && (cn.nodeValue != null) && (cn.nodeValue.trim() != "")) {
                //console.log(encodeURIComponent(cn.nodeValue));
                let wrap = document.createElement("it-wrapper");
                wrap.appendChild(document.createTextNode(cn.nodeValue));
                wrap.classList.add(editorClass);
                wrap.setAttribute("contenteditable", true);
                target.replaceChild(wrap, cn);
                console.log("Attempted creating editor at " + getSelector(target));
            }
        });
    }

    const makeExclusivelyEditable = (target) => {
        removeEditorsExcept(target);
        addEditor(target);
    }

    const init = () => {
        document.body.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(e.target);
            makeExclusivelyEditable(e.target);
            return false;
        });
        document.body.addEventListener("mouseover", function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        //console.log("Click on body attached");

        //Prevent from accidental navigation while deleting text (using backspace)
        disableBackspaceNavigation();
    }
    const message = (msg) => {
        console.log("Message :: " + msg);
    }
    const save = () => {
        removeEditor();
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    console.log(this.responseText);
                    //window.location.reload(true);
                } else if(this.status == 401) {
                    message("You appear to be logged out, or are not authorized to save the file.");
                } else if(this.status == 419) {
                    message("This appears to be a system problem, please inform developer or development manager.");
                    console.log("Invalid CSRF Token.");
                }
            }
        }
        xhr.open("POST", "/editor/save", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("X-CSRF-TOKEN", document.getElementsByName("csrf-token")[0].getAttribute("content"));
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.send("body=" + document.body.innerHTML + "&head=" + document.head.innerHTML + "&page=" + window.location.pathname);
    }
    return {
        init,
        save
    }
})()
