// KNOWN BUGS
// Sort by date does not factor the year
// Enter key doesn't submit new task after date is picked

// NEEDED FEATURES
// Ask for confirmation before deleting task
// Ability to change existing task due date and then resort data
// Limit Completed Task list to show first 10 but allow to show the next 10
// Allow to clear all completed tasks with one click (ask confirmation)

// Empty task arrays
var todoList = [];
var doneList = [];

// Initial task arrays
var initialtodoList = [{
    taskTitle: "Do The Laundry",
    todo: true,
    dueDate: "10/12"
}, {
    taskTitle: "Clean the Bathroom",
    todo: true,
    dueDate: "10/13"
}, {
    taskTitle: "Make Dinner",
    todo: true,
    dueDate: "10/14"
}];
var initialdoneList = [{
    taskTitle: "Watch TV",
    todo: false,
    dueDate: "08/16"
}, {
    taskTitle: "Take A Nap",
    todo: false,
    dueDate: "08/19"
}, {
    taskTitle: "Eat Pizza",
    todo: false,
    dueDate: "08/25"
}];

// Constructor Function for new task object
function Task(taskTitle, todo, dueDate) {
    this.taskTitle = taskTitle;
    this.todo = todo;
    this.dueDate = dueDate;
};

// set empty variable for HTML
var todoListHTML = "";
var doneListHTML = "";

// Loop through ToDo List array and create HTML tasks
function generateTodoTasks() {
    for (i = 0; i < todoList.length; i++) {
        var newTaskTitle = todoList[i].taskTitle;
        var newDueDate = todoList[i].dueDate;
        todoListHTML += '<tr class="task-todo" data-index="' + i + '">';
        todoListHTML += '<td><i class="fa fa-check-square-o pull-left check-icon"></i></td>';
        todoListHTML += '<td class="task-text"><textarea rows="1" class="pull-left task-title" maxlength="120">' + newTaskTitle + '</textarea></td>';
        todoListHTML += '<td class="date"><input type="text" class="pull-right due-date" value="' + newDueDate + '" /></td>';
        todoListHTML += '<td><i class="fa fa-close pull-right close-icon"></i></td>';
        todoListHTML += '</tr>';
    }
};

// Loop through ToDo List array and create HTML tasks
function generateCompletedTasks() {
    for (i = 0; i < doneList.length; i++) {
        var newTaskTitle = doneList[i].taskTitle;
        var newDueDate = doneList[i].dueDate;
        doneListHTML += '<tr class="task-completed" data-index="' + i + '">';
        doneListHTML += '<td><i class="fa fa-undo pull-left undo-icon"></i></td>';
        doneListHTML += '<td class="task-text"><span class="pull-left">' + newTaskTitle + '</span></td>';
        doneListHTML += '<td class="date"><span class="pull-right">' + newDueDate + '</span></td>';
        doneListHTML += '<td><i class="fa fa-close pull-right close-icon"></i></td>';
        doneListHTML += '</tr>';
    }
};

// Convert tasks from ToDo List array to HTML
function refreshTodoList() {
    $("#todo-list").empty();
    todoListHTML = "";
    generateTodoTasks();
    $("#todo-list").html(todoListHTML);
    $("#incompleted-date-sort").stupidsort('asc');

};

// Convert tasks from Completed List array to HTML
function refreshDoneList() {
    $("#completed-list").empty();
    doneListHTML = "";
    generateCompletedTasks();
    $("#completed-list").html(doneListHTML);
    $("#completed-date-sort").stupidsort('asc');
};

// check for tasks that are due today and highlight in green
function dueToday() {
    var today = $.datepicker.formatDate('mm/dd', new Date());
    $('#todo-list-table .date span').each(function(i, obj) {
        if ($(this).text() == today) {
            $(this).text("Today");
            $(this).css({
                color: '#28c262',
                fontWeight: 'bold'
            });
        }
    });
};

// check for tasks that are overdue and highlight in red
function pastDue() {
    var today = $.datepicker.formatDate('mm/dd', new Date());
    $('#todo-list-table .date .due-date').each(function(i, obj) {
        if ($(this).val() < today) {
            $(this).css({
                color: '#bf0b0b',
                fontWeight: 'bold'
            });
        }
    });
};

// check for tasks that were due yesterday and change text
function dueYesterday() {
    var someDate = new Date();
    someDate.setDate(someDate.getDate() - 1);
    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (dd < 10) {
        dd = "0" + dd;
    }
    yesterday = mm + '/' + dd;

    $('#todo-list-table .date .due-date').each(function(i, obj) {
        if ($(this).val() == yesterday) {
            $(this).val("Yesterday");
        }
    });
};

// check for tasks that are due tomorrow and change text
function dueTomorrow() {
    var someDate = new Date();
    someDate.setDate(someDate.getDate() + 1);
    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (dd < 10) {
        dd = "0" + dd;
    }
    tomorrow = mm + '/' + dd;

    $('#todo-list-table .date .due-date').each(function(i, obj) {
        if ($(this).val() == tomorrow) {
            $(this).val("Tomorrow");
            $(this).css({
                color: '#28c262',
                fontWeight: 'bold'
            });
        }
    });
};

