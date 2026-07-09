'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (data.photos) setPhotos(data.photos);
    } catch (err) {
      console.error('Failed to fetch photos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let finalFile = file;

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      await fetchPhotos();
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError('Failed to upload the photo. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      const res = await fetch(`/api/photos?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchPhotos();
    } catch (err) {
      console.error(err);
      setError('Failed to delete photo.');
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto font-inter">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-playfair font-bold text-white">Admin Dashboard</h1>
        <Link href="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors glass border border-white/20">
          Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 border border-white/20 sticky top-8">
            <h2 className="text-2xl font-playfair text-white mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-pink-400" /> Upload Memory
            </h2>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label 
                  htmlFor="file-upload" 
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-white/20 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-3 text-white/50" />
                    <p className="mb-2 text-sm text-white/70">
                      <span className="font-semibold text-pink-300">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-white/50">PNG, JPG, WEBP or HEIC (Max. 10MB)</p>
                  </div>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept="image/*,.heic,.heif" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files?.[0]) setFile(e.target.files[0]);
                      setError('');
                    }}
                  />
                </label>
              </div>

              {file && (
                <div className="text-sm text-white/80 bg-white/10 p-3 rounded-lg truncate border border-white/10">
                  Selected: {file.name}
                </div>
              )}

              {error && (
                <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                  </>
                ) : (
                  'Upload Photo'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-6 border border-white/20 min-h-[500px]">
            <h2 className="text-2xl font-playfair text-white mb-6">Current Photos ({photos.length})</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
              </div>
            ) : photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-white/50 bg-white/5 rounded-xl border border-white/10">
                <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                <p>No photos uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((src, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    <Image
                      src={src}
                      alt={`Memory ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm gap-3">
                      <button
                        onClick={() => handleDelete(src)}
                        className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <span className="text-white/80 text-xs">Photo {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
