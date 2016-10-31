// KNOWN BUGS
// nothin right now

// POTENTIAL FEATURES
// Ability to remove existing date
// Option to sort/filter tasks by date, due today, late, future

// Empty task arrays
var todoList = [];
var doneList = [];

// set empty variables for HTML
var todoListHTML = "";
var doneListHTML = "";

// helper for submit new task bug
var submitReady = false;

// Local Storage Functions
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

// load any existing tasks from local storage
if (localStorage.getObject('todoList')) {
    todoList = localStorage.getObject('todoList');
    console.log("using existing local storage for todo list");
};
if (localStorage.getObject('doneList')) {
    doneList = localStorage.getObject('doneList');
    console.log("using existing local storage for completed task list");
};

// functions to sync with local storage
function syncTodoList() {
    localStorage.setObject('todoList', todoList);
};

function syncDoneList() {
    localStorage.setObject('doneList', doneList);
};

// function to hide/show "clear all" button
function clearAllControl() {
    if ($(".task-completed").length > 0) {
        $("#clear-all-wrapper").css({
            "display": "inline-block"
        });
    } else {
        $("#clear-all-wrapper").css({
            "display": "none"
        });
    }
};

// Constructor Function for new task object
function Task(taskTitle, todo, dueDate) {
    this.taskTitle = taskTitle;
    this.todo = todo;
    this.dueDate = dueDate;
};

// Loop through ToDo List array and create HTML tasks
function generateTodoTasks() {
    for (i = 0; i < todoList.length; i++) {
        var newTaskTitle = todoList[i].taskTitle;
        var newDueDate = todoList[i].dueDate;
        // generate integer of date with year in front
        var newDueDateInt = newDueDate.replace('/', '');
        newDueDateInt = newDueDateInt.replace('/', '');
        var newDueDateIntYr = newDueDateInt.slice(4, 6);
        newDueDateInt = newDueDateInt.slice(0, 4);
        newDueDateInt = newDueDateIntYr + newDueDateInt;
        newDueDateInt = parseInt(newDueDateInt);
        // build html string
        todoListHTML += '<tr class="task-todo" data-index="' + i + '">';
        todoListHTML += '<td><i class="fa fa-check-square-o pull-left check-icon"></i></td>';
        todoListHTML += '<td class="task-text"><textarea rows="1" class="pull-left task-title" maxlength="120">' + newTaskTitle + '</textarea></td>';
        todoListHTML += '<td class="date" data-sort-value="' + newDueDateInt + '"><input type="text" class="pull-right due-date" readonly="true" value="' + newDueDate + '" /></td>';
        todoListHTML += '<td><i class="fa fa-trash-o pull-right close-icon"></i></td>';
        todoListHTML += '</tr>';
    }
};

