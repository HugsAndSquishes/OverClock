import React, { useState, useEffect } from 'react';

const Board = () => {
    const [activeTab, setActiveTab] = useState('daily');
    const [BoardData, setBoardData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fake Data to populate the table until the API is ready
    const sampleData = {
        daily: [
            { id: 1, name: 'Alex Johnson', score: 2340, avatar: '/api/placeholder/40/40' },
            { id: 2, name: 'Sarah Williams', score: 2210, avatar: '/api/placeholder/40/40' },
            { id: 3, name: 'Michael Brown', score: 1950, avatar: '/api/placeholder/40/40' },
            { id: 4, name: 'Emma Davis', score: 1820, avatar: '/api/placeholder/40/40' },
            { id: 5, name: 'James Wilson', score: 1760, avatar: '/api/placeholder/40/40' },
        ],
        weekly: [
            { id: 2, name: 'Sarah Williams', score: 9540, avatar: '/api/placeholder/40/40' },
            { id: 1, name: 'Alex Johnson', score: 8970, avatar: '/api/placeholder/40/40' },
            { id: 5, name: 'James Wilson', score: 7650, avatar: '/api/placeholder/40/40' },
            { id: 3, name: 'Michael Brown', score: 7320, avatar: '/api/placeholder/40/40' },
            { id: 7, name: 'Olivia Martin', score: 6980, avatar: '/api/placeholder/40/40' },
        ],
        monthly: [
            { id: 5, name: 'James Wilson', score: 32450, avatar: '/api/placeholder/40/40' },
            { id: 2, name: 'Sarah Williams', score: 30120, avatar: '/api/placeholder/40/40' },
            { id: 7, name: 'Olivia Martin', score: 28760, avatar: '/api/placeholder/40/40' },
            { id: 1, name: 'Alex Johnson', score: 26540, avatar: '/api/placeholder/40/40' },
            { id: 9, name: 'Robert Taylor', score: 24890, avatar: '/api/placeholder/40/40' },
        ],
        quarterly: [
            { id: 7, name: 'Olivia Martin', score: 89730, avatar: '/api/placeholder/40/40' },
            { id: 5, name: 'James Wilson', score: 87650, avatar: '/api/placeholder/40/40' },
            { id: 9, name: 'Robert Taylor', score: 82340, avatar: '/api/placeholder/40/40' },
            { id: 2, name: 'Sarah Williams', score: 78920, avatar: '/api/placeholder/40/40' },
            { id: 11, name: 'David Anderson', score: 76450, avatar: '/api/placeholder/40/40' },
        ]
    };

    // Simulate data fetching
    useEffect(() => {
        setLoading(true);
        // Simulate API call with setTimeout
        const timer = setTimeout(() => {
            setBoardData(sampleData[activeTab]);
            setLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [activeTab]);

    const formatScore = (score) => {
        return new Intl.NumberFormat().format(score);
    };

    const tabs = [
        { id: 'daily', label: 'Daily' },
        { id: 'weekly', label: 'Weekly' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'quarterly', label: 'Quarterly' }
    ];

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="p-8 w-full max-w-2xl mx-4 bg-gray-700 rounded-2xl shadow-xl border border-gray-600">
                <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">Leaderboard</h2>
                
                <div className="flex justify-center gap-2 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-4 py-2 rounded-xl border transition-all ${
                                activeTab === tab.id 
                                    ? 'bg-gray-800 border-gray-600 text-white' 
                                    : 'border-gray-600 text-gray-400 hover:bg-gray-800'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-gray-300 text-center">Loading...</p>
                    ) : (
                        BoardData.map((user, index) => (
                            <div 
                                key={user.id} 
                                className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-600"
                            >
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={user.avatar} 
                                        alt="avatar" 
                                        className="size-12 rounded-full bg-gray-600"
                                    />
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-100">{user.name}</h4>
                                        <p className="text-gray-400">{formatScore(user.score)} pts</p>
                                    </div>
                                </div>
                                <span className="text-xl font-semibold text-gray-100">
                                    #{index + 1}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );    
};

export default Board;