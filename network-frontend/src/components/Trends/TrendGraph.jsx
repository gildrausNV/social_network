import './Trends.css';
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
import Chart from 'chart.js/auto';

ChartJS.register(
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const TrendGraph = ({ info }) => {
    const [data, setData] = useState();

    function formatDate(date) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

    useEffect(() => {
        if (info != null && info.length > 0) { // Check if there's at least one post
            if (info.length === 1) {
                // Handle the case where there's only one post
                const postTime = new Date(info[0].timePosted);
                const currentTime = new Date();

                const labels = [formatDate(postTime), formatDate(currentTime)];
                const numberOfPosts = [1, 1]; // A straight line from 1 to 1

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
            } else {
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
        } else {
            // Handle the case where there's no data
            setData(null);
        }
    }, [info]);

    return (
        <div className="trend-graph">
            {data ? <Line data={data} /> : <p>No data available</p>}
        </div>
    );
}

export default TrendGraph;
