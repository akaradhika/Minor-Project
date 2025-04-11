import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';

const GREEN_COLOR = '#52e500';

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const imageRef = useRef(null);

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user)

    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setMessage('No files selected.');
            return;
        }
    
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("images", selectedFiles[i]); // Append each file
        }
    
        const user = JSON.parse(localStorage.getItem('user'));
        setUploading(true);
        setMessage('');
    
        try {
            const response = await axios.post(
                `http://localhost:5001/upload-files?userId=${user._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            setMessage('Upload successful!');
        } catch (error) {
            console.error(error);
            setMessage('Error uploading files.');
        } finally {
            setUploading(false);
        }
    };
    

    return (
        <div className="max-w-screen h-screen mx-auto py-20 px-6 bg-black text-gray-100">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
                Upload Your Images
            </h2>
            <p className="text-xl text-gray-400 text-center mb-8">
                Select multiple images to upload to your creative space.
            </p>
            <div className="flex flex-col items-center">
                <input
                    type="file"
                    multiple
                    name='images'
                    onChange={handleFileChange}
                    ref={imageRef}
                    className="mb-4 border border-gray-600 rounded-lg p-2 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    style={{ backgroundColor: GREEN_COLOR }}
                    className={`px-8 py-3 text-black rounded-full transition-all hover:opacity-90 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {uploading ? 'Uploading...' : 'Upload Images'}
                    <ChevronRight className="inline ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                {message && (
                    <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
