export const fakeDb = {
    users: [
        { id: 0, email: "foo@bar.de", password: "123", income: 333 },
        { id: 1, email: "max@bar.de", password: "345", income: 111 },
    ],

    posts: [
        { id: 0, title: "foo", content: "bar" },
        { id: 1, title: "baz", content: "qux" },
    ],

    getUser(id: number) {
        return this.users.find(user => user.id === id);
    },

    getUsers(ids: number[]) {
        return this.users.filter(x => ids.includes(x.id));
    },

    getPost(id: number) {
        return this.posts.find(post => post.id === id);
    },
}

