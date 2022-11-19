import axios from "axios";

export default class WorkerAchievementService {
    static async getActiveForUser(id){
        const response =  axios.get(`http://localhost:3000/api/v1/worker_achievements?id=${id}&isActive=true`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response
    }


    static async createAch(ach){
        const response =  axios.post(`http://localhost:3000/api/v1/worker_achievements`,
            {
                ach
            },
            {
                headers:
                    {
                        'Content-Type': 'application/json',
                        'authorization': localStorage.getItem('token')
                    }
            });

        return response
    }

}
