export const handleClickOutside = (inputRef, editingTitles, toggleEditingTitle) => (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
    };
      const id = Object.keys(editingTitles).find(key => editingTitles[key]);
      if (id) {
        toggleEditingTitle(id);
      }
    };
  
  export const handleEscape = (editingTitles, originalTitle, setConversations, toggleEditingTitle) => (event) => {
    if (event.key === "Escape") {
      const id = Object.keys(editingTitles).find(key => editingTitles[key]);
      if (id) {
        setConversations((prev) => prev.map(conv => 
          conv.id === id ? {...conv, title: originalTitle} : conv
        ));
        toggleEditingTitle(id);
      }
    }
  };

  export const handleKeyDown = (activeConversation, conversations, setActiveConversation) => (e) => {
    let newIndex;
    if (activeConversation) {
      const currentIndex = conversations.findIndex(
        (conv) => conv.id === activeConversation.id
      );
      if (e.keyCode === 38 && currentIndex > 0) { // Up key
        newIndex = currentIndex - 1;
      } else if (e.keyCode === 40 && currentIndex < conversations.length - 1) { // Down key
        newIndex = currentIndex + 1;
      }
    } else if (e.keyCode === 38 || e.keyCode === 40) { // If no conversation selected yet
      newIndex = 0;
    }
    if (newIndex !== undefined) {
      setActiveConversation(conversations[newIndex]);
    }
  };