// Create the context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "alternateCaps",
        title: "Alternate Caps",
        contexts: ["selection"]
    });
});

// Add a click event listener to the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "alternateCaps") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: alternateCapsOnPage,
            args: [info.selectionText]
        });
    }
});

function alternateCapsOnPage(selectedText) {
    function alternateCaps(text) {
        let result = '';
        let makeUpper = true;

        for (let char of text) {
            if (char.match(/[a-z]/i)) {
                result += makeUpper ? char.toUpperCase() : char.toLowerCase();
                makeUpper = !makeUpper;
            } else {
                result += char;
            }
        }
        return result;
    }

    function replaceSelectedText(replacementText) {
        const activeElement = document.activeElement;
        const tagName = activeElement.tagName.toLowerCase();
        
        if (tagName === 'textarea' || (tagName === 'input' && activeElement.type === 'text')) {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            activeElement.setRangeText(replacementText, start, end, 'select');
        } else if (window.getSelection) {
            const selection = window.getSelection();
            if (!selection.rangeCount) return false;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(replacementText));
        }
    }

    const transformedText = alternateCaps(selectedText);
    replaceSelectedText(transformedText);
}
