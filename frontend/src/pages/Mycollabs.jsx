import React, { useEffect, useState } from "react";
import { Users, MessageSquare, Target, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GREEN_COLOR = '#52e500';

const MyCollabs = () => {
  const [collaborations, setCollaborations] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        console.log(user._id);
        const response = await fetch(`http://localhost:5001/profile/${user._id}`);
        const data = await response.json();
        setCollaborations(data.collaborations);
      } catch (error) {
        console.error("Error fetching collaborations:", error);
      }
    };

    fetchCollaborations();
  }, []);

  console.log(collaborations);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center gap-4 mb-12">
          <Users className="w-8 h-8" style={{ color: GREEN_COLOR }} />
          <h1 className="text-4xl font-bold">
            Collaboration <span style={{ color: GREEN_COLOR }}>Requests</span>
          </h1>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Requests</p>
            <p className="text-2xl font-bold mt-1" style={{ color: GREEN_COLOR }}>
              {collaborations?.length || 0}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold mt-1" style={{ color: GREEN_COLOR }}>
              {collaborations?.filter(collab => !collab.collaboratorStatus).length || 0}
            </p>
          </div>
        </div>

        {/* Collaboration Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {collaborations && collaborations.map((collab) => (
            <div 
              key={collab.collaboratorId} 
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:-translate-y-1 transition-all"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{collab.collaboratorName}</h2>
                    <p className="text-gray-400 text-sm">Request ID: {collab.collaboratorId}</p>
                  </div>
                  {collab.collaboratorStatus ? <div className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500">
                    Pending
                  </div>:<div className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-green-500">
                    Accepted
                  </div>}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Goal</p>
                      <p className="text-sm">{collab.collaboratorGoal}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Message</p>
                      <p className="text-sm">{collab.collaboratorMessage}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-black/20 flex gap-3">
                {!collab.collaboratorStatus ? (
                  <div className="flex gap-3">
                    <button 
                      className="flex-1 px-4 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
                      style={{ backgroundColor: GREEN_COLOR }}
                      onClick={async () => {
                        try {
                          const response = await fetch(`http://localhost:5001/accept/${collab._id}`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ collaboratorStatus: true }),
                          });
                          if (response.ok) {
                            setCollaborations(prev => 
                              prev.map(c => 
                                c.collaboratorId === collab.collaboratorId 
                                  ? { ...c, collaboratorStatus: true } 
                                  : c
                              )
                            );
                          } else {
                            console.error('Error accepting collaboration:', response.statusText);
                          }
                        } catch (error) {
                          console.error('Error during fetch:', error);
                        }
                      }}
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button 
                      className="flex-1 px-4 py-2 rounded-full font-medium bg-gray-800 hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                ) : (
                  <button 
                    className="flex-1 px-4 py-2 rounded-full font-medium hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors" style={{ backgroundColor: GREEN_COLOR }}
                  >
                    <Check className="w-4 h-4" />
                    Accepted
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!collaborations || collaborations.length === 0) && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No Collaboration Requests</h3>
            <p className="text-gray-400">You don't have any pending collaboration requests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCollabs;