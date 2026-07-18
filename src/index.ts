class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet() {
    console.log(`Hi, ${this.name}!`);
  }
}

const user = new User("JH");
user.greet();