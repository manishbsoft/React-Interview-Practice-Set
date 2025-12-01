// simple mock - gives stable ids
export const fetchMockData = () =>
    Promise.resolve({
        data: [
            { id: 1, name: "Gold Ring", price: 5000, quantity: 10 },
            { id: 2, name: "Silver Chain", price: 1500, quantity: 20 },
            { id: 3, name: "Diamond Earrings", price: 25000, quantity: 5 },
        ],
    });