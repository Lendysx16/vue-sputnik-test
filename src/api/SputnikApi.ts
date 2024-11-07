import { BASE_URL } from '../consts';
import { City } from '../types/City';
import { EventElement } from '../types/EventElement';

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

    async getAllEvents(city_id?: number) {
        try {
            const response = await fetch(`${this.baseUrl}products?${city_id ? `city_id=${city_id}` : ''}`);
            const raw: EventElement[] = await response.json();

            return raw;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export const useSputnikApi = () => new SputnikApi(BASE_URL);
