import React, { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import './Notifications.css';
import useFetchData from '../../customHooks/useFetch';
import authContext from '../../AuthContext';

const Notifications = () => {
    const apiUrl = "http://localhost:8080/api/v1/notifications";
    const user = useContext(authContext);
    const [currentPage, setCurrentPage] = useState(0);
    const { data: notificationsData, updateParams, totalPages } = useFetchData(apiUrl, user.token, { size: 3, page: currentPage });

    const nextPage = () => {
        setCurrentPage((currentPage) => currentPage + 1);
        updateParams({ size: 3, page: currentPage + 1 });
    };

    const previousPage = () => {
        setCurrentPage((currentPage) => currentPage - 1);
        updateParams({ size: 3, page: currentPage - 1 });
    };
    
    return (
        <div className="notifications">
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notificationsData && notificationsData.map((notification) => (
                            <TableRow key={notification.id}>
                                <TableCell>{notification.content}</TableCell>
                                <TableCell>{notification.publisher.firstname} {notification.publisher.lastname}</TableCell>
                                <TableCell>{notification.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Notifications;
