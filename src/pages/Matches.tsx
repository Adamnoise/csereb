import React, { useState, useEffect } from "react";
import { fetchMatchData } from "@/services/dataService";
import { Match } from "@/types";

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMatches = async () => {
      try {
        setLoading(true);
        const data = await fetchMatchData();
        setMatches(data);
      } catch (err) {
        setError("Failed to fetch matches.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMatches();
  }, []);

  if (loading) {
    return <div>Loading matches...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Matches</h1>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            {match.HomeTeam} vs {match.AwayTeam}: {match.FTHG} - {match.FTAG}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Matches;