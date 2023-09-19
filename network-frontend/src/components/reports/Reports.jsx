import axios from 'axios';
import './Reports.css';
import { useEffect } from 'react';
import { useState } from 'react';
import usePostData from '../../usePostData';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const getReports = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/v1/reports",
                    {
                        params: {
                            size: 4,
                            page: currentPage,
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setReports(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Login failed:", error);
                throw error;
            }
        };
        getReports();

    }, [currentPage]);

    const deletePost = async (id) => {
        try {
            const response = await axios.delete('http://localhost:8080/api/v1/posts/' + id, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            setReports(reports.filter((report) => report.id != id))
        } catch (error) {
            console.error('Post failed:', error);
            throw error;
        }
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
        try {
            const response = await axios.delete('http://localhost:8080/api/v1/reports/' + id, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            setReports(reports.filter((report) => report.id != id))
        } catch (error) {
            console.error('Post failed:', error);
            throw error;
        }
    }
    console.log(reports)

    const nextPage = () => {
        setCurrentPage((currentPage) => currentPage + 1);
    };

    const previousPage = () => {
        setCurrentPage((currentPage) => currentPage - 1);
    };

    return (
        <div className="reports">
            <div className="pagination">
                <button
                    onClick={previousPage}
                    disabled={currentPage === 0}
                    className="pagination-button"
                >
                    Previous
                </button>
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
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
                    {reports && reports.map((report, index) => (
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