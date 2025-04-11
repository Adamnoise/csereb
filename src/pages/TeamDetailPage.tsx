import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as dataService from '../services/dataService';
import { getTeamById } from '../services/teamService'
import TeamHeader from '../components/TeamHeader';
import MatchList from '../components/MatchList';
import StatsTable from '../components/StatsTable';

const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMatches, setTeamMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);

  // Custom tab component
  const TabItem: React.FC<{ index: number, label: string }> = ({ index, label }) => (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
        activeTab === index
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      onClick={() => setActiveTab(index)}
    >
      {label}
    </button>
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const teamData = await getTeamById(teamId);
        setTeam(teamData);
        const allMatchesData = await dataService.fetchMatchData();
        setAllMatches(allMatchesData);
        const matchesData = await dataService.getTeamMatches(teamId,allMatchesData);
        setTeamMatches(matchesData);
      } catch (err) {
        setError('Failed to load team data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId]);

  const calculateTeamStats = () => {
    if (!teamMatches.length) return null;

    let wins = 0;
    let losses = 0;
    let draws = 0;
    teamMatches.forEach(match => {
      if ((match.homeTeam === team.name && match.homeFullTimeScore > match.awayFullTimeScore) || (match.awayTeam === team.name && match.awayFullTimeScore > match.homeFullTimeScore)) wins++;
      else if ((match.homeTeam === team.name && match.homeFullTimeScore < match.awayFullTimeScore) || (match.awayTeam === team.name && match.awayFullTimeScore < match.homeFullTimeScore)) losses++;
      else draws++;
    });

    return { wins, losses, draws };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Team Detail Page - {teamId}</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && team && (
        <>
        <div className="mb-4 border-b">
            <div className="flex space-x-2">
              <TabItem index={0} label="Overview" />
              <TabItem index={1} label="Matches" />
              <TabItem index={2} label="Analysis" />
            </div>
        </div>

        <div className="mt-4">
          {activeTab === 0 && <TeamHeader team={team} />}
          {activeTab === 1 && (
            <MatchList teamName={team.name} matches={teamMatches} />
          )}
          {activeTab === 2 && (
            <StatsTable
              teamName={team.name}
              matches={teamMatches}
              wins={calculateTeamStats()?.wins}
              losses={calculateTeamStats()?.losses}
              draws={calculateTeamStats()?.draws}
            />
          )}
          </div>
          
        </>
      )}
    </div>
  );
};

export default TeamDetailPage;