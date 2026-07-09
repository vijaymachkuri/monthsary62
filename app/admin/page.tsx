'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2, Trash2, Plus, Edit2, Save, X, Camera, Heart, Star, Map, Sparkles, Send, Type } from 'lucide-react';
import Link from 'next/link';

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  photoUrl: string | null;
};

const ICONS = ['Heart', 'Star', 'Camera', 'Map', 'Sparkles'];

export default function AdminPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Settings State
  const [letterBody, setLetterBody] = useState<string>('');
  const [recipientEmails, setRecipientEmails] = useState<string>('vijaymachkuri12@gmail.com, mzjhe9601@gmail.com');
  const [savingSettings, setSavingSettings] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // Timeline State
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TimelineEvent>>({});
  const [timelineUploading, setTimelineUploading] = useState<string | null>(null);
  const [savingTimeline, setSavingTimeline] = useState(false);

  const fetchData = async () => {
    try {
      const [photosRes, timelineRes, settingsRes] = await Promise.all([
        fetch('/api/photos'),
        fetch('/api/timeline'),
        fetch('/api/settings')
      ]);
      const photosData = await photosRes.json();
      const timelineData = await timelineRes.json();
      const settingsData = await settingsRes.json();
      
      if (photosData.photos) setPhotos(photosData.photos);
      if (timelineData.timeline) setTimeline(timelineData.timeline);
      if (settingsData.settings?.letterBody) setLetterBody(settingsData.settings.letterBody);
      if (settingsData.settings?.recipientEmails) setRecipientEmails(settingsData.settings.recipientEmails);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Gallery Logic ---
  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError('Please select a file first.');
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/photos', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      await fetchData();
      setFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError('Failed to upload the photo.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryDelete = async (url: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      const res = await fetch(`/api/photos?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete photo.');
    }
  };

  // --- Timeline Logic ---
  const saveTimeline = async (updatedTimeline: TimelineEvent[]) => {
    setSavingTimeline(true);
    try {
      const res = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline: updatedTimeline })
      });
      if (!res.ok) throw new Error('Failed to save timeline');
      setTimeline(updatedTimeline);
    } catch (err) {
      console.error(err);
      alert('Error saving timeline');
    } finally {
      setSavingTimeline(false);
    }
  };

  const handleAddEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: 'New Date',
      title: 'New Milestone',
      description: 'Describe the memory here.',
      icon: 'Heart',
      photoUrl: null
    };
    const updated = [...timeline, newEvent];
    saveTimeline(updated);
    startEditing(newEvent);
  };

  const handleDeleteEvent = (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline event?')) return;
    const updated = timeline.filter(t => t.id !== id);
    saveTimeline(updated);
  };

  const startEditing = (event: TimelineEvent) => {
    setEditingId(event.id);
    setEditForm({ ...event });
  };

  const saveEdit = () => {
    if (!editingId) return;
    const updated = timeline.map(t => t.id === editingId ? { ...t, ...editForm } as TimelineEvent : t);
    saveTimeline(updated);
    setEditingId(null);
  };

  const handleTimelinePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const uploadFile = e.target.files?.[0];
    if (!uploadFile) return;

    setTimelineUploading(id);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('id', id);

      const res = await fetch('/api/timeline-photo', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      const updated = timeline.map(t => t.id === id ? { ...t, photoUrl: data.url } : t);
      saveTimeline(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to upload timeline photo.');
    } finally {
      setTimelineUploading(null);
    }
  };

  const handleTimelinePhotoDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event photo?')) return;
    setTimelineUploading(id);
    try {
      const res = await fetch(`/api/timeline-photo?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      
      const updated = timeline.map(t => t.id === id ? { ...t, photoUrl: null } : t);
      saveTimeline(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to delete timeline photo.');
    } finally {
      setTimelineUploading(null);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { letterBody, recipientEmails } })
      });
      if (!res.ok) throw new Error('Failed to save settings');
      alert('Settings saved!');
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendEmail = async () => {
    if (!confirm('Are you sure you want to send the reminder email right now?')) return;
    setEmailSending(true);
    try {
      const res = await fetch('/api/admin/send-email', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to send email');
      alert('Email sent successfully to both of you!');
    } catch (err) {
      console.error(err);
      alert('Error sending email');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto font-inter pb-24">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-playfair font-bold text-white">Admin Dashboard</h1>
        <Link href="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors glass border border-white/20">
          Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Gallery Upload Section */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-playfair text-white mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-pink-400" /> Upload Gallery Memory
            </h2>
            
            <form onSubmit={handleGalleryUpload} className="space-y-4">
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
                  </div>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept="image/*" 
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
                <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>
              )}

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
              >
                {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Upload Photo'}
              </button>
            </form>
          </div>

          {/* Love Letter Settings */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-playfair text-white mb-6 flex items-center gap-2">
              <Type className="w-5 h-5 text-purple-400" /> Love Letter Edit
            </h2>
            <div className="space-y-4">
              <p className="text-xs text-white/60 mb-2">
                Use <code className="bg-black/30 px-1 rounded text-purple-300">{`{MONTH_COUNT}`}</code> for the ordinal number (e.g. 62nd) and <code className="bg-black/30 px-1 rounded text-purple-300">{`{MONTHS}`}</code> for the raw number (e.g. 62).
              </p>
              <textarea 
                value={letterBody}
                onChange={(e) => setLetterBody(e.target.value)}
                className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm font-inter leading-relaxed focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Write your letter here..."
              />
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-400 hover:to-indigo-300 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {savingSettings ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Letter</>}
              </button>
            </div>
          </div>

          {/* Manual Email Trigger & Settings */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-playfair text-white mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-rose-400" /> Email Settings & Trigger
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 block mb-2">Recipient Emails (comma separated)</label>
                <input 
                  type="text"
                  value={recipientEmails}
                  onChange={(e) => setRecipientEmails(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm font-inter focus:outline-none focus:border-rose-500/50 transition-colors"
                  placeholder="email1@gmail.com, email2@gmail.com"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {savingSettings ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Emails</>}
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={emailSending}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-500 to-red-400 hover:from-rose-400 hover:to-red-300 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
                >
                  {emailSending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Test Email</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Gallery & Timeline Manager) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Timeline Manager Section */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-playfair text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" /> Timeline Sections
              </h2>
              <button 
                onClick={handleAddEvent}
                disabled={savingTimeline}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 rounded-lg text-sm transition-colors border border-purple-500/30"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /></div>
            ) : (
              <div className="space-y-4">
                {timeline.map((event) => (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    {editingId === event.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            value={editForm.date || ''} 
                            onChange={e => setEditForm({...editForm, date: e.target.value})}
                            className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            placeholder="Date (e.g. May 9, 2021)"
                          />
                          <input 
                            type="text" 
                            value={editForm.title || ''} 
                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                            className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            placeholder="Title"
                          />
                        </div>
                        <textarea 
                          value={editForm.description || ''} 
                          onChange={e => setEditForm({...editForm, description: e.target.value})}
                          className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm w-full h-20"
                          placeholder="Description"
                        />
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-white/50">Icon:</span>
                          <select 
                            value={editForm.icon || 'Heart'} 
                            onChange={e => setEditForm({...editForm, icon: e.target.value})}
                            className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                          >
                            {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                          </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                          <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm text-white/50 hover:text-white flex items-center gap-1">
                            <X className="w-4 h-4" /> Cancel
                          </button>
                          <button onClick={saveEdit} className="px-3 py-1.5 text-sm bg-green-500/20 text-green-300 hover:bg-green-500/40 rounded-lg flex items-center gap-1">
                            <Save className="w-4 h-4" /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-xs text-purple-300 uppercase tracking-wider">{event.date}</span>
                              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {event.title}
                                <span className="text-xs font-normal text-white/30">({event.icon})</span>
                              </h3>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => startEditing(event)} className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteEvent(event.id)} className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-white/70">{event.description}</p>
                        </div>
                        
                        {/* Event Photo Manager */}
                        <div className="md:w-48 shrink-0">
                          {event.photoUrl ? (
                            <div className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
                              <Image src={event.photoUrl} alt="Event Memory" fill className="object-cover" unoptimized />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <button 
                                  onClick={() => handleTimelinePhotoDelete(event.id)}
                                  disabled={timelineUploading === event.id}
                                  className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                                >
                                  {timelineUploading === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full aspect-video border border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                              {timelineUploading === event.id ? (
                                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                              ) : (
                                <>
                                  <Camera className="w-5 h-5 mb-1 text-white/30" />
                                  <span className="text-[10px] text-white/50">Add Photo</span>
                                </>
                              )}
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleTimelinePhotoUpload(e, event.id)}
                                disabled={timelineUploading === event.id}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Gallery Photos */}
          <div className="glass rounded-2xl p-6 border border-white/20 min-h-[400px]">
            <h2 className="text-2xl font-playfair text-white mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-pink-400" /> Gallery Photos ({photos.length})
            </h2>
            
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
                        onClick={() => handleGalleryDelete(src)}
                        className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
