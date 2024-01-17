import { useNavigate } from 'react-router-dom';
import userIcon from '../../icons/user (1).png';
import { Typography, Avatar, Paper, Grid, Button } from '@mui/material';

const UserDetails = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className='user-details'>
            <Paper elevation={3} className="user-info-paper">
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        {/* <Avatar alt="User Icon" src={data.icon || userIcon} /> */}
                        <img src={userIcon} alt="" className='user-icon' />
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" component="div">
                            {`${user.firstname} ${user.lastname}`}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {`@${user.username}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {user.email}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="primary" onClick={() => navigate('/profile/' + user.id)}>
                            View profile
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default UserDetails;