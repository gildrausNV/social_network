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
    const { data: trends, updateUrl, refetchDataParams, fetchDataNewUrl } = useFetchData2(apiUrl, null, token);
    const { data: trendsGraphInfo, updateUrl: updateUrlTrendsGraph, refetchDataParams: refetchDataParamsTrendsGraph, fetchDataNewUrl: fetchDataNewUrlTrend } = useFetchData2(apiUrlTrendsInfo, null, token);

    // useEffect(() => {
    //     updateUrl(`http://localhost:8080/api/v1/trends${selectedOption}`);
    //     refetchDataParams(null);
    //     console.log(trends);
    // }, [selectedOption]);

    function handleNewUrl(option) {
        fetchDataNewUrl(`http://localhost:8080/api/v1/trends${option}`);
    }

    function handleNewTrendSelected(id) {
        setSelectedTrend(id);
        fetchDataNewUrlTrend(`http://localhost:8080/api/v1/posts/trends/${id}`);
    }

    return (
        <>
            <div className="trends">
                <h2>Trends</h2>
                <select value={selectedOption} onChange={(e) => handleNewUrl(e.target.value)}>
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
            </div>
            {trendsGraphInfo && selectedTrend && <div className="trend-graph-container">
                {trendsGraphInfo && <>Selected trend length: {trendsGraphInfo?.length}</>}
                {selectedTrend && <TrendGraph info={trendsGraphInfo} />}
            </div>}
        </>

    );
};

export default Trends;
