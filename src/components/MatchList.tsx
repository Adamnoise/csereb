import React from "react";

interface Match {
  matchday: number;
  homeTeam: string;
  awayTeam: string;
  homeFullTimeScore: number;
  awayFullTimeScore: number;
}

interface MatchListProps {
  teamName: string;
  matches: Match[];
}

const MatchList: React.FC<MatchListProps> = ({ teamName, matches }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Matches for {teamName}</h3>
      {matches.length > 0 ? (
        <ul className="space-y-2">
          {matches.map((match, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded">
              <p className="text-sm">
                {match.matchday} -{" "}
                <span
                  className={match.homeTeam === teamName ? "font-bold" : ""}
                >
                  {match.homeTeam}{" "}
                </span>{" "}
                {match.homeFullTimeScore} - {match.awayFullTimeScore}{" "}
                <span
                  className={match.awayTeam === teamName ? "font-bold" : ""}
                >
                  {match.awayTeam}{" "}
                </span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches found for {teamName}.</p>
      )}
    </div>
  );
};

export default MatchList;