import React from 'react';
import './App.css';

const Todo = (props) => {
  return (
    <li data-key={props.id} onClick={props.addClickHandler}>{props.todo}
      <span data-key={props.id} className="date-and-time">{props.datetime}</span>
    </li>
  );
}
class App extends React.Component {
  constructor() {
    super();
    const todos = [];
    Object.keys(localStorage).forEach((key) => todos.push({ key, ...JSON.parse(localStorage.getItem(key)) }));
    this.state = { todos: [...todos] };
  }
  render() {
    return (
      <div className="container">
        <h1>Add todos <span role="img" aria-label="Document">📝</span></h1>
        <input className="todo-input" onKeyDown={this.checkKey.bind(this)} placeholder="Your todo..." type="text" id="add" />
        <button className="add-btn" onClick={this.add.bind(this)}> <span role="img" aria-label="Handshake">👋🏻</span></button>
        <h2>Open Todos</h2>
        <ul>
          {this.state.todos.map((todo) => !todo.isDone ? <Todo addClickHandler={this.done.bind(this)} id={todo.key} key={todo.key} todo={todo.text} datetime={todo.datetime} /> : undefined)}
        </ul>
        <h2>Completed Todos</h2>
        <ul>
          {this.state.todos.map((todo) => todo.isDone ? <Todo id={todo.key} key={todo.key} todo={todo.text} /> : undefined)}
        </ul>
      </div>
    );
  }
  componentDidMount() {
    this.todoField = document.getElementById("add");
  }
  checkKey(e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      this.add();
    }
  }
  async add() {
    const todo = { text: this.todoField.value, datetime: new Date().toLocaleString(), isDone: false };
    const key = this.uniqueId();
    const todoWithKey = { ...todo, key }
    this.setState({ todos: [...this.state.todos, todoWithKey] }, async () => await this.addToLocalStorage(key, todo));
    this.todoField.value = "";
  }
  async done(e) {
    const key = e.target.getAttribute("data-key");
    let todos = [...this.state.todos];
    for (const todo of todos) {
      if (todo.key === key) {
        todo.isDone = true;
        await this.updateLocalStorage(todo.key, todo);
        this.setState({ todos: [...todos] });
      }
    }
  }
  addToLocalStorage(key, todo) {
    return new Promise((resolve) => {
      localStorage.setItem(key, JSON.stringify(todo));
      resolve();
    });
  }
  updateLocalStorage(key, todo) {
    return new Promise((resolve) => {
      if (todo.key) delete todo.key;
      localStorage.setItem(key, JSON.stringify(todo));
      resolve();
    });
  }
  deleteFromLocalStorage() {

  }
  uniqueId() {
    const ID_LENGTH = 36;
    const START_LETTERS_ASCII = 97; // Use 64 for uppercase
    const ALPHABET_LENGTH = 26;
    return [...new Array(ID_LENGTH)]
      .map(() => String.fromCharCode(START_LETTERS_ASCII + Math.random() * ALPHABET_LENGTH))
      .join('');
  }
}
export default App;
