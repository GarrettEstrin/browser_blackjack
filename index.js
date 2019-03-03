class BlackJack {
    constructor() {
        this.playerChips = 100;
        this.currentBet = null;
        this.playingHand = false;
        this.round = {};
        this.shuffleDeck();
        console.log("Let's Play BlackJack!");
    }

    startGame = function(){
        this.newHand();
    }

    newHand = function(){
        console.log("How much do you want to bet? Bet by typing blackjack.bet(bet)");
        return;
    }

    informHand = function(hand, dealerFirstHand = false, who = "You have", dealer = false){
        let aceOfSpades = this.hasAceOfSpades(hand) ? "666" : "";
        if(dealerFirstHand){
            console.image(`http://static.garrettestrin.com/browserblackjack/images/${hand[1].img}`);
            console.log(`Dealer is showing: ${hand[1].face} of ${hand[1].suit} ${aceOfSpades}`);
            console.log(`Totalling ${this.getHandTotal(hand)}`);
        } else {
            this.showCards(hand);
            this.tellCards(hand, who, aceOfSpades);
            console.log(`Totalling ${this.getHandTotal(hand)}`);
            if(this.isBlackJack(hand)){
                this.blackJack();
                return;
            }
            if(!dealer){
                this.hitOrStayMessage();
            }
        }
    }

    shuffleDeck = function(){
        this.deckObj = new Deck();
        this.deck = this.deckObj.deck;
        let shuffledDeckObj = this.deckObj.shuffle();
        this.deck = shuffledDeckObj.deck;
    }

    discard = function(numOfCardsToDiscard){
        this.deck.splice(0, numOfCardsToDiscard);
    }

    deal = function(){
        let deck = this.deck;
        this.round.playerHand = [deck[0], deck[2]];
        this.round.dealerHand = [deck[1], deck[3]];
        this.discard(4);
        this.informHand(this.round.dealerHand, true, "Dealer has", true);
        setTimeout(() => this.informHand(this.round.playerHand), 2500);
    }

    getHandTotal = function(hand){
        let values = [];
        let hasAce = false;
        for(let card in hand){
            if(hand[card].value == 1){
                hasAce = true;
            }
            values.push(hand[card].value);
        }
        const add = (a, b) =>
            a + b
        let total = values.reduce(add);
        if(hasAce){
            console.log('has ace');
            let totalWithHighAce = total + 10;
            if(totalWithHighAce > total && totalWithHighAce < 22){
                return totalWithHighAce;
            }
        }
        return total;
    }

    bet = function(bet){
        if(this.deck.length < 8){
            this.shuffleDeck();
        }
        if(this.playingHand){
            return "Can't bet right now";
        }
        this.round = {};
        if(typeof(bet) !== "number"){
            return "Please enter a number for you bet";
        } else if (bet > this.playerChips){
            return `You don't have enought chips for that bet. You have ${this.playerChips}`;
        } else {
            this.playerChips = this.playerChips - bet;
            this.currentBet = bet;
            this.playingHand = true;
            this.deal();
            return;
        }
    }

    hit = function(){
        if(this.playingHand && this.currentBet !== null){
            this.round.playerHand.push(this.deck[0]);
            this.discard(1);
            this.informHand(this.round.playerHand);
            if(this.getHandTotal(this.round.playerHand) > 21){
                this.showBustMessage()
                this.endRound();
            }
        } else {
            return "Can't hit right now.";
        }
    }

    stay = function(){
        if(this.playingHand && this.currentBet !== null){
            this.finishDealerHand();
        } else {
            return "Can't stay right now";
        }
    }

    showCards = function(hand){
        for(let card in hand){
            console.image(`http://static.garrettestrin.com/browserblackjack/images/${hand[card].img}`);
        }
    }

    tellCards = function(hand, who, aceOfSpades){
        console.log(`${who}:`);
        for(let card in hand){
            console.log(`${hand[card].face} of ${hand[card].suit} ${aceOfSpades}`);
        }
    }

    isBlackJack = function(hand){
        if(this.getHandTotal(hand) == 21){
            return true;
        }
        return false;
    }

    finishDealerHand = function(){
        this.hitForDealer(this.round.dealerHand);
    }

    myChips = function(){
        return this.playerChips;
    }

    blackJack = function(){
        let winnings = this.currentBet * 2.5;
        this.playerChips = this.playerChips + winnings;
        console.log("Black Jack!");
    }

    hitForDealer = function(){
        if(this.getHandTotal(this.round.dealerHand) < 17){
            this.round.dealerHand.push(this.deck[0]);
            this.discard(1);
            this.hitForDealer(this.round.dealerHand);
            return;
        } else if (this.getHandTotal(this.round.dealerHand) > 21){
            this.informHand(this.round.dealerHand, false, "Dealer has", true);
            this.dealerBustMessage();
            this.endRound();
            return;
        } else {
            this.informHand(this.round.dealerHand, false, "Dealer has", true);
            setTimeout(() => this.whoWon(), 2000);
            return;
        }
    }

    whoWon = function(){
        let playerTotal = this.getHandTotal(this.round.playerHand);
        let dealerTotal = this.getHandTotal(this.round.dealerHand);
        if(playerTotal > dealerTotal){
            let winnings = this.currentBet * 2;
            this.playerChips = this.playerChips + winnings;
            this.showBustMessage();
        } else if(playerTotal < dealerTotal){
            this.showDealerWinsMessage();
        } else {
            this.playerChips = this.playerChips + this.currentBet;
            this.showPushMessage();
        }
        this.endRound()
    }

    hitOrStayMessage = function(){
        setTimeout(function(){
            console.log("Do you want to hit or stay? Hit by typing blackjack.hit() and stay by typing blackjack.stay()")
        }, 2000)
    }

    dealerBustMessage = function(){
        setTimeout(() => {
            console.log("Dealer busts! Type blackjack.bet() to bet and start the next hand. Type blackjack.myChips() to see your current chips total");
        }, 1000)
    }

    showBustMessage = function(){
        setTimeout(() => {
            console.log("You win! Type blackjack.bet() to bet and start the next hand. Type blackjack.myChips() to see your current chips total")
        }, 1000)
    }

    showDealerWinsMessage = function(){
        setTimeout(() => {
            console.log("Dealer wins! Type blackjack.bet() to bet and start the next hand. Type blackjack.myChips() to see your current chips total")
        }, 1000)
    }

    showPushMessage = function(){
        setTimeout(() => {
            console.log("Push! Type blackjack.bet() to bet and start the next hand. Type blackjack.myChips() to see your current chips total")
        }, 1000)
    }

    hasAceOfSpades = function(hand){
        for(let card in hand){
            if(hand[card].suit == "Spades" && hand[card].face == "Ace"){
                return true;
            }
        }
        return false;
    }

    endRound = function(){
        this.playingHand = false;
    }

    testhand = JSON.parse('[{"suit":"Hearts","value":1,"face":"Ace","img":"7H.jpg"},{"suit":"Clubs","value":10,"face":10,"img":"10C.jpg"}]');
}



class Deck {
    constructor() {
      this.deck = [];
  
      const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
      const faces = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  
      for (let suit in suits) {
        for (let value in values) {
            let card = {};
            card.suit = suits[suit];
            card.value = values[value];
            card.face = faces[value];
            card.img = this.getImgFileName(card.suit, card.face);
            this.deck.push(card);
        }
      }
    }

    shuffle = function(){
        const { deck } = this;
        let m = deck.length, i;
        while (m) {
          i = Math.floor(Math.random() * m--);
          [deck[m], deck[i]] = [deck[i], deck[m]];
        }
        return this;
    }

    getImgFileName = function(suit, face){
        if(typeof(face) == "number"){
            return `${face}${suit[0]}.jpg`;
        } else {
            return `${face[0]}${suit[0]}.jpg`;
        }
    }
  }


let blackjack = new BlackJack();
blackjack.startGame();