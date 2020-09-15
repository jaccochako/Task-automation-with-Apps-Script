'use strict'

function listCourses() {
  let courseList = Classroom.Courses.list({ courseStates: "ACTIVE" }).courses;
  let tasks = Tasks.Tasks.list("Sk9sa0czR0ZORGxDUEMwVA", {maxResults: 50, showHidden: true}).items;

    courseList.forEach(course => {

        // agarra todas las tareas de una materia
        let courseWorks = Classroom.Courses.CourseWork.list(course.id).courseWork;

        courseWorks.forEach(courseWork => {
            try { 

                let mySub = Classroom.Courses.CourseWork.StudentSubmissions.list(course.id, courseWork.id).studentSubmissions[0];

                Logger.log(mySub.state + " " + courseWork.title);

                if (mySub.state != "TURNED_IN" && mySub.state != "RETURNED" && !isAlreadyCreated(courseWork.title,tasks)) {
                    if (courseWork.dueDate == null) {
                        addTask("Sk9sa0czR0ZORGxDUEMwVA", courseWork.title, courseWork.alternateLink);
                    } else {

                        addTask("Sk9sa0czR0ZORGxDUEMwVA", courseWork.title, courseWork.dueDate.day + "/" + courseWork.dueDate.month + "\n" + courseWork.alternateLink);

                    }


                }
            } catch (error) {
                Logger.log(error + " " + course.name + " " + courseWork.title);

            }
        });

    });
}





function isAlreadyCreated(taskName, tasksCreated){
  if (tasksCreated == null) {
      return false;
  }
    return tasksCreated.filter(task => task.title === taskName).length > 0;
}



function addTask(taskListId, title, description) {
    let task = {
        title: title,
        notes: description
    };
    task = Tasks.Tasks.insert(task, taskListId);
    Logger.log('Task "%s" was created.', title);
}

function deleteTasks() {
  
  try{

    let tasksToDelete = Tasks.Tasks.list("Sk9sa0czR0ZORGxDUEMwVA").items;
    Logger.log(tasksToDelete.length);


    tasksToDelete.forEach(task => {
        Tasks.Tasks.remove("Sk9sa0czR0ZORGxDUEMwVA", task.id);
    });

    Logger.log("Tareas borrasdas");

    tasksToDelete = Tasks.Tasks.list("Sk9sa0czR0ZORGxDUEMwVA", { maxResults: 99 }).items;

    if (tasksToDelete == null || tasksToDelete.length >= 100) {
        deleteTasks();
    }
}catch(error){
  Logger.log(error);
}

}
