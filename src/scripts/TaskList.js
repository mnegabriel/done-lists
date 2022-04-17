import { uid } from "../helpers/general"

export class TaskList {
  #listNode = null

  constructor(parent, initialData) {
    this._parent = parent

    if (initialData) this.#fromData(initialData)
    else this.#fromScratch()

    this.#renderList()
  }

  get node() {
    return this.#listNode
  }

  #fromData(data) {
    this.id = data.id
    this.name = data.name
    this.items = data.items
  }

  #fromScratch() {
    this.id = uid()
    this.name = 'New list'
    this.items = []
  }

  add(name) {
    const newItem = {
      id: uid(),
      name,
      done: false
    }

    this.items.push(newItem)

    if (this.#isRendered) {
      const ul = this.#listNode.querySelector(`[data-id="${this.id}"] ul`)

      ul.append(this.#scaffoldListItem(newItem))
    }

    return newItem
  }

  toggle(id, desiredValue) {
    const selected = this.items.find(task => task.id === id)

    if (!selected) return

    selected.done = typeof desiredValue === 'boolean'
      ? desiredValue
      : !selected.done

    if (this.#isRendered) {
      const node = this.#listNode.querySelector(`[data-id="${id}"]`)
      node.dataset.done = selected.done
      node.children[0].innerHTML = selected.done
        ? '&times;'
        : '&omicron;'
    }
  }

  remove(id) {
    const index = this.items.findIndex(task => task.id === id)

    if (index < 0) return

    this.items.splice(index, 1)

    if (this._parent) {
      this.#listNode.querySelector(`[data-id="${id}"]`).remove()
    }
  }

  destroy() {
    this.#listNode.remove()
  }

  #renderList() {
    const wrapper = document.createElement('article')
    wrapper.dataset.testId = 'task-list'
    wrapper.dataset.id = this.id

    const header = this.#createHeader()

    const ul = document.createElement('ul')
    const listItems = this.items.map(item => this.#scaffoldListItem(item));
    listItems.forEach(el => ul.appendChild(el));

    const form = this.#createFooter();

    [header, ul, form].forEach(el => wrapper.appendChild(el));

    this.#listNode = wrapper

    this._parent && this._parent.append(this.#listNode)
  }

  get #isRendered() {
    return !!this._parent && !!this.#listNode
  }

  #createHeader() {
    const header = document.createElement('header')

    const h5 = document.createElement('h5')
    h5.innerHTML = this.name

    const removeBtn = document.createElement('button')
    removeBtn.classList.add('list-remover')
    removeBtn.innerHTML = '&times;'
    removeBtn.addEventListener('click', () => {
      const destroyedEvent = new CustomEvent('list-destroyed', {
        bubbles: true,
        cancelable: true
      })

      this.#listNode.dispatchEvent(destroyedEvent)
      this.destroy()
    });

    [h5, removeBtn].forEach(el => header.append(el))

    return header
  }

  #createFooter() {
    const form = document.createElement('form')
    form.innerHTML = `
      <input name="task" type="text" >
      <input type="submit" class="add" value="add">
    `
    form.addEventListener('submit', e => {
      e.preventDefault()
      const { task } = Object.fromEntries(new FormData(e.target).entries())

      const trimmed = task.trim().replace(/\s+/g, ' ')
      if (!trimmed) return

      this.add(trimmed)
      e.target.reset()
    })

    return form
  }

  #scaffoldListItem(item) {
    const { id, done, name } = item

    const li = document.createElement('li')
    li.dataset.id = id
    li.dataset.done = done

    const span = document.createElement('span')
    span.classList.add('toggler')
    span.innerHTML = done ? '&times;' : '&omicron;'

    span.addEventListener('click', () => {
      this.toggle(id)
    })

    const h6 = document.createElement('h6')
    h6.innerHTML = name;

    const removeBtn = document.createElement('button')
    removeBtn.classList.add('task-remover');
    removeBtn.innerHTML = '&times;'
    removeBtn.addEventListener('click', () => {
      this.remove(id)
    });

    [span, h6, removeBtn].forEach(el => li.append(el))
    return li
  }
} 