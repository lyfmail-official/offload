/* ============================================
   OFFLOAD — Main Application Controller
   Single-Page Application with 8 Views
   ============================================ */

import { DataStore, MoonPhase, SleepTips, PMRSteps } from './data-store.js';
import { AudioEngine } from './audio-engine.js';
import { CeremonyRenderer } from './ceremony-renderer.js';
import { SentimentAnalyzer } from './sentiment-analyzer.js';

// ---- App State ----
const App = (() => {
  let currentView = 'landing';
  let currentSession = null;
  let timerInterval = null;
  let wakeLock = null;
  let recognition = null;
  let settings = {};

  // ---- View Navigation ----
  function showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active');
      currentView = viewName;
    }

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`[data-nav="${viewName}"]`);
    if (navItem) navItem.classList.add('active');

    // Show/hide nav
    const nav = document.getElementById('bottom-nav');
    if (nav) {
      nav.style.display = (viewName === 'dump' || viewName === 'ceremony') ? 'none' : 'flex';
    }

    // Focus mode off when leaving dump
    if (viewName !== 'dump') {
      exitFocusMode();
    }
  }

  // ---- Toast Notifications ----
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ---- Landing View ----
  async function initLanding() {
    const phase = MoonPhase.getPhase();
    document.getElementById('moon-img').src = phase.image;
    document.getElementById('moon-name').textContent = phase.name;
    document.getElementById('moon-illumination').textContent = `${phase.illumination}% illuminated`;
    document.getElementById('sleep-tip-text').textContent = SleepTips.getDailyTip();

    document.getElementById('btn-begin').addEventListener('click', () => {
      AudioEngine.playSound('click');
      startNewSession();
    });

    document.getElementById('btn-pmr').addEventListener('click', () => {
      AudioEngine.playSound('click');
      showPmrModal();
    });
  }

  // ---- PMR Modal ----
  function showPmrModal() {
    const stepsHtml = PMRSteps.map((step, i) => `
      <div class="pmr-step">
        <span class="pmr-step-number">${i + 1}</span>
        <strong>${step.muscle}</strong>: ${step.action}
      </div>
    `).join('');

    document.getElementById('pmr-content').innerHTML = stepsHtml;
    document.getElementById('pmr-modal').classList.remove('hidden');
  }

  // ---- Brain Dump View ----
  function startNewSession() {
    currentSession = {
      id: crypto.randomUUID(),
      content: '',
      wordCount: 0,
      sentiment: 'neutral',
      energyRating: 0,
      intention: '',
      gratitude: '',
      createdAt: new Date().toISOString()
    };

    document.getElementById('dump-textarea').value = '';
    document.getElementById('word-count').textContent = '0 words';
    document.getElementById('sentiment-badge').className = 'sentiment-badge sentiment-neutral';
    document.getElementById('sentiment-badge').textContent = 'Calm';

    // Setup timer
    setupTimer(settings.timerDuration || 5);

    showView('dump');

    // Request wake lock
    requestWakeLock();
  }

  function setupTimer(minutes) {
    const totalSeconds = minutes * 60;
    let remaining = totalSeconds;

    const ring = document.getElementById('timer-ring-progress');
    const text = document.getElementById('timer-text');
    const circumference = 2 * Math.PI * 90; // r=90

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = 0;

    function updateTimer() {
      remaining--;
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      text.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

      const progress = remaining / totalSeconds;
      ring.style.strokeDashoffset = circumference * (1 - progress);

      if (remaining <= 0) {
        clearInterval(timerInterval);
        completeSession();
      }
    }

    // Initial display
    text.textContent = `${minutes}:00`;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }

  function completeSession() {
    clearInterval(timerInterval);
    AudioEngine.playSound('complete');

    // Save content
    const content = document.getElementById('dump-textarea').value.trim();
    currentSession.content = content;
    currentSession.wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

    // Stop audio
    AudioEngine.stopPinkNoise();
    AudioEngine.stopBinauralBeats();

    // Show ceremony
    showCeremony();
  }

  // ---- Textarea Handling ----
  function initDumpView() {
    const textarea = document.getElementById('dump-textarea');
    const wordCount = document.getElementById('word-count');
    const sentimentBadge = document.getElementById('sentiment-badge');

    textarea.addEventListener('input', () => {
      const text = textarea.value;
      const words = text.split(/\s+/).filter(w => w.length > 0);
      wordCount.textContent = `${words.length} word${words.length !== 1 ? 's' : ''}`;

      // Sentiment analysis
      if (words.length > 3) {
        const analysis = SentimentAnalyzer.analyze(text);
        currentSession.sentiment = analysis.sentiment;
        const sentimentClass = `sentiment-${analysis.sentiment}`;
        sentimentBadge.className = `sentiment-badge ${sentimentClass}`;
        sentimentBadge.textContent = SentimentAnalyzer.getLabel(analysis.sentiment);
      }
    });

    // Audio controls
    document.getElementById('btn-pink-noise').addEventListener('click', function() {
      if (AudioEngine.isPinkNoisePlaying()) {
        AudioEngine.stopPinkNoise();
        this.classList.remove('active');
        this.style.color = '';
      } else {
        AudioEngine.startPinkNoise();
        this.classList.add('active');
        this.style.color = 'var(--accent-purple)';
      }
    });

    document.getElementById('btn-binaural').addEventListener('click', function() {
      if (AudioEngine.isBinauralPlaying()) {
        AudioEngine.stopBinauralBeats();
        this.classList.remove('active');
        this.style.color = '';
      } else {
        AudioEngine.startBinauralBeats();
        this.classList.add('active');
        this.style.color = 'var(--accent-teal)';
      }
    });

    document.getElementById('btn-focus').addEventListener('click', () => {
      enterFocusMode();
    });

    document.getElementById('btn-voice').addEventListener('click', () => {
      toggleVoiceInput();
    });

    document.getElementById('btn-end-early').addEventListener('click', () => {
      if (confirm('End this session early?')) {
        completeSession();
      }
    });
  }

  // ---- Focus Mode ----
  function enterFocusMode() {
    const overlay = document.getElementById('focus-overlay');
    const textarea = document.getElementById('focus-textarea');
    const mainTextarea = document.getElementById('dump-textarea');

    textarea.value = mainTextarea.value;
    overlay.classList.remove('hidden');

    textarea.addEventListener('input', () => {
      mainTextarea.value = textarea.value;
      mainTextarea.dispatchEvent(new Event('input'));
    });
  }

  function exitFocusMode() {
    const overlay = document.getElementById('focus-overlay');
    overlay.classList.add('hidden');
  }

  // ---- Voice Input ----
  function toggleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('Voice input not supported in this browser', 'error');
      return;
    }

    if (recognition && recognition.recording) {
      recognition.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.recording = true;

    const textarea = document.getElementById('dump-textarea');

    recognition.onresult = (e) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      if (textarea.value && !textarea.value.endsWith(' ')) {
        textarea.value += ' ';
      }
      textarea.value += transcript;
      textarea.dispatchEvent(new Event('input'));
    };

    recognition.onerror = () => {
      showToast('Voice recognition error', 'error');
    };

    recognition.onend = () => {
      recognition.recording = false;
    };

    recognition.start();
    showToast('Listening... speak now');
  }

  // ---- Wake Lock ----
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (e) {
      // Wake lock not supported or failed
    }
  }

  async function releaseWakeLock() {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  }

  // ---- Ceremony View ----
  function showCeremony() {
    showView('ceremony');

    const canvas = document.getElementById('ceremony-canvas');
    const renderer = CeremonyRenderer;

    renderer.init(canvas);
    AudioEngine.playCeremonyChime();
    renderer.triggerHaptic();

    renderer.start(() => {
      // Ceremony complete
      renderer.destroy();
      releaseWakeLock();
      showIntentionView();
    });
  }

  // ---- Intention View ----
  function showIntentionView() {
    showView('intention');

    // Generate intention
    const analysis = SentimentAnalyzer.analyze(currentSession.content);
    const result = SentimentAnalyzer.generateIntention(currentSession.content);

    document.getElementById('ai-intention-text').textContent = result.text;
    document.getElementById('intention-category').textContent = `Based on your ${result.category} reflection`;

    // Star rating
    const stars = document.querySelectorAll('#star-rating .star');
    stars.forEach((star, i) => {
      star.addEventListener('click', () => {
        currentSession.energyRating = i + 1;
        stars.forEach((s, j) => {
          s.classList.toggle('active', j <= i);
        });
      });
    });

    document.getElementById('btn-save-session').addEventListener('click', saveSession);
  }

  async function saveSession() {
    currentSession.intention = document.getElementById('intention-text').value.trim()
      || document.getElementById('ai-intention-text').textContent;
    currentSession.gratitude = document.getElementById('gratitude-text').value.trim();

    await DataStore.saveSession(currentSession);
    AudioEngine.playSound('success');
    showToast('Session saved', 'success');
    showView('landing');
  }

  // ---- Archive View ----
  async function loadArchive() {
    const sessions = await DataStore.getSessions();
    const container = document.getElementById('archive-list');

    if (sessions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 6v6l4 2"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <p>No sessions yet. Begin your first offload.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = sessions.map(s => `
      <div class="session-card" data-id="${s.id}" role="button" tabindex="0" aria-label="Session from ${new Date(s.createdAt).toLocaleDateString()}">
        <div class="session-card-header">
          <span class="session-date">${new Date(s.createdAt).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span>${SentimentAnalyzer.getEmoji(s.sentiment || 'neutral')}</span>
        </div>
        <div class="session-preview">${s.content || 'No content'}</div>
        <div class="session-meta">
          <span>${s.wordCount || 0} words</span>
          <span>${'★'.repeat(s.energyRating || 0)}${'☆'.repeat(5 - (s.energyRating || 0))}</span>
          ${s.intention ? '<span>Has intention</span>' : ''}
        </div>
      </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.session-card').forEach(card => {
      card.addEventListener('click', () => showSessionDetail(card.dataset.id));
    });
  }

  async function showSessionDetail(id) {
    const sessions = await DataStore.getSessions();
    const session = sessions.find(s => s.id === id);
    if (!session) return;

    const modal = document.getElementById('detail-modal');
    document.getElementById('detail-date').textContent = new Date(session.createdAt).toLocaleString();
    document.getElementById('detail-sentiment').textContent = SentimentAnalyzer.getLabel(session.sentiment || 'neutral');
    document.getElementById('detail-content').textContent = session.content || 'No content';
    document.getElementById('detail-words').textContent = session.wordCount || 0;
    document.getElementById('detail-energy').textContent = '★'.repeat(session.energyRating || 0) || 'Not rated';
    document.getElementById('detail-intention').textContent = session.intention || '—';
    document.getElementById('detail-gratitude').textContent = session.gratitude || '—';

    // Share handler
    document.getElementById('btn-share-session').onclick = async () => {
      const shareData = {
        title: 'My Offload Session',
        text: session.content?.substring(0, 200) + '...'
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (e) {
          // User cancelled
        }
      } else {
        await navigator.clipboard.writeText(session.content || '');
        showToast('Copied to clipboard', 'success');
      }
    };

    // Delete handler
    document.getElementById('btn-delete-session').onclick = async () => {
      if (confirm('Delete this session?')) {
        await DataStore.deleteSession(id);
        modal.classList.add('hidden');
        loadArchive();
        showToast('Session deleted', 'info');
      }
    };

    modal.classList.remove('hidden');
  }

  // ---- Dreams View ----
  async function loadDreams() {
    const dreams = await DataStore.getDreams();
    const container = document.getElementById('dreams-list');

    if (dreams.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </div>
          <p>No dreams recorded yet.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = dreams.map(d => `
      <div class="card dream-card" data-id="${d.id}">
        <div class="session-card-header">
          <h3 style="font-size: var(--font-body); color: var(--text-primary);">${d.title}</h3>
          <span class="session-date">${new Date(d.createdAt).toLocaleDateString()}</span>
        </div>
        <p style="font-size: var(--font-body); color: var(--text-secondary); margin: var(--space-xs) 0;">${d.content?.substring(0, 120)}${d.content?.length > 120 ? '...' : ''}</p>
        <div class="session-meta">
          ${(d.tags || []).map(t => `<span class="tag tag-${t}">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.dream-card').forEach(card => {
      card.addEventListener('click', () => showDreamDetail(card.dataset.id));
    });
  }

  async function showDreamDetail(id) {
    const dreams = await DataStore.getDreams();
    const dream = dreams.find(d => d.id === id);
    if (!dream) return;

    // Populate edit form
    document.getElementById('dream-title').value = dream.title || '';
    document.getElementById('dream-content').value = dream.content || '';

    // Tag selection
    const tagOptions = ['lucid', 'vivid', 'nightmare', 'recurring', 'prophetic'];
    const selectedTags = new Set(dream.tags || []);
    document.getElementById('dream-tags').innerHTML = tagOptions.map(tag => `
      <button class="tag tag-${tag} ${selectedTags.has(tag) ? 'selected' : ''}" data-tag="${tag}" style="cursor: pointer; border: none; ${selectedTags.has(tag) ? 'box-shadow: 0 0 0 2px var(--accent-purple);' : ''}">
        ${tag}
      </button>
    `).join('');

    // Tag click handlers
    document.querySelectorAll('#dream-tags .tag').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        btn.style.boxShadow = btn.classList.contains('selected') ? '0 0 0 2px var(--accent-purple)' : 'none';
      });
    });

    document.getElementById('dream-modal-title').textContent = 'Edit Dream';
    document.getElementById('dream-modal').classList.remove('hidden');
    document.getElementById('btn-save-dream').onclick = async () => {
      dream.title = document.getElementById('dream-title').value;
      dream.content = document.getElementById('dream-content').value;
      dream.tags = Array.from(document.querySelectorAll('#dream-tags .tag.selected')).map(t => t.dataset.tag);
      await DataStore.saveDream(dream);
      document.getElementById('dream-modal').classList.add('hidden');
      loadDreams();
      showToast('Dream updated', 'success');
    };
  }

  function initDreamForm() {
    document.getElementById('btn-new-dream').addEventListener('click', () => {
      document.getElementById('dream-title').value = '';
      document.getElementById('dream-content').value = '';
      document.getElementById('dream-tags').innerHTML = ['lucid', 'vivid', 'nightmare', 'recurring', 'prophetic'].map(tag => `
        <button class="tag tag-${tag}" data-tag="${tag}" style="cursor: pointer; border: none;">${tag}</button>
      `).join('');
      document.querySelectorAll('#dream-tags .tag').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.classList.toggle('selected');
          btn.style.boxShadow = btn.classList.contains('selected') ? '0 0 0 2px var(--accent-purple)' : 'none';
        });
      });
      document.getElementById('dream-modal-title').textContent = 'New Dream';
      document.getElementById('dream-modal').classList.remove('hidden');
      document.getElementById('btn-save-dream').onclick = async () => {
        const title = document.getElementById('dream-title').value.trim();
        if (!title) {
          showToast('Please enter a title', 'error');
          return;
        }
        const dream = {
          title,
          content: document.getElementById('dream-content').value,
          tags: Array.from(document.querySelectorAll('#dream-tags .tag.selected')).map(t => t.dataset.tag)
        };
        await DataStore.saveDream(dream);
        document.getElementById('dream-modal').classList.add('hidden');
        loadDreams();
        showToast('Dream recorded', 'success');
      };
    });
  }

  // ---- Stats View ----
  async function loadStats() {
    const stats = await DataStore.getStats();

    document.getElementById('stat-sessions').textContent = stats.totalSessions;
    document.getElementById('stat-words').textContent = stats.totalWords.toLocaleString();
    document.getElementById('stat-energy').textContent = stats.averageEnergy || '—';
    document.getElementById('stat-streak').textContent = `${stats.streak} day${stats.streak !== 1 ? 's' : ''}`;

    // Weekly chart
    drawWeeklyChart(stats.weeklyData);

    // Word cloud
    const cloudContainer = document.getElementById('word-cloud');
    if (stats.wordCloud.length === 0) {
      cloudContainer.innerHTML = '<p class="caption" style="text-align: center; color: var(--text-muted);">Write more to generate your word cloud</p>';
    } else {
      const maxCount = Math.max(...stats.wordCloud.map(w => w.count));
      cloudContainer.innerHTML = stats.wordCloud.map(w => {
        const size = 0.7 + (w.count / maxCount) * 1.3;
        const opacity = 0.4 + (w.count / maxCount) * 0.6;
        return `<span class="word-cloud-item" style="font-size: ${size}em; opacity: ${opacity}; color: var(--accent-purple-light);">${w.word}</span>`;
      }).join('');
    }
  }

  function drawWeeklyChart(data) {
    const canvas = document.getElementById('stats-chart');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 10, bottom: 30, left: 10 };
    const barWidth = (w - padding.left - padding.right) / data.length * 0.6;
    const maxCount = Math.max(...data.map(d => d.count), 1);

    ctx.clearRect(0, 0, w, h);

    data.forEach((d, i) => {
      const x = padding.left + (i + 0.5) * ((w - padding.left - padding.right) / data.length) - barWidth / 2;
      const barHeight = (d.count / maxCount) * (h - padding.top - padding.bottom);
      const y = h - padding.bottom - barHeight;

      // Bar
      const gradient = ctx.createLinearGradient(0, y, 0, h - padding.bottom);
      gradient.addColorStop(0, '#7c6fae');
      gradient.addColorStop(1, 'rgba(124, 111, 174, 0.2)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();

      // Day label
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.date, x + barWidth / 2, h - 8);

      // Count label
      if (d.count > 0) {
        ctx.fillStyle = '#a0a8b0';
        ctx.font = '11px sans-serif';
        ctx.fillText(d.count, x + barWidth / 2, y - 6);
      }
    });
  }

  // ---- Settings View ----
  async function loadSettings() {
    settings = await DataStore.getSettings();

    // Duration selector
    document.querySelectorAll('.duration-option').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.minutes) === settings.timerDuration);
    });

    // Toggles
    document.getElementById('toggle-audio').classList.toggle('active', settings.audioEnabled);
    document.getElementById('toggle-binaural').classList.toggle('active', settings.binauralEnabled);
    document.getElementById('toggle-notifications').classList.toggle('active', settings.notificationsEnabled);
    document.getElementById('toggle-encryption').classList.toggle('active', settings.encryptionEnabled);

    // Reminder time
    document.getElementById('reminder-time').value = settings.reminderTime || '21:00';
  }

  function initSettings() {
    // Duration selector
    document.querySelectorAll('.duration-option').forEach(btn => {
      btn.addEventListener('click', async () => {
        settings.timerDuration = parseInt(btn.dataset.minutes);
        document.querySelectorAll('.duration-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        await DataStore.saveSettings(settings);
      });
    });

    // Audio toggle
    document.getElementById('toggle-audio').addEventListener('click', async function() {
      settings.audioEnabled = !settings.audioEnabled;
      this.classList.toggle('active', settings.audioEnabled);
      await DataStore.saveSettings(settings);
    });

    // Binaural toggle
    document.getElementById('toggle-binaural').addEventListener('click', async function() {
      settings.binauralEnabled = !settings.binauralEnabled;
      this.classList.toggle('active', settings.binauralEnabled);
      await DataStore.saveSettings(settings);
    });

    // Notifications toggle
    document.getElementById('toggle-notifications').addEventListener('click', async function() {
      settings.notificationsEnabled = !settings.notificationsEnabled;
      this.classList.toggle('active', settings.notificationsEnabled);

      if (settings.notificationsEnabled && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          settings.notificationsEnabled = false;
          this.classList.remove('active');
          showToast('Notification permission denied', 'error');
        }
      }
      await DataStore.saveSettings(settings);
    });

    // Encryption toggle
    document.getElementById('toggle-encryption').addEventListener('click', async function() {
      const passphraseInput = document.getElementById('passphrase-input');

      if (!settings.encryptionEnabled) {
        // Enabling encryption
        passphraseInput.classList.remove('hidden');
        passphraseInput.querySelector('input').focus();
      } else {
        // Disabling encryption
        settings.encryptionEnabled = false;
        DataStore.disableEncryption();
        this.classList.remove('active');
        passphraseInput.classList.add('hidden');
        await DataStore.saveSettings(settings);
        showToast('Encryption disabled', 'info');
      }
    });

    // Passphrase confirm
    document.getElementById('btn-set-passphrase').addEventListener('click', async () => {
      const input = document.querySelector('#passphrase-input input');
      const passphrase = input.value;

      if (passphrase.length < 8) {
        showToast('Passphrase must be at least 8 characters', 'error');
        return;
      }

      try {
        await DataStore.initializeEncryption(passphrase);
        settings.encryptionEnabled = true;
        document.getElementById('toggle-encryption').classList.add('active');
        document.getElementById('passphrase-input').classList.add('hidden');
        input.value = '';
        await DataStore.saveSettings(settings);
        showToast('Encryption enabled', 'success');
      } catch (e) {
        showToast('Failed to enable encryption', 'error');
      }
    });

    // Reminder time
    document.getElementById('reminder-time').addEventListener('change', async (e) => {
      settings.reminderTime = e.target.value;
      await DataStore.saveSettings(settings);
      scheduleReminder();
    });

    // Export
    document.getElementById('btn-export').addEventListener('click', async () => {
      try {
        await DataStore.exportAll();
        showToast('Backup downloaded', 'success');
      } catch (e) {
        showToast('Export failed', 'error');
      }
    });

    // Import
    document.getElementById('btn-import').addEventListener('click', () => {
      document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        await DataStore.importAll(text);
        showToast('Backup restored', 'success');
        loadArchive();
        loadStats();
      } catch (err) {
        showToast('Invalid backup file', 'error');
      }
      e.target.value = '';
    });
  }

  function scheduleReminder() {
    if (!settings.notificationsEnabled || !settings.reminderTime) return;

    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    const now = new Date();
    const reminder = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (reminder <= now) {
      reminder.setDate(reminder.getDate() + 1);
    }

    const delay = reminder - now;
    setTimeout(() => {
      if (settings.notificationsEnabled) {
        new Notification('Offload', {
          body: 'Time to release your thoughts and prepare for rest.',
          icon: './icon-192.png',
          badge: './icon-192.png'
        });
      }
      scheduleReminder(); // Schedule next
    }, delay);
  }

  // ---- Initialization ----
  async function init() {
    // Load settings
    settings = await DataStore.getSettings();

    // Initialize sentiment analyzer
    await SentimentAnalyzer.initialize();

    // Initialize encryption if enabled
    if (settings.encryptionEnabled) {
      document.getElementById('passphrase-prompt').classList.remove('hidden');
      document.getElementById('btn-unlock').addEventListener('click', async () => {
        const passphrase = document.getElementById('unlock-passphrase').value;
        try {
          await DataStore.initializeEncryption(passphrase);
          document.getElementById('passphrase-prompt').classList.add('hidden');
          showToast('Unlocked', 'success');
        } catch (e) {
          showToast('Invalid passphrase', 'error');
        }
      });
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.dataset.nav;
        AudioEngine.playSound('click');
        showView(view);

        if (view === 'archive') loadArchive();
        if (view === 'dreams') loadDreams();
        if (view === 'stats') loadStats();
        if (view === 'settings') loadSettings();
      });
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el || el.classList.contains('modal-close')) {
          el.closest('.modal-overlay')?.classList.add('hidden');
        }
      });
    });

    // Focus mode exit
    document.getElementById('btn-exit-focus').addEventListener('click', exitFocusMode);

    // Initialize views
    initLanding();
    initDumpView();
    initDreamForm();
    initSettings();

    // Show landing
    showView('landing');

    // Schedule reminder
    scheduleReminder();

    // Service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // SW registration failed silently
      });
    }

    console.log('Offload initialized');
  }

  return { init };
})();

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
