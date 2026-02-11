import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTrophy, FaSearch } from "react-icons/fa";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import DashboardLayout from "../components/layouts/DashboardLayout";
import LoadingState from "../components/ui/LoadingState";
import PodiumCard from "../components/ui/PodiumCard"; 
import PlayerBadge from "../components/ui/PlayerBadge"; 
import type { UserProfile } from '../models/User';

interface RankedUser extends UserProfile {
    rank: number;
    points: number;
    trend: 'up' | 'down' | 'stable';
}

const Ranking = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [rankingData, setRankingData] = useState<RankedUser[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchRanking = async () => {
             setIsLoading(true);
             await new Promise(resolve => setTimeout(resolve, 800)); 
 
             const mockRanking: RankedUser[] = Array.from({ length: 15 }).map((_, i) => ({
                 id: i + 1,
                 username: i === 0 ? "TheKing" : i === 1 ? "NexusMaster" : i === 5 ? "Miriam" : i === 3 ? "Name14CharsMax" : `Player_${i + 1}`,
                 avatar: i < 6 ? `/assets/avatars/${['wizard', 'warrior', 'sorceress', 'dragon', 'rogue', 'queen'][i]}.png` : "",
                 email: "test@test.com",
                 status: 'online',
                 stats: { wins: 100 - i * 2, losses: i, gamesPlayed: 100, winRate: 0 },
                 rank: i + 1,
                 points: 2500 - (i * 100),
                 trend: i % 3 === 0 ? 'up' : i % 2 === 0 ? 'down' : 'stable'
             }));
 
             setRankingData(mockRanking);
             setIsLoading(false);
         };
         fetchRanking();
    }, []);

    const topThree = rankingData.slice(0, 3);
    const restOfPlayers = rankingData.slice(3).filter(player => 
        player.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <DashboardLayout isCentered={true}><LoadingState message={t('common.loading')} /></DashboardLayout>;

    return (
        <DashboardLayout isCentered={false}>
            <div className="max-w-5xl mx-auto w-full animate-fade-in-up pb-2">
                
                {/* HEADER */}
                <div className="mb-10 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <FaTrophy className="text-brand-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" /> 
                        <span className="text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-2">
                            {t('ranking.title')}
                        </span>
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto">{t('ranking.subtitle')}</p>
                </div>

                {/* PODIUM SECTION */}
                <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-1 md:gap-4 mb-12 w-full">
					{/* 1ST PLACE */}
                    {/* MÓVIL: Orden 1 (Arriba), Ancho 100%. TABLET/PC: Orden 2 (Centro) */}
                    <div className="order-1 md:order-2 w-full md:w-1/3 flex justify-center z-10">
                        {topThree[0] && <PodiumCard player={topThree[0]} place={1} delay="0ms" isWinner />}
                    </div>

                    {/* 2ND PLACE */}
                    {/* MOBILE:  MÓVIL: Orden 2 (debajo del 1º), Ancho 100% (w-full). TABLET/PC: Orden 1 (Izq), Ancho Auto */}
                    <div className="order-2 md:order-1 w-full md:w-1/3 flex justify-center">
                        {topThree[1] && <PodiumCard player={topThree[1]} place={2} delay="100ms" />}
                    </div>
                                        
                    {/* 3RD PLACE */}
                    {/* MÓVIL: Orden 3 (Abajo), Ancho 100%. TABLET/PC: Orden 3 (Der) */}
                    <div className="order-3 md:order-3 w-full md:w-1/3 flex justify-center">
                        {topThree[2] && <PodiumCard player={topThree[2]} place={3} delay="200ms" />}
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="glass-panel p-4 mb-6 flex items-center gap-3">
                    <FaSearch className="text-slate-500 ml-2" />
                    <input 
                        type="text" 
                        placeholder={t('ranking.search_player')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 w-full outline-none"
                    />
                </div>

                {/* --- MOBILE VIEW (CARDS 2 LÍNEAS) --- */}
                <div className="grid gap-3 lg:hidden">
                    {restOfPlayers.map((player) => (
                        <div key={player.id} className={`glass-panel p-4 relative overflow-hidden ${player.username === "Miriam" ? "border-brand-500/50 bg-brand-500/5" : ""}`}>
                            
                            {/* LÍNEA 1: Posición + Usuario */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="font-mono text-xl font-bold text-slate-500 w-8 text-center shrink-0">
                                    #{player.rank}
                                </div>
                                <div className="flex-1">
                                    <PlayerBadge 
                                        avatar={player.avatar} 
                                        username={player.username} 
                                        isCurrentUser={player.username === "Miriam"}
                                        className="justify-start! [&>div:first-child]:w-auto [&>div:first-child]:pr-3 [&>div:last-child]:w-auto [&>div:last-child]:pl-3" 
                                    />
                                </div>
                            </div>

                            {/* Separador */}
                            <div className="h-px bg-white/5 w-full mb-3"></div>

                            {/* LÍNEA 2: Datos */}
                            <div className="flex justify-between items-center px-2">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span>{t('profile.wins')}: <span className="text-white font-bold">{player.stats.wins}</span></span>
                                    
                                    <div className="flex items-center gap-1 ml-2 bg-black/20 px-2 py-1 rounded">
                                        {player.trend === 'up' && <HiTrendingUp className="text-success" />}
                                        {player.trend === 'down' && <HiTrendingDown className="text-danger" />}
                                        {player.trend === 'stable' && <span>-</span>}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-xs text-slate-500 block">{t('ranking.points')}</span>
                                    <span className="text-white font-mono font-bold text-lg tracking-wider">
                                        {player.points}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden lg:block glass-panel overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4 text-center w-16">#</th>
                                <th className="px-6 py-4 text-center">{t('common.username')}</th>
                                <th className="px-6 py-4 text-center w-44">{t('ranking.trend')}</th>
                                <th className="px-6 py-4 text-center w-44">{t('profile.wins')}</th>
                                <th className="px-6 py-4 text-right w-48">{t('ranking.points')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {restOfPlayers.map((player) => (
                                <tr key={player.id} className={`hover:bg-white/5 transition-colors group ${player.username === "Miriam" ? "bg-brand-500/10" : ""}`}>
                                    <td className="px-6 py-4 text-center font-mono font-bold text-slate-500 group-hover:text-white transition-colors">{player.rank}</td>
                                    <td className="px-6 py-4">
                                        <PlayerBadge 
                                            avatar={player.avatar} 
                                            username={player.username} 
                                            isCurrentUser={player.username === "Miriam"} 
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {player.trend === 'up' && <HiTrendingUp className="inline text-success text-xl" />}
                                        {player.trend === 'down' && <HiTrendingDown className="inline text-danger text-xl" />}
                                        {player.trend === 'stable' && <span className="text-slate-600">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-300">{player.stats.wins}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-white tracking-wider">{player.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {restOfPlayers.length === 0 && <div className="p-8 text-center text-slate-500">{t('ranking.no_results')}</div>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Ranking;