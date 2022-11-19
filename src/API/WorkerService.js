import axios from "axios";

export default class WorkerService {
    static async getAll() {
        const response = axios.get(`http://localhost:3000/api/v1/workers/`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response
    }

    static async getByMangerId(id) {
        const response = axios.get(`http://localhost:3000/api/v1/workers?manager_id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response
    }

    static async deactiveAchsForWorker(id) {
        const response = axios.get(`http://localhost:3000/api/v1/workers/deactivate_achievements?id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        });
        return response

    }
}
