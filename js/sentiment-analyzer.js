/* ============================================
   OFFLOAD — Sentiment Analyzer
   Client-Side Emotion Detection
   ============================================ */

const SentimentAnalyzer = (() => {
  let isModelLoaded = false;
  let model = null;

  // ---- Sentiment Word Lists ----
  // Comprehensive lexicon for client-side analysis
  const positiveWords = new Set([
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
    'happy', 'joy', 'love', 'loved', 'loving', 'best', 'beautiful', 'perfect',
    'brilliant', 'excited', 'exciting', 'grateful', 'thankful', 'blessed',
    'peaceful', 'calm', 'relaxed', 'serene', 'hopeful', 'optimistic', 'proud',
    'accomplished', 'successful', 'confident', 'strong', 'motivated', 'inspired',
    'creative', 'energetic', 'refreshed', 'renewed', 'positive', 'lucky',
    'fortunate', 'delighted', 'pleased', 'satisfied', 'content', 'comfortable',
    'safe', 'secure', 'supported', 'cared', 'appreciated', 'valued', 'respected',
    'kind', 'gentle', 'warm', 'friendly', 'lovely', 'enjoy', 'enjoyed',
    'fun', 'laugh', 'smile', 'laughed', 'smiled', 'celebrate', 'celebrated',
    'win', 'won', 'achieve', 'achieved', 'progress', 'improved', 'better',
    'growth', 'healing', 'healed', 'recovered', 'relief', 'relieved',
    'excited', 'thrilled', 'eager', 'enthusiastic', 'passionate', 'bliss',
    'harmony', 'balance', 'mindful', 'present', 'gratitude', 'appreciation',
    'abundance', 'prosperity', 'flourishing', 'thriving', 'radiant', 'glowing',
    'free', 'liberated', 'empowered', 'courageous', 'brave', 'determined'
  ]);

  const negativeWords = new Set([
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'hated', 'angry',
    'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'sad', 'depressed',
    'depressing', 'depression', 'melancholy', 'gloomy', 'miserable', 'unhappy',
    'disappointed', 'discouraged', 'hopeless', 'desperate', 'anxious', 'worried',
    'nervous', 'stressed', 'overwhelmed', 'exhausted', 'tired', 'drained',
    'burned', 'struggle', 'struggling', 'difficult', 'hard', 'tough', 'rough',
    'pain', 'painful', 'hurt', 'hurting', 'wounded', 'broken', 'lost',
    'confused', 'uncertain', 'doubt', 'doubtful', 'fear', 'fearful', 'scared',
    'afraid', 'terrified', 'panic', 'anxiety', 'worry', 'concern', 'concerned',
    'problem', 'problems', 'trouble', 'troubled', 'issue', 'issues', 'crisis',
    'conflict', 'argue', 'argued', 'argument', 'fight', 'fighting', 'alone',
    'lonely', 'isolated', 'rejected', 'abandoned', 'betrayed', 'cheated',
    'lied', 'dishonest', 'unfair', 'injustice', 'guilty', 'shame', 'ashamed',
    'embarrassed', 'insecure', 'inadequate', 'failure', 'failed', 'mistake',
    'regret', 'remorse', 'bitter', 'resentful', 'jealous', 'envious',
    'hostile', 'aggressive', 'violent', 'abuse', 'abused', 'trauma', 'traumatized'
  ]);

  const intensifiers = new Set([
    'very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally',
    'utterly', 'deeply', 'profoundly', 'severely', 'intensely', 'strongly',
    'really', 'so', 'too', 'quite', 'rather', 'pretty', 'fairly', 'highly',
    'exceptionally', 'remarkably', 'extraordinarily', 'tremendously', 'immensely'
  ]);

  const negations = new Set([
    'not', 'no', 'never', 'nothing', 'nobody', 'neither', 'nowhere', 'hardly',
    'scarcely', 'barely', 'don\'t', 'doesn\'t', 'didn\'t', 'won\'t', 'wouldn\'t',
    'shouldn\'t', 'couldn\'t', 'can\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t'
  ]);

  // ---- Analysis Logic ----
  function analyzeText(text) {
    if (!text || text.trim().length === 0) {
      return { sentiment: 'neutral', score: 0, confidence: 0 };
    }

    const words = text.toLowerCase()
      .replace(/[^a-z\s']/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);

    if (words.length === 0) {
      return { sentiment: 'neutral', score: 0, confidence: 0 };
    }

    let score = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    let negationActive = false;
    let intensifierMultiplier = 1;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // Check for negations
      if (negations.has(word)) {
        negationActive = true;
        continue;
      }

      // Check for intensifiers
      if (intensifiers.has(word)) {
        intensifierMultiplier = 1.5;
        continue;
      }

      // Check sentiment
      let wordScore = 0;
      if (positiveWords.has(word)) {
        wordScore = 1;
        positiveCount++;
      } else if (negativeWords.has(word)) {
        wordScore = -1;
        negativeCount++;
      }

      // Apply negation and intensifier
      if (wordScore !== 0) {
        if (negationActive) {
          wordScore *= -0.5; // Negation flips and weakens
          negationActive = false;
        }
        wordScore *= intensifierMultiplier;
        score += wordScore;
        intensifierMultiplier = 1;
      }

      // Negation expires after 3 words
      if (negationActive && i > 0 && (i % 3 === 0)) {
        negationActive = false;
      }
    }

    // Normalize score (-1 to 1 range roughly)
    const maxPossible = Math.max(words.length * 0.3, 1);
    const normalizedScore = Math.max(-1, Math.min(1, score / maxPossible));

    // Calculate confidence based on word counts
    const totalSentimentWords = positiveCount + negativeCount;
    const confidence = Math.min(1, totalSentimentWords / Math.max(words.length * 0.1, 3));

    // Determine sentiment category
    let sentiment;
    if (normalizedScore > 0.1) {
      sentiment = 'positive';
    } else if (normalizedScore < -0.1) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    // Adjust for very short texts
    if (words.length < 5 && sentiment === 'neutral') {
      return { sentiment: 'neutral', score: 0, confidence: confidence * 0.5 };
    }

    return {
      sentiment,
      score: Math.round(normalizedScore * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      details: {
        positiveWords: positiveCount,
        negativeWords: negativeCount,
        totalWords: words.length
      }
    };
  }

  // ---- Category Detection ----
  function detectCategory(text) {
    const categories = {
      work: ['work', 'job', 'boss', 'colleague', 'project', 'deadline', 'career', 'office', 'meeting', 'client', 'business', 'professional', 'task', 'deadline', 'pressure', 'overtime'],
      stress: ['stress', 'anxious', 'anxiety', 'worry', 'worried', 'overwhelmed', 'pressure', 'tense', 'nervous', 'panic', 'restless', 'uneasy', 'troubled', 'burden'],
      relation: ['relationship', 'partner', 'love', 'boyfriend', 'girlfriend', 'husband', 'wife', 'marriage', 'divorce', 'breakup', 'friend', 'family', 'mother', 'father', 'parent', 'child', 'argument', 'fight'],
      health: ['health', 'sick', 'illness', 'pain', 'doctor', 'hospital', 'medicine', 'symptom', 'body', 'exercise', 'diet', 'sleep', 'insomnia', 'fatigue', 'energy', 'weight', 'mental']
    };

    const lowerText = text.toLowerCase();
    const scores = {};

    for (const [category, keywords] of Object.entries(categories)) {
      scores[category] = keywords.filter(kw => lowerText.includes(kw)).length;
    }

    const maxCategory = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return maxCategory[1] > 0 ? maxCategory[0] : 'general';
  }

  // ---- Intention Generation ----
  function generateIntention(category, sentiment) {
    const intentions = {
      work: [
        'I release the need to control every outcome at work.',
        'My worth is not defined by my productivity.',
        'I trust that challenges at work are opportunities for growth.',
        'I let go of work stress and welcome peaceful rest.',
        'Tomorrow, I will approach my work with clarity and calm.'
      ],
      stress: [
        'I am safe, and this moment is enough.',
        'With each breath, I release tension from my body.',
        'I choose peace over worry.',
        'I trust in my ability to handle whatever comes.',
        'I am allowed to rest and simply be.'
      ],
      relation: [
        'I release the need to be perfect in my relationships.',
        'Love flows to me and through me effortlessly.',
        'I communicate my needs with kindness and clarity.',
        'I am worthy of deep, meaningful connections.',
        'I let go of resentment and open my heart to understanding.'
      ],
      health: [
        'My body is wise and knows how to heal.',
        'I honor my body by giving it the rest it deserves.',
        'Each night of sleep brings renewal and restoration.',
        'I am grateful for my body and all it does for me.',
        'I trust in my body\'s natural ability to find balance.'
      ],
      general: [
        'I release today and welcome restful sleep.',
        'My mind is calm, my body is relaxed, my spirit is at peace.',
        'I am grateful for this day and look forward to tomorrow.',
        'I let go of what I cannot control and trust the process.',
        'Sleep comes to me easily and naturally.'
      ]
    };

    const categoryIntentions = intentions[category] || intentions.general;
    // Pick based on sentiment to match mood
    const index = sentiment === 'negative'
      ? Math.floor(Math.random() * 2) // First 2 are more comforting
      : Math.floor(Math.random() * categoryIntentions.length);

    return categoryIntentions[index];
  }

  // ---- Public API ----
  return {
    // Initialize (no external model needed for rule-based)
    async initialize() {
      isModelLoaded = true;
      return true;
    },

    // Check if ready
    isReady() {
      return isModelLoaded;
    },

    // Analyze text sentiment
    analyze(text) {
      return analyzeText(text);
    },

    // Detect content category
    categorize(text) {
      return detectCategory(text);
    },

    // Generate intention based on content
    generateIntention(text) {
      const analysis = analyzeText(text);
      const category = detectCategory(text);
      return {
        text: generateIntention(category, analysis.sentiment),
        category,
        basedOn: analysis.sentiment
      };
    },

    // Get emoji for sentiment
    getEmoji(sentiment) {
      const emojis = {
        positive: '😊',
        negative: '😔',
        neutral: '😐'
      };
      return emojis[sentiment] || '😐';
    },

    // Get label with icon
    getLabel(sentiment) {
      const labels = {
        positive: 'Positive',
        negative: 'Heavy',
        neutral: 'Calm'
      };
      return labels[sentiment] || 'Calm';
    }
  };
})();

export { SentimentAnalyzer };
