let isEnabled = true;

// Загружаем состояние из хранилища при запуске
chrome.storage.sync.get(['enabled'], function(result) {
  isEnabled = result.enabled !== undefined ? result.enabled : true;
});

// Обработчик для изменения заголовков
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (!isEnabled) return;
    
    const protectedText = "Защищено Samoilik Protect 🛡️";
    
    for (let i = 0; i < details.requestHeaders.length; i++) {
      if (details.requestHeaders[i].name.toLowerCase() === 'x-forwarded-for') {
        details.requestHeaders[i].value = protectedText;
        return { requestHeaders: details.requestHeaders };
      }
      if (details.requestHeaders[i].name.toLowerCase() === 'x-real-ip') {
        details.requestHeaders[i].value = protectedText;
        return { requestHeaders: details.requestHeaders };
      }
    }
    
    details.requestHeaders.push({
      name: 'X-Forwarded-For',
      value: protectedText
    });
    
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

// Обработчик сообщений от popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggle") {
    isEnabled = request.value;
    chrome.storage.sync.set({enabled: isEnabled});
    
    // Обновляем все активные вкладки
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {action: "toggle", value: isEnabled});
      });
    });
    
    sendResponse({status: "success"});
  }
  else if (request.action === "getStatus") {
    sendResponse({enabled: isEnabled});
  }
  return true;
});