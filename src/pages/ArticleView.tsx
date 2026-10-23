import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import { getArticleById } from '../lib/content';
import { EmptyState } from '../components/States';
import { ChevronLeft, ExternalLink, BookOpen, Lightbulb, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function ArticleView() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { t } = useApp();
  const [showSimple, setShowSimple] = useState(false);
  const article = articleId ? getArticleById(articleId) : undefined;

  if (!article) {
    return (
      <div className="space-y-5">
        <button onClick={() => navigate('/learn')} className="btn-ghost"><ChevronLeft size={18} /> {t('learnBack')}</button>
        <div className="card"><EmptyState icon={<BookOpen size={28} />} title="Article not found" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/learn')} className="btn-ghost">
        <ChevronLeft size={18} /> {t('learnBack')}
      </button>

      <div>
        <span className="badge bg-lavender-100 text-lavender-600 mb-2">{article.category}</span>
        <h1 className="font-display text-2xl font-semibold text-plum-700">{article.title}</h1>
        <p className="mt-2 text-sm text-plum-400">{article.summary}</p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-plum-300">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          {t('learnReviewed')}: {format(parseISO(article.reviewedDate), 'MMM yyyy')}
        </div>
      </div>

      {/* Explain simply toggle */}
      <button
        onClick={() => setShowSimple(!showSimple)}
        className={`flex w-full items-center gap-2 rounded-xl border p-4 transition-all ${
          showSimple ? 'border-coral-300 bg-coral-50' : 'border-cream-200 bg-white hover:bg-cream-50'
        }`}
      >
        <Lightbulb size={18} className={showSimple ? 'text-coral-500' : 'text-plum-400'} />
        <span className={`text-sm font-medium ${showSimple ? 'text-coral-500' : 'text-plum-500'}`}>{t('learnExplain')}</span>
      </button>

      {showSimple && (
        <div className="card animate-slide-up p-5">
          <div className="mb-2 flex items-center gap-2">
            <Lightbulb size={16} className="text-coral-400" />
            <h2 className="text-sm font-semibold text-coral-500">Simple explanation</h2>
          </div>
          <p className="text-sm leading-relaxed text-plum-500">{article.simpleExplanation}</p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {article.sections.map((section, i) => (
          <div key={i} className="card p-5">
            <h2 className="mb-2 font-display text-lg font-semibold text-plum-700">{section.heading}</h2>
            <p className="text-sm leading-relaxed text-plum-500">{section.body}</p>
          </div>
        ))}
      </div>

      {/* Sources */}
      <div className="card p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-plum-500">
          <BookOpen size={16} className="text-coral-400" />
          {t('learnSources')}
        </h2>
        <div className="space-y-2">
          {article.sources.map((src, i) => (
            <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-coral-500 hover:underline">
              <ExternalLink size={14} />
              {src.name}
            </a>
          ))}
        </div>
      </div>

      {/* Related */}
      {article.relatedIds.length > 0 && (
        <div className="card p-5">
          <h2 className="mb-3 text-sm font-semibold text-plum-500">{t('learnRelated')}</h2>
          <div className="space-y-2">
            {article.relatedIds.map(id => {
              const related = getArticleById(id);
              if (!related) return null;
              return (
                <button key={id} onClick={() => { navigate(`/learn/${id}`); setShowSimple(false); window.scrollTo(0, 0); }}
                  className="flex w-full items-center justify-between rounded-xl bg-cream-50 px-4 py-3 text-left transition-colors hover:bg-cream-100">
                  <span className="text-sm font-medium text-plum-600">{related.title}</span>
                  <ChevronLeft size={16} className="rotate-180 text-plum-300" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
