import axios from "axios";

export default class AchievementService {
    f
    static async getAll(){
        const response =  axios.get(`http://localhost:3000/api/v1/achievements/`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response
    }

}
