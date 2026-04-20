/* ============================================
   OFFLOAD — Encrypted Data Store
   Web Crypto API (AES-256-GCM) localStorage Wrapper
   ============================================ */

const DataStore = (() => {
  const DB_NAME = 'offload_db';
  const SESSIONS_KEY = 'offload_sessions';
  const DREAMS_KEY = 'offload_dreams';
  const SETTINGS_KEY = 'offload_settings';
  const CRYPTO_KEY_KEY = 'offload_crypto_key';
  const SALT_KEY = 'offload_salt';

  let cryptoKey = null;
  let isEncryptionEnabled = false;

  // ---- Salt Generation ----
  async function generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  // ---- Key Derivation (PBKDF2) ----
  async function deriveKey(passphrase, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 150000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // ---- Encrypt Data ----
  async function encryptData(plaintext, key) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plaintext)
    );

    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(ciphertext)),
      encrypted: true
    };
  }

  // ---- Decrypt Data ----
  async function decryptData(encryptedObj, key) {
    const iv = new Uint8Array(encryptedObj.iv);
    const ciphertext = new Uint8Array(encryptedObj.data);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  // ---- Storage Helpers ----
  async function saveToStorage(key, data) {
    const json = JSON.stringify(data);

    if (isEncryptionEnabled && cryptoKey) {
      const encrypted = await encryptData(json, cryptoKey);
      localStorage.setItem(key, JSON.stringify(encrypted));
    } else {
      localStorage.setItem(key, json);
    }
  }

  async function loadFromStorage(key, defaultValue = []) {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;

    try {
      const parsed = JSON.parse(stored);

      if (parsed.encrypted && isEncryptionEnabled && cryptoKey) {
        const decrypted = await decryptData(parsed, cryptoKey);
        return JSON.parse(decrypted);
      }

      return parsed;
    } catch (e) {
      console.warn(`Failed to load ${key}:`, e);
      return defaultValue;
    }
  }

  // ---- Public API ----
  return {
    // Initialize encryption with passphrase
    async initializeEncryption(passphrase) {
      let salt = localStorage.getItem(SALT_KEY);

      if (!salt) {
        const newSalt = await generateSalt();
        salt = JSON.stringify(Array.from(newSalt));
        localStorage.setItem(SALT_KEY, salt);
      }

      const saltArray = new Uint8Array(JSON.parse(salt));
      cryptoKey = await deriveKey(passphrase, saltArray);
      isEncryptionEnabled = true;

      // Test encryption/decryption
      try {
        const testData = await encryptData('test', cryptoKey);
        await decryptData(testData, cryptoKey);
      } catch (e) {
        throw new Error('Invalid passphrase');
      }

      return true;
    },

    // Disable encryption
    disableEncryption() {
      cryptoKey = null;
      isEncryptionEnabled = false;
    },

    // Check if encryption is active
    isEncrypted() {
      return isEncryptionEnabled;
    },

    // Check if data is encrypted on disk
    hasEncryptedData() {
      const sessions = localStorage.getItem(SESSIONS_KEY);
      if (!sessions) return false;
      try {
        return JSON.parse(sessions).encrypted === true;
      } catch {
        return false;
      }
    },

    // ---- Sessions ----
    async getSessions() {
      return loadFromStorage(SESSIONS_KEY, []);
    },

    async saveSession(session) {
      const sessions = await this.getSessions();
      session.id = session.id || crypto.randomUUID();
      session.createdAt = session.createdAt || new Date().toISOString();

      // Check if updating existing
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      if (existingIndex >= 0) {
        sessions[existingIndex] = { ...sessions[existingIndex], ...session };
      } else {
        sessions.unshift(session);
      }

      await saveToStorage(SESSIONS_KEY, sessions);
      return session;
    },

    async deleteSession(id) {
      const sessions = await this.getSessions();
      const filtered = sessions.filter(s => s.id !== id);
      await saveToStorage(SESSIONS_KEY, filtered);
    },

    // ---- Dreams ----
    async getDreams() {
      return loadFromStorage(DREAMS_KEY, []);
    },

    async saveDream(dream) {
      const dreams = await this.getDreams();
      dream.id = dream.id || crypto.randomUUID();
      dream.createdAt = dream.createdAt || new Date().toISOString();

      const existingIndex = dreams.findIndex(d => d.id === dream.id);
      if (existingIndex >= 0) {
        dreams[existingIndex] = { ...dreams[existingIndex], ...dream };
      } else {
        dreams.unshift(dream);
      }

      await saveToStorage(DREAMS_KEY, dreams);
      return dream;
    },

    async deleteDream(id) {
      const dreams = await this.getDreams();
      const filtered = dreams.filter(d => d.id !== id);
      await saveToStorage(DREAMS_KEY, filtered);
    },

    // ---- Settings ----
    async getSettings() {
      const stored = localStorage.getItem(SETTINGS_KEY);
      const defaults = {
        timerDuration: 5,
        audioEnabled: true,
        binauralEnabled: false,
        notificationsEnabled: false,
        reminderTime: '21:00',
        encryptionEnabled: false,
      };

      if (!stored) return defaults;

      try {
        const parsed = JSON.parse(stored);
        if (parsed.encrypted && isEncryptionEnabled && cryptoKey) {
          const decrypted = await decryptData(parsed, cryptoKey);
          return { ...defaults, ...JSON.parse(decrypted) };
        }
        return { ...defaults, ...parsed };
      } catch {
        return defaults;
      }
    },

    async saveSettings(settings) {
      await saveToStorage(SETTINGS_KEY, settings);
    },

    // ---- Export / Import ----
    async exportAll() {
      const data = {
        sessions: await this.getSessions(),
        dreams: await this.getDreams(),
        settings: await this.getSettings(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `offload-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return data;
    },

    async importAll(jsonString) {
      const data = JSON.parse(jsonString);

      if (!data.sessions || !data.dreams) {
        throw new Error('Invalid backup file format');
      }

      await saveToStorage(SESSIONS_KEY, data.sessions);
      await saveToStorage(DREAMS_KEY, data.dreams);
      if (data.settings) {
        await saveToStorage(SETTINGS_KEY, data.settings);
      }

      return true;
    },

    // ---- Stats ----
    async getStats() {
      const sessions = await this.getSessions();
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalWords = sessions.reduce((sum, s) => sum + (s.wordCount || 0), 0);
      const avgEnergy = sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.energyRating || 0), 0) / sessions.length
        : 0;

      // Calculate streak
      const sessionDates = [...new Set(sessions.map(s =>
        new Date(s.createdAt).toDateString()
      ))].map(d => new Date(d)).sort((a, b) => b - a);

      let streak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (sessionDates.length > 0) {
        const lastDate = sessionDates[0].toDateString();
        if (lastDate === today || lastDate === yesterday) {
          streak = 1;
          for (let i = 1; i < sessionDates.length; i++) {
            const expectedDate = new Date(sessionDates[i - 1].getTime() - 86400000).toDateString();
            if (sessionDates[i].toDateString() === expectedDate) {
              streak++;
            } else {
              break;
            }
          }
        }
      }

      // Weekly data for chart
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 86400000);
        const dateStr = date.toDateString();
        const daySessions = sessions.filter(s =>
          new Date(s.createdAt).toDateString() === dateStr
        );
        weeklyData.push({
          date: date.toLocaleDateString('en', { weekday: 'short' }),
          count: daySessions.length,
          words: daySessions.reduce((s, d) => s + (d.wordCount || 0), 0)
        });
      }

      // Word frequency for cloud
      const wordFreq = {};
      sessions.forEach(s => {
        if (s.content) {
          const words = s.content.toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'were', 'they', 'will', 'been', 'their', 'what', 'when', 'where', 'which', 'while', 'about', 'would', 'could', 'should'].includes(w));
          words.forEach(w => {
            wordFreq[w] = (wordFreq[w] || 0) + 1;
          });
        }
      });

      const wordCloud = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map(([word, count]) => ({ word, count }));

      return {
        totalSessions: sessions.length,
        totalWords,
        averageEnergy: Math.round(avgEnergy * 10) / 10,
        streak,
        weeklyData,
        wordCloud
      };
    }
  };
})();

// ---- Moon Phase Calculator ----
const MoonPhase = {
  getPhase(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c, e, jd, b;
    if (month < 3) {
      year--;
      month += 12;
    }

    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);

    const phaseNames = [
      'New Moon',
      'Waxing Crescent',
      'First Quarter',
      'Waxing Gibbous',
      'Full Moon',
      'Waning Gibbous',
      'Last Quarter',
      'Waning Crescent'
    ];

    if (b >= 8) b = 0;

    return {
      index: b,
      name: phaseNames[b],
      image: `moon-${phaseNames[b].toLowerCase().replace(/\s/g, '-')}.png`,
      illumination: Math.round((1 - Math.cos((jd * 2 * Math.PI))) * 50)
    };
  }
};

// ---- Sleep Tips ----
const SleepTips = {
  tips: [
    'Keep your bedroom cool (65-68°F / 18-20°C) for optimal sleep.',
    'Avoid screens 1 hour before bed — blue light suppresses melatonin.',
    'Try the 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s.',
    'Consistency is key — sleep and wake at the same time daily.',
    'Avoid caffeine after 2 PM — it has a half-life of 5-6 hours.',
    'A warm bath 1-2 hours before bed helps your body cool down for sleep.',
    'Write down worries before bed to offload them from your mind.',
    'Keep your bedroom dark — even small lights can disrupt sleep quality.',
    'Exercise regularly, but not within 3 hours of bedtime.',
    'Avoid heavy meals close to bedtime — digestion can disrupt sleep.',
    'Try progressive muscle relaxation — tense and release each muscle group.',
    'Limit naps to 20-30 minutes and avoid napping after 3 PM.',
    'Use white noise or pink noise to mask disruptive sounds.',
    'Keep work-related stress out of the bedroom — reserve it for sleep.',
    'Exposure to natural light in the morning helps regulate your circadian rhythm.'
  ],

  getDailyTip() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return this.tips[dayOfYear % this.tips.length];
  }
};

// ---- PMR Steps ----
const PMRSteps = [
  { muscle: 'Hands', action: 'Clench your fists tightly, hold for 5 seconds, then release.' },
  { muscle: 'Forearms', action: 'Bend your hands back at the wrists, hold, then let go.' },
  { muscle: 'Biceps', action: 'Tense your biceps by drawing your forearms up, hold, then relax.' },
  { muscle: 'Shoulders', action: 'Shrug your shoulders up toward your ears, hold, then drop.' },
  { muscle: 'Forehead', action: 'Raise your eyebrows as high as possible, hold, then smooth.' },
  { muscle: 'Eyes', action: 'Shut your eyes tightly, hold for 5 seconds, then release.' },
  { muscle: 'Jaw', action: 'Clench your jaw tightly, hold, then let your mouth fall open slightly.' },
  { muscle: 'Neck', action: 'Press your head back gently, hold, then return to center.' },
  { muscle: 'Chest', action: 'Take a deep breath and hold it, tensing your chest, then exhale fully.' },
  { muscle: 'Stomach', action: 'Tighten your stomach muscles, hold, then release completely.' },
  { muscle: 'Thighs', action: 'Tense your thigh muscles by pressing your legs down, hold, then relax.' },
  { muscle: 'Calves', action: 'Point your toes upward toward your face, hold, then release.' },
  { muscle: 'Feet', action: 'Curl your toes downward, hold for 5 seconds, then relax.' }
];

export { DataStore, MoonPhase, SleepTips, PMRSteps };
