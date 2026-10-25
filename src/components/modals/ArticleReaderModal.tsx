import React from 'react';
import { X, BookOpen, Clock, Tag, UserCheck } from 'lucide-react';
import { CareArticle } from '../../types/index.ts';

interface ArticleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: CareArticle | null;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden my-6 flex flex-col max-h-[85vh]">
        {/* Header Image & Close Button */}
        <div className="relative h-60 w-full overflow-hidden bg-gray-900">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500 text-white inline-block mb-2 shadow-xs">
              {article.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-snug">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-gray-700 leading-relaxed text-sm">
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pb-3 border-b border-gray-100 gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>
                By <strong className="text-gray-800">{article.authorName}</strong> ({article.authorRole})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
              </span>
              <span>• Published {article.publishedDate}</span>
            </div>
          </div>

          <p className="text-base text-gray-800 font-medium italic bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            "{article.excerpt}"
          </p>

          <div className="whitespace-pre-line space-y-3 text-gray-700 leading-relaxed">
            {article.content}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">Topics:</span>
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Reviewed by PetCare Veterinary Board</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
};
