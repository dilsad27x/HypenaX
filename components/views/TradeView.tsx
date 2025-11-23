import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MARKET_DATA, CHART_DATA as MOCK_CHART_DATA } from '../../constants';
import { AppState } from '../../types';
import { ToonButton, ToonCard } from '../ui/ToonComponents';
import { 
  Search, Star, ArrowLeft, MoreHorizontal, 
  ArrowUp, ArrowDown, SlidersHorizontal, Flame, RefreshCcw, Loader2
} from 'lucide-react';

interface TradeViewProps {
  appState: AppState;
}

// Helper to format large numbers
const formatVolume = (num: number) => {
  if (!num) return '0';
  if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return '$' + (num / 1e3).toFixed(2) + 'K';
  return '$' + num.toFixed(2);
};

export const TradeView: React.FC<TradeViewProps> = ({ appState }) => {
  const [coins, setCoins] = useState<typeof MARKET_DATA>(MARKET_DATA);
  const [selectedCoin, setSelectedCoin] = useState<typeof MARKET_DATA[0] | null>(null);
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const [amountPercent, setAmountPercent] = useState<number>(0);
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapApiData = (data: any[]) => {
    return data.map((coin: any, index: number) => ({
      id: coin.id, // Store ID for chart queries
      rank: coin.market_cap_rank || index + 1,
      symbol: coin.symbol.toUpperCase(),
      pair: 'USDT',
      price: coin.current_price,
      change: parseFloat(coin.price_change_percentage_24h?.toFixed(2) || '0'),
      volume: formatVolume(coin.total_volume),
      name: coin.name,
      high: coin.high_24h,
      low: coin.low_24h,
      isNew: index > 45 // Mock 'New' tag for newer entires
    }));
  };

  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Updated RapidAPI Key
      const response = await fetch('https://coingecko-api-without-rate-limit.p.rapidapi.com/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'x-rapidapi-host': 'coingecko-api-without-rate-limit.p.rapidapi.com',
          'x-rapidapi-key': 'eee4736cf2134eb7b21afa218062a5de'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const mapped = mapApiData(data);
          setCoins(mapped);
          updateSelectedCoin(mapped);
          return; // Success
        }
      }
      
      throw new Error('RapidAPI failed');

    } catch (err) {
      console.warn("RapidAPI failed, trying public fallback...", err);
      
      // Fallback to public API
      try {
        const publicResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
        if (publicResponse.ok) {
          const data = await publicResponse.json();
          if (Array.isArray(data)) {
            const mapped = mapApiData(data);
            setCoins(mapped);
            updateSelectedCoin(mapped);
            return;
          }
        }
      } catch (fallbackErr) {
        console.error("All APIs failed", fallbackErr);
        setError("Using cached data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCoin]);

  const updateSelectedCoin = (newData: typeof MARKET_DATA) => {
    if (selectedCoin) {
      // Match by symbol or ID if possible
      const updated = newData.find(c => c.symbol === selectedCoin.symbol);
      if (updated) {
        setSelectedCoin(updated);
      }
    }
  };

  // Initial Fetch and Interval
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []); 

  // Reset scroll when opening details
  useEffect(() => {
    if (selectedCoin) {
      window.scrollTo(0, 0);
    }
  }, [selectedCoin]);

  if (selectedCoin) {
    return (
      <CoinDetailView 
        coin={selectedCoin} 
        onBack={() => setSelectedCoin(null)} 
        tradeTab={tradeTab}
        setTradeTab={setTradeTab}
        amountPercent={amountPercent}
        setAmountPercent={setAmountPercent}
        tradeAmount={tradeAmount}
        setTradeAmount={setTradeAmount}
        balance={appState.balance}
      />
    );
  }

  return (
    <MarketListView 
      coins={coins}
      onSelect={setSelectedCoin}
      onRefresh={fetchMarketData}
      isLoading={isLoading}
      error={error}
    />
  );
};

const MarketListView: React.FC<{ 
  coins: typeof MARKET_DATA, 
  onSelect: (coin: any) => void,
  onRefresh: () => void,
  isLoading: boolean,
  error: string | null
}> = ({ coins, onSelect, onRefresh, isLoading, error }) => {
  const [filter, setFilter] = useState('Hot');
  
  return (
    <div className="flex flex-col h-full bg-[#0B0B0D] -mx-4 -mt-2 px-4 pt-2 pb-24 min-h-screen">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search symbol (e.g. SOL/USDT)" 
          className="w-full bg-[#1C1C1E] text-white rounded-full py-3 pl-12 pr-4 text-sm border border-transparent focus:border-slate-600 outline-none placeholder-slate-600"
        />
      </div>

      {/* Sub Navigation */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar mb-4 pb-2 border-b border-slate-800 items-center">
        {['Favorites', 'Hot', 'Pre-Market', 'New', 'Gainers'].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`whitespace-nowrap text-sm font-bold pb-2 transition-colors relative ${
              filter === tab ? 'text-white' : 'text-slate-500'
            }`}
          >
            {tab}
            {filter === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-t-full" />
            )}
          </button>
        ))}
        <button onClick={onRefresh} className={`ml-auto pb-2 ${isLoading ? 'animate-spin text-white' : 'text-slate-500'}`}>
            <RefreshCcw size={16} />
        </button>
      </div>
      
      {error && (
        <div className="mb-2 text-xs text-red-400 text-center bg-red-500/10 py-1 rounded">
          Live update failed. Showing cached data.
        </div>
      )}

      {/* Column Headers */}
      <div className="flex justify-between text-xs text-slate-500 mb-2 px-2">
        <div className="w-[40%]">Trading Pairs / Vol</div>
        <div className="w-[30%] text-right">Price</div>
        <div className="w-[30%] text-right">24H Change</div>
      </div>

      {/* Market List */}
      <div className="flex flex-col gap-1">
        {coins.map((coin) => (
          <button 
            key={coin.symbol}
            onClick={() => onSelect(coin)}
            className="flex items-center justify-between py-3 px-2 hover:bg-[#1C1C1E] rounded-xl transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 w-[40%]">
              <span className={`text-sm font-bold w-4 ${coin.rank <= 3 ? 'text-[#F0B90B]' : 'text-slate-500'}`}>
                {coin.rank}
              </span>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-sm">{coin.symbol}</span>
                  <span className="text-slate-500 text-xs">/ {coin.pair}</span>
                  {coin.rank <= 3 && <Flame size={12} className="text-orange-500 fill-orange-500" />}
                  {coin.isNew && <span className="bg-slate-700 text-[10px] px-1 rounded text-white">New</span>}
                </div>
                <span className="text-slate-500 text-xs">{coin.volume}</span>
              </div>
            </div>

            <div className="w-[30%] text-right">
              <span className="text-white font-bold text-[15px]">{coin.price < 1 ? coin.price.toFixed(5) : coin.price.toLocaleString()}</span>
            </div>

            <div className="w-[30%] flex justify-end">
              <div className={`w-20 py-1.5 rounded-lg flex items-center justify-center text-xs font-bold ${
                coin.change >= 0 
                  ? 'bg-[#16C784] text-white' 
                  : 'bg-[#FF4D4F] text-white'
              }`}>
                {coin.change > 0 ? '+' : ''}{coin.change}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface CoinDetailProps {
  coin: typeof MARKET_DATA[0];
  onBack: () => void;
  tradeTab: 'buy' | 'sell';
  setTradeTab: (t: 'buy' | 'sell') => void;
  amountPercent: number;
  setAmountPercent: (p: number) => void;
  tradeAmount: string;
  setTradeAmount: (s: string) => void;
  balance: number;
}

const CoinDetailView: React.FC<CoinDetailProps> = ({ 
  coin, onBack, tradeTab, setTradeTab, amountPercent, setAmountPercent, tradeAmount, setTradeAmount, balance 
}) => {
  const [chartData, setChartData] = useState<any[]>(MOCK_CHART_DATA);
  const [timeframe, setTimeframe] = useState('1D');
  const [loadingChart, setLoadingChart] = useState(false);

  const isPositive = coin.change >= 0;
  const color = isPositive ? '#16C784' : '#FF4D4F';

  // Fetch Real Chart Data
  useEffect(() => {
    const fetchChart = async () => {
      // Need ID to fetch chart (e.g. "bitcoin")
      if (!coin.id) return;

      setLoadingChart(true);
      try {
        const daysMap: {[key: string]: string} = { '1D': '1', '7D': '7', '30D': '30' };
        const days = daysMap[timeframe] || '1';
        
        // Use RapidAPI with Updated Key
        const url = `https://coingecko-api-without-rate-limit.p.rapidapi.com/coins/${coin.id}/market_chart?vs_currency=usd&days=${days}`;
        const headers = {
           'Accept': 'application/json',
           'x-rapidapi-host': 'coingecko-api-without-rate-limit.p.rapidapi.com',
           'x-rapidapi-key': 'eee4736cf2134eb7b21afa218062a5de'
        };

        let res = await fetch(url, { headers });
        
        // Fallback logic if RapidAPI fails
        if (!res.ok) {
           res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${days}`);
        }

        if (res.ok) {
          const data = await res.json();
          if (data.prices) {
             const formatted = data.prices.map((p: number[]) => ({
                time: new Date(p[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                value: p[1]
             }));
             setChartData(formatted);
          }
        }
      } catch (e) {
        console.error("Chart fetch error", e);
        // Keep using mock data on error
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChart();
  }, [coin.id, timeframe]);

  return (
    <div className="flex flex-col h-full bg-[#0B0B0D] -mx-4 -mt-2 px-0 pb-0 min-h-screen z-50 fixed top-0 left-0 w-full overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 sticky top-0 bg-[#0B0B0D] z-20 border-b border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <div className="font-bold text-white text-lg">{coin.symbol} / {coin.pair}</div>
        </div>
        <button className="p-2 -mr-2 text-slate-400 hover:text-yellow-400">
          <Star size={24} />
        </button>
      </div>

      {/* Price Header */}
      <div className="px-4 py-4 flex justify-between items-end">
        <div>
          <div className={`text-4xl font-black ${isPositive ? 'text-[#16C784]' : 'text-[#FF4D4F]'}`}>
            {coin.price < 1 ? coin.price.toFixed(5) : coin.price.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-400 text-sm">≈ ${coin.price.toLocaleString()}</span>
            <span className={`text-sm font-bold flex items-center ${isPositive ? 'text-[#16C784]' : 'text-[#FF4D4F]'}`}>
              {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {Math.abs(coin.change)}%
            </span>
          </div>
        </div>
      </div>

      {/* Market Info Grid */}
      <div className="px-4 grid grid-cols-4 gap-2 mb-4">
        <div className="bg-[#1C1C1E] p-2 rounded-lg">
          <div className="text-[10px] text-slate-500">24h High</div>
          <div className="text-white text-xs font-bold">{coin.high ? coin.high.toLocaleString() : '--'}</div>
        </div>
        <div className="bg-[#1C1C1E] p-2 rounded-lg">
          <div className="text-[10px] text-slate-500">24h Low</div>
          <div className="text-white text-xs font-bold">{coin.low ? coin.low.toLocaleString() : '--'}</div>
        </div>
        <div className="bg-[#1C1C1E] p-2 rounded-lg">
          <div className="text-[10px] text-slate-500">24h Vol</div>
          <div className="text-white text-xs font-bold text-[10px] sm:text-xs truncate">{coin.volume}</div>
        </div>
        <div className="bg-[#1C1C1E] p-2 rounded-lg">
          <div className="text-[10px] text-slate-500">Cap</div>
          <div className="text-white text-xs font-bold">--</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full mb-4 relative group">
        <div className="absolute top-2 left-4 z-10 flex gap-2">
            {['1D', '7D', '30D'].map(tf => (
                <button 
                  key={tf} 
                  onClick={() => setTimeframe(tf)}
                  className={`text-xs font-bold px-2 py-1 rounded transition-colors ${timeframe === tf ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {tf}
                </button>
            ))}
            {loadingChart && <Loader2 size={16} className="animate-spin text-slate-500 ml-2" />}
        </div>
        <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={chartData}>
             <defs>
               <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                 <stop offset="95%" stopColor={color} stopOpacity={0}/>
               </linearGradient>
             </defs>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
             <YAxis domain={['auto', 'auto']} hide />
             <Tooltip 
                contentStyle={{ backgroundColor: '#1C1C1E', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ display: 'none' }}
                formatter={(value: number) => [value.toLocaleString(), 'Price']}
             />
             <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                fill="url(#colorGradient)" 
                animationDuration={500}
             />
           </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Orderbook Visual (Simplified) */}
      <div className="px-4 mb-32">
        <div className="flex gap-4 border-b border-slate-800 mb-2">
           <button className="pb-2 border-b-2 border-white text-white font-bold text-sm">Order Book</button>
           <button className="pb-2 text-slate-500 font-bold text-sm">Trades</button>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Bid</span>
            <span>Ask</span>
        </div>
        <div className="flex">
            <div className="w-1/2 pr-1">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex justify-between text-xs py-0.5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-full bg-[#16C784]/10" style={{width: `${Math.random() * 100}%`}} />
                        <span className="relative text-[#16C784] z-10">{(coin.price * (1 - i*0.001)).toFixed(4)}</span>
                        <span className="relative text-slate-300 z-10">{(Math.random() * 2).toFixed(3)}</span>
                    </div>
                ))}
            </div>
            <div className="w-1/2 pl-1">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex justify-between text-xs py-0.5 relative overflow-hidden">
                         <div className="absolute top-0 left-0 h-full bg-[#FF4D4F]/10" style={{width: `${Math.random() * 100}%`}} />
                        <span className="relative text-[#FF4D4F] z-10">{(coin.price * (1 + i*0.001)).toFixed(4)}</span>
                        <span className="relative text-slate-300 z-10">{(Math.random() * 2).toFixed(3)}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Bottom Trade Panel */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1C1C1E] rounded-t-3xl p-4 pb-8 border-t border-slate-700 shadow-2xl z-30">
         <div className="flex bg-[#0B0B0D] rounded-xl p-1 mb-4">
            <button 
                onClick={() => setTradeTab('buy')}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tradeTab === 'buy' ? 'bg-[#16C784] text-white shadow-lg' : 'text-slate-500'}`}
            >
                Buy
            </button>
            <button 
                onClick={() => setTradeTab('sell')}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tradeTab === 'sell' ? 'bg-[#FF4D4F] text-white shadow-lg' : 'text-slate-500'}`}
            >
                Sell
            </button>
         </div>

         <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-3">
                {/* Price Input */}
                <div className="bg-[#0B0B0D] rounded-xl px-3 py-2 border border-slate-700 focus-within:border-slate-500">
                    <label className="text-[10px] text-slate-500">Price ({coin.pair})</label>
                    <input 
                        type="number" 
                        value={coin.price} 
                        readOnly 
                        className="w-full bg-transparent text-white font-bold outline-none"
                    />
                </div>
                {/* Amount Input */}
                <div className="bg-[#0B0B0D] rounded-xl px-3 py-2 border border-slate-700 focus-within:border-slate-500">
                    <label className="text-[10px] text-slate-500">Amount ({coin.symbol})</label>
                    <input 
                        type="number" 
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent text-white font-bold outline-none"
                    />
                </div>
                {/* Percent Slider/Buttons */}
                <div className="flex justify-between gap-1">
                    {[25, 50, 75, 100].map(pct => (
                        <button 
                            key={pct}
                            onClick={() => setAmountPercent(pct)}
                            className={`flex-1 text-[10px] py-1 rounded bg-slate-800 ${amountPercent === pct ? 'text-white bg-slate-600' : 'text-slate-500'}`}
                        >
                            {pct}%
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-[40%] flex flex-col justify-between">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500">Available</span>
                    <span className="text-xs font-bold text-white">{balance.toFixed(2)} {coin.pair}</span>
                </div>
                
                <ToonButton 
                    className={`w-full !py-4 text-lg shadow-none ${tradeTab === 'buy' ? '!bg-[#16C784] hover:!bg-[#10b981]' : '!bg-[#FF4D4F] hover:!bg-[#ef4444]'}`}
                >
                    {tradeTab === 'buy' ? 'Buy' : 'Sell'} <br/> {coin.symbol}
                </ToonButton>
            </div>
         </div>
      </div>

    </div>
  );
};
