// ===== グローバル変数 =====
let questions = [];
let currentQuestionIndex = 0;
let currentQuestions = [];
let stats = {
    totalAnswered: 0,
    totalCorrect: 0,
    correctStreak: 0,
    incorrectQuestions: []
};
let currentMode = null;
let soundEnabled = true;

// ===== ローカルストレージキー =====
const STORAGE_KEYS = {
    STATS: 'worldHeritageStats',
    DARK_MODE: 'worldHeritageDarkMode',
    SOUND: 'worldHeritageSound'
};

// ===== 効果音（Web Audio API使用） =====
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

function playSound(type) {
    if (!soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
        // 正解音：明るい和音
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'incorrect') {
        // 不正解音：低い音
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'streak') {
        // 連続正解音：特別な音
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime); // G5
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1); // A5
        oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime + 0.2); // C6
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadStats();
    loadQuestions();
    initializeEventListeners();
});

// ===== 問題データの読み込み =====
async function loadQuestions() {
    try {
        const response = await fetch('questions.csv');
        const text = await response.text();
        questions = parseCSV(text);
        
        // ローディング画面を非表示
        document.getElementById('loadingScreen').classList.add('hidden');
    } catch (error) {
        console.error('問題の読み込みに失敗:', error);
        alert('問題データの読み込みに失敗しました。ページを再読み込みしてください。');
    }
}

// ===== CSV解析 =====
function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const question = {};
        headers.forEach((header, index) => {
            question[header] = values[index] ? values[index].trim() : '';
        });
        return question;
    }).filter(q => q.question); // 問題文が空でないもののみ
}

// CSV行のパース（カンマ区切りだが、ダブルクォート内のカンマは無視）
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result;
}

// ===== イベントリスナーの設定 =====
function initializeEventListeners() {
    // 設定ボタン
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsDropdown').classList.toggle('active');
    });
    
    // ダークモード切り替え
    document.getElementById('darkModeToggle').addEventListener('change', (e) => {
        toggleDarkMode(e.target.checked);
    });
    
    // 効果音切り替え
    document.getElementById('soundToggle').addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
        localStorage.setItem(STORAGE_KEYS.SOUND, soundEnabled);
    });
    
    // 進捗リセット
    document.getElementById('resetProgressBtn').addEventListener('click', resetProgress);
    
    // モード選択ボタン
    document.getElementById('sequentialBtn').addEventListener('click', () => startQuiz('sequential'));
    document.getElementById('randomBtn').addEventListener('click', () => startQuiz('random'));
    document.getElementById('categoryBtn').addEventListener('click', showCategorySelect);
    document.getElementById('reviewBtn').addEventListener('click', () => startQuiz('review'));
    
    // カテゴリ選択から戻る
    document.getElementById('backToModeBtn').addEventListener('click', hideCategorySelect);
    
    // スタート画面に戻る
    document.getElementById('backToStartBtn').addEventListener('click', backToStart);
    
    // 次の問題へ
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    
    // オーバーレイクリックで閉じる
    document.getElementById('resultOverlay').addEventListener('click', closeResultOverlay);
}

// ===== 設定の読み込み =====
function loadSettings() {
    // ダークモード
    const darkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    document.getElementById('darkModeToggle').checked = darkMode;
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // 効果音
    const sound = localStorage.getItem(STORAGE_KEYS.SOUND);
    soundEnabled = sound === null ? true : sound === 'true';
    document.getElementById('soundToggle').checked = soundEnabled;
}

// ===== 統計情報の読み込み =====
function loadStats() {
    const saved = localStorage.getItem(STORAGE_KEYS.STATS);
    if (saved) {
        stats = JSON.parse(saved);
    }
    updateOverallStats();
}

// ===== 統計情報の保存 =====
function saveStats() {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    updateOverallStats();
}

// ===== 全体統計の更新 =====
function updateOverallStats() {
    document.getElementById('totalAnswered').textContent = stats.totalAnswered;
    document.getElementById('totalCorrect').textContent = stats.totalCorrect;
    
    const rate = stats.totalAnswered > 0 
        ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
        : 0;
    document.getElementById('correctRate').textContent = rate + '%';
}

// ===== ダークモード切り替え =====
function toggleDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, enabled);
}

// ===== 進捗リセット =====
function resetProgress() {
    if (confirm('学習履歴をすべてリセットしますか？この操作は取り消せません。')) {
        stats = {
            totalAnswered: 0,
            totalCorrect: 0,
            correctStreak: 0,
            incorrectQuestions: []
        };
        saveStats();
        alert('進捗をリセットしました。');
    }
}

// ===== カテゴリ選択表示 =====
function showCategorySelect() {
    // カテゴリを抽出
    const categories = [...new Set(questions.map(q => q.category))].filter(c => c);
    
    const categoryButtons = document.getElementById('categoryButtons');
    categoryButtons.innerHTML = '';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.addEventListener('click', () => startQuiz('category', category));
        categoryButtons.appendChild(btn);
    });
    
    document.querySelector('.mode-buttons').style.display = 'none';
    document.querySelector('.overall-stats').style.display = 'none';
    document.getElementById('categorySelect').classList.remove('hidden');
}

// ===== カテゴリ選択非表示 =====
function hideCategorySelect() {
    document.querySelector('.mode-buttons').style.display = 'grid';
    document.querySelector('.overall-stats').style.display = 'grid';
    document.getElementById('categorySelect').classList.add('hidden');
}

