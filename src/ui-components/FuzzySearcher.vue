<script
    setup
    lang="ts"
    generic="T extends { [key: string]: any } | number | string"
>
import SelectSvg from '../assets/SelectArrow.svg';
import Fuse from 'fuse.js';
import debounce from 'lodash-es/debounce';
import { onMounted, onUnmounted, ref, watch } from 'vue';

type Props = {
    items: T[];
    withSelect?: boolean;
    itemKey?: keyof T;
    placeholder?: string;
    isLoading?: boolean;
};

const props = defineProps<Props>();

const foundItems = defineModel<T[]>('foundItems', { default: [] });
const prompt = defineModel<string>('prompt', { default: '' });
const value = defineModel<T | null>('value', { default: null });

const inputRef = ref<HTMLInputElement>();
const selectRef = ref<HTMLDivElement>();

const isSelectOpened = ref(false);

const fuse = ref<Fuse<T> | null>(null);

const search = debounce(
    (term: string) => {
        if (!term) {
            foundItems.value = props.items;
            return;
        }

        foundItems.value =
            fuse.value?.search(term).map((item) => item.item) || [];
    },
    500,
    {
        leading: true,
        trailing: true,
    }
);

function handleClickOutside(event: MouseEvent) {
    if (
        !(
            event.target === inputRef.value?.parentElement ||
            inputRef.value?.parentNode?.contains(event.target as Node) ||
            selectRef.value?.contains(event.target as Node) ||
            selectRef.value === event.target
        )
    ) {
        isSelectOpened.value = false;
        prompt.value = value.value
            ? props.itemKey
                ? String(value.value[props.itemKey])
                : String(value.value)
            : '';
    }
}

function calcPostion() {
    if (!props.withSelect) {
        return;
    }

    const docRect = document.documentElement.getBoundingClientRect();
    const inputRect = inputRef.value?.parentElement?.getBoundingClientRect();

    if (!inputRect || !selectRef.value) {
        return;
    }

    selectRef.value.style.top = `${inputRect.bottom + 5 - docRect.y}px`;
    selectRef.value.style.left = `${inputRect.left}px`;
    selectRef.value.style.width = `${inputRect.width}px`;
}

function handleClick() {
    inputRef.value?.focus();

    if (!props.withSelect) {
        return;
    }

    search(prompt.value);
    calcPostion();

    isSelectOpened.value = true;
}

function onSelectValue(item: T) {
    value.value = item;
    prompt.value = props.itemKey ? String(item[props.itemKey]) : String(item);
    isSelectOpened.value = false;
}

onMounted(() => {
    if (props.withSelect) {
        window.addEventListener('click', handleClickOutside);
        window.addEventListener('scroll', calcPostion);
        window.addEventListener('resize', calcPostion);
    }
});

onUnmounted(() => {
    if (props.withSelect) {
        window.removeEventListener('click', handleClickOutside);
        window.removeEventListener('scroll', calcPostion);
        window.addEventListener('resize', calcPostion);
    }
});

watch(
    () => props.items,
    () => {
        fuse.value = new Fuse(props.items, {
            keys: [String(props.itemKey)],
            threshold: 0.3,
        });
        search(prompt.value);
    },
    { deep: true, immediate: true }
);

watch(
    () => prompt.value,
    () => {
        search(prompt.value);
    }
);
</script>

<template>
    <div class="fuzzy-searcher" @click="handleClick()">
        <input
            ref="inputRef"
            v-model="prompt"
            class="fuzzy-searcher-input"
            :placeholder="placeholder"
            @input="(e) => search((e.target as HTMLInputElement).value)"
        />

        <select-svg v-if="withSelect" class="fuzzy-searcher-select-arrow" />

        <Teleport v-if="withSelect" to="Body">
            <div
                v-show="isSelectOpened"
                ref="selectRef"
                class="fuzzy-searcher-select"
            >
                <div v-if="isLoading" class="fuzzy-searcher-select-item">
                    Загрузка...
                </div>

                <div
                    v-else-if="!foundItems.length"
                    class="fuzzy-searcher-select-item"
                >
                    Ничего не найдено
                </div>

                <div
                    v-for="(item, index) in foundItems"
                    :key="itemKey ? String(item[itemKey]) : index"
                    class="fuzzy-searcher-select-item"
                    @click="onSelectValue(item)"
                >
                    {{ itemKey ? item[itemKey] : item }}
                </div>
            </div>
        </Teleport>
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
    border-radius: 1px;
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

.fuzzy-searcher-select-arrow {
    color: colors.$text-accent;
    opacity: 0.3;
}

.fuzzy-searcher-select {
    position: absolute;
    z-index: 100;

    overflow-y: auto;

    max-height: 250px;

    background-color: colors.$primary;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 4px 15px 0 #0000001a;
}

.fuzzy-searcher-select-item {
    cursor: pointer;
    padding: 1rem;
    border-bottom: 1px solid colors.$border-light;

    &:last-child {
        border-bottom: none;
    }
}
</style>