// Loop through Done List array and create HTML tasks
function generateCompletedTasks() {
    for (i = 0; i < doneList.length; i++) {
        var newTaskTitle = doneList[i].taskTitle;
        var newDueDate = doneList[i].dueDate;
        // generate integer of date with year in front
        var newDueDateInt = newDueDate.replace('/', '');
        newDueDateInt = newDueDateInt.replace('/', '');
        var newDueDateIntYr = newDueDateInt.slice(4, 6);
        newDueDateInt = newDueDateInt.slice(0, 4);
        newDueDateInt = newDueDateIntYr + newDueDateInt;
        newDueDateInt = parseInt(newDueDateInt);
        doneListHTML += '<tr class="task-completed" data-index="' + i + '">';
        doneListHTML += '<td><i class="fa fa-undo pull-left undo-icon"></i></td>';
        doneListHTML += '<td class="task-text"><span class="pull-left">' + newTaskTitle + '</span></td>';
        doneListHTML += '<td class="date" data-sort-value="' + newDueDateInt + '"><span class="pull-right">' + newDueDate + '</span></td>';
        doneListHTML += '<td><i class="fa fa-trash-o pull-right close-icon"></i></td>';
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

// If tasks have no date, move to end of the list
function moveDatelessTasks() {
    $('#todo-list-table .date .due-date').each(function() {
        if ($(this).val() === "") {
            $(this).parents("tr").appendTo("#todo-list-table");
        }
    });
};

// check for tasks that are due today and highlight in green
function dueToday() {
    var today = $.datepicker.formatDate('mm/dd/y', new Date());
    $('#todo-list-table .date .due-date').each(function() {
        if ($(this).val() == today) {
            $(this).val("Today");
            $(this).addClass("soon");
        }
    });
};

// check for tasks that are overdue and highlight in red
function pastDue() {
    var today = parseInt($.datepicker.formatDate('ymmdd', new Date()));
    $('#todo-list-table .date .due-date').each(function() {
        if ($(this).parent().attr("data-sort-value") < today) {
            $(this).addClass("late");
        }
    });
};

// check for tasks that were due yesterday and change text
function dueYesterday() {
    var someDate = new Date();
    someDate.setDate(someDate.getDate() - 1);
    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    var y = someDate.getFullYear().toString().substr(2, 2);
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (dd < 10) {
        dd = "0" + dd;
    }
    yesterday = mm + '/' + dd + '/' + y;

    $('#todo-list-table .date .due-date').each(function() {
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
    var y = someDate.getFullYear().toString().substr(2, 2);
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (dd < 10) {
        dd = "0" + dd;
    }
    tomorrow = mm + '/' + dd + '/' + y;

    $('#todo-list-table .date .due-date').each(function() {
        if ($(this).val() == tomorrow) {
            $(this).val("Tomorrow");
            $(this).addClass("soon");
        }
    });
};

// Format Due Date for readability
function dateReadability() {
    $('#todo-list-table .date .due-date').each(function() {

        if ($(this).val() == "Yesterday" || $(this).val() == "Today" || $(this).val() == "Tomorrow") {
            return;
        }

        var month = $(this).parent().attr("data-sort-value").slice(2, 4);
        var day = $(this).parent().attr("data-sort-value").slice(4, 6);

        if (day.slice(0, 1) == "0") {
            day = day.slice(1, 2);
        }

        if (month == 01) {
            $(this).val("Jan" + " " + day);
        } else if (month == 02) {
            $(this).val("Feb" + " " + day);
        } else if (month == 03) {
            $(this).val("March" + " " + day);
        } else if (month == 04) {
            $(this).val("April" + " " + day);
        } else if (month == 05) {
            $(this).val("May" + " " + day);
        } else if (month == 06) {
            $(this).val("June" + " " + day);
        } else if (month == 07) {
            $(this).val("July" + " " + day);
        } else if (month == 08) {
            $(this).val("Aug" + " " + day);
        } else if (month == 09) {
            $(this).val("Sept" + " " + day);
        } else if (month == 10) {
            $(this).val("Oct" + " " + day);
        } else if (month == 11) {
            $(this).val("Nov" + " " + day);
        } else if (month == 12) {
            $(this).val("Dec" + " " + day);
        }
    });
}

// add task function
function addTask() {
    var taskTitle = $("#new-task-field").val();
    var dueDate = $("#date-field").val();
    var newTask = new Task(taskTitle, true, dueDate);
    todoList.unshift(newTask);
    refreshTodoList();
    syncTodoList();
    console.log("New task added – " + "'" + taskTitle + "'");
};

// Add submitted task to the ToDo List array on click
$("#create-task-button").on("click", function(e) {
    addTask();
    $(".add-new-task").hide();
    $("#new-task-field").val("");
    $("#date-field").val("");
    e.preventDefault();
});

// Add submitted task to the ToDo List array on enter press if date has been entered
$(document).keydown(function(e) {
    if (submitReady && e.keyCode == 13) {
        addTask();
        $(".add-new-task").hide();
        $("#new-task-field").val("");
        $("#date-field").val("");
        submitReady = false;
    }
});

// Show new task popup
$("#new-task-button").on("click", function(e) {
    $(".add-new-task").fadeIn(150);
    $("#new-task-field").focus();
});

// close new task popup on cancel click
$(".cancel").on("click", function(e) {
    $(".add-new-task").hide();
    $("#new-task-field").val("");
    $("#date-field").val("");
    submitReady = false;
});

// close new task popup on esc keydown
$(document).keydown(function(e) {
    if (e.keyCode == 27) {
        $(".add-new-task").hide();
        $("#new-task-field").val("");
        $("#date-field").val("");
        submitReady = false;
    }
});

// close new task popup when clicked outside of popup
$(".add-new-task").on('click', function(event) {
    if (!$(event.target).closest('.popup').length) {
        $(".add-new-task").hide();
        $("#new-task-field").val("");
        $("#date-field").val("");
        submitReady = false;
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
    syncTodoList();
});

// Listen for delete confirmation
$("#incompleted-tasks").on("click", ".confirm-yes", function() {
    // Find matching object and remove it
    var trIndex = ($(this).parents("tr").attr("data-index"));
    for (i = 0; i < todoList.length; i++) {
        if (trIndex == i) {
            console.log("Removed " + "'" + todoList[i].taskTitle + "'" + " from index " + i);
            todoList.splice(i, 1);
            break;
        }
    }
    var toDelete = $(this).parents("tr")
        // Move confirmation box out of current task element so it won't get deleted
    $(".custom-tooltip-wrapper").hide();
    $(document.body).append($(".custom-tooltip-wrapper"));
    // Remove tr parent of clicked close-icon
    toDelete.remove();
    refreshTodoList();
    syncTodoList();
});

// Listen for delete cancel
$("#incompleted-tasks").on("click", ".confirm-no", function() {
    $(".custom-tooltip-wrapper").fadeOut(150, function() {
        $(document.body).append($(".custom-tooltip-wrapper"));
    });
});

// Listen for close-icon click for incompleted tasks and show confirm box
$("#incompleted-tasks").on("click", ".close-icon", function() {
    $(".custom-tooltip-wrapper").hide();
    $(this).before($(".custom-tooltip-wrapper"));
    $(".custom-tooltip-wrapper").fadeIn(150);
});

// Hide delete confirmation box when clicked outside of box
$(document).on('click', function(event) {
    if (!$(event.target).closest('.custom-tooltip-wrapper').length && !$(event.target).closest('.close-icon').length) {
        $(".custom-tooltip-wrapper").fadeOut(150, function() {
            $(document.body).append($(".custom-tooltip-wrapper"));
        });
    }
});

// Listen for close-icon click for completed tasks
$("#completed-tasks").on("click", ".close-icon", function() {
    $(".custom-tooltip-wrapper").hide();
    $(document.body).append($(".custom-tooltip-wrapper"));
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
    syncDoneList();
    clearAllControl();
});

// Listen for check-icon click for incompleted tasks
$("#incompleted-tasks").on("click", ".check-icon", function() {
    $(".custom-tooltip-wrapper").hide();
    $(document.body).append($(".custom-tooltip-wrapper"));
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
    syncTodoList();
    syncDoneList();
    clearAllControl();
});

// Listen for undo-icon click for incompleted tasks
$("#completed-tasks").on("click", ".undo-icon", function() {
    $(".custom-tooltip-wrapper").hide();
    $(document.body).append($(".custom-tooltip-wrapper"));
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
    syncTodoList();
    syncDoneList();
    clearAllControl();
});

// Listen for click to clear all completed tasks
$("#clear-all").on("click", function() {
    doneList = [];
    refreshDoneList();
    syncDoneList();
    clearAllControl();
});

// Call Plugins & Features
$(function() {
    // Call datepicker for creating a new task
    $("#date-field").datepicker({
        dateFormat: "mm/dd/y",
        // callback function after date is selected
        onSelect: function() {
            submitReady = true;
        }
    });
    // Call datepicker for existing tasks
    $('body').on('focus', ".due-date", function() {
        $(this).datepicker({
            dateFormat: "mm/dd/y",
            // callback function after date is selected
            onSelect: function() {
                $("#todo-list-table").hide();
                $(this).removeClass("late soon");
                // update due date in javascript object
                var newDueDate = $(this).val();
                var trIndex = ($(this).parents("tr").attr("data-index"));
                // Find matching object and update the taskTitle
                for (i = 0; i < todoList.length; i++) {
                    if (trIndex == i) {
                        todoList[i].dueDate = newDueDate;
                    }
                }
                refreshTodoList();
                syncTodoList();
            }
        });
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
    dateReadability();
    moveDatelessTasks();
    $("#todo-list-table").fadeIn(500);
});

// create any existing tasks
refreshTodoList();
refreshDoneList();

// if completed tasks exist, show clear all button
clearAllControl();
