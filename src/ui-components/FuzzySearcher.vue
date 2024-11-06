<script
    setup
    lang="ts"
    generic="T extends { [key: string]: any } | number | string"
>
import { ref } from 'vue';

type Props = {
    items: T[];
    withSelect?: boolean;
    multiple?: boolean;
    itemKey?: keyof T;
    itemValue?: keyof T;
    placeholder?: string;
};

const props = defineProps<Props>();

const value = defineModel<T[] | T | null>('foundItems', { default: [] });
const prompt = defineModel<string>('prompt', { default: '' });

const inputRef = ref<HTMLInputElement>();
</script>

<template>
    <div class="fuzzy-searcher" @click.stop="inputRef?.focus()">
        <input
            ref="inputRef"
            v-model="prompt"
            class="fuzzy-searcher-input"
            :placeholder="placeholder"
        />
    </div>
</template>

<style lang="scss">
@use './../styles/colors';

.fuzzy-searcher {
    cursor: text;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    min-height: 50px;
    padding: 0.8rem;

    border: 1px solid colors.$border-accent;
}

.fuzzy-searcher-input {
    flex: 2;
    font-size: 1rem;
    color: colors.$text-accent;

    &::placeholder {
        font-size: 1rem;
        color: colors.$text-accent;
    }
}
</style>
