<script setup lang="ts">
import { useSputnikApi } from './api/SputnikApi';
import SputnikLogo from './assets/SputnikWithName.svg';
import { City } from './types/City';
import FuzzySearcher from './ui-components/FuzzySearcher.vue';
import { onMounted, ref } from 'vue';

const sputnikApi = useSputnikApi();

const events = ref([]);
const foundEvents = ref([]);
const eventName = ref('');

const allCites = ref<City[]>([]);
const selectedCity = ref<City | null>(null);
const cityName = ref('');

onMounted(() => {
    sputnikApi.getAllCities().then((data) => (allCites.value = data));
});
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
                multiple
                class="app-main-searcher"
                placeholder="Введите название экскурсии"
            />

            <fuzzy-searcher
                v-model:found-items="selectedCity"
                v-model:prompt="cityName"
                :items="allCites"
                class="app-main-searcher"
                with-select
                placeholder="Выберите город"
            />
        </div>
    </div>
</template>

<style lang="scss">
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

.app-main-searchers {
    display: flex;
    gap: 1.5rem;
}

.app-main-searcher {
    width: 300px;
}
</style>
