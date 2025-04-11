import React, { useState } from 'react';

const GREEN_COLOR = '#52e500';
const HOVER_GREEN = '#47c700';

const MusicGenerator = () => {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'prompt'
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [error, setError] = useState('');
    const [prompt, setPrompt] = useState('');

    const handleUploadSubmit = async (event) => {
        event.preventDefault();
        const fileInput = document.getElementById("fileInput");

        if (!fileInput.files.length) {
            alert("Please select an audio file.");
            return;
        }

        setLoading(true);
        setAudioUrl('');
        setError('');

        const formData = new FormData();
        formData.append("audioFile", fileInput.files[0]);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload-audio", {
                method: "POST",
                body: formData
            });

            setLoading(false);

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            } else {
                setError("An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
            setError("An error occurred. Please try again.");
        }
    };

    const handlePromptSubmit = async (event) => {
        event.preventDefault();

        if (!prompt) {
            alert("Please enter a prompt.");
            return;
        }

        setLoading(true);
        setAudioUrl('');
        setError('');

        try {
            const response = await fetch("http://127.0.0.1:5000/generate-audio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt })
            });

            setLoading(false);

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            } else {
                setError("An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-6">Generate Music with AI</h1>
            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'upload' ? 'bg-green-600' : 'bg-gray-600'}`}
                    onClick={() => setActiveTab('upload')}
                >
                    Upload Audio
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'prompt' ? 'bg-green-600' : 'bg-gray-600'}`}
                    onClick={() => setActiveTab('prompt')}
                >
                    Generate from Prompt
                </button>
            </div>

            {activeTab === 'upload' && (
                <form onSubmit={handleUploadSubmit} className="flex flex-col items-center">
                    <input type="file" id="fileInput" name="audioFile" accept="audio/*" required className="mb-4 px-4 py-2 border border-gray-600 rounded bg-gray-800 text-gray-100" />
                    <button type="submit" className="px-6 py-2 rounded-full transition-all" style={{ backgroundColor: GREEN_COLOR, color: 'black' }}>Generate Music</button>
                </form>
            )}

            {activeTab === 'prompt' && (
                <form onSubmit={handlePromptSubmit} className="flex flex-col items-center">
                    <input
                        type="text"
                        placeholder="Enter a music prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mb-4 px-4 py-2 border border-gray-600 rounded bg-gray-800 text-gray-100"
                    />
                    <button type="submit" className="px-6 py-2 rounded-full transition-all" style={{ backgroundColor: GREEN_COLOR, color: 'black' }}>Generate Music</button>
                </form>
            )}

            {loading && <div className="text-gray-400">Processing, please wait...</div>}
            {audioUrl && (
                <div className="mt-6">
                    <h3 className="text-2xl font-semibold">Your Generated Audio:</h3>
                    <audio controls src={audioUrl} className="mt-2"></audio>
                </div>
            )}
            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
};

export default MusicGenerator;
