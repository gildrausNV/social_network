import './Topics.css';
import {
    Chart as ChartJS,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import { CategoryScale } from 'chart.js';
ChartJS.register(LinearScale, LineElement, PointElement, Title, Tooltip, Legend, CategoryScale);


const TrendGraph = ({ info }) => {
    const [data, setData] = useState();

    function formatDate(date) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }
    console.log(info);


    useEffect(() => {
        if (info != null) {
            const firstPostTime = new Date(info[0].timePosted);
            const lastPostTime = new Date(info[info.length - 1].timePosted);
            const timeInterval = (lastPostTime - firstPostTime) / 4;

            const labels = Array.from({ length: 5 }, (_, index) => {
                const intervalStartTime = new Date(firstPostTime.getTime() + index * timeInterval);
                return formatDate(intervalStartTime);
            });

            let cumulativeSum = 0;
            const numberOfPosts = labels.map((label, index) => {
                const startTime = new Date(firstPostTime.getTime() + index * timeInterval);
                const endTime = new Date(startTime.getTime() + timeInterval);

                const postsWithinInterval = info.filter(post => {
                    const postTime = new Date(post.timePosted);
                    return postTime >= startTime && postTime < endTime;
                });

                cumulativeSum += postsWithinInterval.length;
                return cumulativeSum;
            });

            setData({
                labels,
                datasets: [{
                    label: 'Cumulative Number of Posts',
                    data: numberOfPosts,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    pointBorderColor: 'blue'
                }]
            });
        }
    }, [info]);

    return (
        <div className="trend-graph">
            {data && <Line data={data} />}
        </div>
    );
}

export default TrendGraph;