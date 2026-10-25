import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  UserCheck,
  Tag,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { CareArticle } from '../types/index.ts';

interface ArticlesPageProps {
  articles: CareArticle[];
  onReadArticle: (article: CareArticle) => void;
  onOpenCreateArticle?: () => void;
  canCreate?: boolean;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({
  articles,
  onReadArticle,
  onOpenCreateArticle,
  canCreate = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Nutrition',
    'Preventative Care',
    'First Aid',
    'Training & Behavior',
    'Grooming',
  ];

  const filtered = articles.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>Pet Care Knowledge & Education Center</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Clinical wellness articles authored by board-certified veterinarians and animal care specialists.
          </p>
        </div>

        {canCreate && onOpenCreateArticle && (
          <button
            onClick={onOpenCreateArticle}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Article</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides, toxins, symptoms..."
            className="w-full sm:w-64 px-3 py-1.5 pl-8 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Articles Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-gray-200 space-y-2">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-xs text-gray-500">No articles match your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art) => (
            <div
              key={art.id}
              onClick={() => onReadArticle(art)}
              className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="h-44 w-full bg-gray-100 overflow-hidden relative">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 text-emerald-800 text-[10px] font-bold backdrop-blur-xs shadow-xs">
                      {art.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 font-display">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {art.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[120px]">{art.authorName}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
