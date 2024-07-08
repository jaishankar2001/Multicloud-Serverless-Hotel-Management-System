import { useEffect } from 'react';

const ChatKommunicate = () => {
  useEffect(() => {
    const loadKommunicate = () => {
      if (!document.getElementById('kommunicate-script')) {
        var kommunicateSettings = {"appId":"2884ca133c0d4bf9d92b56625c718dfe8","popupWidget":true,"automaticChatOpenOnNavigation":true};
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        s.id = "kommunicate-script"; // Add an id to the script
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
        window.kommunicate = window.kommunicate || {};
        window.kommunicate._globals = kommunicateSettings;
      } else {
        console.log('Kommunicate script is already loaded.');
      }
    };

    loadKommunicate();
  }, []);

  return null;
};

export default ChatKommunicate;
