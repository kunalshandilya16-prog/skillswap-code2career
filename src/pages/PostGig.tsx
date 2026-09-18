import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, Category } from '../types';
import { validateGigForm, PostGigErrors } from '../utils/validation';
import {
  PlusCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  User,
} from 'lucide-react';

export const PostGig: React.FC = () => {
  const { createGig, navigateTo, activeCreatorId, creators, currentRole } = useApp();

  const currentCreator =
    creators.find((c) => c.id === activeCreatorId) || creators[0];

  const [formData, setFormData] = useState({
    title: '',
    category: '' as Category | '',
    rate: '',
    description: '',
    creatorName: currentRole === 'creator' && currentCreator ? currentCreator.name : '',
  });

  useEffect(() => {
    if (currentRole === 'creator' && currentCreator && !formData.creatorName) {
      setFormData((prev) => ({
        ...prev,
        creatorName: currentCreator.name,
      }));
    }
  }, [currentRole, currentCreator]);

  const [errors, setErrors] = useState<PostGigErrors>({});
  const [createdGigId, setCreatedGigId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateGigForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const newGig = createGig({
      title: formData.title,
      category: formData.category as Category,
      rate: parseFloat(formData.rate),
      description: formData.description,
      creatorName: formData.creatorName,
      creatorId: currentCreator?.id,
    });

    setCreatedGigId(newGig.id);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      category: '',
      rate: '',
      description: '',
      creatorName: currentCreator?.name || '',
    });
    setErrors({});
    setCreatedGigId(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          List your creative service
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Post a New Gig
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
          Share your craft with clients looking for design, editing, tutoring, music, and more.
          New gigs appear at the top of the marketplace feed.
        </p>
      </div>

      {createdGigId ? (
        /* Success Card */
        <div
          id="post-gig-success-card"
          className="bg-white rounded-3xl border border-emerald-200 p-8 text-center space-y-6 shadow-sm animate-in zoom-in-95"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Published & Live
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Your gig has been published!
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Because SkillSwap implements <strong>Decision Point 3 (Newest First)</strong>, your new listing is now positioned at the top of the marketplace discovery feed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-view-published-gig"
              onClick={() => navigateTo('gig-details', createdGigId)}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              View Your Gig
            </button>
            <button
              id="btn-return-marketplace"
              onClick={() => navigateTo('marketplace')}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Back to Marketplace
            </button>
            <button
              id="btn-post-another-gig"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              + Post Another
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form
          id="post-gig-form"
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label htmlFor="gig-title-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gig Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="gig-title-input"
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="e.g., Professional YouTube Thumbnail Design"
              className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-hidden focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.title ? (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                Write a concise, compelling service title (5 - 80 characters).
              </p>
            )}
          </div>

          {/* Category and Rate Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label htmlFor="gig-category-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="gig-category-select"
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value as Category });
                  if (errors.category) setErrors({ ...errors, category: undefined });
                }}
                className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-hidden focus:ring-2 transition-all bg-white ${
                  errors.category
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Rate */}
            <div>
              <label htmlFor="gig-rate-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Rate (₹ INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  id="gig-rate-input"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.rate}
                  onChange={(e) => {
                    setFormData({ ...formData, rate: e.target.value });
                    if (errors.rate) setErrors({ ...errors, rate: undefined });
                  }}
                  placeholder="300"
                  className={`w-full pl-8 pr-4 py-3 text-sm border rounded-xl focus:outline-hidden focus:ring-2 transition-all ${
                    errors.rate
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.rate ? (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.rate}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">
                  Fixed project price or base session fee.
                </p>
              )}
            </div>
          </div>

          {/* Creator Name */}
          <div>
            <label htmlFor="gig-creator-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Creator Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="gig-creator-name-input"
              type="text"
              value={formData.creatorName}
              onChange={(e) => {
                setFormData({ ...formData, creatorName: e.target.value });
                if (errors.creatorName) setErrors({ ...errors, creatorName: undefined });
              }}
              placeholder="e.g., Aarav Sharma"
              className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-hidden focus:ring-2 transition-all ${
                errors.creatorName
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.creatorName ? (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.creatorName}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                Your public creator name displayed on cards and marketplace search.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="gig-description-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gig Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="gig-description-input"
              rows={5}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="Detail what clients receive, your turnaround time, tools used, requirements, and revisions policy..."
              className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-hidden focus:ring-2 transition-all resize-none ${
                errors.description
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.description ? (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                Minimum 15 characters. Be specific so clients can book with confidence.
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              id="btn-cancel-post-gig"
              type="button"
              onClick={() => navigateTo('marketplace')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-post-gig"
              type="submit"
              className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Publish Gig
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
