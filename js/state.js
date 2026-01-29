// アプリケーションの状態
const state = {
    tasks: [],
    editingTaskId: null,
    autoColorIndex: 0
};

// 状態の取得
export function getTasks() {
    return state.tasks;
}

export function setTasks(newTasks) {
    state.tasks = newTasks;
}

export function getEditingTaskId() {
    return state.editingTaskId;
}

export function setEditingTaskId(id) {
    state.editingTaskId = id;
}

export function getAutoColorIndex() {
    return state.autoColorIndex;
}

export function incrementAutoColorIndex() {
    state.autoColorIndex++;
    return state.autoColorIndex;
}

// タスク操作
export function addTask(task) {
    state.tasks.push(task);
}

export function updateTask(taskId, updates) {
    const index = state.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...updates };
    }
}

export function removeTask(taskId) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
}

export function findTask(taskId) {
    return state.tasks.find(t => t.id === taskId);
}
