import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import { articles, CATEGORIES, searchArticles } from '../lib/content';
import { EmptyState } from '../components/States';
import { Search, BookOpen, ChevronRight, Flower2 } from 'lucide-react';
import type { TranslationKey } from '../lib/i18n';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'learnAll', basics: 'learnCatBasics', puberty: 'learnCatPuberty', hygiene: 'learnCatHygiene',
  symptoms: 'learnCatSymptoms', conditions: 'learnCatConditions', products: 'learnCatProducts',
  myths: 'learnCatMyths', wellbeing: 'learnCatWellbeing', seekcare: 'learnCatSeekCare',
};

export function Learn() {
  const { t, lang } = useApp();
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

      {/* Featured: PCOS Guide */}
      <button
        onClick={() => navigate('/learn/pcos-guide')}
        className="card block w-full overflow-hidden text-left transition-all hover:shadow-card"
      >
        <div className="flex items-center gap-4 bg-gradient-to-br from-blush-100 via-lavender-100 to-mint-100 p-5">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/60">
            <Flower2 size={28} className="text-coral-400" />
          </span>
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-plum-700">{lang === 'hi' ? 'PCOS/PCOD को समझना' : 'Understanding PCOS/PCOD'}</p>
            <p className="text-sm font-medium text-coral-500">{lang === 'hi' ? 'बिना डर के ज्ञान' : 'Knowledge Without Fear'}</p>
            <p className="mt-1 text-xs leading-relaxed text-plum-500">
              {lang === 'hi'
                ? 'एक व्यापक मार्गदर्शक: हार्मोन, लक्षण, निदान, उपचार, प्रजनन क्षमता, और भावनात्मक कल्याण।'
                : 'A comprehensive guide: hormones, symptoms, diagnosis, treatment, fertility, and emotional well-being.'}
            </p>
          </div>
          <ChevronRight size={20} className="flex-shrink-0 text-plum-300" />
        </div>
      </button>

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
                  <p className="font-medium text-plum-600">{article.title[lang]}</p>
                  <p className="mt-1 text-sm text-plum-400 line-clamp-2">{article.summary[lang]}</p>
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
