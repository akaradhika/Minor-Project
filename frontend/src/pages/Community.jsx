import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ImageIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';


const GREEN_COLOR = '#52e500';

const Community = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/fetchusers');
      const userData = await response.json();
  
      const formattedUserData = userData.map(user => ({
        ...user,
        arts: user.arts.map(art => {
          const uint8Array = new Uint8Array(art.data);
          const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
          return `data:image/png;base64,${btoa(base64String)}`;
        }),
      }));
  
      setUsers(formattedUserData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Process all images and apply search filtering
  useEffect(() => {
    const allImages = users.flatMap(user =>
      user.arts.map(art => ({
        art,
        userName: user.name,
        likes: Math.floor(Math.random() * 15),
        views: Math.floor(Math.random() * 12),
        id: user._id,
      }))
    );

    // Filter images based on search query
    const filtered = searchQuery
      ? allImages.filter(item =>
          item.userName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allImages;

    setFilteredImages(filtered);
  }, [users, searchQuery]); // Re-run when users or searchQuery changes

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  console.log(selectedImage)


  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Navigation Bar */}
      <div className="border-b border-gray-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: GREEN_COLOR }}>
            Community Gallery
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="px-4 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-sm">
              Home
            </Link>
            <Link to="/Login" 
              className="px-4 py-1.5 rounded-full text-sm text-black" 
              style={{ backgroundColor: GREEN_COLOR }}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="border-b border-gray-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700">
            <SlidersHorizontal size={18} />
            <span>Filter</span>
          </button>

          <div className="flex-1 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by username..."
                className="w-full pl-10 pr-4 py-1.5 bg-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700">
              <ImageIcon size={18} />
              <span>Search by Image</span>
            </button>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700">
            <span>Recommended</span>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredImages.length === 0 && searchQuery && (
          <div className="text-center text-gray-400 py-8">
            No results found for "{searchQuery}"
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredImages.map((item, index) => (
            <div 
              key={index} 
              className="group cursor-pointer" 
              onClick={() => setSelectedImage(item)}
            >
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={item.art}
                    alt={`Art by ${item.userName}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex gap-4 text-xs">
                      <span>♥ {item.likes}</span>
                      <span>👁 {item.views}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm" style={{ color: GREEN_COLOR }}>
                      {item.userName}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <span>♥ {item.likes}</span>
                      <span>👁 {item.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-gray-900 rounded-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 z-10"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col">
              {/* Image */}
              <div className="relative">
                <img
                  src={selectedImage.art}
                  alt={`Art by ${selectedImage.userName}`}
                  className="w-full max-h-[80vh] object-contain"
                />
              </div>

              {/* Info Section */}
              <div className="p-6 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium mb-1" style={{ color: GREEN_COLOR }}>
                      {selectedImage.userName}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Published on Community Gallery
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span>♥</span>
                      <span>{selectedImage.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👁</span>
                      <span>{selectedImage.views}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/artist/${selectedImage.id}`} className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;