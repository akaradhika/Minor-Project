import React, { useState } from 'react';
import { ImageIcon, Type, Sparkles } from 'lucide-react';

const GREEN_COLOR = '#52e500';
const HOVER_GREEN = '#47c700';

function ColorPalette() {
  const [activeTab, setActiveTab] = useState('analyze'); // 'analyze' or 'generate'
  const [selectedImage, setSelectedImage] = useState(null);
  const [theme, setTheme] = useState('');
  const [palette, setPalette] = useState([]);
  const [confidence, setConfidence] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textPrompt, setTextPrompt] = useState('');
  const [textGeneratedImage, setTextGeneratedImage] = useState(null);

  const handleImageUpload = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTheme(data.theme);
        setPalette(data.palette);
        setConfidence(data.confidence);
        generateImage(data.theme);
      } else {
        alert("Failed to analyze image.");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
    }
  };

  const generateImage = async (theme) => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: theme }),
      });

      if (response.ok) {
        const blob = await response.blob();
        setGeneratedImage(URL.createObjectURL(blob));
      } else {
        alert("Failed to generate image.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextToImage = async () => {
    if (!textPrompt.trim()) {
      alert("Please enter a text prompt.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: textPrompt }),
      });

      if (response.ok) {
        const blob = await response.blob();
        setTextGeneratedImage(URL.createObjectURL(blob));
      } else {
        alert("Failed to generate image from text.");
      }
    } catch (error) {
      console.error("Error generating image from text:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header Section */}
      <div className="pt-10 pb-8 px-6 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            AI Image Generation Studio
          </h1>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-900 p-1 rounded-full">
              <button
                onClick={() => setActiveTab('analyze')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                  activeTab === 'analyze'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-black'
                    : 'hover:bg-gray-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Image Analysis
              </button>
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                  activeTab === 'generate'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-black'
                    : 'hover:bg-gray-800'
                }`}
              >
                <Type className="w-4 h-4" />
                Text to Image
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'analyze' ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Choose Image
                </label>
                {selectedImage && (
                  <span className="ml-3 text-gray-400">
                    {selectedImage.name}
                  </span>
                )}
              </div>
              
              <button
                onClick={analyzeImage}
                disabled={loading}
                style={{ backgroundColor: loading ? HOVER_GREEN : GREEN_COLOR }}
                className="px-6 py-2 rounded-full text-black transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Processing...' : 'Analyze Image'}
              </button>
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <textarea
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="w-full p-4 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"
                    rows="4"
                  />
                </div>
                <button
                  onClick={handleTextToImage}
                  disabled={isGenerating}
                  className="px-6 py-3 rounded-full text-black transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: isGenerating ? HOVER_GREEN : GREEN_COLOR }}
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating ? 'Generating...' : 'Generate Image'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {activeTab === 'analyze' && (
            <>
              {/* Analysis Results */}
              {isAnalyzing ? (
                <div className="bg-gray-900 rounded-lg p-8 flex items-center justify-center">
                  <div className="loader"></div>
                </div>
              ) : (theme && (
                <div className="bg-gray-900 rounded-lg p-8">
                  <h2 className="text-2xl font-semibold mb-6">Analysis Results</h2>
                  <p>Detected Theme: {theme}</p>
                  <p>Confidence: {confidence}%</p>
                  <div>
                    <h3>Color Palette:</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {palette.map((color, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: 'rgba(82, 229, 0, 0.1)', color: GREEN_COLOR }}
                        >
                          {color}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Generated Image from Analysis */}
              {generatedImage && (
                <div className="bg-gray-900 rounded-lg p-8">
                  <h2 className="text-2xl font-semibold mb-6">Generated Image from Theme</h2>
                  <img src={generatedImage} alt="Generated AI" className="w-full h-auto rounded-lg" />
                </div>
              )}
            </>
          )}

          {/* Text Generated Image */}
          {activeTab === 'generate' && textGeneratedImage && (
            <div className="col-span-2">
              <div className="bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Generated Image from Text Prompt</h2>
                <img src={textGeneratedImage} alt="Generated from Text Prompt" className="w-full h-auto rounded-lg" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ColorPalette;