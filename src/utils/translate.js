/**
 * List of garbage/political/news words that indicate corrupted translation
 */
const GARBAGE_WORDS = [
  'पर्सनल लॉ बोर्ड',
  'सदाभाऊ खोत',
  'Personal Law Board',
  'Sadabhau Khot',
  'विधानसभा',
  'Vidhan Sabha',
  'विधान परिषद',
  'Vidhan Parishad',
  'लोकसभा',
  'Lok Sabha',
  'राज्यसभा',
  'Rajya Sabha',
  'मुख्यमंत्री',
  'Mukhya Mantri',
  'प्रधानमंत्री',
  'Pradhan Mantri',
  'राष्ट्रपति',
  'Rashtragati',
  'चुनाव',
  'Chunav',
  'Election',
  'विधानसभा निवडणूक',
  'Assembly Election'
];

/**
 * Validates if translation result contains garbage political/news words
 * @param {string} translated - The translated text to validate
 * @returns {boolean} - True if translation is clean, false if contains garbage
 */
const isCleanTranslation = (translated) => {
  if (!translated || typeof translated !== 'string') return false;
  
  // Check for known garbage words
  for (const garbageWord of GARBAGE_WORDS) {
    if (translated.toLowerCase().includes(garbageWord.toLowerCase())) {
      console.warn('Garbage word detected in translation:', garbageWord);
      return false;
    }
  }
  
  // Check for template-like garbage patterns (e.g., "साचा:देवदेवदेव...")
  if (translated.includes('साचा:') || translated.includes('Template:') || translated.includes('template:')) {
    return false;
  }
  
  // Check for JSON-like strings leaking through
  if (translated.startsWith('{') || translated.startsWith('[')) {
    return false;
  }
  
  return true;
};

/**
 * Utility function to translate text using MyMemory Translation API
 * This is a free API that doesn't require authentication for basic usage
 * @param {string} text - The text to translate
 * @param {string} targetLang - Target language code (e.g., 'mr' for Marathi, 'hi' for Hindi)
 * @returns {Promise<string>} - Translated text or original text if translation fails
 */
export const translateText = async (text, targetLang) => {
  try {
    if (!text || text.trim() === '') {
      return text;
    }

    const sourceLang = 'en'; // Assuming source is English
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      const translated = data.responseData.translatedText;
      
      // Validate translation is clean before returning
      if (isCleanTranslation(translated)) {
        return translated;
      } else {
        console.warn('Garbage detected in translation, using original text:', { original: text, translated });
        return text;
      }
    } else {
      console.error('Translation API returned non-200 status:', data);
      return text; // Return original text if translation fails
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Translation API timeout after 5 seconds');
    } else {
      console.error('Translation API error:', error);
    }
    return text; // Return original text if API call fails
  }
};

/**
 * Translates text to multiple languages
 * @param {string} text - The text to translate
 * @returns {Promise<Object>} - Object with translations: { en, mr, hi }
 */
export const translateToMultipleLanguages = async (text) => {
  try {
    const [marathi, hindi] = await Promise.all([
      translateText(text, 'mr'),
      translateText(text, 'hi')
    ]);
    
    return {
      en: text,
      mr: marathi || text, // Fallback to original text if translation fails
      hi: hindi || text   // Fallback to original text if translation fails
    };
  } catch (error) {
    console.error('Translation error in translateToMultipleLanguages:', error);
    // Always return the proper structure even if everything fails
    return {
      en: text,
      mr: text,
      hi: text
    };
  }
};
