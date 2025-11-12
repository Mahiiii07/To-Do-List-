// Elements
const inputBox = document.getElementById("input-box");
const addButton = document.getElementById("addTask");
const dropdownMenu = document.getElementById("dropdownMenu");
const taskList = document.getElementById("taskList");
let selectedPriority = null;
let taskBeingEdited = null; // store LI which is being edited


// Toggle dropdown
function toggleDropdown() {
    dropdownMenu.classList.toggle("hidden");
}
// Toggle Task List Image
function updateEmptyState() {
    const emptyImage = document.getElementById("emptyState");
    const hasTasks = taskList.querySelectorAll("li").length > 0;
    emptyImage.style.display = hasTasks ? "none" : "block";
}

// Progress Bar Function
function updateProgress() {
    const total = taskList.querySelectorAll("li").length;
    const completed = taskList.querySelectorAll("li.completed").length;

    // Update the numbers (X / Y)
    document.getElementById("numbers").textContent = `${completed} / ${total}`;

    // Update progress bar
    const progressBar = document.getElementById("progress");
    
    if (total === 0) {
        progressBar.style.width = "0%";
        return;
    }

    const percent = (completed / total) * 100;
    progressBar.style.width = percent + "%";
}


// Priority select
document.getElementById("level1").onclick = () => { selectedPriority = 1; dropdownMenu.classList.add("hidden"); };
document.getElementById("level2").onclick = () => { selectedPriority = 2; dropdownMenu.classList.add("hidden"); };
document.getElementById("level3").onclick = () => { selectedPriority = 3; dropdownMenu.classList.add("hidden"); };

// Icons
const priorityIcons = {
    1: "../Assets/Green Star.png",
    2: "../Assets/Blue Star.png",
    3: "../Assets/Red Star.png"
};

// Add or Update task
addButton.addEventListener("click", () => {
    const text = inputBox.value.trim();

    // If editing an existing task
    if (taskBeingEdited) {
        if (text === "") {
            taskBeingEdited.remove(); // delete when blank
            updateEmptyState();
            updateProgress();
        } else {
            taskBeingEdited.querySelector(".task-text").textContent = text;
        }

        taskBeingEdited = null;
        inputBox.value = "";
        addButton.textContent = "Add";
        return;
    }

    // Otherwise normal add
    if (!text) {
        alert("Enter a task first");
        return;
    }
    if (!selectedPriority) {
        alert("Select a priority level");
        return;
    }

    const li = document.createElement("li");
    li.className =
        "flex justify-between items-center bg-blue-50 border-2 border-dark-blue px-4 py-3 rounded-2xl";

    li.innerHTML = `
  <div class="flex items-start gap-3 w-full">
      <img src="../Assets/unchecked.png" class="h-5 cursor-pointer status-btn flex-shrink-0">
      <p class="text-lg font-medium task-text break-words whitespace-normal w-full">
          ${text}
      </p>
  </div>

  <div class="flex items-center gap-4 flex-shrink-0">
      <img src="${priorityIcons[selectedPriority]}" class="h-5 priority-icon">
      <img src="../Assets/edit.svg" class="h-5 cursor-pointer edit-btn">
      <img src="../Assets/delete.png" class="h-5 cursor-pointer delete-btn">
  </div>
`;

    taskList.appendChild(li);
    updateEmptyState();
    updateProgress();
    selectedPriority = null;
    inputBox.value = "";
});

// Edit + Delete
taskList.addEventListener("click", (e) => {
    const target = e.target;

    // Delete task
    if (target.classList.contains("delete-btn")) {
        target.closest("li").remove();
        updateEmptyState();
        updateProgress();
        return;
    }

    // Edit task
    if (target.classList.contains("edit-btn")) {
        taskBeingEdited = target.closest("li");
        const existingText = taskBeingEdited.querySelector(".task-text").textContent;

        inputBox.value = existingText;
        addButton.textContent = "Upd";
        

        return; 
    }

    // Toggle checked/unchecked task
    if (target.classList.contains("status-btn")) {
        const li = target.closest("li");
        const text = li.querySelector(".task-text");

        const isDone = li.classList.contains("completed");

        if (isDone) {
            // Mark as incomplete
            target.src = "../Assets/unchecked.png";
            text.classList.remove("line-through");
            li.classList.remove("completed");
        } else {
            // Mark as complete
            target.src = "../Assets/checked.png";
            text.classList.add("line-through");
            li.classList.add("completed");
        }

        updateProgress();
        return;
    }
});