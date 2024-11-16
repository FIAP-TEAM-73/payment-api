import { IIntegration } from "../interfaces/IIntegration";
import axios from 'axios';

interface Response<T> {
    data: T
    status: number
    statusText: string
    headers: Record<string, unknown>
    config: any
}

const REDIRECTION = 300
const SERVER_ERROR = 599

export default class AxiosIntegration implements IIntegration {

    private readonly instance;

    constructor(baseURL: string) {
        this.instance = axios.create({ baseURL })
    }

    async post(endpoint: string, body: unknown, headers: Record<string, unknown>): Promise<unknown> {
        const response = await this.instance.post(endpoint, body, { headers });
        return this.handleResponse(response)
    }

    private handleResponse<T>({ data, status }: Response<T>): T {
        if (status >= REDIRECTION && status <= SERVER_ERROR ) {
            const message = `Integration error. Status: ${status}. Data: ${JSON.stringify(data)}`
            console.error(message)
            throw new Error(message)
        }
        return data
    }

    async put(endpoint: string, body: unknown, headers: Record<string, unknown>): Promise<unknown> {
        const response = await this.instance.post(endpoint, body, { headers })
        return this.handleResponse(response)
    }

    async get(endpoint: string, headers: Record<string, unknown>): Promise<unknown> {
        const response = await this.instance.post(endpoint, { headers })
        return this.handleResponse(response)
    }
}