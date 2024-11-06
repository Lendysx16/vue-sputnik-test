<script setup lang="ts">
import { useSputnikApi } from './api/SputnikApi';
import SputnikLogo from './assets/SputnikWithName.svg';
import { City } from './types/City';
import { EventElement } from './types/EventElement';
import FuzzySearcher from './ui-components/FuzzySearcher.vue';
import { computed, onMounted, ref, watch } from 'vue';

const sputnikApi = useSputnikApi();

const events = ref<EventElement[]>([]);
const foundEvents = ref<EventElement[]>([]);
const eventName = ref('');
const eventsAreLoading = ref(false);

const allCites = ref<City[]>([]);
const selectedCity = ref<City | null>(null);
const citiesAreLoading = ref(false);

const notFound = computed(() => {
    return (
        !eventsAreLoading.value &&
        foundEvents.value.length === 0 &&
        (eventName.value || selectedCity.value)
    );
});

function resetFilter() {
    eventName.value = '';
    selectedCity.value = null;
    foundEvents.value = events.value;
}

onMounted(() => {
    citiesAreLoading.value = true;
    eventsAreLoading.value = true;

    sputnikApi
        .getAllEvents()
        .then((data) => (events.value = data))
        .finally(() => (eventsAreLoading.value = false));

    sputnikApi
        .getAllCities()
        .then((data) => (allCites.value = data))
        .finally(() => (citiesAreLoading.value = false));
});

watch(
    () => selectedCity.value,
    (newValue) => {
        eventsAreLoading.value = true;

        sputnikApi
            .getAllEvents(newValue?.id)
            .then((data) => (events.value = data))
            .finally(() => (eventsAreLoading.value = false));
    }
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
                placeholder="Выберите город"
            />
        </div>

        <div v-if="notFound" class="app-main-not-found">
            <p>Поиск не дал результатов</p>
            <button class="app-main-reset-btn" @click="resetFilter">
                Сбросить фильтры
            </button>
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
}

.app-main-searcher {
    width: 300px;
}
</style>
