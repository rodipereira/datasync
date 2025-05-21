
import { useState, useEffect, useRef } from 'react';

interface TypewriterOptions {
  text: string;
  delay?: number;
  onComplete?: () => void;
  speedFactor?: number;
}

export const useTypewriterEffect = ({
  text,
  delay = 30,
  onComplete,
  speedFactor = 1,
}: TypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fullTextRef = useRef(text);
  const indexRef = useRef(0);

  // Reinicia a animação quando o texto muda
  useEffect(() => {
    fullTextRef.current = text;
    indexRef.current = 0;
    setDisplayedText('');
    setIsTyping(true);
  }, [text]);

  useEffect(() => {
    if (!isTyping) return;

    const typeNextCharacter = () => {
      if (indexRef.current < fullTextRef.current.length) {
        const currentChar = fullTextRef.current.charAt(indexRef.current);
        
        // Adiciona pausas extras para criar um efeito mais natural
        let typeDelay = delay * speedFactor;
        
        // Pausa mais longa em pontuações
        if (['.', '!', '?'].includes(currentChar)) {
          typeDelay = delay * 10 * speedFactor; // Pausa mais longa após pontuação final
        } else if ([',', ';', ':'].includes(currentChar)) {
          typeDelay = delay * 5 * speedFactor; // Pausa média após vírgulas e similares
        }

        setDisplayedText(prev => prev + currentChar);
        indexRef.current += 1;
        
        setTimeout(typeNextCharacter, typeDelay);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };

    // Inicia a animação com um pequeno delay inicial
    const timerId = setTimeout(typeNextCharacter, 300);
    
    return () => clearTimeout(timerId);
  }, [delay, isTyping, onComplete, speedFactor]);

  return {
    displayedText,
    isTyping,
    isComplete: !isTyping && displayedText === fullTextRef.current,
  };
};
