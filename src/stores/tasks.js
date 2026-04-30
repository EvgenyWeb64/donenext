import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'donenext-tasks';

function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

export const useTasksStore = defineStore('tasks', () => {
    const tasksByDate = ref(loadFromStorage());
    const loading = ref(false);

    watch(tasksByDate, (newValue) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
    }, { deep: true });

    function loadTasks(date) {
        loading.value = true;
        if (!tasksByDate.value[date]) {
            tasksByDate.value[date] = [];
        }
        loading.value = false;
    }

    function getTasksForDate(date) {
        return tasksByDate.value[date] ?? [];
    }

    function addTask(date, data) {
        console.log('addTask called:', date, data);
        if (!tasksByDate.value[date]) {
            tasksByDate.value[date] = [];
        }
        const newTask = {
            id: Date.now(),
            date,
            title: data.title,
            project: data.project || null,
            project_color: data.project_color || null,
            done: false,
            created_at: new Date().toISOString(),
        };
        tasksByDate.value[date].push(newTask);
        console.log('tasksByDate after add:', tasksByDate.value);
    }

    function toggleTask(date, taskId) {
        const tasks = tasksByDate.value[date] ?? [];
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index].done = !tasks[index].done;
        }
    }

    function removeTask(date, taskId) {
        const tasks = tasksByDate.value[date] ?? [];
        tasksByDate.value[date] = tasks.filter(t => t.id !== taskId);
    }

    return {
        tasksByDate,
        loading,
        loadTasks,
        getTasksForDate,
        addTask,
        toggleTask,
        removeTask,
    };
});