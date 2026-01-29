/**
 * DOM要素管理モジュール
 * DOM要素の参照を一元管理
 */

let elements = null;

/**
 * DOM要素を初期化
 */
export function initElements() {
    elements = {
        // 日付・時刻表示
        dateDisplay: document.getElementById('dateDisplay'),
        currentTime: document.getElementById('currentTime'),
        wakeTimeInput: document.getElementById('wakeTimeInput'),
        sleepTimeInput: document.getElementById('sleepTimeInput'),

        // タスク関連
        taskCount: document.getElementById('taskCount'),
        taskList: document.getElementById('taskList'),

        // 円グラフ
        segmentsGroup: document.getElementById('segmentsGroup'),
        timeLabels: document.getElementById('timeLabels'),

        // 追加ボタン
        addBtn: document.getElementById('addBtn'),

        // タスクモーダル
        taskModal: document.getElementById('taskModal'),
        modalTitle: document.getElementById('modalTitle'),
        modalClose: document.getElementById('modalClose'),
        taskNameInput: document.getElementById('taskNameInput'),
        startTimeInput: document.getElementById('startTimeInput'),
        endTimeInput: document.getElementById('endTimeInput'),
        priorityInput: document.getElementById('priorityInput'),
        colorPicker: document.getElementById('colorPicker'),
        formActions: document.getElementById('formActions'),
        cancelBtn: document.getElementById('cancelBtn'),
        saveBtn: document.getElementById('saveBtn'),

    };

    return elements;
}

/**
 * DOM要素を取得
 */
export function getElements() {
    if (!elements) {
        throw new Error('Elements not initialized. Call initElements() first.');
    }
    return elements;
}
