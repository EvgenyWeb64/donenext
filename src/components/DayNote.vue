<script setup>
import { ref, watch, onMounted } from 'vue';
import { useNotesStore } from '../stores/notes';

const props = defineProps({
    date: {
        type: String,
        required: true,
    },
});

const store = useNotesStore();

// Инициализируем локальный ref
const text = ref('');

// Загружаем заметку при монтировании
onMounted(() => {
    store.loadNote(props.date);
    text.value = store.getNoteForDate(props.date);
});

// Следим за изменением текста и сохраняем
watch(text, (newValue) => {
    store.setNote(props.date, newValue);
});

// Следим за изменением даты (при переходе между днями)
watch(
    () => props.date,
    (newDate) => {
        store.loadNote(newDate);
        text.value = store.getNoteForDate(newDate);
    },
);
</script>

<template>
    <div class="day-note">
        <h3>Заметка</h3>
        <textarea
            v-model="text"
            placeholder="Заметки на этот день..."
            rows="4"
        />
    </div>
</template>

<style scoped>
.day-note {
    margin-top: 24px;
}

h3 {
    margin-bottom: 8px;
    font-size: 15px;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 15px;
    font-family: inherit;
    resize: vertical;
    line-height: 1.5;
}

textarea:focus {
    outline: none;
    border-color: #4f46e5;
}
</style>
