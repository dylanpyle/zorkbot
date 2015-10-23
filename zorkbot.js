'use strict';

module.exports = class Zorkbot {
  // Instantiate a new Zorkbot
  //
  // Required arguments:
  //   `places` - An object describing a set of places. See README.md.
  //   `startingPlace` - The name of the starting point. Must correspond to a
  //     key in the `places` object.
  //
  // Optional arguments:
  //   `initialState` - An object containing the starting state information.
  constructor(places, startingPlace, initialState) {
    if (!places || !startingPlace) { throw new Error('Missing required arguments'); }

    this.places = places;
    this.position = places[startingPlace];

    if(!this.position){ throw new Error(`Invalid starting place: ${startingPlace}`); }

    this.state = initialState || {};
  }

  // Returns a Promise, which will resolve with a String prompt.
  getPrompt() {
    if (this.position === false) {
      return Promise.reject(new Error("Can't continue past the end"));
    }

    return Promise.resolve(this.position.getPrompt(this.state));
  }

  // Returns a Promise, which will resolve with a Boolean.
  // `true` indicates that the story is still in progress (i.e. there's another
  // prompt available), `false` indicates we've come to the end.
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
