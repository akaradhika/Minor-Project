import React, { useEffect, useState } from 'react';
import { Mail, User, Database, Image, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Maintain consistent color scheme
const GREEN_COLOR = '#52e500';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5001/profile/${user._id}`);
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchData();
    }
  }, []);
  console.log(userData)

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-800 relative">
            {/* Background Image */}
            {userData.arts.length > 0 && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(data:image/png;base64,${btoa(new Uint8Array(userData.arts[0].data).reduce((data, byte) => data + String.fromCharCode(byte), ''))})` }}
              />
            )}
            <div className="flex items-center gap-6 relative z-10">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                style={{ backgroundColor: GREEN_COLOR }}
              >
                {userData.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{userData.name}</h1>
                <p className="text-gray-400">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-6">
            {/* User Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">User ID</p>
                    <p className="font-mono">{userData._id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p>{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p>{userData.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Artwork Gallery */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Your <span style={{ color: GREEN_COLOR }}>Artworks</span>
                </h2>
                <Link 
                  to="/file-upload" 
                  style={{ color: GREEN_COLOR }} 
                  className="flex items-center group"
                >
                  Upload New 
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userData.arts.map((art, index) => {
                  const uint8Array = new Uint8Array(art.data);
                  const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
                  const imageSrc = `data:image/png;base64,${btoa(base64String)}`;

                  return (
                    <div 
                      key={index}
                      className="aspect-square bg-black rounded-lg border border-gray-800 overflow-hidden hover:-translate-y-1 transition-all"
                    >
                      <img src={imageSrc} alt={`Artwork ${index}`} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;