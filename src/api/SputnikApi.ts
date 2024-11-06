import { BASE_URL } from '../consts';
import { City } from '../types/City';

export default class SputnikApi {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        if (!baseUrl) {
            throw new Error('baseUrl is required');
        }
        this.baseUrl = baseUrl;
    }

    async getAllCities() {
        try {
            const response = await fetch(`${this.baseUrl}cities`);
            const raw: City[] = await response.json();

            return raw;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async getAllEvents() {
        try {
            const response = await fetch(`${this.baseUrl}products`);
            const raw = await response.json();

            return raw;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export const useSputnikApi = () => new SputnikApi(BASE_URL);
