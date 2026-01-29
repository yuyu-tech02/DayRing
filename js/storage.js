/**
 * ストレージ操作モジュール
 * Cookie と localStorage を使用したデータ永続化
 */

import { getTasks, setTasks } from './state.js';
import { getElements } from './elements.js';

/**
 * 今日のキーを取得
 */
function getTodayKey() {
    const now = new Date();
    return `tasks_${now.getFullYear()}_${now.getMonth()}_${now.getDate()}`;
}


/**
 * タスクを保存
 */
export function saveTasks() {
    try {
        const tasks = getTasks();
        const data = JSON.stringify(tasks);
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        // Cookie に保存（7日間有効）
        document.cookie = `${getTodayKey()}=${encodeURIComponent(data)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

        // バックアップとして localStorage にも保存
        localStorage.setItem(getTodayKey(), data);
    } catch (e) {
        console.error('Failed to save tasks:', e);
    }
}

/**
 * タスクを読み込み
 */
export function loadTasks() {
    try {
        // Cookie から読み込み
        const cookieMatch = document.cookie.match(new RegExp(`${getTodayKey()}=([^;]*)`));
        if (cookieMatch) {
            return JSON.parse(decodeURIComponent(cookieMatch[1]));
        }

        // localStorage からフォールバック
        const stored = localStorage.getItem(getTodayKey());
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to load tasks:', e);
        return [];
    }
}


/**
 * 起床時間を保存
 */
export function saveWakeTime() {
    const elements = getElements();
    localStorage.setItem('wakeTime', elements.wakeTimeInput.value);
}

/**
 * 就寝時間を保存
 */
export function saveSleepTime() {
    const elements = getElements();
    localStorage.setItem('sleepTime', elements.sleepTimeInput.value);
}

/**
 * 就寝時間を読み込み
 */
export function loadSleepTime() {
    const elements = getElements();
    const saved = localStorage.getItem('sleepTime');
    if (saved) {
        elements.sleepTimeInput.value = saved;
    }
}

/**
 * 起床時間を読み込み
 */
export function loadWakeTime() {
    const elements = getElements();
    const saved = localStorage.getItem('wakeTime');
    if (saved) {
        elements.wakeTimeInput.value = saved;
    }
}

/**
 * 古いデータのクリーンアップ
 */
export function cleanupOldData() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const oldKey = `tasks_${twoDaysAgo.getFullYear()}_${twoDaysAgo.getMonth()}_${twoDaysAgo.getDate()}`;

    localStorage.removeItem(oldKey);
    document.cookie = `${oldKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
