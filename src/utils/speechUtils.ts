
// Speech-to-text and text-to-speech utilities

export const speechUtils = {
  // Initialize speech recognition (browser API)
  initSpeechRecognition(language: string = 'es-ES'): any {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return null;
    }
    
    // Use the appropriate speech recognition API
    const SpeechRecognition = (window as any).SpeechRecognition || 
                            (window as any).webkitSpeechRecognition;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;
    
    return recognition;
  },
  
  // Convert speech to text
  startListening(
    language: string = 'es-ES',
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): { stop: () => void } {
    const recognition = this.initSpeechRecognition(language);
    
    if (!recognition) {
      onError('Speech recognition not supported in this browser');
      return {
        stop: () => {}
      };
    }
    
    recognition.onresult = (event: any) => {
      const result = event.results[0];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      onResult(transcript, isFinal);
    };
    
    recognition.onerror = (event: any) => {
      onError(`Speech recognition error: ${event.error}`);
    };
    
    recognition.start();
    
    return {
      stop: () => {
        recognition.stop();
      }
    };
  },
  
  // Convert text to speech
  speak(text: string, language: string = 'es-ES', onEnd?: () => void): void {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    
    // Try to get a voice that matches the language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }
    
    if (onEnd) {
      utterance.onend = onEnd;
    }
    
    window.speechSynthesis.speak(utterance);
  },
  
  // Stop any ongoing speech
  stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },
  
  // Record audio for pronunciation analysis
  async startAudioRecording(): Promise<{ 
    stop: () => Promise<Blob>,
    cancel: () => void
  }> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Audio recording not supported in this browser');
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: BlobPart[] = [];
    
    mediaRecorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });
    
    mediaRecorder.start();
    
    const stop = () => {
      return new Promise<Blob>((resolve) => {
        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          resolve(audioBlob);
        });
        
        mediaRecorder.stop();
      });
    };
    
    const cancel = () => {
      // Stop recording without resolving a blob
      mediaRecorder.stop();
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
    };
    
    return { stop, cancel };
  },
  
  // Create an audio URL from a blob
  createAudioUrl(audioBlob: Blob): string {
    return URL.createObjectURL(audioBlob);
  },
  
  // Play audio from a URL
  playAudio(audioUrl: string): { pause: () => void } {
    const audio = new Audio(audioUrl);
    audio.play();
    
    return {
      pause: () => audio.pause()
    };
  },
};

// Helper for mocking pronunciation feedback in development
export const mockPronunciationAnalysis = async (audioBlob: Blob, text: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random score between 60-100
  const score = Math.floor(Math.random() * 40) + 60;
  
  let feedback;
  if (score >= 90) {
    feedback = '¡Excelente pronunciación! Suenas muy natural.';
  } else if (score >= 80) {
    feedback = 'Muy buena pronunciación. Sigue así.';
  } else if (score >= 70) {
    feedback = 'Buena pronunciación. Practica un poco más la entonación.';
  } else {
    feedback = 'Tu pronunciación es entendible, pero necesitas más práctica con ciertos sonidos.';
  }
  
  return {
    score,
    feedback,
    detailedFeedback: {
      accuracy: Math.floor(Math.random() * 40) + 60,
      fluency: Math.floor(Math.random() * 40) + 60,
      intonation: Math.floor(Math.random() * 40) + 60,
    }
  };
};
