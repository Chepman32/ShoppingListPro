/**
 * Lists Store Tests
 */

import { useListsStore } from '../../src/stores/listsStore';

// Mock database
jest.mock('../../src/database', () => ({
  database: {
    get: jest.fn(() => ({
      query: jest.fn(() => ({
        fetch: jest.fn(() => Promise.resolve([])),
      })),
      find: jest.fn(),
      create: jest.fn(),
    })),
    write: jest.fn((fn) => fn()),
  },
}));

describe('Lists Store', () => {
  it('initializes with empty lists', () => {
    const { lists } = useListsStore.getState();
    expect(lists).toEqual([]);
  });

  it('sets active list', () => {
    const { setActiveList, activeListId } = useListsStore.getState();
    setActiveList('test-list-id');
    expect(useListsStore.getState().activeListId).toBe('test-list-id');
  });

  it('updates filter and sort settings', () => {
    const state = useListsStore.getState();
    expect(state.sortBy).toBe('custom');
    expect(state.filterBy).toBe('active');
  });
});
