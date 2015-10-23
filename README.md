# zorkbot

You have been eaten by a grue.

Zorkbot is a choose-your-own-adventure engine for node.js.

## Example Usage

```
const Zorkbot = require('zorkbot');

const PLACES = {
  clearing: {
    getPrompt: (state) => "You are in a clearing, with a forest surrounding you on the west.",
    handleResponse: (response, state) => {
      if (response === 'west') return 'forest':
      return 'clearing';
    }
  },
  forest: {
    getPrompt: (state) => 'This is a dimly lit forest, with large trees all around.'
    handleResponse: (response, state) => {
      if (response === 'east') return 'clearing':
      return 'forest';
    }
  }
}

const bot = new Zorkbot(PLACES, 'clearing');

bot.getPrompt()
  .then((prompt) => console.log(prompt)); // You are in ...

bot.handleResponse('east')
  .then(() => bot.getPrompt())
  .then((prompt) => console.log(prompt)); // This is a dimly lit...
```
