import { EVENT_NAMES } from '../helpers/constants';
import { TaskList } from './TaskList';

export class ListsHolder {
  collection = [];
  listnode = null;
  #parentNode;

  constructor(selector) {
    this.#mountOnNode(selector);
    this.#addDestroyListener();
  }

  get parentNode() {
    return this.#parentNode;
  }

  #mountOnNode(selector) {
    this.#parentNode = document.querySelector(selector);

    this.listNode = document.createElement('section');
    this.listNode.classList.add('lists-holder');
    this.listNode.dataset.testid = 'list-node';

    const listAddBtn = document.createElement('button');
    listAddBtn.dataset['testid'] = 'list-adder';
    listAddBtn.innerHTML = 'New List';
    listAddBtn.addEventListener('click', () => {
      const newList = new TaskList(this.listNode);
      this.collection.push(newList.rawData);
    });

    [this.listNode, listAddBtn].forEach(el => this.#parentNode.append(el));
  }

  #addDestroyListener() {
    this.listNode.addEventListener(EVENT_NAMES.LIST_DESTROYED, e => {
      const { id } = e.target.dataset;

      this.deleteFromCollection(id);
    });
  }

  deleteFromCollection(id) {
    const index = this.collection.findIndex(list => list.id == id);

    if (index < 0) return;
    this.collection.splice(index, 1);
  }
}
