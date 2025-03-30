class User {
    constructor() {
        console.log('User was instantiated')
    }
    public firstName = 'Jophn';
}

class Post {
    constructor(
        private user: User
    ) {
        console.log('Post was instantiated');
    }
}

class Page {
    constructor(
        private user: User
    ) {
        console.log('Page was instantiated');
    }
}

// Nest.js 

const user = new User();
  

// Client code

const post = new Post(user);
const page = new Page(user);