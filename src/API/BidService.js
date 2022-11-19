import axios from "axios";

export default class BidService {
    static async getAll(){
        const response =  axios.get(`http://localhost:3000/api/v1/bids`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response
    }

    static async create(bid){
        const response =  axios.post(`http://localhost:3000/api/v1/bids`,
            {
                bid
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

    static async applyBid(id){
        const response =  axios.get(`http://localhost:3000/api/v1/bids/apply?id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response
    }

    static async rejectBid(id){
        const response =  axios.get(`http://localhost:3000/api/v1/bids/reject?id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response
    }

}
