'use strict';

module.exports = class Zorkbot {
  constructor(places, startingPlace) {
    if (!places || !startingPlace) { throw new Error('Missing required arguments'); }

    this.places = places;
    this.position = places[startingPlace];

    if(!this.position){ throw new Error(`Invalid starting place: ${startingPlace}`); }

    this.state = {};
  }

  getPrompt() {
    if (this.position === false) {
      return Promise.reject(new Error("Can't continue past the end"));
    }

    return Promise.resolve(this.position.getPrompt(this.state));
  }

  handleResponse(response) {
    if (this.position === false) {
      return Promise.reject(new Error("Can't continue past the end"));
    }

    return Promise.resolve(this.position.handleResponse(response, this.state))
      .then((destinationName) => {
        if (destinationName === false) {
          // The story is over.
          this.position = false;
          return false;
        }

        this.position = this.places[destinationName];

        if (this.position === undefined) {
          throw new Error(`Invalid destination: ${destinationName}`);
        }

        return true;
      })
  }
};
