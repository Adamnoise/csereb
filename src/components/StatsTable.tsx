import React from 'react';

interface StatsTableProps {
  wins: number;
  losses: number;
  draws: number;
}

const StatsTable: React.FC<StatsTableProps> = ({ wins, losses, draws }) => { 
  return (
   <div className="overflow-x-auto">
   <table className="min-w-full bg-white">
     <thead>
       <tr className="bg-gray-800 text-white">
         <th className="py-2 px-4 text-left">Wins</th>
         <th className="py-2 px-4 text-left">Losses</th>
         <th className="py-2 px-4 text-left">Draws</th>
       </tr>
     </thead>
     <tbody className="text-gray-700">
       <tr>
         <td className='py-2 px-4'>{wins}</td>
         <td className='py-2 px-4'>{losses}</td>
         <td className='py-2 px-4'>{draws}</td>
       </tr>
     </tbody>
   </table>
 </div>
  );
};

export default StatsTable;
