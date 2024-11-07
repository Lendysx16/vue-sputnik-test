<script setup lang="ts">
import RatingStar from '../assets/RatingStar.svg';
import { EventElement } from '../types/EventElement';

type Props = {
    event: EventElement;
};

defineProps<Props>();
</script>

<template>
    <div class="event-description">
        <img lazy :src="event.cover_photo.big" class="event-description-photo" />

        <div>
            <div class="event-description-ratiing">
                <rating-star />
                <div>
                    <span>
                        {{ String(event.customers_review_rating).replace('.', ',') }}
                    </span>
                    <span class="event-description-ratiing-count">({{ event.reviews }})</span>
                </div>
            </div>

            <h3 class="event-description-tittle">{{ event.title }}</h3>
        </div>

        <div class="event-description-price">
            <span class="event-description-price-rub">От {{ event.price }}</span>
            <span class="event-description-price-text">за экскурсию </span>
        </div>
    </div>
</template>

<style lang="scss">
@use '../styles/colors.scss';

.event-description {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;

    max-width: 345px;
}

.event-description-photo {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
}

.event-description-ratiing {
    display: flex;
    gap: 3px;
    align-items: center;
    font-size: 14px;
}

.event-description-tittle {
    font-weight: bold;
    line-height: 1.5;
}

.event-description-ratiing-count {
    margin-left: 3px;
    font-size: 12px;
    color: colors.$text-accent;
}

.event-description-price {
    display: flex;
    flex-direction: column;
}
.event-description-price-rub {
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 32px;
}

.event-description-price-text {
    color: colors.$text-accent;
    font-size: 0.75rem;
}
</style>