// add task function
function addTask() {
    var taskTitle = $("#new-task-field").val();
    var dueDate = $("#date-field").val();
    var newTask = new Task(taskTitle, true, dueDate);
    todoList.unshift(newTask);
    refreshTodoList();
    console.log("New task added – " + "'" + taskTitle + "'");
};

// Add submitted task to the ToDo List array on click
$("#create-task-button").on("click", function(e) {
    addTask();
    $(".blackout").fadeOut(110, function() {
        $("#new-task-field").val("");
        $("#date-field").val("");
    });
    e.preventDefault();
});

// Show new task popup
$("#new-task-button").on("click", function(e) {
    $(".blackout").fadeIn(110);
    $("#new-task-field").focus();
});

// close new task popup on cancel click
$(".cancel").on("click", function(e) {
    $(".blackout").fadeOut(110, function() {
        $("#new-task-field").val("");
        $("#date-field").val("");
    });
});

// close new task popup on esc keydown
$(document).keydown(function(e) {
    if (e.keyCode == 27) {
        $(".blackout").fadeOut(110, function() {
            $("#new-task-field").val("");
            $("#date-field").val("");
        });
    }
});

// blur textArea when you press enter
$(document).keydown(function(e) {
    if (e.keyCode == 13) {
        $(".task-title:focus").blur();
    }
});

// Listen for blur of textarea to update title
$("#incompleted-tasks").on("blur", ".task-title", function() {
    $(this).text($(this).val());
    var newText = $(this).text();
    var trIndex = ($(this).parents("tr").attr("data-index"));
    // Find matching object and update the taskTitle
    for (i = 0; i < todoList.length; i++) {
        if (trIndex == i) {
            todoList[i].taskTitle = newText;
        }
    }
});

// Listen for close-icon click for incompleted tasks
$("#incompleted-tasks").on("click", ".close-icon", function() {
    var trIndex = ($(this).parents("tr").attr("data-index"));
    // Find matching object and remove it
    for (i = 0; i < todoList.length; i++) {
        if (trIndex == i) {
            console.log("Removed " + "'" + todoList[i].taskTitle + "'" + " from index " + i);
            todoList.splice(i, 1);
            break;
        }
    }
    // Remove tr parent of clicked close-icon
    $(this).parents("tr").remove();
    refreshTodoList();
});

// Listen for close-icon click for completed tasks
$("#completed-tasks").on("click", ".close-icon", function() {
    var trIndex = ($(this).parents("tr").attr("data-index"));
    for (i = 0; i < doneList.length; i++) {
        // Find matching object and remove it
        if (trIndex == i) {
            console.log("Removed " + "'" + doneList[i].taskTitle + "'" + " from index " + i);
            doneList.splice(i, 1);
            break;
        }
    }
    // Remove tr parent of clicked close-icon
    $(this).parents("tr").remove();
    refreshDoneList();
});

// Listen for check-icon click for incompleted tasks
$("#incompleted-tasks").on("click", ".check-icon", function() {
    var trIndex = ($(this).parents("tr").attr("data-index"));
    for (i = 0; i < todoList.length; i++) {
        // Find matching object, mark as completed, and move to completed list array
        if (trIndex == i) {
            console.log("Task " + "'" + todoList[i].taskTitle + "'" + " completed");
            todoList[i].todo = false;
            doneList.unshift(todoList[i]);
            todoList.splice(i, 1);
            break;
        }
    }
    // Remove tr parent of clicked close-icon
    $(this).parents("tr").remove();
    refreshTodoList();
    refreshDoneList();
});

// Listen for undo-icon click for incompleted tasks
$("#completed-tasks").on("click", ".undo-icon", function() {
    var trIndex = ($(this).parents("tr").attr("data-index"));
    for (i = 0; i < doneList.length; i++) {
        // Find matching object, mark as completed, and move to completed list array
        if (trIndex == i) {
            console.log("Task " + "'" + doneList[i].taskTitle + "'" + " moved back to Todo List");
            doneList[i].todo = true;
            todoList.unshift(doneList[i]);
            doneList.splice(i, 1);
            break;
        }
    }
    // Remove tr parent of clicked close-icon
    $(this).parents("tr").remove();
    refreshTodoList();
    refreshDoneList();
});

// Create todo tasks
initialtodoList.forEach(function(task) {
    var myTask = new Task(task.taskTitle, task.todo, task.dueDate);
    // add to the proper array
    todoList.unshift(myTask);
    // render HTML tasks on page
    refreshTodoList();
});

// Create completed tasks
initialdoneList.forEach(function(task) {
    var myTask = new Task(task.taskTitle, task.todo, task.dueDate);
    // add to the proper array
    doneList.unshift(myTask);
    // render HTML tasks on page
    refreshDoneList();
});

// Call Plugins & Features
$(function() {
    // Call datepicker
    $("#date-field, .due-date").datepicker({
        dateFormat: "mm/dd"
    });
    // Call table sorter
    $("table").stupidtable();
    // Call TextArea AutoResize
    autosize($('textarea'));
});

// callbacks after todo list has been sorted by date
var table = $("#todo-list-table").stupidtable();
table.bind('aftertablesort', function(event, data) {
    dueToday();
    pastDue();
    dueYesterday();
    dueTomorrow();
    autosize($('textarea'));
});
