// this file holds the logic of the rps game
class RpsGame {
  // constructor
  constructor(p1, p2) {
    // player1 and player2
    this._players = [p1, p2]; // _players is private (array of our two players)
    this._rpsRound = [null, null]; // _rpsRound is initialized with null

    this._sendToPlayers('Rock Paper Scissors starts!');

    // add event listener to check whenever a player is sending his/her choice
    this._players.forEach((player, idx) => {
      player.on('rpsChoice', (rpsChoice) => {
        this._onRound(idx, rpsChoice);
      });
    });
  }

  // methods
  // send message to one player
  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg);
  }

  // send message to both players
  _sendToPlayers(msg) {
    this._players.forEach((player) => player.emit('message', msg));
  }

  // keep track of rounds
  _onRound(playerIndex, rpsChoice) {
    this._rpsRound[playerIndex] = rpsChoice;
    this._sendToPlayer(playerIndex, `You selected ${rpsChoice}`);
    // check if round is finished (both players made their choice)
    this._checkRoundFinished();
  }

  // check if the round is finished (both players made their choice)
  _checkRoundFinished() {
    const rpsRound = this._rpsRound; // this line is just to make the code more readable
    if (rpsRound[0] && rpsRound[1]) {
      // show choices made to the players
      this._sendToPlayers('Choices made: ' + rpsRound.join(' vs '));
      this._getRoundResult();
      // reset for a new round
      this._rpsRound = [null, null];
      this._sendToPlayers('Next round!');
    }
  }

  // see who won the round
  _getRoundResult() {
    const p0 = this._decodeChoice(this._rpsRound[0]);
    const p1 = this._decodeChoice(this._rpsRound[1]);

    const distance = (p1 - p0 + 3) % 3;

    switch (distance) {
      case 0:
        this._sendToPlayers('Draw!');
        break;
      case 1:
        this._sendWinMessage(this._players[0], this._players[1]);
        break;
      case 2:
        this._sendWinMessage(this._players[1], this._players[0]);
        break;
    }
  }

  // win message
  _sendWinMessage(winner, loser) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.');
  }

  // decode player's choice
  _decodeChoice(choice) {
    switch (choice) {
      case 'rock':
        return 0;
      case 'scissors':
        return 1;
      case 'paper':
        return 2;
      default:
        throw new Error(`Could not decode turn ${choice}`);
    }
  }
}

module.exports = RpsGame;
