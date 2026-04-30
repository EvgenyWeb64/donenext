<script setup>
import { ref, watch, onMounted } from 'vue';
import { useWorkTimeStore } from '../stores/workTime';

const props = defineProps({
    date: {
        type: String,
        required: true,
    },
});

const store = useWorkTimeStore();
const timeFrom = ref('');
const timeTo = ref('');

function formatValue(from, to) {
    if (from && to) {
        return `с ${from} до ${to}`;
    } else if (from) {
        return `с ${from}`;
    } else if (to) {
        return `до ${to}`;
    }
    return '';
}

function parseValue(value) {
    if (!value) return { from: '', to: '' };
    const fromMatch = value.match(/с\s+(\d{1,2}:\d{2})/);
    const toMatch = value.match(/до\s+(\d{1,2}:\d{2})/);
    return {
        from: fromMatch ? fromMatch[1] : '',
        to: toMatch ? toMatch[1] : '',
    };
}

function formatTime(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) {
        return numbers.slice(0, 2) + ':' + numbers.slice(2, 4);
    }
    return numbers.slice(0, 2) + ':' + numbers.slice(2, 4);
}

function handleInput(event, field) {
    const value = event.target.value;
    const formatted = formatTime(value);
    if (field === 'from') {
        timeFrom.value = formatted;
    } else {
        timeTo.value = formatted;
    }
}

function updateStore() {
    const value = formatValue(timeFrom.value, timeTo.value);
    store.setWorkTime(props.date, value);
}

onMounted(() => {
    const saved = store.getWorkTime(props.date);
    const parsed = parseValue(saved);
    timeFrom.value = parsed.from;
    timeTo.value = parsed.to;
});

watch([timeFrom, timeTo], () => {
    updateStore();
});

watch(
    () => props.date,
    (newDate) => {
        const saved = store.getWorkTime(newDate);
        const parsed = parseValue(saved);
        timeFrom.value = parsed.from;
        timeTo.value = parsed.to;
    },
);
</script>

<template>
    <div class="work-time-input">
        <label>Время работы</label>
        <span class="prefix">с</span>
        <input
            :value="timeFrom"
            @input="handleInput($event, 'from')"
            type="text"
            placeholder="00:00"
            class="time-input"
            maxlength="5"
        />
        <span class="separator">до</span>
        <input
            :value="timeTo"
            @input="handleInput($event, 'to')"
            type="text"
            placeholder="00:00"
            class="time-input"
            maxlength="5"
        />
    </div>
</template>

<style scoped>
.work-time-input {
    display: flex;
    align-items: center;
    gap: 8px;
}

.work-time-input label {
    font-size: 14px;
    color: #555;
}

.prefix {
    color: #555;
    font-size: 14px;
}

.time-input {
    width: 70px;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    text-align: center;
}

.time-input:focus {
    outline: none;
    border-color: #4f46e5;
}

.separator {
    color: #555;
    font-size: 14px;
}
</style>
