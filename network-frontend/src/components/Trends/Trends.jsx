import { useContext, useEffect, useState } from 'react';
import useFetchData2 from '../../useFetchData2';
import './Trends.css';
import { AuthContext } from '../../App';
import TrendGraph from './TrendGraph';

const Trends = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedTrend, setSelectedTrend] = useState('');
    const apiUrl = `http://localhost:8080/api/v1/trends${selectedOption}`;
    const apiUrlTrendsInfo = `http://localhost:8080/api/v1/posts/trends/${selectedTrend}`;
    const user = useContext(AuthContext);
    const token = user.token;
    const [info, setInfo] = useState([]);
    const { data: trends, updateUrl, refetchDataParams } = useFetchData2(apiUrl, null, token);
    const { data: trendsGraphInfo, updateUrl: updateUrlTrendsGraph, refetchDataParams: refetchDataParamsTrendsGraph } = useFetchData2(apiUrlTrendsInfo, null, token);

    useEffect(() => {
        updateUrl(apiUrl);
        refetchDataParams(null);
        console.log(apiUrl);
    }, [selectedOption]);

    function handleNewTrendSelected(id) {
        setSelectedTrend(id);
        updateUrlTrendsGraph(apiUrlTrendsInfo);
        refetchDataParamsTrendsGraph(null);
        console.log(apiUrlTrendsInfo);
        console.log(trendsGraphInfo);
    }

    return (
        <div className="trends">
            <h2>Trends</h2>
            <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                <option value="">All time</option>
                <option value="/thisMonth">This month</option>
                <option value="/thisWeek">This week</option>
                <option value="/today">Today</option>
            </select>
            {trends && trends?.map((trend, position) => (
                <div
                    className={`trend ${trend.id === selectedTrend ? 'selected' : ''}`}
                    key={trend?.id}
                    onClick={() => handleNewTrendSelected(trend?.id)}
                >
                    {position + 1}. {trend?.topic} {trend?.numberOfPosts}
                </div>
            ))}
            Selected trend length: {trendsGraphInfo?.length}
            {selectedTrend && <TrendGraph info={trendsGraphInfo} />}
        </div>
    );
};

export default Trends;
