import axios from "axios";

export default class PremiumForScoreService {
    static async getMinimalPremium(){
        const response =  axios.get(`http://localhost:3000/api/v1/premium_for_scores/minimal_premium`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response
    }

}
