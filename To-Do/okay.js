async function newtask() {
    const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "Task",
        inputPlaceholder: "Type your task here",
        inputAttributes: {
            "aria-label": "Type your message here"
        },
        showCancelButton: true
    });

    if (text === '') {
        let audio = new Audio('sounds/ERROR.mp3');
        audio.play();
        audio.onended = function() {
            alert("Please enter some input");
        }
    } else {
        const ul = document.getElementById('itemList');
        const li = document.createElement('li');
        const currentTime = new Date().toISOString();
        li.textContent = text + ".";
        li.setAttribute('data-timestamp', currentTime); 
        ul.appendChild(li);

        const done = document.createElement("button");
        done.classList.add('done');
        li.appendChild(done);
        done.setAttribute('color', '#17C3B2');

        let imgdone = document.createElement('img');
        imgdone.setAttribute('src', 'images/done.png');
        done.appendChild(imgdone);

        const details = document.createElement("button");
        details.classList.add('del');
        li.appendChild(details);
        details.setAttribute('color', '#17C3B2');

        let imgdel = document.createElement('img');
        imgdel.setAttribute('src', 'images/detail.png');
        details.appendChild(imgdel);

        const bdel = document.createElement("button");
        bdel.classList.add('bin');
        li.appendChild(bdel);
        bdel.setAttribute('color', '#17C3B2');

        let img = document.createElement('img');
        img.setAttribute('src', 'images/cross.png');
        bdel.appendChild(img);

        done.addEventListener('click', function() {
            li.style.textDecoration = 'line-through red';
        });

        details.addEventListener('click', function() {
            showTaskDetail(text, currentTime); 
        });

        bdel.addEventListener('click', function() {
            ul.removeChild(li);
            let audio = new Audio('sounds/delete.mp3');
            audio.play();
            savekaam();
        });

        savekaam();
    }
}

function savekaam() {
    const ul = document.getElementById('itemList');
    const listItems = ul.getElementsByTagName('li');
    const tasks = [];

    for (let li of listItems) {
        const text = li.childNodes[0].textContent;
        const currentTime = li.getAttribute('data-timestamp'); 
        tasks.push({ text, currentTime }); 
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showplease() {
    const savedData = localStorage.getItem("tasks");
    if (savedData) {
        const tasks = JSON.parse(savedData);
        const ul = document.getElementById('itemList');
        ul.innerHTML = '';

        for (let task of tasks) {
            const li = document.createElement('li');
            li.textContent = task.text + ".";
            li.setAttribute('data-timestamp', task.currentTime);
            ul.appendChild(li);

            const done = document.createElement("button");
            done.classList.add('done');
            li.appendChild(done);
            done.setAttribute('color', '#17C3B2');

            let imgdone = document.createElement('img');
            imgdone.setAttribute('src', 'images/done.png');
            done.appendChild(imgdone);

            const details = document.createElement("button");
            details.classList.add('del');
            li.appendChild(details);
            details.setAttribute('color', '#17C3B2');

            let imgdel = document.createElement('img');
            imgdel.setAttribute('src', 'images/detail.png');
            details.appendChild(imgdel);

            const bdel = document.createElement("button");
            bdel.classList.add('bin');
            li.appendChild(bdel);
            bdel.setAttribute('color', '#17C3B2');

            let img = document.createElement('img');
            img.setAttribute('src', 'images/cross.png');
            bdel.appendChild(img);

            done.addEventListener('click', function() {
                li.style.textDecoration = 'line-through red';
            });

            details.addEventListener('click', function() {
                showTaskDetail(task.text, task.currentTime); 
            });

            bdel.addEventListener('click', function() {
                ul.removeChild(li);
                let audio = new Audio('sounds/delete.mp3');
                audio.play();
                savekaam();
            });
        }
        setInterval(updateTime, 60000); 
    }
}

function showTaskDetail(text, currentTime) { 
    const taskTime = new Date(currentTime); 
    Swal.fire({
        html: `
            <p><strong>Date:</strong> ${taskTime.toLocaleString()}</p>
        `
    });
}

function getTimePassed(currentTime) { 
    const now = new Date();
    const taskTime = new Date(currentTime); 
    const diffMs = now - taskTime;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) {
        return `${diffMins} minute(s) ago`;
    } else {
        const diffHours = Math.round(diffMins / 60);
        if (diffHours < 24) {
            return `${diffHours} hour(s) ago`;
        } else {
            const diffDays = Math.round(diffHours / 24);
            return `${diffDays} day(s) ago`;
        }
    }
}

function updateTime() {
    const timestampElements = document.querySelectorAll('li');
    timestampElements.forEach(okay => { 
        const currentTime = okay.getAttribute('data-timestamp'); 
        const timePassed = getTimePassed(currentTime); 
    });
}

function requestNotificationPermission() {
    if (Notification.permission === "granted") {
        return Promise.resolve();
    } else if (Notification.permission !== "denied") {
        return Notification.requestPermission();
    }
}

function checkTaskTimes() {
    const timestampElements = document.querySelectorAll('li');
    timestampElements.forEach(okay => {
        const currentTime = okay.getAttribute('data-timestamp'); 
        const checktime = timepassed(currentTime);
        if (checktime > 5) {
            sendNotification("Task Reminder", `PLEASE COMPLETE YOUR TASK!`);
        }
    });
}

function timepassed(currentTime) { 
    const now = new Date();
    const taskTime = new Date(currentTime);
    const diffMs = now - taskTime;
    return Math.round(diffMs / 1000); 
}

function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showplease();
    requestNotificationPermission().then(() => {
        setInterval(checkTaskTimes, 1000);
    });
});
