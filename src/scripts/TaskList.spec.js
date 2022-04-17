import { describe, it, expect, afterEach, vi } from 'vitest';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  afterEach(() => {
    document.querySelector('body').innerHTML = '';
  });

  describe('create', () => {
    it('should create list', () => {
      const list = new TaskList();

      expect(list.name).toBe('New list');
      expect(list.items.length).toBe(0);
      expect(list).toHaveProperty('id');
    });

    it('should create list from backup', () => {
      const backup = {
        id: 1,
        name: 'My list',
        items: [{ id: 2, name: 'first list item', done: true }],
      };
      const list = new TaskList(null, backup);

      expect(list.name).toBe('My list');
      expect(list.items.length).toBe(1);
      expect(list.items[0].name).toBe('first list item');
      expect(list.items[0].done).toBe(true);
    });

    it('should create list into dom', () => {
      const parent = document.querySelector('body');
      new TaskList(parent, {
        id: 1,
        name: 'My List',
        items: [
          { id: 2, name: 'first task', done: true },
          { id: 3, name: 'second task', done: false },
        ],
      });

      expect(parent.innerHTML).toMatchSnapshot();
    });
  });

  describe('add', () => {
    it('should add item to list', () => {
      const list = new TaskList();

      expect(list.items.length).toBe(0);

      list.add('Name for a task');

      expect(list.items.length).toBe(1);

      expect(list.items[0]).toHaveProperty('id');
      expect(list.items[0].name).toBe('Name for a task');
      expect(list.items[0].done).toBe(false);
    });

    it('should update dom if task added', () => {
      const parent = document.querySelector('body');
      const list = new TaskList(parent);

      const ul = parent.querySelector('ul');

      expect(ul.children.length).toBe(0);

      const newItem = list.add('Name for a task');

      const li = parent.querySelector('li[data-id]');

      expect(li).not.toBeNull();
      expect(ul.children.length).toBe(1);

      expect(li.dataset.id).toBe(newItem.id);
      expect(li.children[1].innerHTML).toBe('Name for a task');
    });

    it('should add task through dom', () => {
      const parent = document.querySelector('body');
      new TaskList(parent);

      expect(parent.querySelector('ul').children.length).toBe(0);

      parent.querySelector('[type="text"]').value = 'first task';
      parent.querySelector('[type="submit"].add').click();

      expect(parent.querySelector('ul').children.length).toBe(1);
      expect(
        parent.querySelector('ul').children[0].children[1].textContent
      ).toBe('first task');
      expect(parent.querySelector('[type="text"]').value).toBe('');
    });

    it('should return new task on add method call', () => {
      const list = new TaskList();
      const task = list.add('Name for a task');

      expect(list.items[0]).toEqual(task);
    });
  });

  describe('toggle', () => {
    it('should toggle done property value', () => {
      const list = new TaskList();
      const task = list.add('Name for a task');

      list.toggle(task.id);
      expect(list.items[0].done).toBe(true);

      list.toggle(task.id);
      expect(list.items[0].done).toBe(false);

      list.toggle(task.id, false);
      expect(list.items[0].done).toBe(false);

      list.toggle(task.id, true);
      expect(list.items[0].done).toBe(true);

      list.toggle(task.id, true);
      expect(list.items[0].done).toBe(true);
    });

    it('should toggle done property value in the dom', () => {
      const parent = document.querySelector('body');
      const list = new TaskList(parent);
      const task = list.add('Name for a task');

      const taskNode = parent.querySelector(`[data-id="${task.id}"]`);

      expect(taskNode.dataset.done).toBe('false');
      expect(taskNode.children[0].innerHTML).toBe('ο');

      list.toggle(task.id, false);

      expect(taskNode.dataset.done).toBe('false');
      expect(taskNode.children[0].innerHTML).toBe('ο');

      list.toggle(task.id);

      expect(taskNode.dataset.done).toBe('true');
      expect(taskNode.children[0].innerHTML).toBe('×');

      list.toggle(task.id, true);

      expect(taskNode.dataset.done).toBe('true');
      expect(taskNode.children[0].innerHTML).toBe('×');
    });

    it('should toggle done status through the dom', () => {
      const parent = document.querySelector('body');
      new TaskList(parent, {
        id: 1,
        name: 'My list',
        items: [{ id: 2, name: 'task', done: false }],
      });

      const listItem = parent.querySelector('[data-id="2"]');

      expect(listItem.dataset.done).toBe('false');

      listItem.querySelector('.toggler').click();
      expect(listItem.dataset.done).toBe('true');
    });
  });

  describe('remove', () => {
    it('should remove item from items', () => {
      const list = new TaskList();
      const task = list.add('Name for a task');
      const task2 = list.add('Name for a task 2');
      const task3 = list.add('Name for a task 3');

      expect(list.items.length).toBe(3);
      expect(list.items).toEqual([task, task2, task3]);

      list.remove(task2.id);
      expect(list.items.length).toBe(2);

      expect(list.items).toEqual([task, task3]);
    });

    it('should remove item node from list', () => {
      const parent = document.querySelector('body');
      const list = new TaskList(parent);

      const tasks = [
        list.add('Name for a task'),
        list.add('Name for a task 2'),
        list.add('Name for a task 3'),
      ];

      tasks.forEach(t => {
        expect(parent.querySelector(`[data-id="${t.id}"]`)).not.toBeNull();
      });

      list.remove(tasks[1].id);

      expect(parent.querySelector('ul').children.length).toBe(2);

      list.items.forEach(({ id }) => {
        expect(parent.querySelector(`[data-id="${id}"]`)).not.toBeNull();
      });
    });

    it('should remove item through the dom', () => {
      const parent = document.querySelector('body');
      new TaskList(parent, {
        id: 1,
        name: 'My List',
        items: [
          { id: 2, name: 'kkk', done: false },
          { id: 3, name: 'zzz', done: false },
          { id: 4, name: 'bbb', done: false },
        ],
      });

      expect(parent.querySelector('ul').children.length).toBe(3);

      parent.querySelector('.task-remover').click();

      expect(parent.querySelector('ul').children.length).toBe(2);
      expect(parent.querySelector('[data-id="2"]')).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should destroy list from dom', () => {
      const parent = document.querySelector('body');
      const list = new TaskList(parent);

      expect(parent.children.length).toBe(1);

      list.destroy();
      expect(parent.children.length).toBe(0);
    });

    it('should destroy list through the dom', () => {
      const parent = document.querySelector('body');
      const list = new TaskList(parent);

      expect(parent.children.length).toBe(1);
      expect(parent.querySelector(`[data-id="${list.id}"]`)).not.toBeNull();

      parent.querySelector('.list-remover').click();

      expect(parent.children.length).toBe(0);
      expect(parent.querySelector(`[data-id="${list.id}"]`)).toBeNull();
    });

    it('should emit event on list destroy', () => {
      const mockFn = vi.fn();

      const parent = document.querySelector('body');
      parent.addEventListener('list-destroyed', mockFn);

      new TaskList(parent);

      expect(mockFn).not.toHaveBeenCalled();
      parent.querySelector('.list-remover').click();

      expect(mockFn).toHaveBeenCalled();
    });
  });
});
