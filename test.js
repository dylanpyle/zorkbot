'use strict';
const Zorkbot = require('./zorkbot');
require('chai').should();

const TEST_PLACES = {
  first: {
    getPrompt(state) {
      const mailboxSize = state.mailboxSize || 'small';
      return `There is a ${mailboxSize} mailbox here.`;
    },

    handleResponse(response, state) {
      if (response === 'west') {
        return 'second';
      } else {
        state.color = 'blue';
        return 'third';
      }
    }
  },

  second: {
    getPrompt(state) {
      return Promise.resolve('This is a forest.');
    },

    handleResponse(response, state) {
      state.color = 'red';
      return Promise.resolve('third');
    }
  },

  third: {
    getPrompt(state) {
      return Promise.resolve(`There is a ${state.color} house here.`);
    },

    handleResponse(response, state) {
      return false;
    }
  }
};

describe('Zorkbot', () => {
  let bot;

  beforeEach(() => {
    bot = new Zorkbot(TEST_PLACES, 'first');
  });

  it('begins at the beginning', () => {
    return bot.getPrompt()
      .then((prompt) =>
        prompt.should.equal('There is a small mailbox here.')
      );
  });

  it('accepts an initial state object', () => {
    const newBot = new Zorkbot(TEST_PLACES, 'first', { mailboxSize: 'large' });
    return newBot.getPrompt()
      .then((prompt) =>
        prompt.should.equal('There is a large mailbox here.')
      );
  });

  it('moves synchronously without updating state', () => {
    return bot.handleResponse('west')
      .then(() => bot.getPrompt())
      .then((prompt) =>
        prompt.should.equal('This is a forest.')
      );
  });

  it('moves synchronously while updating state', () => {
    return bot.handleResponse('east')
      .then(() => bot.getPrompt())
      .then((prompt) =>
        prompt.should.equal('There is a blue house here.')
      );
  });

  it('moves asynchronously while updating state', () => {
    return bot.handleResponse('west')
      .then(() => bot.handleResponse('north'))
      .then(() => bot.getPrompt())
      .then((prompt) =>
        prompt.should.equal('There is a red house here.')
      );
  });

  it('exits once we reach the end', () => {
    return bot.handleResponse('west')
      .then(() => bot.handleResponse('north'))
      .then(() => bot.handleResponse('south'))
      .then((prompt) =>
        prompt.should.equal(false)
      );
  });

  it('throws an error if we try to continue past the end', () => {
    return bot.handleResponse('west')
      .then(() => bot.handleResponse('north'))
      .then(() => bot.handleResponse('south'))
      .then(() => bot.handleResponse('east'))
      .then(() => { throw new Error("Shouldn't get this far"); })
      .catch((err) =>
        err.message.should.equal("Can't continue past the end")
      );
  });
});
