import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import axios from 'axios';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const GREEN_COLOR = '#52e500'; // Define the green color
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { name, email, password };

    try {
        const response = await axios.post('http://localhost:5001/signup', userData);
        
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }

        if (response.status === 200) {
            setToastMessage('Sign-up successful! You can now log in.');
            const user = response.data.newUser; // Assuming server sends user data in response
            localStorage.setItem('user', JSON.stringify(user))
            navigate('/')
        }
        
    } catch (error) {
        console.error('Error during sign-up:', error);
    }

    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-gray-100">
      {toastMessage && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-md">
          {toastMessage}
        </div>
      )}
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block font-medium mb-2 text-gray-300">
              Name
            </label>
            
                
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block font-medium mb-2 text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block font-medium mb-2 text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: GREEN_COLOR }} // Use the special green color
            className="w-full text-black py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;