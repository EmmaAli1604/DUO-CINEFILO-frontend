import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
    id: string;
    text: string;
    htmlContent?: string;
    peticionData?: any; // Datos JSON extra del backend
    sender: "user" | "bot";
    timestamp: Date;
}

// "display" se usa cuando el bot solo muestra datos pasivamente
type NextAction = "search" | "display" | null;

interface ChatbotProps {
    onSearch: (query: string) => void;
    onStartSearch: (query: string) => void;
}

const Chatbot = ({ onSearch, onStartSearch }: ChatbotProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isTtsEnabled, setIsTtsEnabled] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [nextAction, setNextAction] = useState<NextAction>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Asegúrate de tener VITE_API_BASE_URL en tu .env.local
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

    // --- FUNCIÓN PARA RENDERIZAR JSON BONITO (CON FILTROS) ---
    const renderPrettyJson = (data: any) => {
        if (!data) return null;

        // Campos que NO queremos mostrar en el chat
        const hiddenFields = ["idpelicula", "poster", "trailer", "id", "id_pelicula"];

        const shouldShow = (key: string) => !hiddenFields.includes(key.toLowerCase());

        // A) Si es una lista (Array)
        if (Array.isArray(data)) {
            return (
                <div className="flex flex-col gap-2 mt-2">
                    {data.map((item, idx) => (
                        <div key={idx} className="bg-background/50 p-2 rounded border border-border/50 text-xs">
                            {Object.entries(item).map(([key, value]) => {
                                if (!shouldShow(key)) return null;
                                return (
                                    <div key={key} className="flex flex-col mb-1 last:mb-0">
                                        <span className="font-bold capitalize text-cinema-rose">{key.replace(/_/g, ' ')}:</span>
                                        <span className="truncate text-foreground/90">{String(value)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            );
        }

        // B) Si es un objeto único
        if (typeof data === 'object') {
            return (
                <div className="bg-background/50 p-2 rounded border border-border/50 text-xs mt-2">
                    {Object.entries(data).map(([key, value]) => {
                        if (!shouldShow(key)) return null;
                        return (
                            <div key={key} className="flex justify-between gap-2 mb-1 last:mb-0 border-b border-border/20 last:border-0 pb-1 last:pb-0">
                                <span className="font-bold capitalize text-cinema-rose">{key.replace(/_/g, ' ')}:</span>
                                <span className="text-right text-foreground/90">{String(value)}</span>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return <span>{String(data)}</span>;
    };

    const speak = async (text: string) => {
        if (!isTtsEnabled || !text) return;
        if (audio) audio.pause();

        try {
            // Limpiamos el texto de posibles etiquetas HTML antes de enviarlo al TTS
            const cleanText = text.replace(/<[^>]*>?/gm, '');
            const requestBody = { texto: cleanText };

            const response = await fetch(`${apiBaseUrl}/chat/tts/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) throw new Error('Error TTS');
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const newAudio = new Audio(audioUrl);
            setAudio(newAudio);
            newAudio.play();
        } catch (error) {
            console.error('Error audio:', error);
        }
    };

    const sendBotRequest = async (message: string, searchQuery?: string) => {
        setIsLoading(true);
        try {
            const idusuario = getCookie('username');
            const token = getCookie('authToken');

            if (!idusuario || !token) {
                throw new Error("Usuario no autenticado.");
            }

            const requestBody: any = {
                mensaje_usuario: message,
                idusuario: decodeURIComponent(idusuario),
                token: decodeURIComponent(token)
            };

            if (searchQuery) {
                requestBody.busqueda = searchQuery;
            }

            const res = await fetch(`${apiBaseUrl}/chat/msj/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();
            const operacion = data.operacion;
            const botResponse = data.respuesta || "No he podido procesar tu solicitud.";

            // Capturamos la data extra si viene del backend
            const peticionInfo = data.peticion || null;

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
                // Solo guardamos la data si la operación es de Respuesta ('R')
                peticionData: (operacion === 'R') ? peticionInfo : undefined,
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
            speak(textToSpeak);

            // Lógica de acciones siguientes
            if (operacion === 'B') {
                setNextAction("search");
            } else if (operacion === 'R') {
                setNextAction("display");
            } else {
                setNextAction(null);
            }

        } catch (error) {
            console.error("Error bot:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Error de conexión con el asistente.",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
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

        if (nextAction === "search") {
            setInputText("");
            setNextAction(null);
            onSearch(trimmedInput);
            onStartSearch(trimmedInput);
            await sendBotRequest("ESTOY BUSCANDO", trimmedInput);
        } else {
            const userMessage: Message = {
                id: Date.now().toString(),
                text: trimmedInput,
                sender: "user",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setInputText("");
            await sendBotRequest(trimmedInput);
        }
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
            padding: 0.5rem;
            margin-top: 0.5rem;
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            border: none;
            border-radius: 0.5rem;
            text-align: center;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.85rem;
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
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border bg-cinema-burgundy">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cinema-rose flex items-center justify-center">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Asistente Cineteca</h3>
                                <p className="text-xs text-gray-300">En línea</p>
                            </div>
                        </div>
                        <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon" className="hover:bg-cinema-rose/20 text-white">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Área de Mensajes */}
                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef} onClick={handleOptionClick}>
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] rounded-lg p-3 ${
                                        message.sender === "user"
                                            ? "bg-cinema-rose text-white"
                                            : "bg-secondary text-foreground"
                                    }`}>
                                        <p className="text-sm whitespace-pre-line">{message.text}</p>

                                        {/* Renderizado de botones/HTML legacy */}
                                        {message.htmlContent && (
                                            <div className="mt-2" dangerouslySetInnerHTML={{ __html: message.htmlContent }} />
                                        )}

                                        {/* Renderizado del JSON Bonito (Info técnica filtrada) */}
                                        {message.peticionData && (
                                            <div className="mt-3 border-t border-border/20 pt-2">
                                                <p className="text-xs font-semibold mb-1 opacity-70">Detalles:</p>
                                                {renderPrettyJson(message.peticionData)}
                                            </div>
                                        )}

                                        <span className="text-xs opacity-70 mt-1 block text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-foreground">
                                        <div className="flex space-x-1 items-center h-5">
                                            <div className="w-2 h-2 bg-cinema-rose rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-cinema-rose rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-cinema-rose rounded-full animate-bounce"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-card">
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