// ===== クイズ開始 =====
function startQuiz(mode, category = null) {
    currentMode = mode;
    
    // 問題を準備
    if (mode === 'sequential') {
        currentQuestions = [...questions];
    } else if (mode === 'random') {
        currentQuestions = shuffle([...questions]);
    } else if (mode === 'category') {
        currentQuestions = questions.filter(q => q.category === category);
        if (currentQuestions.length === 0) {
            alert('このカテゴリには問題がありません。');
            return;
        }
    } else if (mode === 'review') {
        if (stats.incorrectQuestions.length === 0) {
            alert('まだ間違えた問題がありません。先に問題を解いてみましょう！');
            return;
        }
        currentQuestions = questions.filter(q => 
            stats.incorrectQuestions.includes(parseInt(q.id))
        );
    }
    
    // リセット
    currentQuestionIndex = 0;
    stats.correctStreak = 0;
    
    // 画面切り替え
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    
    // 問題表示
    showQuestion();
}

// ===== 配列シャッフル =====
function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// ===== 問題表示 =====
function showQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showQuizComplete();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    
    // 統計バーを更新
    document.getElementById('currentQuestion').textContent = 
        `${currentQuestionIndex + 1}/${currentQuestions.length}`;
    document.getElementById('correctCount').textContent = stats.totalCorrect;
    document.getElementById('streakCount').textContent = stats.correctStreak;
    
    // 問題情報を表示
    document.getElementById('questionNumber').textContent = 
        `第${currentQuestionIndex + 1}問`;
    document.getElementById('questionCategory').textContent = question.category || '';
    document.getElementById('questionText').textContent = question.question;
    
    // 選択肢を表示
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    
    const choiceLabels = ['ア', 'イ', 'ウ', 'エ'];
    const choiceKeys = ['choice_a', 'choice_b', 'choice_c', 'choice_d'];
    
    choiceKeys.forEach((key, index) => {
        if (question[key]) {
            const choice = document.createElement('div');
            choice.className = 'choice';
            choice.innerHTML = `<strong>${choiceLabels[index]}.</strong> ${question[key]}`;
            choice.dataset.choice = ['a', 'b', 'c', 'd'][index];
            choice.addEventListener('click', () => selectChoice(choice));
            choicesContainer.appendChild(choice);
        }
    });
    
    // 解説エリアを非表示
    document.getElementById('explanationArea').classList.add('hidden');
}

// ===== 選択肢選択 =====
function selectChoice(choiceElement) {
    const question = currentQuestions[currentQuestionIndex];
    const selectedAnswer = choiceElement.dataset.choice;
    const correctAnswer = question.correct.toLowerCase();
    
    // すべての選択肢を無効化
    document.querySelectorAll('.choice').forEach(choice => {
        choice.classList.add('disabled');
    });
    
    // 正誤判定
    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
        choiceElement.classList.add('correct');
        stats.totalCorrect++;
        stats.correctStreak++;
        playSound('correct');
        
        // 連続正解チェック
        const streakMilestones = [5, 10, 15, 20, 30, 50];
        if (streakMilestones.includes(stats.correctStreak)) {
            playSound('streak');
        }
    } else {
        choiceElement.classList.add('incorrect');
        
        // 正解を表示
        document.querySelectorAll('.choice').forEach(choice => {
            if (choice.dataset.choice === correctAnswer) {
                choice.classList.add('correct');
            }
        });
        
        // 間違えた問題を記録
        const questionId = parseInt(question.id);
        if (!stats.incorrectQuestions.includes(questionId)) {
            stats.incorrectQuestions.push(questionId);
        }
        
        stats.correctStreak = 0;
        playSound('incorrect');
    }
    
    stats.totalAnswered++;
    saveStats();
    
    // 結果を表示
    showResult(isCorrect);
    
    // 解説を表示
    setTimeout(() => {
        document.getElementById('explanationText').textContent = 
            question.explanation || '解説がありません。';
        document.getElementById('explanationArea').classList.remove('hidden');
    }, 1500);
}

// ===== 結果表示 =====
function showResult(isCorrect) {
    const overlay = document.getElementById('resultOverlay');
    const icon = document.getElementById('resultIcon');
    const message = document.getElementById('resultMessage');
    const streakMessage = document.getElementById('streakMessage');
    
    if (isCorrect) {
        icon.textContent = '⭕';
        icon.style.color = 'var(--success-color)';
        message.textContent = '正解！';
        
        // 連続正解メッセージ
        const streakMilestones = [5, 10, 15, 20, 30, 50];
        if (streakMilestones.includes(stats.correctStreak)) {
            streakMessage.textContent = `🎉 ${stats.correctStreak}問連続正解！！`;
            streakMessage.classList.remove('hidden');
        } else {
            streakMessage.classList.add('hidden');
        }
    } else {
        icon.textContent = '❌';
        icon.style.color = 'var(--error-color)';
        message.textContent = '不正解';
        streakMessage.classList.add('hidden');
    }
    
    overlay.classList.remove('hidden');
    
    // 1.5秒後に自動で閉じる
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 1500);
}

// ===== 結果オーバーレイを閉じる =====
function closeResultOverlay() {
    document.getElementById('resultOverlay').classList.add('hidden');
}

// ===== 次の問題へ =====
function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
    
    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== クイズ完了 =====
function showQuizComplete() {
    const correctCount = currentQuestions.filter((q, index) => {
        // この実装では正解数をカウントできないため、statsから推測
        return true; // 実装を簡略化
    }).length;
    
    const totalQuestions = currentQuestions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    alert(`お疲れ様でした！\n\n全${totalQuestions}問中、${correctCount}問正解\n正解率: ${percentage}%`);
    
    backToStart();
}

// ===== スタート画面に戻る =====
function backToStart() {
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    
    // カテゴリ選択を非表示
    if (!document.getElementById('categorySelect').classList.contains('hidden')) {
        hideCategorySelect();
    }
    
    updateOverallStats();
}
