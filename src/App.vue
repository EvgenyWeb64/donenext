<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useTasksStore } from './stores/tasks';

dayjs.locale('ru');

const store = useTasksStore();
const currentDate = ref(dayjs());
const currentTime = ref('');
let timeInterval = null;

const monthName = computed(() => currentDate.value.format('MMMM YYYY'));

function updateTime() {
    currentTime.value = dayjs().format('HH:mm');
}

function prevMonth() {
    currentDate.value = currentDate.value.subtract(1, 'month');
}

function nextMonth() {
    currentDate.value = currentDate.value.add(1, 'month');
}

function getCalendarDays() {
    const today = dayjs();
    const startOfMonth = currentDate.value.startOf('month');
    const endOfMonth = currentDate.value.endOf('month');

    const startDayOfWeek =
        startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
    const endDayOfWeek = endOfMonth.day() === 0 ? 6 : endOfMonth.day() - 1;
    const trailingEmpty = 6 - endDayOfWeek;

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ empty: true });
    }

    for (
        let day = startOfMonth;
        day.isBefore(endOfMonth) || day.isSame(endOfMonth, 'day');
        day = day.add(1, 'day')
    ) {
        const dateStr = day.format('YYYY-MM-DD');
        const hasTasks = store.tasksByDate[dateStr]?.length > 0;
        const isPast = day.isBefore(today, 'day');

        days.push({
            value: dateStr,
            dayNum: day.format('D'),
            hasTasks,
            isPast,
        });
    }

    for (let i = 0; i < trailingEmpty; i++) {
        days.push({ empty: true });
    }

    return days;
}

const calendarDays = computed(() => getCalendarDays());

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getUrlForDate(dateValue) {
    return dateValue === dayjs().format('YYYY-MM-DD')
        ? '/'
        : `/day/${dateValue}`;
}

onMounted(() => {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval);
});
</script>

<template>
    <div class="app">
        <header class="site-header">
            <div class="logo">
                <img src="/favicon.svg" alt="doneNext" class="logo-img" />
                <div class="logo-text">
                    <span>doneNext</span>
                    <span class="logo-subtext">календарь задач</span>
                </div>
            </div>
            <div class="current-time">{{ currentTime }}</div>
        </header>

        <header class="header">
            <div class="month-nav">
                <button @click="prevMonth" class="nav-btn">&lt;</button>
                <span class="month-name">{{ monthName }}</span>
                <button @click="nextMonth" class="nav-btn">&gt;</button>
            </div>

            <nav class="calendar">
                <div v-for="wd in weekDays" :key="wd" class="weekday">
                    {{ wd }}
                </div>
                <template v-for="day in calendarDays">
                    <div v-if="day.empty" class="day-cell empty"></div>
                    <RouterLink
                        v-else
                        :to="getUrlForDate(day.value)"
                        class="day-cell"
                        :class="{
                            'has-tasks': day.hasTasks,
                            'is-past': day.isPast,
                        }"
                    >
                        <span class="day-num">{{ day.dayNum }}</span>
                        <span v-if="day.hasTasks" class="task-dot"></span>
                    </RouterLink>
                </template>
            </nav>
        </header>

        <main class="main">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
.app {
    max-width: 900px;
    margin: 0 auto;
    padding: 12px 20px;
}

.site-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #757575;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-img {
    width: 28px;
    height: 28px;
}

.logo-text {
    display: flex;
    flex-direction: column;
}

.logo-text span:first-child {
    font-size: 22px;
    font-weight: 700;
    color: #4f46e5;
    line-height: 1.1;
}

.logo-img {
    width: 28px;
    height: 28px;
}

.logo-text {
    font-size: 22px;
    font-weight: 700;
    color: #4f46e5;
}

.logo-subtext {
    font-size: 11px;
    color: #757575;
    margin-left: 3px;
}

.current-time {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    font-variant-numeric: tabular-nums;
}

.header {
    margin-bottom: 32px;
}

.month-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 16px;
}

.nav-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 16px;
    color: #555;
}

.nav-btn:hover {
    border-color: #4f46e5;
    color: #4f46e5;
}

.month-name {
    font-size: 18px;
    font-weight: 600;
    min-width: 160px;
    text-align: center;
    text-transform: capitalize;
}

.calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #ddd;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.weekday {
    padding: 8px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    background: #f0f0f0;
}

.day-cell {
    padding: 8px 4px;
    text-align: center;
    text-decoration: none;
    color: #333;
    font-size: 14px;
    background: white;
    transition: all 0.15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 36px;
}

.day-cell.empty {
    background: #f5f5f5;
}

.day-num {
    line-height: 1;
}

.task-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #4f46e5;
}

.day-cell:hover {
    background: #f5f5ff;
}

.day-cell.has-tasks .task-dot {
    background: #4f46e5;
}

.day-cell.router-link-active {
    background: #4f46e5;
    color: white;
}

.day-cell.router-link-active .task-dot {
    background: white;
}
</style>
