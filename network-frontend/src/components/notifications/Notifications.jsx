import { useContext, useEffect, useState } from 'react';
import './Notifications.css';
import useFetchData2 from '../../useFetchData2';
import { AuthContext } from '../../App';
import usePostData from '../../usePostData';

const Notifications = ({ setNewNotification }) => {
    // const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const { postDataRequest } = usePostData();

    const apiUrl = "http://localhost:8080/api/v1/notifications";
    const user = useContext(AuthContext);
    const token = user.token;

    const { data: notifications, totalPages, loading, error, refetchDataParams } = useFetchData2(apiUrl, {
        size: 5,
        page: currentPage
    }, token);
    console.log(notifications)

    useEffect(() => { setNewNotification(false) }, [])

    useEffect(() => {
        refetchDataParams({
            size: 5,
            page: currentPage
        });
    }, [currentPage]);

    const nextPage = () => {
        setCurrentPage((currentPage) => currentPage + 1);
    };

    const previousPage = () => {
        setCurrentPage((currentPage) => currentPage - 1);
    };

    const read = (id) => {
        const apiReadNotification = "http://localhost:8080/api/v1/notifications/" + id;
        postDataRequest(apiReadNotification, null, token);
        refetchDataParams({
            size: 5,
            page: currentPage
        });
    }

    return (
        <div className="notifications">
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
            {notifications?.content.map((notification) => (
                <div className={`notification ${notification.isRead ? '' : 'unread'}`} onClick={() => read(notification.id)}>
                    {notification.content}
                </div>
            ))}
        </div>
    );
}

export default Notifications;