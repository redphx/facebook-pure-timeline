'use strict';
(function(delay) {
  var DEFAULT_MESSAGE = 'Get off facebook and do your work!';

  function saveMessage(message, callback) {
    message = message.trim();
    if (message.lenght === 0) {
      message = DEFAULT_MESSAGE;
    }

    chrome.storage.local.set({
      'message': message
    }, function() {
      callback && callback(message);
    });
  }

  function showMessage(elm, message) {
    var messageElm = document.createElement('div');
    messageElm.innerText = message;
    messageElm.className = 'pure-message';
    messageElm.setAttribute('contentEditable', 'true');
    messageElm.addEventListener('blur', function(e) {
      var msg = this.innerText.trim();
      if (msg !== message) {
        saveMessage(msg, function(newMessage) {
          messageElm.innerText = newMessage;
        });
      }
    });

    elm.parentNode.insertBefore(messageElm, elm.nextSibling);
  }

  function purify(message) {
    var elms = document.querySelectorAll('div[id^=topnews_main_stream], div[id^=mostrecent_main_stream], div[id^=pagelet_home_stream]');
    var size = elms.length;
    if (size > 0) {
      for (var i = 0; i < size; i++) {
        var elm = elms[i];
        showMessage(elm, message);

        elm.parentNode.removeChild(elm);
      }
    }

    console.log('PURIFIED');
  }

  chrome.storage.local.get('message', function(data) {
    var message = data.message || DEFAULT_MESSAGE;
    setTimeout(purify, delay, message);
  });
})(5000);