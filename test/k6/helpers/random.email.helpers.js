import faker from "k6/x/faker"

export function randomEmail() {
    const timestamp = Date.now();
    return faker.internet.email(`user${timestamp}`);
}