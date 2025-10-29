import React, { useState, useRef } from 'react';

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState('');
  const typingRef = useRef(false);
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);

    // typing indicator debounce
    if (!typingRef.current) {
      onTyping && onTyping(true);
      typingRef.current = true;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onTyping && onTyping(false);
      typingRef.current = false;
    }, 700);
  };

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setText('');
      inputRef.current?.focus();
      return;
    }
    onSend && onSend(trimmed);
    setText('');
    onTyping && onTyping(false);
    typingRef.current = false;
    inputRef.current?.focus();
  };

  // Optional: allow Shift+Enter for newline in future if switching to textarea.
  return (
    <div className="input-area">
      <form onSubmit={submit} className="message-form" aria-label="Send message">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={handleChange}
          autoComplete="off"
          aria-label="Message"
        />
        <button type="submit" aria-label="Send message">Send</button>
      </form>
    </div>
  );
}
