import axios from 'axios';
import './Reports.css';
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import usePostData from '../../usePostData';
import useDeleteData from '../../useDeleteData';
import useFetchData2 from '../../useFetchData2';
import { AuthContext } from '../../App';

const Reports = () => {
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const apiUrl = "http://localhost:8080/api/v1/reports";
    const user = useContext(AuthContext);
    const token = user.token;

    const { data: reports, loading, error } = useFetchData2(apiUrl, null, token);

    const { deleteRequest } = useDeleteData();


    const deletePost = async (id) => {
        const url = "http://localhost:8080/api/v1/posts/" + id;
        deleteRequest(url, localStorage.getItem("token"));
        window.location.reload();
    };

    function calculateTimeAgo(givenDate) {
        const currentDate = new Date();
        const givenDateTime = new Date(givenDate);

        if (!isNaN(givenDateTime)) {
            const timeDifference = currentDate - givenDateTime;
            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                return `${days} day${days !== 1 ? 's' : ''} ago`;
            } else if (hours > 0) {
                return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
            } else if (minutes > 0) {
                return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            } else {
                return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
            }
        } else {
            return "Invalid date";
        }
    }

    const dismissReport = async (id) => {
        const url = "http://localhost:8080/api/v1/reports/" + id;
        deleteRequest(url, localStorage.getItem("token"));
        window.location.reload();
    }

    return (
        <div className="reports">
            <table className="reports-table">
                <thead>
                    <tr>
                        <th>Reported by</th>
                        <th>Post</th>
                        <th>Reported</th>
                        <th>Delete post</th>
                        <th>Dismiss</th>
                    </tr>
                </thead>
                <tbody>
                    {reports && reports.content.map((report, index) => (
                        <tr key={index} className="report-row">
                            <td>{report.reporter.username}</td>
                            <td>{report.reportedPost.creator.username}: {report.reportedPost.content}</td>
                            <td>{calculateTimeAgo(report.timestamp)}</td>
                            <td><button onClick={() => deletePost(report.reportedPost.id)} className='delete-btn'>Delete post</button></td>
                            <td><button onClick={() => dismissReport(report.id)} className='delete-btn'>Dismiss</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default Reports;