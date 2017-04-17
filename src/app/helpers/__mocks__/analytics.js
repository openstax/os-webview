const analytics = jest.genMockFromModule('analytics');

analytics.start = () => {
    console.log("Using mocked analytics start");
};
analytics.send = () => {};

export default analytics;
