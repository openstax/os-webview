export const mockStorage = {
    setItem: jest.spyOn(Storage.prototype, 'setItem'),
    getItem: jest.spyOn(Storage.prototype, 'getItem'),
    removeItem: jest.spyOn(Storage.prototype, 'removeItem')
};
