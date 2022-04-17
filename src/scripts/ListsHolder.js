import { uid } from '../helpers/general'
import { TaskList } from './TaskList'

export class ListsHolder {
  collection
  #parentNode

  constructor(selector) {
    this.collection = []

    this.#mountOnNode(selector)
  }


  get parentNode() {
    return this.#parentNode
  }

  #mountOnNode(selector) {
    this.#parentNode = document.querySelector(selector)

    this.listNode = document.createElement('section')
    this.listNode.classList.add('lists-holder')
    this.listNode.dataset.testid = 'list-node'

    const listAddBtn = document.createElement('button')
    listAddBtn.dataset['testid'] = "list-adder"
    listAddBtn.innerHTML = 'New List'
    listAddBtn.addEventListener('click', () => {
      const newList = new TaskList(this.listNode)
      this.collection.push(newList)
    })

      ;[this.listNode, listAddBtn].forEach(el => this.#parentNode.append(el))

  }
}