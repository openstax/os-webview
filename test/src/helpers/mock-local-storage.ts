const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0,
    visitedGive: '0',
    campaignId: ''
};

Reflect.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

export default mockLocalStorage;
