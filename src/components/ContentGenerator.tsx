import React, { useState } from 'react';
import './ContentGenerator.css';
import PhoneBrandSelector from './PhoneBrandSelector';

// Prompt templates for different cellphone marketing scenarios
const PROMPT_TEMPLATES = [
  { 
    label: 'Product Launch Announcement', 
    value: 'launch', 
    template: 'Create an exciting product launch announcement for a new smartphone.' 
  },
  { 
    label: 'Social Media Campaign', 
    value: 'social', 
    template: 'Write an engaging social media campaign post for a smartphone.' 
  },
  { 
    label: 'Feature Highlight', 
    value: 'feature', 
    template: 'Generate compelling content highlighting the key features of a smartphone.' 
  },
  { 
    label: 'Comparison Ad', 
    value: 'comparison', 
    template: 'Create a persuasive comparison advertisement for a smartphone against competitors.' 
  },
  { 
    label: 'Tech Review', 
    value: 'review', 
    template: 'Write a detailed technical review of a smartphone for tech enthusiasts.' 
  },
];

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const ContentGenerator: React.FC = () => {
  const [promptType, setPromptType] = useState(PROMPT_TEMPLATES[0].value);
  const [phoneModel, setPhoneModel] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [performance, setPerformance] = useState<{ time?: number; tokens?: number }>({});

  const buildPrompt = () => {
    const template = PROMPT_TEMPLATES.find(t => t.value === promptType)?.template || '';
    return `${template}\nPhone Model: ${phoneModel}\nTarget Audience: ${targetAudience}\nKey Features: ${keyFeatures}`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');
    const start = Date.now();
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      setError('Gemini API key not found. Please check your .env file.');
      setLoading(false);
      return;
    }
    const prompt = buildPrompt();
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setOutput(data.candidates[0].content.parts[0].text);
        setPerformance({ time: Date.now() - start, tokens: data.usageMetadata?.totalTokens || undefined });
      } else if (data.error) {
        setError(data.error.message || 'Unknown error from Gemini API.');
      } else {
        setError('No content generated.');
      }
    } catch (err: any) {
      setError('Failed to connect to Gemini API.');
    }
    setLoading(false);
  };

  const handleExport = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartphone-marketing-content.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleModelSelect = (model: string) => {
    setPhoneModel(model);
  };

  return (
    <div className="content-generator-container">
      <h2 className="store-title">NKOSINATHI SMARTPHONES MARKETING STORE</h2>
      <form onSubmit={handleGenerate} className="content-generator-form">
        <div className="form-group">
          <label htmlFor="promptType">Content Type</label>
          <select 
            id="promptType"
            value={promptType} 
            onChange={e => setPromptType(e.target.value)}
            className="form-control"
          >
            {PROMPT_TEMPLATES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Phone Brand and Model</label>
          <PhoneBrandSelector onSelectModel={handleModelSelect} />
          <input 
            id="phoneModel"
            value={phoneModel} 
            onChange={e => setPhoneModel(e.target.value)} 
            placeholder="Or type your own model"
            className="form-control"
            style={{ marginTop: '10px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience</label>
          <input 
            id="targetAudience"
            value={targetAudience} 
            onChange={e => setTargetAudience(e.target.value)} 
            placeholder="e.g., Tech enthusiasts, Business professionals, Photography lovers"
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="keyFeatures">Key Features to Highlight</label>
          <input 
            id="keyFeatures"
            value={keyFeatures} 
            onChange={e => setKeyFeatures(e.target.value)} 
            placeholder="e.g., 48MP camera, 5G connectivity, 5000mAh battery"
            required 
            className="form-control"
          />
        </div>

        <button type="submit" disabled={loading} className="generate-button">
          {loading ? 'Generating...' : 'Generate Marketing Content'}
        </button>
      </form>

      {loading && <p>Generating marketing content...</p>}
      {error && <p className="error">{error}</p>}
      {output && (
        <div className="output-section">
          <h3>Generated Marketing Content</h3>
          <pre>{output}</pre>
          <button onClick={handleExport} className="export-button">Export Content</button>
        </div>
      )}
      {performance.time && (
        <div className="performance">
          <p>Generation Time: {performance.time} ms</p>
          <p>Token Usage: {performance.tokens}</p>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator; 