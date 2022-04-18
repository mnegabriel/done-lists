import { EVENT_NAMES } from '../helpers/constants';
import { uid } from '../helpers/general';

const emitEvent = name => new CustomEvent(name, {
  bubbles: true,
  cancelable: true
});

export class TaskList {
  #listNode = null;

  constructor(parent, initialData) {
    this._parent = parent;

    if (initialData) this.#fromData(initialData);
    else this.#fromScratch();

    this.#renderList();
  }

  get node() {
    return this.#listNode;
  }

  get rawData() {
    return {
      id: this.id,
      name: this.name,
      items: this.items,
    };
  }

  #fromData(data) {
    this.id = data.id;
    this.name = data.name;
    this.items = data.items;
  }

  #fromScratch() {
    this.id = uid();
    this.name = 'New list';
    this.items = [];
  }

  add(name) {
    const newItem = {
      id: uid(),
      name,
      done: false,
    };

    this.items.push(newItem);

    if (this.#isRendered) {
      const ul = this.#listNode.querySelector(`[data-id="${this.id}"] ul`);

      const li = this.#scaffoldListItem(newItem);

      ul.append(li);

      const addEvent = emitEvent(EVENT_NAMES.TASK_CREATED);

      li.dispatchEvent(addEvent);
    }

    return newItem;
  }

  toggle(id, desiredValue) {
    const selected = this.items.find(task => task.id === id);

    if (!selected) return;

    selected.done =
      typeof desiredValue === 'boolean' ? desiredValue : !selected.done;

    if (this.#isRendered) {
      const node = this.#listNode.querySelector(`[data-id="${id}"]`);
      node.dataset.done = selected.done;
      node.children[0].innerHTML = selected.done ? '&times;' : '&omicron;';

      const toggledEvent = emitEvent(EVENT_NAMES.TASK_TOGGLED);
      node.dispatchEvent(toggledEvent);
    }
  }

  remove(id) {
    const index = this.items.findIndex(task => task.id === id);

    if (index < 0) return;

    this.items.splice(index, 1);

    if (this._parent) {
      const node = this.#listNode.querySelector(`[data-id="${id}"]`);

      const toggledEvent = emitEvent(EVENT_NAMES.TASK_REMOVED);
      node.dispatchEvent(toggledEvent);

      node.remove();
    }
  }

  destroy() {
    const destroyedEvent = emitEvent(EVENT_NAMES.LIST_DESTROYED);

    this.#listNode.dispatchEvent(destroyedEvent);
    this.#listNode.remove();
  }

  #renderList() {
    const wrapper = document.createElement('article');
    wrapper.dataset.testId = 'task-list';
    wrapper.dataset.id = this.id;

    const header = this.#createHeader();

    const ul = document.createElement('ul');
    const listItems = this.items.map(item => this.#scaffoldListItem(item));
    listItems.forEach(el => ul.appendChild(el));

    const form = this.#createFooter();

    [header, ul, form].forEach(el => wrapper.appendChild(el));

    this.#listNode = wrapper;

    this._parent && this._parent.append(this.#listNode);
  }

  get #isRendered() {
    return !!this._parent && !!this.#listNode;
  }

  #createHeader() {
    const header = document.createElement('header');

    const h5 = document.createElement('h5');
    h5.innerHTML = this.name;

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('list-remover');
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
      this.destroy();
    });

    [h5, removeBtn].forEach(el => header.append(el));

    return header;
  }

  #createFooter() {
    const form = document.createElement('form');
    form.innerHTML = `
      <input name="task" type="text" >
      <input type="submit" class="add" value="add">
    `;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const { task } = Object.fromEntries(new FormData(e.target).entries());

      const trimmed = task.trim().replace(/\s+/g, ' ');
      if (!trimmed) return;

      this.add(trimmed);

      e.target.reset();
    });

    return form;
  }

  #scaffoldListItem(item) {
    const { id, done, name } = item;

    const li = document.createElement('li');
    li.dataset.id = id;
    li.dataset.done = done;

    const span = document.createElement('span');
    span.classList.add('toggler');
    span.innerHTML = done ? '&times;' : '&omicron;';

    span.addEventListener('click', () => {
      this.toggle(id);
    });

    const h6 = document.createElement('h6');
    h6.innerHTML = name;

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('task-remover');
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
      this.remove(id);
    });

    [span, h6, removeBtn].forEach(el => li.append(el));
    return li;
  }
}
