import './Report.css';
import React, { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import useFetchData from '../../customHooks/useFetch';
import authContext from '../../AuthContext';
import useDeleteData from '../../customHooks/useDelete';

const Report = () => {
    const apiUrl = "http://localhost:8080/api/v1/reports";
    const user = useContext(authContext);
    const [currentPage, setCurrentPage] = useState(0);
    const { data: reports, updateParams, totalPages } = useFetchData(apiUrl, user.token, { size: 3, page: currentPage });

    const nextPage = () => {
        setCurrentPage((currentPage) => currentPage + 1);
        updateParams({ size: 3, page: currentPage + 1 });
    };

    const previousPage = () => {
        setCurrentPage((currentPage) => currentPage - 1);
        updateParams({ size: 3, page: currentPage - 1 });
    };

    const { deleteRequest } = useDeleteData();

    const deletePost = async (id) => {
        const url = "http://localhost:8080/api/v1/posts/" + id;
        deleteRequest(url, user.token);
        window.location.reload();
    };

    const dismissReport = async (id) => {
        const url = "http://localhost:8080/api/v1/reports/" + id;
        deleteRequest(url, user.token);
        window.location.reload();
    }

    return (
        <div className="report">
            <div className="page-buttons-container">
                <div className="page-buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={previousPage}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Content</TableCell>
                            <TableCell>Publisher</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Report</TableCell>
                            <TableCell>Dissmiss</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports && reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.reportedPost.content}</TableCell>
                                <TableCell>{report.reportedPost.creator.firstname} {report.reportedPost.creator.lastname}</TableCell>
                                <TableCell>{report.timestamp}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="error" onClick={() => deletePost()}>
                                        Delete
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="error" onClick={() => dismissReport()}>
                                        Dissmiss
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Report;