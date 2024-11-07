<script setup lang="ts">
import { useSputnikApi } from './api/SputnikApi';
import SputnikLogo from './assets/SputnikWithName.svg';
import EventDescription from './components/EventDescription.vue';
import { City } from './types/City';
import { EventElement } from './types/EventElement';
import FuzzySearcher from './ui-components/FuzzySearcher.vue';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

type Props = {
    query?: Record<string, string>;
};

const props = defineProps<Props>();

const router = useRouter();

const sputnikApi = useSputnikApi();

const events = ref<EventElement[]>([]);
const foundEvents = ref<EventElement[]>([]);
const eventName = ref('');
const eventsAreLoading = ref(false);

const allCites = ref<City[]>([]);
const selectedCity = ref<City | null>(null);
const citiesAreLoading = ref(false);

const notFound = computed(() => {
    return !eventsAreLoading.value && foundEvents.value.length === 0 && (eventName.value || selectedCity.value);
});

const eventsListRef = ref<HTMLDivElement | null>(null);

function resetFilter() {
    eventName.value = '';
    selectedCity.value = null;
    foundEvents.value = events.value;
}

watch(
    () => selectedCity.value,
    (newValue) => {
        if (selectedCity.value === null) {
            router.push('/');
            return;
        }

        eventsAreLoading.value = true;

        router.push({ query: { city_id: String(newValue?.id) } });

        sputnikApi
            .getAllEvents(newValue?.id)
            .then((data) => (events.value = data))
            .finally(() => (eventsAreLoading.value = false));
    }
);

watch(
    () => eventName.value.length,
    () => {
        if (eventsListRef.value) {
            eventsListRef.value.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
);

watch(
    () => props.query,
    async () => {
        if (!allCites.value.length) {
            citiesAreLoading.value = true;
            allCites.value = await sputnikApi.getAllCities();
            citiesAreLoading.value = false;
        }

        if (props.query?.['city_id']) {
            const city_id = Number(props.query?.['city_id']);

            if (city_id === selectedCity.value?.id) {
                return;
            }

            selectedCity.value = allCites.value.find((city) => city.id === city_id) || null;
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="app-main">
        <header class="app-main-header">
            <sputnik-logo />
            <h1 class="app-main-header-text">Экскурсии по всему миру</h1>
        </header>

        <div class="app-main-searchers">
            <fuzzy-searcher
                v-model:found-items="foundEvents"
                v-model:prompt="eventName"
                :items="events"
                :item-key="'title'"
                :disabled="!selectedCity?.id"
                class="app-main-searcher"
                placeholder="Введите название экскурсии"
            />

            <fuzzy-searcher
                v-model:value="selectedCity"
                :is-loading="citiesAreLoading"
                :items="allCites"
                :item-key="'name'"
                class="app-main-searcher"
                with-select
                :placeholder="citiesAreLoading ? 'Загрузка городов...' : 'Выберите город'"
            />
        </div>

        <div v-if="notFound" class="app-main-not-found">
            <p>Поиск не дал результатов</p>
            <button class="app-main-reset-btn" @click="resetFilter">Сбросить фильтры</button>
        </div>

        <div v-if="eventsAreLoading" class="app-main-not-found">
            <p>Загрузка...</p>
        </div>

        <div v-else-if="selectedCity?.id" ref="eventsListRef" class="app-main-events">
            <event-description v-for="event in foundEvents" :key="event.id" :event="event" />
        </div>
    </div>
</template>

<style lang="scss">
@use './styles/colors';

.app-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
}

.app-main-header {
    margin: 50px 0;
    text-align: center;
}

.app-main-header-text {
    margin-top: 30px;
    font-size: 3rem;
    font-weight: bold;
}

.app-main-not-found {
    margin-top: 200px;
    font-size: 1.5rem;
    text-align: center;
}

.app-main-reset-btn {
    cursor: pointer;

    margin-top: 2rem;
    padding: 0.75rem 2.5rem;

    font-size: 14px;
    color: colors.$primary;

    background-color: colors.$button-blue;
    border-radius: 3px;
    box-shadow: none;

    transition: background-color 0.2s ease;

    &:hover {
        background-color: colors.$button-blue-hover;
    }
}

.app-main-searchers {
    display: flex;
    gap: 1.5rem;

    @media screen and (width < 1000px) {
        flex-direction: column;
    }
}

.app-main-searcher {
    width: 300px;
}

.app-main-events {
    overflow-y: auto;
    height: 60svh;
    margin-top: 90px;
    display: grid;
    grid-template-columns: repeat(3, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1rem;

    @media screen and (width > 2000px) {
        grid-template-columns: repeat(5, minmax(300px, 1fr));
        height: 70svh;
    }

    @media screen and (width < 1200px) {
        grid-template-columns: repeat(2, minmax(300px, 1fr));
    }

    @media screen and (width < 800px) {
        grid-template-columns: repeat(1, minmax(300px, 1fr));
    }
}
</style>
