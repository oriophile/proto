window.onload = function() {
    editor.init();
}
const browserCapabilitiesRequired = [
    XMLHttpRequest
];
const editor = (function() {
    const editorClass = "incogtech_wysiwyg_editor";
    const disableBackspaceNavigation = function() {
        document.body.onkeydown = function(e) {
            let code = e.keyCode;
            if(((code == 8) || (code == 46)) && (e.target.nodeName == "BODY")) {
                e.preventDefault();
                return false;
            }
        }
        console.log("Disabled navigation from backspace to prevent accidental navigation.");
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

    const addEditor = function(target) {
        target.childNodes.forEach(function(cn) {
            if((cn.nodeType == Node.TEXT_NODE) && (target.nodeName != "IT-WRAPPER") && (cn.nodeValue != null) && (cn.nodeValue.trim() != "")) {
                console.log(encodeURIComponent(cn.nodeValue));
                let wrap = document.createElement("it-wrapper");
                wrap.appendChild(document.createTextNode(cn.nodeValue));
                wrap.classList.add(editorClass);
                wrap.setAttribute("contenteditable", true);
                target.replaceChild(wrap, cn);
            }
        });
    }

    const init = () => {
        document.body.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            let target = e.target;
            removeEditorsExcept(target);
            addEditor(target);
            return false;
        });
        document.body.addEventListener("mouseover", function(e) {
        });
        console.log("Click on body attached");

        //Prevent from accidental navigation while deleting text (using backspace)
        disableBackspaceNavigation();
    }
    const save = () => {
        var page = {};
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    console.log(this.responseText);
                }
            }
        }
        xhr.open("POST", "/editor/save", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("csrf", document.getElementByName("csrf-token")[0].getAttribute("csrf-token"));
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.send(JSON.stringify(page));
    }
    return {
        init,
        save
    }
})()
