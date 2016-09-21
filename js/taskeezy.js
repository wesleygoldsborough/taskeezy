// Empty task arrays
var todoList = [];
var doneList = [];

// Initial task arrays
var initialtodoList = [
  {taskTitle: "Do The Laundry",todo: true,dueDate: "09/20"},
  {taskTitle: "Clean the Bathroom",todo: true,dueDate: "09/21"},
  {taskTitle: "Make Dinner",todo: true,dueDate: "09/22"}
];
var initialdoneList = [
  {taskTitle: "Watch TV",todo: false,dueDate: "08/16"},
  {taskTitle: "Take A Nap",todo: false,dueDate: "08/19"},
  {taskTitle: "Eat Pizza",todo: false,dueDate: "08/25"}
];

// Constructor Function for new task object
function Task (taskTitle, todo, dueDate) {
  this.taskTitle = taskTitle;
  this.todo = todo;
  this.dueDate = dueDate;
};

// set empty variable for HTML
var todoListHTML = "";
var doneListHTML = "";

// Loop through ToDo List array and create HTML tasks
function generateTodoTasks () {
  for (i=0;i<todoList.length;i++) {
    var newTaskTitle = todoList[i].taskTitle;
    var newDueDate = todoList[i].dueDate;
    todoListHTML += '<tr class="task-todo" data-index="' + i + '">';
    todoListHTML += '<td><i class="fa fa-check-square-o pull-left check-icon"></i></td>';
    todoListHTML += '<td class="task-text"><span class="pull-left">' + newTaskTitle + '</span></td>';
    todoListHTML += '<td class="date"><span class="pull-right">' + newDueDate + '</span></td>';
    todoListHTML += '<td><i class="fa fa-close pull-right close-icon"></i></td>';
    todoListHTML += '</tr>';
  }
};

// Loop through ToDo List array and create HTML tasks
function generateCompletedTasks () {
  for (i=0;i<doneList.length;i++) {
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
function refreshTodoList () {
  $("#todo-list").empty();
  todoListHTML = "";
  generateTodoTasks();
  $("#todo-list").html(todoListHTML);
  $("#incompleted-date-sort").stupidsort('asc');
};

// Convert tasks from Completed List array to HTML
function refreshDoneList () {
  $("#completed-list").empty();
  doneListHTML = "";
  generateCompletedTasks();
  $("#completed-list").html(doneListHTML);
  $("#completed-date-sort").stupidsort('asc');
};

// check for tasks that are due today and highlight in green
function dueToday () {
  var today = $.datepicker.formatDate('mm/dd', new Date());
  $('#todo-list-table .date span').each(function(i, obj) {
    if ($(this).text() == today) {
      $(this).text("Due Today");
      $(this).css({color: '#28c262', fontWeight: 'bold'});
    }
  });
};

// check for tasks that are overdue and highlight in red
function pastDue () {
  var today = $.datepicker.formatDate('mm/dd', new Date());
  $('#todo-list-table .date span').each(function(i, obj) {
    if ($(this).text() < today) {
      $(this).css({color: '#bf0b0b', fontWeight: 'bold'});
    }
  });
};

// add task function
function addTask () {
  var taskTitle = $("#new-task-field").val();
  var dueDate = $("#date-field").val();
  if (taskTitle !== "") {
    var newTask = new Task (taskTitle, true, dueDate);
    todoList.unshift(newTask);
    refreshTodoList();
    console.log("New task added – " + "'" + taskTitle + "'");
  } else {
    console.log("Empty task. No task added.");
  }
};

// Add submitted task to the ToDo List array on click
$("#create-task-button").on( "click", function(e) {
  addTask();
  $(".blackout").fadeOut(110, function () {
    $("#new-task-field").val("");
    $("#date-field").val("");
  });
  e.preventDefault();
});

// Show new task popup
$("#new-task-button").on( "click", function(e) {
  $(".blackout").fadeIn(110);
  $("#new-task-field").focus();
});

$(document).keyup(function(e) {
     if (e.keyCode == 78) {
        $(".blackout").fadeIn(110);
        $("#new-task-field").focus();
    }
});

// close new task popup
$(".cancel").on( "click", function(e) {
  $(".blackout").fadeOut(110, function () {
    $("#new-task-field").val("");
    $("#date-field").val("");
  });
});

$(document).keyup(function(e) {
     if (e.keyCode == 27) {
        $(".blackout").fadeOut(110, function () {
          $("#new-task-field").val("");
          $("#date-field").val("");
        });
    }
});

// Listen for close-icon click for incompleted tasks
$("#incompleted-tasks").on( "click", ".close-icon", function() {
  var liIndex = ($(this).parents("tr").attr("data-index"));
  for (i=0;i<todoList.length;i++) {
    // Find matching object and remove it
    if (liIndex == i) {
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
$("#completed-tasks").on( "click", ".close-icon", function() {
  var liIndex = ($(this).parents("tr").attr("data-index"));
  for (i=0;i<doneList.length;i++) {
    // Find matching object and remove it
    if (liIndex == i) {
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
$("#incompleted-tasks").on( "click", ".check-icon", function() {
  var liIndex = ($(this).parents("tr").attr("data-index"));
  for (i=0;i<todoList.length;i++) {
    // Find matching object, mark as completed, and move to completed list array
    if (liIndex == i) {
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
$("#completed-tasks").on( "click", ".undo-icon", function() {
  var liIndex = ($(this).parents("tr").attr("data-index"));
  for (i=0;i<doneList.length;i++) {
    // Find matching object, mark as completed, and move to completed list array
    if (liIndex == i) {
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

// Call Plugins
$(function() {
  // Call datepicker
  $("#date-field").datepicker({ dateFormat: "mm/dd" });
  // Call table sorter
  $("table").stupidtable();
});

// callbacks after table has been sorted by date
var table = $("#todo-list-table").stupidtable();
table.bind('aftertablesort', function (event, data) {
    dueToday();
    pastDue();
});
