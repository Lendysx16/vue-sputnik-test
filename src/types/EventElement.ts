export interface EventElement {
    title: string;
    id: number;
    price: string;
    customers_review_rating: number;
    cover_photo: {
        big: string;
    };
    reviews: number;
    city_id: number;
}
