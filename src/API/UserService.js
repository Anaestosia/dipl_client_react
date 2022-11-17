import axios from "axios";

export default class UserService {
f
    static async getUser(id){
        const response =  axios.get(`http://localhost:3000/api/v1/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response
    }

}
