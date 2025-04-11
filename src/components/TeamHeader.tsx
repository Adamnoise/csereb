import React from 'react';

interface TeamHeaderProps {
    team: {
        name: string;
        logoUrl?: string;
    };
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ team }) => {
    return (
        <div className='flex items-center justify-center gap-4'>
            <h2 className="text-xl font-bold mb-4">{team.name}</h2>
            {team.logoUrl && <img src={team.logoUrl} alt={`${team.name} Logo`} className="h-12 w-12" />}
        </div>
    );
};

export default TeamHeader;