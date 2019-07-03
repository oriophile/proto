window.onload = function() {
    editor.init();
}

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
        document.body.addEventListener("mouseover", function(e) {
            e.preventDefault();
            let target = e.target;

            removeEditorsExcept(target);

            addEditor(target);

            return false;
        });
        console.log("Click on body attached");

        //Prevent from accidental navigation while deleting text (using backspace)
        disableBackspaceNavigation();
    }
    return {
        init
    }
})()
