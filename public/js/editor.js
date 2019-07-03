window.onload = function() {
    editor.init();
}

const editor = (function() {
    const editorClass = "incogtech_wysiwyg_editor";
    const init = () => {
        document.body.addEventListener("click", function(e) {
            e.preventDefault();

            //Remove all editors
            let oldTarget = document.querySelectorAll("." + editorClass);
            oldTarget.forEach(function(node) {
                node.classList.remove(editorClass);
                node.removeAttribute("contenteditable");
            });

            //Add editor on clicked TEXT NODE
            let target = e.target;
            target.click();
            target.childNodes.forEach(function(cn) {
                if(cn.nodeType == Node.TEXT_NODE) {
                    target.classList.add(editorClass);
                    target.setAttribute("contenteditable", true);
                }
            });

            return false;
        });
        console.log("Click on body attached");

        //Prevent from accidental navigation while deleting text (using backspace)
        document.body.onkeydown = function(e) {
            let code = e.keyCode;
            if(((code == 8) || (code == 46)) && (e.target.nodeName == "BODY")) {
                e.preventDefault();
                return false;
            }
        }
        console.log("Disabled navigation from backspace to prevent accidental navigation.");
    }
    return {
        init
    }
})()
