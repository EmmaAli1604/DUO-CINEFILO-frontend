import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  text: string;
  htmlContent?: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const getCookie = (name: string) => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollableNode = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableNode) {
          scrollableNode.scrollTop = scrollableNode.scrollHeight;
        }
      }
    }, 100);
  };

  const speak = async (text: string) => {
    if (!isTtsEnabled || !text) return;
    if (audio) audio.pause();

    try {
      const requestBody = { texto: text };
      console.log('Enviando a TTS:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${apiBaseUrl}/chat/tts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error('La respuesta del servicio de TTS no fue exitosa');
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      setAudio(newAudio);
      newAudio.play();
    } catch (error) {
      console.error('Error al reproducir el audio:', error);
    }
  };

  const sendBotRequest = async (message: string) => {
    setIsLoading(true);
    try {
      const idusuario = getCookie('username');
      const token = getCookie('authToken');

      if (!idusuario || !token) {
        throw new Error("Usuario no autenticado.");
      }

      const requestBody = { 
        mensaje_usuario: message,
        idusuario: decodeURIComponent(idusuario),
        token: decodeURIComponent(token)
      };
      console.log('Enviando a Bot:', JSON.stringify(requestBody, null, 2));

      const res = await fetch(`${apiBaseUrl}/chat/msj/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();
      const botResponse = data.respuesta || "No he podido procesar tu solicitud. Inténtalo de nuevo.";
      
      const htmlSeparator = "<br/><br/>";
      let textToSpeak = botResponse;
      let htmlContent: string | undefined = undefined;

      if (botResponse.includes(htmlSeparator)) {
        const parts = botResponse.split(htmlSeparator);
        textToSpeak = parts[0];
        htmlContent = parts.slice(1).join(htmlSeparator);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: textToSpeak,
        htmlContent: htmlContent,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      speak(textToSpeak);

    } catch (error) {
      console.error("Error al obtener respuesta del bot:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, ha ocurrido un error de conexión. Por favor, inténtalo más tarde.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      speak(errorMessage.text);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const username = getCookie('username');
      const token = getCookie('authToken');
      if (username && token) {
        sendBotRequest("hola");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const trimmedInput = text.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    await sendBotRequest(trimmedInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  const toggleTts = () => {
    setIsTtsEnabled((prev) => {
      if (prev && audio) audio.pause();
      return !prev;
    });
  };

  const handleOptionClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.tagName === 'BUTTON' && target.classList.contains('btn-opcion')) {
      event.preventDefault();
      const onclickAttr = target.getAttribute('onclick');
      if (onclickAttr) {
        const match = onclickAttr.match(/enviarOpcion\('([^']*)'\)/);
        if (match && match[1]) {
          const optionValue = match[1];
          handleSend(optionValue);
        }
      }
    }
  };

  return (
    <>
      <style>
        {`
          .btn-opcion {
            display: block;
            width: 100%;
            padding: 0.75rem;
            margin-top: 0.5rem;
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            border: none;
            border-radius: 0.5rem;
            text-align: center;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .btn-opcion:hover {
            background-color: hsl(var(--primary) / 0.9);
          }
        `}
      </style>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-cinema-rose hover:bg-cinema-glow shadow-elevated z-50 animate-glow"
          aria-label="Abrir chatbot"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-card border border-border rounded-lg shadow-elevated z-50 flex flex-col animate-slide-up-fade">
          <div className="flex items-center justify-between p-4 border-b border-border bg-cinema-burgundy">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cinema-rose flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Asistente Cineteca</h3>
                <p className="text-xs text-muted-foreground">En línea</p>
              </div>
            </div>
            <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon" className="hover:bg-cinema-rose/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef} onClick={handleOptionClick}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-cinema-rose text-white" : "bg-secondary text-foreground"}`}>
                    <p className="text-sm">{message.text}</p>
                    {message.htmlContent && (
                      <div className="mt-2" dangerouslySetInnerHTML={{ __html: message.htmlContent }} />
                    )}
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-foreground">
                    <p className="text-sm italic">Escribiendo...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-secondary border-border"
                disabled={isLoading}
              />
              <Button
                onClick={toggleTts}
                variant="ghost"
                size="icon"
                className={`text-muted-foreground hover:bg-secondary ${isTtsEnabled ? 'text-cinema-rose' : ''}`}
                aria-label={isTtsEnabled ? "Desactivar voz" : "Activar voz"}
              >
                {isTtsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <Button onClick={() => handleSend(inputText)} size="icon" className="bg-cinema-rose hover:bg-cinema-glow" disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
