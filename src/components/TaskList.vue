<script setup>
import { computed, ref } from 'vue'
import TaskItem from './TaskItem.vue'
import ConfirmModal from './ConfirmModal.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggle', 'remove', 'toggle-all'])

const sortedTasks = computed(() => {
    return [...props.tasks].sort((a, b) => {
        if (a.done === b.done) return 0
        return a.done ? 1 : -1
    })
})

const pendingCount = computed(() => props.tasks.filter(t => !t.done).length)
const hasCompleted = computed(() => props.tasks.some(t => t.done))

const allSelected = ref(false)
const showDeleteModal = ref(false)
const taskToDelete = ref(null)
const lastPendingIndex = computed(() => {
    return pendingCount.value - 1
})

function toggleAll() {
    allSelected.value = !allSelected.value
    emit('toggle-all', allSelected.value)
}

function confirmRemove(task) {
    taskToDelete.value = task
    showDeleteModal.value = true
}

function handleRemove() {
    if (taskToDelete.value) {
        emit('remove', taskToDelete.value.id)
    }
    showDeleteModal.value = false
    taskToDelete.value = null
}

function cancelRemove() {
    showDeleteModal.value = false
    taskToDelete.value = null
}
</script>

<template>
  <div class="task-table">
    <div class="table-header">
      <button class="check-all" @click="toggleAll">
        <svg v-if="allSelected" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <span class="col-project">Проект</span>
      <span class="col-title">Задача</span>
      <span class="col-action"></span>
    </div>
    
    <div class="table-body">
        <p v-if="!sortedTasks.length" class="empty">
        Задач пока нет
        </p>

<TaskItem
            v-for="(task, index) in sortedTasks"
            :key="task.id"
            :task="task"
            :is-last="index === sortedTasks.length - 1"
            @toggle="emit('toggle', $event)"
            @remove="confirmRemove"
        />
    </div>

    <ConfirmModal
      :show="showDeleteModal"
      title="Удаление задачи"
      message="Вы уверены, что хотите удалить эту задачу?"
      @confirm="handleRemove"
      @cancel="cancelRemove"
    />
  </div>
</template>

<style scoped>
.task-table {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
}

.table-header {
    display: grid;
    grid-template-columns: 24px 130px 1fr 32px;
    gap: 8px;
    padding: 10px 12px;
    background: #f5f5f5;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.table-body {
    max-height: 290px;
    overflow-y: auto;
}

.empty {
    color: #999;
    font-size: 14px;
    text-align: center;
    padding: 16px 0;
    border-bottom: 1px solid #eee;
}

.check-all {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: transparent;
    transition: all 0.15s;
}

.check-all svg {
    width: 11px;
    height: 11px;
}

.check-all:hover {
    border-color: #4f46e5;
}
</style>