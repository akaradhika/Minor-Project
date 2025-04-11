import React, { useEffect, useState } from "react";
import { Mail, User, Database } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const GREEN_COLOR = "#52e500";

const ArtistProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isCollabFormOpen, setCollabFormOpen] = useState(false);
  const [collabGoal, setCollabGoal] = useState("");
  const [collabMessage, setCollabMessage] = useState("");
  const [canSeeEmail, setCanSeeEmail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/profile/${id}`);
        const data = await response.json();
        setUserData(data);

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const currentUserId = currentUser ? currentUser._id : null;

        // Check if the current user is a collaborator and if the status is true
        const canViewEmail = data.collaborations.some(
          (collab) =>
            collab.collaboratorId === currentUserId && collab.collaboratorStatus
        );
        setCanSeeEmail(canViewEmail);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [id]);
  console.log(userData)

  const handleCollabButtonClick = () => {
    setCollabFormOpen(true);
  };

  const handleCollabFormSubmit = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const collabData = {
      collaboratorId: currentUser ? currentUser._id : null,
      collaboratorName: currentUser ? currentUser.name : null,
      collaboratorGoal: collabGoal,
      collaboratorMessage: collabMessage,
    };

    try {
      const response = await fetch(
        `http://localhost:5001/collaboration/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(collabData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Collaboration request sent:", result);
    } catch (error) {
      console.error("Error sending collaboration request:", error);
    }

    setCollabFormOpen(false);
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-8 border-b border-gray-800 relative">
            {userData.arts.length > 0 && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage: `url(data:image/png;base64,${btoa(
                    new Uint8Array(userData.arts[0].data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ""
                    )
                  )})`,
                }}
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
                {/* Show email only if canSeeEmail is true */}
                {canSeeEmail ? (
                  <>
                    <span className="text-sm font-bold bg-green-500 text-white px-2 py-1 rounded">
                      Collaborated ✔️
                    </span>
                    <p className="text-gray-400">{userData.email}</p>
                  </>
                ) : (
                  <p className="text-gray-400">Email is private</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
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
                    {canSeeEmail ? (
                      <p className="text-gray-400">{userData.email}</p>
                    ) : (
                      <p className="text-gray-400">Email is private</p>
                    )}
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
              <div className="flex justify-end p-8">
                <button
                  onClick={handleCollabButtonClick}
                  className={`mt-4 bg-green-500 h-conta h-12 text-white px-4 py-1 rounded ${
                    canSeeEmail ? "hidden" : ""
                  }`}
                >
                  Collaborate
                </button>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  <span style={{ color: GREEN_COLOR }}>Artworks</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userData.arts.map((art, index) => {
                  const uint8Array = new Uint8Array(art.data);
                  const base64String = uint8Array.reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                  );
                  const imageSrc = `data:image/png;base64,${btoa(
                    base64String
                  )}`;

                  return (
                    <div
                      key={index}
                      className="aspect-square bg-black rounded-lg border border-gray-800 overflow-hidden hover:-translate-y-1 transition-all"
                    >
                      <img
                        src={imageSrc}
                        alt={`Artwork ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {isCollabFormOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-2/3 md:w-1/3">
                <h2 className="text-xl font-bold mb-4 text-white">
                  Collaboration Request
                </h2>
                <form onSubmit={handleCollabFormSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Goal
                    </label>
                    <input
                      type="text"
                      value={collabGoal}
                      onChange={(e) => setCollabGoal(e.target.value)}
                      className="border border-gray-600 rounded w-full p-2 bg-gray-900 text-gray-100 placeholder-gray-500"
                      placeholder="Enter your collaboration goal"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Message
                    </label>
                    <textarea
                      value={collabMessage}
                      onChange={(e) => setCollabMessage(e.target.value)}
                      className="border border-gray-600 rounded w-full p-2 bg-gray-900 text-gray-100 placeholder-gray-500"
                      placeholder="Describe your collaboration request"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollabFormOpen(false)}
                    className="ml-2 bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
