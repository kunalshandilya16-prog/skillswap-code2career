import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, Category } from '../types';
import {
  User,
  Mail,
  Camera,
  Briefcase,
  PlusCircle,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle2,
  FolderKanban,
  Sparkles,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
];

const SAMPLE_PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
];

export const CreatorProfileEdit: React.FC = () => {
  const {
    activeCreatorId,
    creators,
    updateCreatorProfile,
    addPortfolioItem,
    deletePortfolioItem,
    navigateTo,
    addToast,
  } = useApp();

  const currentCreator =
    creators.find((c) => c.id === activeCreatorId) || creators[0];

  const [formData, setFormData] = useState({
    name: currentCreator.name,
    email: currentCreator.email,
    avatar: currentCreator.avatar,
    headline: currentCreator.headline,
    bio: currentCreator.bio,
    specialization: currentCreator.specialization,
  });

  const [isSaved, setIsSaved] = useState(false);

  // New portfolio item modal / inline form state
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioData, setPortfolioData] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    category: Category;
  }>({
    title: '',
    description: '',
    imageUrl: SAMPLE_PROJECT_IMAGES[0],
    category: currentCreator.specialization || 'Design',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCreatorProfile({
      ...currentCreator,
      ...formData,
      specialization: formData.specialization as Category,
    });
    setIsSaved(true);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your creator profile details have been saved successfully.',
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioData.title.trim() || !portfolioData.description.trim()) {
      addToast({
        type: 'error',
        title: 'Incomplete Fields',
        message: 'Please provide both title and description for your portfolio project.',
      });
      return;
    }

    addPortfolioItem(currentCreator.id, {
      title: portfolioData.title.trim(),
      description: portfolioData.description.trim(),
      imageUrl: portfolioData.imageUrl.trim() || SAMPLE_PROJECT_IMAGES[0],
      category: portfolioData.category,
    });

    setPortfolioData({
      title: '',
      description: '',
      imageUrl: SAMPLE_PROJECT_IMAGES[0],
      category: currentCreator.specialization || 'Design',
    });
    setShowPortfolioForm(false);

    addToast({
      type: 'success',
      title: 'Project Added',
      message: 'New portfolio item has been added to your public showcase.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Profile Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Edit Creator Profile & Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your bio, contact information, and showcase portfolio up-to-date for potential clients.
          </p>
        </div>

        <button
          onClick={() => navigateTo('creator-profile', currentCreator.id)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>View My Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Main Profile Edit Form */}
      <form
        onSubmit={handleProfileSubmit}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Personal & Bio Details</h2>
          </div>
          {isSaved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved to storage
            </span>
          )}
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Profile Photo / Avatar
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={formData.avatar}
              alt="Profile Preview"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-2 flex-1 w-full">
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="Paste avatar image URL..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Or pick preset:</span>
                <div className="flex items-center gap-1.5">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, avatar: preset })}
                      className="w-6 h-6 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <img
                        src={preset}
                        alt="preset"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two column inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Display Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Specialization / Primary Discipline
            </label>
            <select
              value={formData.specialization}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialization: e.target.value as Category,
                })
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              required
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g., YouTube Video Editor & Motion Designer"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            About & Bio
          </label>
          <textarea
            rows={4}
            required
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Share your experience, software proficiency, achievements, and work style..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
          />
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Information</span>
          </button>
        </div>
      </form>

      {/* Portfolio Showcase Management */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Portfolio Showcase Items</h2>
          </div>

          <button
            type="button"
            onClick={() => setShowPortfolioForm(!showPortfolioForm)}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showPortfolioForm ? 'Hide Form' : 'Add New Portfolio Item'}</span>
          </button>
        </div>

        {/* Inline Add Portfolio Project Form */}
        {showPortfolioForm && (
          <form
            onSubmit={handleAddPortfolio}
            className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200"
          >
            <h3 className="text-sm font-bold text-slate-900">Add Project to Showcase</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={portfolioData.title}
                  onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                  placeholder="e.g., E-Commerce Rebrand & UI Kit"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={portfolioData.category}
                  onChange={(e) =>
                    setPortfolioData({
                      ...portfolioData,
                      category: e.target.value as Category,
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Image URL
              </label>
              <input
                type="url"
                value={portfolioData.imageUrl}
                onChange={(e) => setPortfolioData({ ...portfolioData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white mb-2"
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Sample preview photos:</span>
                <div className="flex items-center gap-2">
                  {SAMPLE_PROJECT_IMAGES.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setPortfolioData({ ...portfolioData, imageUrl: img })}
                      className="w-10 h-7 rounded-md overflow-hidden border border-slate-300 hover:ring-2 hover:ring-indigo-400 cursor-pointer"
                    >
                      <img
                        src={img}
                        alt="sample"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Summary & Impact *
              </label>
              <textarea
                rows={3}
                required
                value={portfolioData.description}
                onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
                placeholder="Explain the client problem, your design/code approach, and the final deliverable..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPortfolioForm(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Publish Project
              </button>
            </div>
          </form>
        )}

        {/* Existing Portfolio Grid */}
        {currentCreator.portfolio && currentCreator.portfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCreator.portfolio.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {item.category && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-indigo-700 bg-white/95 px-2 py-0.5 rounded-md shadow-2xs">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    ID: {item.id.slice(0, 8)}
                  </span>
                  <button
                    type="button"
                    onClick={() => deletePortfolioItem(currentCreator.id, item.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer p-1 rounded-md hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
            No showcase items added yet. Click "Add New Portfolio Item" above to show off your best client work.
          </div>
        )}
      </div>
    </div>
  );
};
