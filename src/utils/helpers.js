// Common utility functions for L'WESMOU OS

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const detectURLType = (url) => {
  if (!url) return 'Unknown';
  
  const urlLower = url.toLowerCase();
  
  // Video platforms
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'YouTube Video';
  }
  if (urlLower.includes('tiktok.com')) {
    return 'TikTok Video';
  }
  if (urlLower.includes('instagram.com')) {
    return 'Instagram Media';
  }
  if (urlLower.includes('facebook.com')) {
    return 'Facebook Media';
  }
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return 'Tweet';
  }
  
  // Audio
  if (urlLower.includes('soundcloud.com')) {
    return 'SoundCloud Audio';
  }
  if (urlLower.includes('spotify.com')) {
    return 'Spotify Track';
  }
  
  // File extensions
  if (/\.(mp4|mkv|avi|mov|flv|webm)$/i.test(urlLower)) {
    return 'Video File';
  }
  if (/\.(mp3|wav|flac|aac|ogg)$/i.test(urlLower)) {
    return 'Audio File';
  }
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlLower)) {
    return 'Image File';
  }
  if (/\.(pdf|doc|docx|xlsx|zip|rar|7z)$/i.test(urlLower)) {
    return 'Document';
  }
  
  return 'Link';
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatDate = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatTime = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

export const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export const isArabic = (text) => {
  return /[\u0600-\u06FF]/.test(text);
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Local processing helpers
export const compressImage = async (imageUri) => {
  // Placeholder for local image compression
  // Would use native module in production
  return imageUri;
};

export const extractTextFromImage = async (imageUri) => {
  // Placeholder for OCR
  // Would use tesseract.js in production
  return 'Extracted text would go here';
};

export const translateText = async (text, targetLanguage = 'ar') => {
  // Placeholder for local translation
  // Would use local ML model in production
  return text;
};

export const generateHash = async (data) => {
  // Placeholder for local hashing
  return data;
};

export const encryptData = async (data, password) => {
  // Placeholder for local encryption
  // Would use crypto in production
  return data;
};

export const decryptData = async (data, password) => {
  // Placeholder for local decryption
  return data;
};

// Error handling
export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);
  return {
    success: false,
    message: error.message || 'An error occurred',
    error,
  };
};

// Success response
export const handleSuccess = (data, message = 'Operation successful') => {
  return {
    success: true,
    message,
    data,
  };
};
