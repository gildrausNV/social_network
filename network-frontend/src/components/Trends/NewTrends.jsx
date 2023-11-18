import { useContext, useEffect, useState } from 'react';
import useFetchData2 from '../../useFetchData2';
import { AuthContext } from '../../App';

const NewTrends = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const apiUrl = `http://localhost:8080/api/v1/topics${selectedOption}`;
    const user = useContext(AuthContext);
    const token = user.token;

    const { data, updateUrl, refetchDataParams, fetchDataNewUrl } = useFetchData2(apiUrl, null, token);
    useEffect(() => {
        alert(data.content.length);
    }, [data]);

    return ( 
        <div className="trends">
            {data && data.content.map((topic) => (
                <div>f</div>
            ))}
        </div>
     );
}
 
export default NewTrends;