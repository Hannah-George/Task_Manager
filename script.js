const taskInput    = document.getElementById('taskInput');
const addTaskBtn   = document.getElementById('addTaskBtn');
const taskList     = document.getElementById('taskList');
const progressFill = document.getElementById('progressFill');
const progressLabel= document.getElementById('progressLabel');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function updateProgress() {
    const total = tasks.length;
    const done  = tasks.filter(t => t.done).length;
    progressFill.style.width = total === 0 ? '0%' : (done / total * 100) + '%';
    progressLabel.textContent = `${done} / ${total}`;
}

function renderList() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">Nothing here yet.</li>';
        updateProgress();
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.done) li.classList.add('done');

        const name = document.createElement('span');
        name.className = 'task-name';
        name.textContent = task.text;

        const group = document.createElement('div');
        group.className = 'btn-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = 'Done';
        completeBtn.addEventListener('click', () => toggleTask(task.id));

        const undoBtn = document.createElement('button');
        undoBtn.className = 'undo-btn';
        undoBtn.textContent = 'Undo';
        undoBtn.addEventListener('click', () => toggleTask(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id, li));

        group.appendChild(completeBtn);
        group.appendChild(undoBtn);
        group.appendChild(deleteBtn);

        li.appendChild(name);
        li.appendChild(group);
        taskList.appendChild(li);
    });

    updateProgress();
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.classList.add('shake');
        taskInput.addEventListener('animationend', () => taskInput.classList.remove('shake'), { once: true });
        return;
    }
    tasks.push({ id: Date.now(), text, done: false });
    taskInput.value = '';
    taskInput.focus();
    renderList();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    renderList();
}

function deleteTask(id, li) {
    li.style.transition = 'opacity 0.2s, transform 0.2s';
    li.style.opacity = '0';
    li.style.transform = 'translateX(12px)';
    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        renderList();
    }, 200);
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });

renderList();
