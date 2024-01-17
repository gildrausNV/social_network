import './Chat.css';

const UsersOnline = ({ connectedUsers, setUserToChat }) => {
    return (
        <div className="users-online">
            {connectedUsers && connectedUsers.map((user) => (
                <div className="user" onClick={() => setUserToChat(user)} key={user.id}>
                    {user.firstname} {user.lastname}
                </div>
            ))}
        </div>
    );
}

export default UsersOnline;