/**
 * アプリケーション メインエントリー
 * 初期化とイベントリスナーの設定
 */

import { setTasks } from './state.js';
import { initElements, getElements } from './elements.js';
import { loadTasks, loadWakeTime, saveWakeTime, saveSleepTime, cleanupOldData } from './storage.js';
import { updateDateDisplay, startTimeUpdater } from './ui/dateTime.js';
import { generateTimeLabels, generateSegments } from './ui/chart.js';
import { updateTaskList } from './ui/taskList.js';
import {
    openAddModal, closeModal,
    setRenderCallback
} from './ui/modal.js';

/**
 * 画面を再描画
 */
function render() {
    generateSegments();
    updateTaskList();
}

/**
 * イベントリスナーを設定
 */
function setupEventListeners() {
    const elements = getElements();

    // 追加ボタン
    elements.addBtn.addEventListener('click', openAddModal);

    // タスクモーダル
    elements.modalClose.addEventListener('click', closeModal);
    elements.taskModal.addEventListener('click', (e) => {
        if (e.target === elements.taskModal) closeModal();
    });

    // 起床時間変更
    elements.wakeTimeInput.addEventListener('change', () => {
        saveWakeTime();
        render();
    });

    // 就寝時間変更
    elements.sleepTimeInput.addEventListener('change', () => {
        saveSleepTime();
        render();
    });



    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

/**
 * アプリケーション初期化
 */
function init() {
    // DOM要素を初期化
    initElements();

    // モーダルにrender関数を渡す（循環依存回避）
    setRenderCallback(render);

    // 日付・時刻表示
    updateDateDisplay();
    startTimeUpdater();
    generateTimeLabels();

    // データ読み込み
    loadWakeTime();
    setTasks(loadTasks());

    // 画面描画
    render();

    // クリーンアップ
    cleanupOldData();

    // イベント設定
    setupEventListeners();
}

// アプリケーション開始
init();
