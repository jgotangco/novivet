"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Link as LinkIcon, X, Check, Dog, Cat, Sparkles } from "lucide-react";

interface PetPhotoUploaderProps {
  photoUrl: string;
  onChange: (url: string) => void;
  species?: "CANINE" | "FELINE";
}

const STOCK_DOG_PHOTOS = [
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400",
];

const STOCK_CAT_PHOTOS = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400",
];

export function PetPhotoUploader({ photoUrl, onChange, species = "CANINE" }: PetPhotoUploaderProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setShowUrlInput(false);
      setUrlDraft("");
    }
  };

  const stockPhotos = species === "FELINE" ? STOCK_CAT_PHOTOS : STOCK_DOG_PHOTOS;

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700">Pet Profile Picture</label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative group">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Pet preview"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
              {species === "FELINE" ? <Cat className="w-7 h-7" /> : <Dog className="w-7 h-7" />}
              <span className="text-[9px] font-bold mt-1">No Photo</span>
            </div>
          )}

          {photoUrl && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full shadow hover:bg-rose-500 transition"
              title="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {showUrlInput && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs p-2 border border-slate-300 rounded-xl"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="py-2 px-3 bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                Apply
              </button>
            </div>
          )}

          <div className="pt-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Or pick stock photo:
            </span>
            <div className="flex items-center gap-2">
              {stockPhotos.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(url)}
                  className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition ${
                    photoUrl === url ? "border-emerald-600 scale-105 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt={`Stock ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
