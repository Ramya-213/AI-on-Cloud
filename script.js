/**
 * PROJECT 2: AI on Cloud - Sentiment Analyzer
 * CodTech Cloud Computing Internship
 *
 * In production, this calls your AWS Lambda + API Gateway endpoint
 * which internally uses Amazon Comprehend's detectSentiment API.
 *
 * For demonstration, a local NLP simulation is included.
 * Replace API_ENDPOINT with your actual deployed Lambda URL.
 */

// ---- CONFIGURATION ----
// Replace this with your actual API Gateway endpoint after deploying Lambda
const API_ENDPOINT = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/analyze';

// ---- Character Counter ----
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');

textInput.addEventListener('input', () => {
  const len = textInput.value.length;
  charCount.textContent = `${len} / 500 characters`;
  charCount.style.color = len > 450 ? '#f85149' : '';
  if (len > 500) textInput.value = textInput.value.slice(0, 500);
});

// ---- Main Analysis Function ----
async function analyzeText() {
  const text = textInput.value.trim();

  // Validation
  if (!text) {
    alert('Please enter some text to analyze.');
    return;
  }

  // Show loading, hide results
  document.getElementById('loading').style.display = 'block';
  document.getElementById('results').style.display = 'none';

  try {
    /**
     * PRODUCTION CODE: Uncomment this block after deploying Lambda
     * 
     * const response = await fetch(API_ENDPOINT, {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({ text: text })
     * });
     * const data = await response.json();
     * displayResults(data);
     */

    // DEMO: Simulate API call with local sentiment detection
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    const result = simulateComprehendAPI(text);
    displayResults(result);

  } catch (error) {
    console.error('API Error:', error);
    document.getElementById('loading').style.display = 'none';
    alert('Error calling AWS API. Check console for details.');
  }
}

// ---- Display Results from AWS Comprehend ----
function displayResults(data) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('results').style.display = 'block';

  const { Sentiment, SentimentScore, LanguageCode } = data;

  // Emoji and colors per sentiment
  const sentimentMap = {
    POSITIVE: { emoji: '😊', color: '#3fb950', label: 'POSITIVE' },
    NEGATIVE: { emoji: '😞', color: '#f85149', label: 'NEGATIVE' },
    NEUTRAL:  { emoji: '😐', color: '#8b949e', label: 'NEUTRAL'  },
    MIXED:    { emoji: '🤔', color: '#d29922', label: 'MIXED'    }
  };
  const s = sentimentMap[Sentiment] || sentimentMap.NEUTRAL;

  // Update sentiment card
  document.getElementById('sentimentEmoji').textContent = s.emoji;
  const labelEl = document.getElementById('sentimentLabel');
  labelEl.textContent = s.label;
  labelEl.style.color = s.color;

  const card = document.getElementById('sentimentCard');
  card.style.borderColor = s.color + '44';

  // Confidence bar for dominant sentiment
  const confidence = SentimentScore[Sentiment] || 0;
  document.getElementById('confidenceBar').style.width = `${(confidence * 100).toFixed(1)}%`;
  document.getElementById('confidenceBar').style.background = s.color;
  document.getElementById('confidenceText').textContent = `Confidence: ${(confidence * 100).toFixed(1)}%`;

  // Score Breakdown
  const breakdown = document.getElementById('scoreBreakdown');
  breakdown.innerHTML = Object.entries(SentimentScore).map(([key, val]) => `
    <div class="score-item">
      <div class="s-label">${key}</div>
      <div class="s-value" style="color:${sentimentMap[key]?.color || '#fff'}">${(val * 100).toFixed(1)}%</div>
    </div>
  `).join('');

  // Language info
  document.getElementById('metaInfo').textContent =
    `Detected Language: ${LanguageCode.toUpperCase()} | Processed: ${new Date().toISOString()}`;

  // Simulated AWS JSON response
  document.getElementById('awsResponse').textContent = JSON.stringify(data, null, 2);
}

// ---- Simulate Amazon Comprehend API Response ----
// In production this logic lives in your Lambda function using AWS SDK
function simulateComprehendAPI(text) {
  const lower = text.toLowerCase();

  // Simple keyword-based scoring
  const positiveWords = ['love','great','awesome','amazing','excellent','good','happy','fantastic','wonderful','best','perfect','brilliant','enjoy','like','nice'];
  const negativeWords = ['hate','terrible','awful','bad','horrible','worst','sad','disappointed','poor','ugly','fail','boring','annoying','useless','wrong'];

  let posScore = 0, negScore = 0;
  const words = lower.split(/\W+/);

  words.forEach(word => {
    if (positiveWords.includes(word)) posScore++;
    if (negativeWords.includes(word)) negScore++;
  });

  const total = posScore + negScore || 1;
  const posNorm = posScore / total;
  const negNorm = negScore / total;
  const neuNorm = 1 - posNorm - negNorm < 0 ? 0 : 1 - posNorm - negNorm;
  const mixNorm = Math.min(posNorm, negNorm) * 0.5;

  let sentiment = 'NEUTRAL';
  if (posScore > negScore && posScore > 0) sentiment = 'POSITIVE';
  else if (negScore > posScore && negScore > 0) sentiment = 'NEGATIVE';
  else if (posScore > 0 && negScore > 0) sentiment = 'MIXED';

  return {
    Sentiment: sentiment,
    SentimentScore: {
      POSITIVE: parseFloat(posNorm.toFixed(4)),
      NEGATIVE: parseFloat(negNorm.toFixed(4)),
      NEUTRAL: parseFloat(neuNorm.toFixed(4)),
      MIXED: parseFloat(mixNorm.toFixed(4))
    },
    LanguageCode: 'en',
    ResponseMetadata: {
      RequestId: 'sim-' + Math.random().toString(36).substr(2,12),
      HTTPStatusCode: 200,
      ServiceName: 'Amazon Comprehend (Simulated)',
      Region: 'us-east-1'
    }
  };
}

console.log('✅ Project 2: AI on Cloud loaded');
console.log('🤖 Service: Amazon Comprehend (Sentiment Analysis)');
console.log('📡 Connect to Lambda: Update API_ENDPOINT variable');