<script setup>
import { computed, onMounted, ref } from 'vue';
import { useTasksStore } from '../stores/tasks';
import TaskInput from '../components/TaskInput.vue';
import TaskList from '../components/TaskList.vue';
import ProjectsModal from '../components/ProjectsModal.vue';
import WorkTimeInput from '../components/WorkTimeInput.vue';

const store = useTasksStore();
const today = new Date().toISOString().split('T')[0];
const showProjectsModal = ref(false);

const tasks = computed(() => store.tasksByDate[today] || []);
const loading = computed(() => store.loading);

onMounted(() => {
    store.loadTasks(today);
});

function addTask(data) {
    store.addTask(today, data);
}

function toggleTask(task) {
    store.toggleTask(today, task.id);
}

function toggleAll(done) {
    tasks.value.forEach((task) => {
        if (task.done !== done) {
            store.toggleTask(today, task.id);
        }
    });
}

function removeTask(id) {
    store.removeTask(today, id);
}
</script>

<template>
    <div>
        <div class="title-row">
            <h2 class="page-title">
                {{ today.split('-').reverse().join('.') }}
            </h2>
        </div>
        <div class="work-row">
            <WorkTimeInput :date="today" />
            <button class="projects-btn" @click="showProjectsModal = true">
                Проекты
            </button>
        </div>
        <TaskInput @add-task="addTask" />
        <p v-if="loading" class="loading">Загрузка...</p>
        <TaskList
            :tasks="tasks"
            @toggle="toggleTask"
            @remove="removeTask"
            @toggle-all="toggleAll"
        />

        <ProjectsModal
            :show="showProjectsModal"
            @close="showProjectsModal = false"
        />
    </div>
</template>

<style scoped>
.title-row {
    margin-bottom: 16px;
}

.work-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
}

.loading {
    color: #999;
    font-size: 14px;
    text-align: center;
    padding: 12px 0;
}

.page-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.projects-btn {
    padding: 8px 16px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    color: #555;
}

.projects-btn:hover {
    background: #eee;
    border-color: #4f46e5;
    color: #4f46e5;
}
</style>
