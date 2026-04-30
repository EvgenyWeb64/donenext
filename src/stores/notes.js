import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'donenext-notes';

function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

export const useNotesStore = defineStore('notes', () => {
    const notesByDate = ref(loadFromStorage());
    const loading = ref(false);

    watch(notesByDate, (newValue) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
    }, { deep: true });

    function loadNote(date) {
        loading.value = true;
        if (!notesByDate.value[date]) {
            notesByDate.value[date] = '';
        }
        loading.value = false;
    }

    function getNoteForDate(date) {
        return notesByDate.value[date] ?? '';
    }

    function setNote(date, text) {
        notesByDate.value[date] = text;
    }

    return {
        notesByDate,
        loading,
        loadNote,
        getNoteForDate,
        setNote,
    };
});