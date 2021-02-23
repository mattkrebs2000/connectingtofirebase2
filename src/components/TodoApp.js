import React, { useState, useEffect } from "react";
import "./todoapp.css";
import firebase from "./firebase";

function TodoApp() {
  const [task, setTask] = useState("");
  const [tasklist, setTaskList] = useState([]);
   const [idOfUpdate, setIdOfUpdate] = useState(null);
  const [truth, setTruth] = useState();

   useEffect(() => {
    populate();
  }, []);

  useEffect(() => {
    let id = idOfUpdate;
    if (id !== null) {
      markCompleteGlobal();
    }
  }, [truth]);

  const markCompleteGlobal = () => {
      let id = idOfUpdate;
    const itemtoupdate = firebase
      .firestore()
      .collection("task")
      .doc(id);

    itemtoupdate.update({
      isCompleted: truth,
    });
  // debugger
    setIdOfUpdate(null);
    setTruth(null);
  };





  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const AddTask = () => {
    if (task !== "") {
        const datas = {
      id: firebase
        .firestore()
        .collection("tasksss")
        .doc().id,
    };

     const taskDetails = {
        id: datas.id,
        value: task,
        isCompleted: false,
      };

    const db = firebase.firestore();
    db.collection("task")
      .doc(datas.id)
      .set({ value: task, isCompleted: false, id: datas.id }).then(() => {
         setTaskList([...tasklist, taskDetails]);
         console.log("this is a new one");
        populate();
      });
    }
  };


    const populate = (data) => {

   setTaskList([])
    return firebase
      .firestore()
      .collection("task")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let newData = doc.data();

          if (tasklist.indexOf(newData.id) === -1) {
            setTaskList((arr) => {
              return [...arr, newData];
            });
          } else {
            console.log("this is a duplicate");
          }
          console.log("here are all of the todos", tasklist);
        });
      })
      .catch((e) => console.log(e));
  };



  const deletetask = (e, id) => {
    e.preventDefault();
    const db = firebase.firestore();
    db.collection("task")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!", id);
      })
      .catch((error) => {
        console.error(id, "Error removing document: ", error);
      })
      .then((res) => setTaskList([...tasklist.filter((todo) => todo.id !== id)]));
    console.log(id, "here is an id", id);
  };


  const taskCompleted = (e, id) => {
    e.preventDefault();
    setIdOfUpdate(id);
 setTaskList(
      tasklist.map((todo) => {
        if (todo.id === id) {
          todo.isCompleted = !todo.isCompleted;

          setTimeout(function() {
            setTruth(todo.isCompleted);
          }, 1000);
        }
        return todo;
      })
    )
    console.log("Second", idOfUpdate, truth);

  };







  return (
    <div className="todo">
      <input
        type="text"
        name="text"
        id="text"
        onChange={(e) => handleChange(e)}
        placeholder="Add task here..."
      />
      <button className="add-btn" onClick={AddTask}>
        Add
      </button>
      <br />
      {tasklist !== [] ? (
        <ul>
          {tasklist.map((t) => (
            <li className={t.isCompleted ? "crossText" : "listitem"}>
              {t.value}
              <button
                className="completed"
                onClick={(e) => taskCompleted(e, t.id)}
              >
                Completed
              </button>

              <button className="delete" onClick={(e) => deletetask(e, t.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default TodoApp;
