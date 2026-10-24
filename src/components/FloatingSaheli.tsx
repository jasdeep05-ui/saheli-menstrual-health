import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../lib/app-context';
import { GirlIllustration } from './GirlIllustration';
import { getSaheliResponse, SUGGESTED_QUESTIONS, type SaheliResponse, type ConversationMessage } from '../lib/saheli-ai';
import { getArticleById } from '../lib/content';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Send, ExternalLink, BookOpen, X, RotateCcw, Heart } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'saheli';
  text: string;
  sources?: { name: string; url: string }[];
  relatedArticleIds?: string[];
  isUrgent?: boolean;
  urgentMessage?: string;
  isError?: boolean;
}

export function FloatingSaheli() {
  const { t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const FLOATING_GREETING = 'Hi, lovely! 💗 What would you like to talk about?';
  const FLOATING_SUGGESTIONS = SUGGESTED_QUESTIONS.slice(0, 4);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'saheli', text: FLOATING_GREETING }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open]);

  const buildConversationHistory = useCallback((currentMessages: ChatMessage[]): ConversationMessage[] => {
    return currentMessages
      .filter(m => !m.isError)
      .map(m => ({
        role: (m.role === 'saheli' ? 'assistant' : 'user') as ConversationMessage['role'],
        content: m.text,
      }))
      .slice(-10);
  }, []);

  const handleSend = useCallback(async (question?: string) => {
    const query = question || input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: query };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = buildConversationHistory([...messages, userMsg]);
      const response: SaheliResponse = await getSaheliResponse(query, history.slice(0, -1));
      setMessages(m => [...m, {
        role: 'saheli', text: response.text, sources: response.sources,
        relatedArticleIds: response.relatedArticleIds, isUrgent: response.isUrgent,
        urgentMessage: response.urgentMessage,
      }]);
    } catch {
      setMessages(m => [...m, {
        role: 'saheli', text: t('askErrorOccurred'), isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, buildConversationHistory, t]);

  const handleNewChat = () => {
    setMessages([{ role: 'saheli', text: FLOATING_GREETING }]);
    setInput('');
    setLoading(false);
  };

  const showSuggestions = messages.length <= 1;

  if (location.pathname === '/ask') return null;

  return (
    <>
      {/* Floating girl button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(prev => !prev)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="group fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6 transition-transform hover:scale-105 active:scale-95"
        aria-label={open ? 'Close Ask Saheli AI chat' : 'Open Ask Saheli AI chat'}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {/* Tooltip */}
        {showTooltip && !open && (
          <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-plum-700 px-3 py-1.5 text-xs font-medium text-white shadow-float animate-fade-in">
            Ask Saheli AI
          </span>
        )}

        {/* The girl illustration with sway animation */}
        <span className="block animate-sway">
          <GirlIllustration size={56} />
        </span>
      </button>

      {/* Chat panel */}
      {open && (
        <>
          {/* Desktop backdrop */}
          <div
            className="fixed inset-0 z-40 hidden lg:block"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Ask Saheli AI chat"
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[75vh] flex-col rounded-t-3xl border border-cream-200 bg-white shadow-float animate-slide-up lg:bottom-6 lg:right-6 lg:left-auto lg:w-96 lg:max-h-[600px] lg:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <GirlIllustration size={28} />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-plum-700">Ask Saheli AI</h2>
                  <p className="text-[10px] text-plum-300">Your health companion</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <button
                    onClick={handleNewChat}
                    className="rounded-lg p-1.5 text-plum-400 transition-colors hover:bg-cream-100 hover:text-plum-600"
                    aria-label={t('askNewChat')}
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-plum-400 transition-colors hover:bg-cream-100 hover:text-plum-600"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-coral-400 text-white'
                      : msg.isError
                        ? 'bg-blush-100 border border-blush-200 text-plum-600'
                        : 'bg-cream-50 border border-cream-200 text-plum-600'
                  }`}>
                    {msg.isUrgent && (
                      <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-blush-100 px-2.5 py-1">
                        <AlertTriangle size={14} className="text-coral-500" />
                        <span className="text-[10px] font-semibold text-coral-600">Urgent care guidance</span>
                      </div>
                    )}
                    {msg.isUrgent && msg.urgentMessage && (
                      <p className="mb-1.5 text-[10px] font-medium text-coral-600">{msg.urgentMessage}</p>
                    )}
                    <p className="whitespace-pre-wrap text-xs leading-relaxed">{msg.text}</p>

                    {msg.isError && (
                      <button
                        onClick={() => handleSend(messages[i - 1]?.text)}
                        className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-coral-500 hover:underline"
                      >
                        <RotateCcw size={10} />
                        {t('askTryAgain')}
                      </button>
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 border-t border-cream-200 pt-1.5">
                        <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-plum-300">{t('askSources')}</p>
                        {msg.sources.map((src, j) => (
                          <a key={j} href={src.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-coral-500 hover:underline">
                            <ExternalLink size={10} />
                            {src.name}
                          </a>
                        ))}
                      </div>
                    )}

                    {msg.relatedArticleIds && msg.relatedArticleIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.relatedArticleIds.map(id => {
                          const article = getArticleById(id);
                          if (!article) return null;
                          return (
                            <button key={id} onClick={() => { navigate(`/learn/${id}`); setOpen(false); }}
                              className="flex items-center gap-1 rounded-full bg-lavender-100 px-2.5 py-1 text-[10px] text-lavender-600 hover:bg-lavender-200 transition-colors">
                              <BookOpen size={10} />
                              {article.title.en}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="rounded-2xl bg-cream-50 border border-cream-200 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Heart size={12} className="text-coral-300 animate-pulse" />
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-coral-300" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-coral-300" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-coral-300" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {showSuggestions && !loading && (
              <div className="px-4 pb-2">
                <p className="mb-1.5 text-[10px] font-medium text-plum-400">Start a conversation:</p>
                <div className="flex flex-wrap gap-1.5">
                  {FLOATING_SUGGESTIONS.map((q, i) => (
                    <button key={i} onClick={() => handleSend(q)}
                      className="rounded-full border border-cream-300 bg-white px-2.5 py-1 text-[10px] text-plum-500 transition-all hover:border-coral-300 hover:bg-coral-50">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-cream-200 px-4 py-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                  placeholder={t('askPlaceholder')}
                  className="input-field flex-1 text-sm"
                  disabled={loading}
                  aria-label="Question input"
                />
                <button onClick={() => handleSend()} disabled={loading || !input.trim()}
                  className="btn-primary px-3" aria-label={t('askSend')}>
                  <Send size={16} />
                </button>
              </div>
              <p className="mt-1.5 text-[9px] text-plum-300">{t('askPrivacyNote')}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
