import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Loader2, AlertCircle, Volleyball } from 'lucide-react';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/upcoming-matches');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        setMatches(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Matches</h2>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex justify-center items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Upcoming Soccer Matches</h1>
              <p className="text-gray-400 text-center py-2">Stay updated with the latest fixtures</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-15">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No Matches Scheduled</h2>
            <p className="text-gray-500">Check back later for upcoming fixtures</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match, idx) => {
              const dateTime = formatDate(match.date);
              
              return (
                <div 
                  key={idx}
                  className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Volleyball className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white text-center leading-tight">
                      {match.teams}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-orange-300" />
                      <span className="text-sm font-medium">{dateTime.date}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-gray-300">
                      <Clock className="w-4 h-4 text-pink-300" />
                      <span className="text-sm font-medium">{dateTime.time}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <span className="px-3 py-1 bg-blue-600/20 text-cyan-300 rounded-full text-xs font-medium border border-cyan-400/30">
                      Upcoming
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {matches.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
              <Volleyball className="w-4 h-4 text-cyan-300" />
              <span className="text-gray-300 text-sm">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} scheduled
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;