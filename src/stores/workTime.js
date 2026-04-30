import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'donenext-work-time';

function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

export const useWorkTimeStore = defineStore('workTime', () => {
    const workTimeByDate = ref(loadFromStorage());

    watch(workTimeByDate, (newValue) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
    }, { deep: true });

    function getWorkTime(date) {
        return workTimeByDate.value[date] || '';
    }

    function setWorkTime(date, time) {
        workTimeByDate.value[date] = time;
    }

    return {
        workTimeByDate,
        getWorkTime,
        setWorkTime,
    };
});