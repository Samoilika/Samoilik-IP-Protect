let isEnabled = true;

// Загружаем состояние из хранилища при запуске
chrome.storage.sync.get(['enabled'], function(result) {
  isEnabled = result.enabled !== undefined ? result.enabled : true;
  if (isEnabled) replaceIPs();
});

// Обработчик сообщений от background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggle") {
    isEnabled = request.value;
    if (isEnabled) replaceIPs();
  }
});

// Функция замены IP на странице
function replaceIPs() {
  if (!isEnabled) return;

  const protectedText = "Защищено Samoilik Protect 🛡️";
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  
  function walkNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (ipRegex.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(ipRegex, protectedText);
      }
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        walkNodes(node.childNodes[i]);
      }
    }
  }
  
  walkNodes(document.body);
  
  // Обработка динамического контента
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        walkNodes(node);
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  if (isEnabled) replaceIPs();
});