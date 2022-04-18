import { it, describe, expect, afterEach } from 'vitest';
import { ListsHolder } from './ListsHolder';

describe('ListsHolder', () => {
  afterEach(() => {
    document.querySelector('body').innerHTML = '';
  });

  it('should initialize as empty array', () => {
    const lists = new ListsHolder('body');

    expect(lists.collection).toEqual([]);
  });

  it('should hold app node based on selector from instatiation', () => {
    const app = new ListsHolder('body');

    expect(app.parentNode).toBeDefined();
    expect(app.parentNode).toBeInstanceOf(HTMLElement);
  });

  it('should mount node for lists and list adder button', () => {
    const app = new ListsHolder('body');

    expect(app.parentNode.children.length).toBe(2);

    expect(document.querySelector('[data-testid="list-node"]')).not.toBeNull();

    const adderBtn = document.querySelector('[data-testid="list-adder"]');

    expect(adderBtn).not.toBeNull();
  });

  it('should add lew task list to list node after list adder button click', () => {
    const app = new ListsHolder('body');

    expect(app.listNode.children.length).toBe(0);

    app.parentNode.querySelector('button[data-testid="list-adder"]').click();
    expect(app.listNode.children.length).toBe(1);
    expect(app.listNode.children[0].tagName).toBe('ARTICLE');
    expect(app.listNode.children[0].dataset.id).toBeDefined();
  });

  it('should add to local data information from the new list', () => {
    const app = new ListsHolder('body');

    expect(app.collection).toEqual([]);

    app.parentNode.querySelector('button[data-testid="list-adder"]').click();

    expect(app.collection.length).toBe(1);
    expect(app.collection[0]).toHaveProperty('id');
    expect(app.collection[0]).toHaveProperty('name');
    expect(app.collection[0]).toHaveProperty('items');
  });

  it('should remove from local data information from a list deleted', () => {
    const app = new ListsHolder('body');

    expect(app.collection).toEqual([]);

    app.parentNode.querySelector('button[data-testid="list-adder"]').click();
    app.parentNode.querySelector('button[data-testid="list-adder"]').click();
    app.parentNode.querySelector('button[data-testid="list-adder"]').click();

    expect(app.collection.length).toBe(3);

    const secondId = app.collection[1].id;

    app.listNode.querySelector(`[data-id="${secondId}"] .list-remover`).click();

    expect(app.collection.length).toBe(2);
    expect(app.listNode.querySelector(`[data-id="${secondId}"]`)).toBeNull();
  });
});
