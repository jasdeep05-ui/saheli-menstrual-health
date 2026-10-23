import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import { articles, CATEGORIES, searchArticles } from '../lib/content';
import { EmptyState } from '../components/States';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import type { TranslationKey } from '../lib/i18n';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'learnAll', basics: 'learnCatBasics', puberty: 'learnCatPuberty', hygiene: 'learnCatHygiene',
  symptoms: 'learnCatSymptoms', conditions: 'learnCatConditions', products: 'learnCatProducts',
  myths: 'learnCatMyths', wellbeing: 'learnCatWellbeing', seekcare: 'learnCatSeekCare',
};

export function Learn() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = category === 'all' && !query
    ? articles
    : query
      ? searchArticles(query).filter(a => category === 'all' || a.category === category)
      : articles.filter(a => a.category === category);

  const allCats = ['all', ...CATEGORIES];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-plum-700">{t('learnTitle')}</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-300" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('learnSearch')}
          className="input-field pl-10"
          aria-label="Search articles"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {allCats.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              category === cat ? 'bg-coral-400 text-white' : 'bg-white border border-cream-200 text-plum-500 hover:bg-cream-100'
            }`}
          >
            {t(CATEGORY_LABELS[cat] as TranslationKey)}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<BookOpen size={28} />} title={t('learnNoResults')} description={t('learnNoResultsDesc')} />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(article => (
            <button
              key={article.id}
              onClick={() => navigate(`/learn/${article.id}`)}
              className="card block w-full p-4 text-left transition-all hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-plum-600">{article.title}</p>
                  <p className="mt-1 text-sm text-plum-400 line-clamp-2">{article.summary}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="badge bg-lavender-100 text-lavender-600">{t(CATEGORY_LABELS[article.category] as TranslationKey)}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="mt-1 flex-shrink-0 text-plum-300" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
