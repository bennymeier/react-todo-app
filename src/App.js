import React from 'react';
import './App.css';

const Todo = (props) => {
  return (
    <li onClick={props.addClickHandler}>{props.todo}
      <span className="date-and-time">{props.datetime}</span>
    </li>
  );
}
const DeleteAllBtn = (props) => {
  return (<button onClick={props.addDeleteHandler} className="btn btn-secondary btn-block btn-lg">Delete all todos!</button>);
};
class App extends React.Component {
  constructor() {
    super();
    const todos = [];
    Object.keys(localStorage).forEach((key) => todos.push({ key, ...JSON.parse(localStorage.getItem(key)) }));
    this.state = { todos: [...todos] };
    this.todoField = React.createRef();

  }
  render() {
    return (
      <div className="container">
        <h1>Add todos <span role="img" aria-label="Document">📝</span></h1>
        <input className="todo-input" ref={this.todoField} onKeyDown={this.checkKey.bind(this)} placeholder="Your todo..." type="text" id="add" />
        <button className="add-btn" onClick={this.add.bind(this)}> <span role="img" aria-label="Handshake">👋🏻</span></button>
        <h2>Open Todos</h2>
        <ul>
          {this.state.todos.map((todo) => !todo.isDone && <Todo addClickHandler={() => this.done(todo.key)} key={`${todo.key}_open`} todo={todo.text} datetime={todo.datetime} />)}
        </ul>
        <h2>Completed Todos</h2>
        <ul>
          {this.state.todos.map((todo) => todo.isDone && <Todo addClickHandler={() => this.deleteFromLocalStorage(todo.key)} key={`${todo.key}_done`} todo={todo.text} datetime={todo.datetime} />)}
        </ul>
        <DeleteAllBtn addDeleteHandler={() => this.deleteAll()} />
      </div>
    );
  }
  componentDidMount() {
    this.todoField.current.focus();
  }
  checkKey(e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      this.add();
    }
  }
  async deleteAll() {
    try {
      await this.deleteStorage();
      this.setState({ todos: [] });
    } catch (err) {
      console.error(err);
    }
  }
  deleteStorage() {
    return new Promise((resolve) => {
      localStorage.clear();
      resolve();
    });
  }
  validateInput() {
    return this.todoField.current.value.length > 0;
  }
  async add() {
    return new Promise((resolve, reject) => {
      if (!this.validateInput()) {
        return reject("Todo is missing!");
      }
      const todo = { text: this.todoField.current.value, datetime: new Date().toLocaleString(), isDone: false };
      const key = this.uniqueId();
      const todoWithKey = { ...todo, key }
      this.setState({ todos: [...this.state.todos, todoWithKey] }, async () => await this.addToLocalStorage(key, todo));
      this.clearInput();
      resolve();
    }).catch((err) => console.error(err));
  }
  async done(key) {
    return new Promise(async (resolve, reject) => {
      if (!key) reject(`key is ${key}`);
      let todos = [...this.state.todos];
      const currentTodo = todos.filter((todo) => todo.key === key);
      currentTodo[0].isDone = true;
      await this.updateLocalStorage(currentTodo[0].key, currentTodo[0]);
      this.setState((prev) => ({ todos: [...prev.todos] }));
      resolve();
    });
  }
  delete(key) {
    return new Promise((resolve, reject) => {
      if (!key) reject(`key is ${key}`);
      let todos = [...this.state.todos];
      const newTodos = todos.filter((todo) => todo.key !== key);
      this.setState(({ todos: [...newTodos] }));
      resolve();
    });
  }
  addToLocalStorage(key, todo) {
    return new Promise((resolve) => {
      if (!key) throw new Error(`key is ${key}`);
      localStorage.setItem(key, JSON.stringify(todo));
      resolve();
    });
  }
  updateLocalStorage(key, todo) {
    return new Promise((resolve) => {
      if (!key) throw new Error(`key is ${key}`);
      // if (todo.key) delete todo.key;
      localStorage.setItem(key, JSON.stringify(todo));
      resolve();
    });
  }
  deleteFromLocalStorage(key) {
    return new Promise(async (resolve) => {
      if (!key) throw new Error(`key is ${key}`);
      await this.delete(key);
      localStorage.removeItem(key);
      resolve();
    });
  }
  clearInput() {
    this.todoField.current.value = "";
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
