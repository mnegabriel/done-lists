import { describe, it, expect, afterEach } from 'vitest'
import { TaskList } from './TaskList'

describe('TaskList', () => {
  afterEach(() => {
    document.querySelector('body').innerHTML = ''
  })

  it('should create list', () => {
    const list = new TaskList()

    expect(list.name).toBe('New list')
    expect(list.items.length).toBe(0)
    expect(list).toHaveProperty('id')
  })

  it('should create list from backup', () => {
    const backup = {
      id: 1, name: 'My list', items: [
        { id: 2, name: 'first list item', done: true }
      ]
    }
    const list = new TaskList(null, backup)

    expect(list.name).toBe('My list')
    expect(list.items.length).toBe(1)
    expect(list.items[0].name).toBe('first list item')
    expect(list.items[0].done).toBe(true)
  })

  it('should create list into dom', () => {
    const parent = document.querySelector('body')
    new TaskList(parent, {
      id: 1,
      name: 'My List',
      items: [
        { id: 2, name: 'first task', done: true },
        { id: 3, name: 'second task', done: false },
      ]
    })

    expect(parent.innerHTML).toMatchSnapshot()
  })

  it('should add item to list', () => {
    const list = new TaskList()

    expect(list.items.length).toBe(0)

    list.add('Name for a task')

    expect(list.items.length).toBe(1)

    expect(list.items[0]).toHaveProperty('id')
    expect(list.items[0].name).toBe('Name for a task')
    expect(list.items[0].done).toBe(false)
  })

  it('should update dom if task added', () => {
    const parent = document.querySelector('body')
    const list = new TaskList(parent)

    const ul = parent.querySelector('ul')

    expect(ul.children.length).toBe(0)

    const newItem = list.add('Name for a task')

    const li = parent.querySelector('li[data-id]')

    expect(li).not.toBeNull()
    expect(ul.children.length).toBe(1)

    expect(li.dataset.id).toBe(newItem.id)
    expect(li.children[1].innerHTML).toBe('Name for a task')
  })

  it('should return new task on add method call', () => {
    const list = new TaskList()
    const task = list.add('Name for a task')

    expect(list.items[0]).toEqual(task)
  })

  it('should toggle done property value', () => {
    const list = new TaskList()
    const task = list.add('Name for a task')

    list.toggle(task.id)
    expect(list.items[0].done).toBe(true)

    list.toggle(task.id)
    expect(list.items[0].done).toBe(false)

    list.toggle(task.id, false)
    expect(list.items[0].done).toBe(false)

    list.toggle(task.id, true)
    expect(list.items[0].done).toBe(true)

    list.toggle(task.id, true)
    expect(list.items[0].done).toBe(true)
  })

  it('should toggle done property value in the dom', () => {
    const parent = document.querySelector('body')
    const list = new TaskList(parent)
    const task = list.add('Name for a task')

    const taskNode = parent.querySelector(`[data-id="${task.id}"]`)

    expect(taskNode.dataset.done).toBe('false')
    expect(taskNode.children[0].innerHTML).toBe('ο')

    list.toggle(task.id, false)

    expect(taskNode.dataset.done).toBe('false')
    expect(taskNode.children[0].innerHTML).toBe('ο')

    list.toggle(task.id)

    expect(taskNode.dataset.done).toBe('true')
    expect(taskNode.children[0].innerHTML).toBe('×')

    list.toggle(task.id, true)

    expect(taskNode.dataset.done).toBe('true')
    expect(taskNode.children[0].innerHTML).toBe('×')
  })

  it('should remove item from items', () => {
    const list = new TaskList()
    const task = list.add('Name for a task')
    const task2 = list.add('Name for a task 2')
    const task3 = list.add('Name for a task 3')

    expect(list.items.length).toBe(3)
    expect(list.items).toEqual([
      task,
      task2,
      task3
    ])

    list.remove(task2.id)
    expect(list.items.length).toBe(2)

    expect(list.items).toEqual([
      task,
      task3
    ])
  })

  it('should remove item node from list', () => {
    const parent = document.querySelector('body')
    const list = new TaskList(parent)

    const tasks = [list.add('Name for a task'),
    list.add('Name for a task 2'),
    list.add('Name for a task 3')]

    tasks.forEach(t => {
      expect(parent.querySelector(`[data-id="${t.id}"]`)).not.toBeNull()
    })

    list.remove(tasks[1].id)

    expect(parent.querySelector('ul').children.length).toBe(2)

    list.items.forEach(({ id }) => {
      expect(parent.querySelector(`[data-id="${id}"]`)).not.toBeNull()
    })
  })

  it('should remove list from dom', () => {
    const parent = document.querySelector('body')
    const list = new TaskList(parent)

    expect(parent.children.length).toBe(1)

    list.destroy()
    expect(parent.children.length).toBe(0)
  })
})