<script setup>
const props = defineProps({
    task: {
        type: Object,
        required: true,
    },
    isLast: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['toggle', 'remove']);
</script>

<template>
    <div class="table-row" :class="{ done: task.done, 'no-border': isLast }">
        <button class="checkbox" @click="emit('toggle', task)">
            <svg v-if="task.done" viewBox="0 0 16 16" fill="none">
                <path
                    d="M3 8l3.5 3.5L13 4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                />
            </svg>
        </button>

        <span
            v-if="task.project"
            class="project-tag"
            :style="{ background: task.project_color }"
            >{{ task.project }}</span
        >
        <span v-else class="project-empty"></span>

        <span class="title">{{ task.title }}</span>
        
        <button class="remove" @click="emit('remove', task)">✕</button>
    </div>
</template>

<style scoped>
.table-row {
    display: grid;
    grid-template-columns: 24px 130px 1fr 32px;
    gap: 8px;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid #eee;
    background: white;
    font-size: 14px;
}

.table-row.done {
    background: #f0f9f0;
}

.table-row.no-border {
    border-bottom: none;
}

.project-tag {
    padding: 6px 10px;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.project-empty {
    display: block;
}

.title {
    word-break: break-word;
    white-space: normal;
}

.table-row.done .title {
    text-decoration: line-through;
    color: #999;
}

.table-row.no-border {
    border-bottom: none;
}

.checkbox {
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
    transition: all 0.15s;
    color: white;
}

.checkbox svg {
    width: 11px;
    height: 11px;
}

.table-row.done .checkbox {
    background: #4f46e5;
    border-color: #4f46e5;
}

.project-tag {
    padding: 2px 8px;
    border-radius: 4px;
    color: white;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.project-empty {
    display: block;
}

.title {
    transition: color 0.15s;
    word-break: break-word;
    white-space: normal;
}

.table-row.done .title {
    text-decoration: line-through;
    color: #999;
}

.remove {
    background: transparent;
    border: none;
    color: #ccc;
    cursor: pointer;
    font-size: 22px;
    padding: 4px 6px;
    opacity: 0;
    transition: all 0.15s;
}

.table-row:hover .remove {
    opacity: 1;
}

.remove:hover {
    color: #e53e3e;
}
</style>