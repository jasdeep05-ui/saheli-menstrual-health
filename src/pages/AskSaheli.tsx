import { useState, useRef, useEffect } from 'react';
import { useApp } from '../lib/app-context';
import { getSaheliResponse, SUGGESTED_QUESTIONS, type SaheliResponse } from '../lib/saheli-ai';
import { getArticleById } from '../lib/content';
import { AlertTriangle, Send, ExternalLink, BookOpen, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  role: 'user' | 'saheli';
  text: string;
  sources?: { name: string; url: string }[];
  relatedArticleIds?: string[];
  isUrgent?: boolean;
}

export function AskSaheli() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'saheli', text: t('askIntro') },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (question?: string) => {
    const query = question || input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: query };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate retrieval + processing delay
    setTimeout(() => {
      const response: SaheliResponse = getSaheliResponse(query);
      setMessages(m => [...m, {
        role: 'saheli', text: response.text, sources: response.sources,
        relatedArticleIds: response.relatedArticleIds, isUrgent: response.isUrgent,
      }]);
      setLoading(false);
    }, 800);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-plum-700">{t('askTitle')}</h1>
      </div>

      {/* Disclaimer bar */}
      <div className="mb-3 flex items-start gap-2 rounded-xl bg-cream-100 px-4 py-2.5">
        <Shield size={16} className="mt-0.5 flex-shrink-0 text-plum-400" />
        <p className="text-xs leading-relaxed text-plum-400">{t('askDisclaimer')}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' ? 'bg-coral-400 text-white' : 'bg-white border border-cream-200 shadow-soft text-plum-600'
            }`}>
              {msg.isUrgent && (
                <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-blush-100 px-3 py-1.5">
                  <AlertTriangle size={16} className="text-coral-500" />
                  <span className="text-xs font-semibold text-coral-600">Urgent care guidance</span>
                </div>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 border-t border-cream-200 pt-2">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-plum-300">{t('askSources')}</p>
                  {msg.sources.map((src, j) => (
                    <a key={j} href={src.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-coral-500 hover:underline">
                      <ExternalLink size={12} />
                      {src.name}
                    </a>
                  ))}
                </div>
              )}

              {msg.relatedArticleIds && msg.relatedArticleIds.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.relatedArticleIds.map(id => {
                    const article = getArticleById(id);
                    if (!article) return null;
                    return (
                      <button key={id} onClick={() => navigate(`/learn/${id}`)}
                        className="flex items-center gap-1 rounded-full bg-lavender-100 px-3 py-1 text-xs text-lavender-600 hover:bg-lavender-200 transition-colors">
                        <BookOpen size={12} />
                        {article.title}
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
            <div className="rounded-2xl bg-white border border-cream-200 shadow-soft px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-coral-300" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-coral-300" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-coral-300" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {showSuggestions && !loading && (
        <div className="mb-3">
          <p className="mb-2 text-xs font-medium text-plum-400">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => handleSend(q)}
                className="rounded-full border border-cream-300 bg-white px-3 py-1.5 text-xs text-plum-500 transition-all hover:border-coral-300 hover:bg-coral-50">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-cream-200 pt-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder={t('askPlaceholder')}
            className="input-field flex-1"
            disabled={loading}
            aria-label="Question input"
          />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()}
            className="btn-primary px-4" aria-label={t('askSend')}>
            <Send size={18} />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-plum-300">{t('askPrivacyNote')}</p>
      </div>
    </div>
  );
}
