export const subModule = () => {
  const logger = new Logger("subModule");
  logger.log("subModule");
};

class Logger {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  log(message: string) {
    console.log(`${this.name}: ${message}`);
  }
}