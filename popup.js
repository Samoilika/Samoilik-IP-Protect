document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('protectionToggle');
  const statusText = document.getElementById('statusText');
  const emojiLine = document.getElementById('emoji-line');
  
  // Генерация случайной строки из 4 эмодзи
  function generateRandomEmojis() {
    const emojis = ["✌", "🤞", "😘", "💕", "💋", "🌹", "🎉", "😂", "✔", "👀", "✨", "😎", "🤑", "😜", "😱", "🧠"];
    let result = '';
    
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * emojis.length);
      result += emojis[randomIndex];
    }
    
    return result;
  }
  
  // Установка новой строки эмодзи
  emojiLine.textContent = generateRandomEmojis();
  
  // Получаем текущее состояние защиты
  chrome.runtime.sendMessage({action: "getStatus"}, function(response) {
    toggle.checked = response.enabled;
    updateStatusText(response.enabled);
  });
  
  // Обработчик переключения
  toggle.addEventListener('change', function() {
    const isEnabled = this.checked;
    updateStatusText(isEnabled);
    
    // Обновляем строку эмодзи при переключении
    emojiLine.textContent = generateRandomEmojis();
    
    // Отправляем сообщение в background
    chrome.runtime.sendMessage({
      action: "toggle",
      value: isEnabled
    });
  });
  
  // Обновление текста статуса
  function updateStatusText(enabled) {
    if (enabled) {
      statusText.textContent = "АКТИВНА 🛡️";
      statusText.style.color = "#4CAF50";
      statusText.style.fontWeight = "bold";
    } else {
      statusText.textContent = "ВЫКЛЮЧЕНА";
      statusText.style.color = "#ff5252";
      statusText.style.fontWeight = "normal";
    }
  }
});