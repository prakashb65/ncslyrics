import { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';

export default function RequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    songLink: '',
    lyrics: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await emailjs.send(
        'service_lg0etrq', // Replace with your EmailJS service ID
        'template_mlv88mj', // Replace with your EmailJS template ID
        {
          to_email: 'ncslyrics55@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          song_link: formData.songLink,
          lyrics: formData.lyrics,
          reply_to: formData.email,
        },
        '2lNpMsCgLZnKZMxED' // Replace with your EmailJS public key
      );

      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        songLink: '',
        lyrics: ''
      });
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Request Song</h1>
      
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          Thank you! Your song request has been submitted successfully.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          Sorry, there was an error submitting your request. Please try again.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Song Link Input */}
          <div>
            <label htmlFor="songLink" className="block text-sm font-medium text-gray-700 mb-1">
              Song Link (YouTube, etc.)
            </label>
            <input
              type="url"
              id="songLink"
              required
              placeholder="https://youtube.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.songLink}
              onChange={(e) => setFormData({ ...formData, songLink: e.target.value })}
            />
          </div>

          {/* Lyrics Input */}
          <div>
            <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-1">
              Song Lyrics
            </label>
            <textarea
              id="lyrics"
              required
              rows={10}
              placeholder="Enter the song lyrics here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
              } text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 