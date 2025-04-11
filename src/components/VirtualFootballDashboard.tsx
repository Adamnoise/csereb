""
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as dataService from '../services/dataService';
import { TEAMS } from '../services/constants';

const VirtualFootballDashboard = () => {
  const [matchData, setMatchData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leagueTable, setLeagueTable] = useState([]);
  const [htFtAnalysis, setHtFtAnalysis] = useState({});
  const [matchCategories, setMatchCategories] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28AFF', '#FF6E6E'];
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        
        
        const sampleData = await generateSampleData(); // Change this to load from your actual data source


        setMatchData(sampleData);
        
        // Extract unique teams
        const extractedTeams = extractTeams(sampleData);
        setTeams(extractedTeams);
        
        // Calculate league table
        const table = calculateLeagueTable(sampleData, extractedTeams);
        setLeagueTable(table);
        
        // Calculate HT-FT analysis
        const htFtData = calculateHtFtAnalysis(sampleData);
        setHtFtAnalysis(htFtData);
        
        // Categorize matches
        const categories = categorizeMatches(sampleData);
        setMatchCategories(categories);
        
        // Set default selected team
        if (extractedTeams.length > 0) {
          setSelectedTeam(extractedTeams[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      };
      
    };
    
    fetchData();
  }, []); 
  
  // Generate sample match data
  const generateSampleData = async () => {
     try {
       const matches = [];
       // Generate a full season of matches (each team plays every other team twice)
       for (let round = 0; round < 2; round++) {
         for (let i = 0; i < TEAMS.length; i++) {
           for (let j = i + 1; j < TEAMS.length; j++) {
             // First round: i at home, j away
             // Second round: j at home, i away
             const homeTeam = round === 0 ? TEAMS[i].name : TEAMS[j].name;
             const awayTeam = round === 0 ? TEAMS[j].name : TEAMS[i].name;

             const homeScoreHT = Math.floor(Math.random() * 3);
             const awayScoreHT = Math.floor(Math.random() * 2);

             const additionalHomeGoals = Math.floor(Math.random() * 3);
             const additionalAwayGoals = Math.floor(Math.random() * 3);

             const homeScoreFT = homeScoreHT + additionalHomeGoals;
             const awayScoreFT = awayScoreHT + additionalAwayGoals;

             const htr = homeScoreHT > awayScoreHT ? 'H' : (homeScoreHT < awayScoreHT ? 'A' : 'D');
             const ftr = homeScoreFT > awayScoreFT ? 'H' : (homeScoreFT < awayScoreFT ? 'A' : 'D');

             matches.push({ Date: `2023-${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`, HomeTeam: homeTeam, AwayTeam: awayTeam, FTHG: homeScoreFT, FTAG: awayScoreFT, FTR: ftr, HTHG: homeScoreHT, HTAG: awayScoreHT, HTR: htr });
           }
         }
       }
       return matches;
     } catch (error) {
       console.error('Error loading data:', error);
       return [];
     }
  };
  
  // Extract unique teams from match data
  const extractTeams = (data) => {
    const teamsSet = new Set();
    data.forEach(match => {
      teamsSet.add(match.HomeTeam);
      teamsSet.add(match.AwayTeam);
    });
    return Array.from(teamsSet).sort();
  };
  
  // Calculate league table
  const calculateLeagueTable = (data, teamsList) => {
    const table = {};
    
    // Initialize table
    teamsList.forEach(team => {
      table[team] = {
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        goalDifference: 0,
        position: 0
      };
    });
    
    // Populate table with data
    data.forEach(match => {
      // Update home team stats
      table[match.HomeTeam].played += 1;
      table[match.HomeTeam].goalsFor += match.FTHG;
      table[match.HomeTeam].goalsAgainst += match.FTAG;
      
      // Update away team stats
      table[match.AwayTeam].played += 1;
      table[match.AwayTeam].goalsFor += match.FTAG;
      table[match.AwayTeam].goalsAgainst += match.FTHG;
      
      // Update results based on FTR
      if (match.FTR === 'H') {
        table[match.HomeTeam].won += 1;
        table[match.HomeTeam].points += 3;
        table[match.AwayTeam].lost += 1;
      } else if (match.FTR === 'A') {
        table[match.AwayTeam].won += 1;
        table[match.AwayTeam].points += 3;
        table[match.HomeTeam].lost += 1;
      } else {
        table[match.HomeTeam].drawn += 1;
        table[match.HomeTeam].points += 1;
        table[match.AwayTeam].drawn += 1;
        table[match.AwayTeam].points += 1;
      }
    });
    
    // Calculate goal difference and sort the table
    const tableArray = Object.values(table).map(team => {
      return {
        ...team,
        goalDifference: team.goalsFor - team.goalsAgainst
      };
    }).sort((a, b) => {
      // Sort by points, then goal difference, then goals for
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
    
    // Add position
    tableArray.forEach((team, index) => {
      team.position = index + 1;
    });
    
    return tableArray;
  };
  
  // Calculate half-time/full-time analysis
  const calculateHtFtAnalysis = (data) => {
    const htFtCounts = {
      'HH': 0, // Leading at HT, won at FT
      'HD': 0, // Leading at HT, drew at FT
      'HA': 0, // Leading at HT, lost at FT
      'DH': 0, // Drawing at HT, won at FT
      'DD': 0, // Drawing at HT, drew at FT
      'DA': 0, // Drawing at HT, lost at FT
      'AH': 0, // Losing at HT, won at FT
      'AD': 0, // Losing at HT, drew at FT
      'AA': 0  // Losing at HT, lost at FT
    };
    
    data.forEach(match => {
      const key = match.HTR + match.FTR;
      if (htFtCounts[key] !== undefined) {
        htFtCounts[key] += 1;
      }
    });
    
    // Transform to array for charts
    const htFtArray = [
      { name: 'Leading at HT → Won', value: htFtCounts['HH'], color: '#4CAF50' },
      { name: 'Leading at HT → Drew', value: htFtCounts['HD'], color: '#FFC107' },
      { name: 'Leading at HT → Lost', value: htFtCounts['HA'], color: '#F44336' },
      { name: 'Drawing at HT → Won', value: htFtCounts['DH'], color: '#8BC34A' },
      { name: 'Drawing at HT → Drew', value: htFtCounts['DD'], color: '#FFD54F' },
      { name: 'Drawing at HT → Lost', value: htFtCounts['DA'], color: '#FF7043' },
      { name: 'Losing at HT → Won', value: htFtCounts['AH'], color: '#2196F3' },
      { name: 'Losing at HT → Drew', value: htFtCounts['AD'], color: '#03A9F4' },
      { name: 'Losing at HT → Lost', value: htFtCounts['AA'], color: '#EF5350' }
    ];
    
    return {
      raw: htFtCounts,
      chartData: htFtArray
    };
  };
  
  // Categorize matches
  const categorizeMatches = (data) => {
    const categories = {
      comebacks: [],
      collapses: [],
      goalFests: [],
      cleanSheets: [],
      draws: []
    };
    
    data.forEach((match, index) => {
      const totalGoals = match.FTHG + match.FTAG;
      const matchId = `${match.HomeTeam} ${match.FTHG}-${match.FTAG} ${match.AwayTeam}`;
      
      // Comebacks (losing at HT, won at FT)
      if ((match.HTR === 'A' && match.FTR === 'H') || (match.HTR === 'H' && match.FTR === 'A')) {
        categories.comebacks.push({ id: index, match: matchId });
      }
      
      // Collapses (winning at HT, lost at FT)
      if ((match.HTR === 'H' && match.FTR === 'A') || (match.HTR === 'A' && match.FTR === 'H')) {
        categories.collapses.push({ id: index, match: matchId });
      }
      
      // Goal fests (4+ goals)
      if (totalGoals >= 4) {
        categories.goalFests.push({ id: index, match: matchId });
      }
      
      // Clean sheets
      if (match.FTHG === 0 || match.FTAG === 0) {
        categories.cleanSheets.push({ id: index, match: matchId });
      }
      
      // Draws
      if (match.FTR === 'D') {
        categories.draws.push({ id: index, match: matchId });
      }
    });
    
    // Calculate summary stats for charts
    const categorySummary = [
      { name: 'Comebacks', value: categories.comebacks.length },
      { name: 'Collapses', value: categories.collapses.length },
      { name: 'Goal Fests', value: categories.goalFests.length },
      { name: 'Clean Sheets', value: categories.cleanSheets.length },
      { name: 'Draws', value: categories.draws.length }
    ];
    
    return {
      details: categories,
      summary: categorySummary
    };
  };
  
  // Calculate team-specific statistics
  const calculateTeamStats = (team) => {
    if (!team || !matchData.length) return null;
    
    const teamMatches = matchData.filter(match => 
      match.HomeTeam === team || match.AwayTeam === team
    );
    
    const stats = {
      played: teamMatches.length,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      cleanSheets: 0,
      htLeading: 0,
      htDrawing: 0,
      htLosing: 0,
      comebacks: 0,
      collapses: 0
    };
    
    teamMatches.forEach(match => {
      const isHome = match.HomeTeam === team;
      const teamGoals = isHome ? match.FTHG : match.FTAG;
      const opponentGoals = isHome ? match.FTAG : match.FTHG;
      const teamHtGoals = isHome ? match.HTHG : match.HTAG;
      const opponentHtGoals = isHome ? match.HTAG : match.HTHG;
      
      // Full time results
      if ((isHome && match.FTR === 'H') || (!isHome && match.FTR === 'A')) {
        stats.won++;
      } else if (match.FTR === 'D') {
        stats.drawn++;
      } else {
        stats.lost++;
      }
      
      // Goals
      stats.goalsFor += teamGoals;
      stats.goalsAgainst += opponentGoals;
      
      // Clean sheets
      if (opponentGoals === 0) {
        stats.cleanSheets++;
      }
      
      // Half time status
      if ((isHome && match.HTR === 'H') || (!isHome && match.HTR === 'A')) {
        stats.htLeading++;
      } else if (match.HTR === 'D') {
        stats.htDrawing++;
      } else {
        stats.htLosing++;
      }
      
      // Comebacks & Collapses
      const htWinning = (isHome && match.HTR === 'H') || (!isHome && match.HTR === 'A');
      const htLosing = (isHome && match.HTR === 'A') || (!isHome && match.HTR === 'H');
      const ftWon = (isHome && match.FTR === 'H') || (!isHome && match.FTR === 'A');
      const ftLost = (isHome && match.FTR === 'A') || (!isHome && match.FTR === 'H');
      
      if (htLosing && ftWon) {
        stats.comebacks++;
      }
      
      if (htWinning && ftLost) {
        stats.collapses++;
      }
    });
    
    return stats;
  };
  
  // Custom tab component
  const TabItem = ({ active, onClick, children }) => {
    return (
      <button
        className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
          active 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading football data...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Virtual Football Championship Analysis</h1>
      
      {/* Tabs */}
      <div className="mb-4 border-b">
        <div className="flex space-x-2">
          <TabItem active={activeTab === 0} onClick={() => setActiveTab(0)}>
            League Table
          </TabItem>
          <TabItem active={activeTab === 1} onClick={() => setActiveTab(1)}>
            Match Analysis
          </TabItem>
          <TabItem active={activeTab === 2} onClick={() => setActiveTab(2)}>
            Team Performance
          </TabItem>
        </div>
      </div>
      
      {/* Tab Panels */}
      <div className="mt-4">
        {/* League Table Panel */}
        {activeTab === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">League Table</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">Team</th>
                    <th className="py-2 px-4">P</th>
                    <th className="py-2 px-4">W</th>
                    <th className="py-2 px-4">D</th>
                    <th className="py-2 px-4">L</th>
                    <th className="py-2 px-4">GF</th>
                    <th className="py-2 px-4">GA</th>
                    <th className="py-2 px-4">GD</th>
                    <th className="py-2 px-4">Pts</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {leagueTable.map((team) => (
                    <tr key={team.team} className="border-b hover:bg-gray-100">
                      <td className="py-2 px-4">{team.position}</td>
                      <td className="py-2 px-4 font-medium">{team.team}</td>
                      <td className="py-2 px-4 text-center">{team.played}</td>
                      <td className="py-2 px-4 text-center">{team.won}</td>
                      <td className="py-2 px-4 text-center">{team.drawn}</td>
                      <td className="py-2 px-4 text-center">{team.lost}</td>
                      <td className="py-2 px-4 text-center">{team.goalsFor}</td>
                      <td className="py-2 px-4 text-center">{team.goalsAgainst}</td>
                      <td className="py-2 px-4 text-center">{team.goalDifference}</td>
                      <td className="py-2 px-4 text-center font-bold">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Points Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={leagueTable}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="team" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="points" fill="#8884d8" name="Points" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {/* Match Analysis Panel */}
        {activeTab === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Match Analysis</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-3">Half-Time to Full-Time Transitions</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={htFtAnalysis.chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        {htFtAnalysis.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  {htFtAnalysis.chartData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 mr-1 rounded-full" 
                        style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                      />
                      <span>{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-3">Match Categories</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={matchCategories.summary}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Featured Matches</h4>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="mb-2">
                      <strong>Comebacks</strong>
                      <ul className="list-disc pl-5 text-sm">
                        {matchCategories.details.comebacks.slice(0, 3).map((item) => (
                          <li key={item.id}>{item.match}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Goal Fests</strong>
                      <ul className="list-disc pl-5 text-sm">
                        {matchCategories.details.goalFests.slice(0, 3).map((item) => (
                          <li key={item.id}>{item.match}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Team Performance Panel */}
        {activeTab === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
            
            <div className="mb-6">
              <label className="block mb-2 font-medium">Select Team:</label>
              <select 
                className="w-full max-w-xs p-2 border rounded"
                value={selectedTeam || ''}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            {selectedTeam && (
              <>
                <div className="bg-white p-4 rounded shadow mb-6">
                  <h3 className="text-lg font-semibold mb-3">{selectedTeam} - Season Stats</h3>
                  
                  {(() => {
                    const stats = calculateTeamStats(selectedTeam);
                    if (!stats) return <div>No data available</div>;
                    
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-2xl font-bold">{stats.won}</div>
                          <div className="text-sm text-gray-600">Wins</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-2xl font-bold">{stats.drawn}</div>
                          <div className="text-sm text-gray-600">Draws</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-2xl font-bold">{stats.lost}</div>
                          <div className="text-sm text-gray-600">Losses</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-2xl font-bold">{stats.goalsFor}</div>
                          <div className="text-sm text-gray-600">Goals For</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-2xl font-bold">{stats.goalsAgainst}</div>
                          <div className="text-sm text-gray-600">Goals Against</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-2xl font-bold">{stats.cleanSheets}</div>
                          <div className="text-sm text-gray-600">Clean Sheets</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-2xl font-bold">{stats.comebacks}</div>
                          <div className="text-sm text-gray-600">Comebacks</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-2xl font-bold">{stats.collapses}</div>
                          <div className="text-sm text-gray-600">Collapses</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold mb-3">{selectedTeam} - Half-Time Performance</h3>
                  
                  {(() => {
                    const stats = calculateTeamStats(selectedTeam);
                    if (!stats) return <div>No data available</div>;
                    
                    const htData = [
                      { name: 'Leading', value: stats.htLeading },
                      { name: 'Drawing', value: stats.htDrawing },
                      { name: 'Losing', value: stats.htLosing }
                    ];
                    
                    return (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={htData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="#4CAF50" />
                              <Cell fill="#FFC107" />
                              <Cell fill="#F44336" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualFootballDashboard;   

""