class BlackJack {
    constructor() {
        this.playerChips = 100;
        this.currentBet = null;
        this.playingHand = false;
        this.round = {};
        this.baseUrl = "https://garrettestrin.github.io/browser_blackjack/images/deck/";
        this.instanceName = "bj";
        this.shuffleDeck();
        console.log("Let's Play BlackJack!");
        return;
    }

    startGame = function(){
        this.newHand();
        return;
    }

    newHand = function(){
        let instanceName = this.instanceName;
        console.log(`How much do you want to bet? You have ${this.playerChips} chips. Bet by typing ` + instanceName + `.bet(bet).`);
        return;
    }

    informHand = function(hand, dealerFirstHand = false, who = "You have", dealer = false){
        if(dealerFirstHand){
            let motorHead = hand[1].motorHead ? hand[1].motorHead : "";
            console.image(`${this.baseUrl}red_back.jpg`);
            console.image(`${this.baseUrl}${hand[1].img}`);
            console.log(`Dealer is showing: ${hand[1].face} of ${hand[1].suit} ${motorHead}`);
            console.log(`Totaling ${this.getHandTotal(hand, dealerFirstHand)}`);
            return;
        } else {
            this.showCards(hand);
            this.tellCards(hand, who);
            console.log(`Totaling ${this.getHandTotal(hand)}`);
            return;
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
        setTimeout(() => this.informHand(this.round.playerHand), 1500);
        let isBlackJack = this.isBlackJack(this.round.playerHand);
        if(isBlackJack){
            this.blackJack();
        } else {
            this.hitOrStayMessage();
        }
        return;
    }

    getHandTotal = function(hand, dealerFirstHand){
        let values = [];
        let hasAce = false;
        for(let card in hand){
            if(hand[card].value == 1){
                hasAce = true;
            }
            values.push(hand[card].value);
        }
        if(dealerFirstHand){
            values.splice(0, 1);
        }
        const add = (a, b) =>
            a + b
        let total = values.reduce(add);
        if(hasAce && !dealerFirstHand){
            let totalWithHighAce = total + 10;
            if(totalWithHighAce > total && totalWithHighAce < 22){
                return totalWithHighAce;
            }
        }
        return total;
    }

    bet = function(bet){
        this.firstHand = true;
        if(this.deck.length < 8){
            this.shuffleDeck();
            return;
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

    hit = () => {
        if(this.playingHand && this.currentBet !== null){
            this.round.playerHand.push(this.deck[0]);
            this.discard(1);
            this.informHand(this.round.playerHand);
            if(this.getHandTotal(this.round.playerHand) > 21){
                this.showBustMessage()
                this.endRound();
            } else {
                this.hitOrStayMessage();
            }
        } else {
            return "Can't hit right now.";
        }
        this.firstHand = false;
        return;
    }

    stay = function(){
        if(this.playingHand && this.currentBet !== null){
            this.finishDealerHand();
            return;
        } else {
            return "Can't stay right now";
        }
    }

    showCards = function(hand){
        for(let card in hand){
            console.image(`${this.baseUrl}${hand[card].img}`);
        }
    }

    tellCards = function(hand, who){
        console.log(`${who}:`);
        for(let card in hand){
            let motorHead = hand[card].motorHead ? hand[card].motorHead : "";
            console.log(`${hand[card].face} of ${hand[card].suit} ${motorHead}`);
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
        this.showBlackJackMessage();
        this.endRound();
    }

    hitForDealer = function(){
        if(this.getHandTotal(this.round.dealerHand) < 17){
            this.round.dealerHand.push(this.deck[0]);
            this.discard(1);
            this.hitForDealer(this.round.dealerHand);
            return;
        } else if (this.getHandTotal(this.round.dealerHand) > 21){
            this.informHand(this.round.dealerHand, false, "Dealer has", true);
            this.addChips();
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
            this.showWinMessage();
        } else if(playerTotal < dealerTotal){
            this.showDealerWinsMessage();
        } else {
            this.playerChips = this.playerChips + this.currentBet;
            this.showPushMessage();
        }
        this.endRound()
    }

    hitOrStayMessage = function(){
        setTimeout(() => {
            let instanceName = this.instanceName;
            console.log("Do you want to hit or stay? Hit by typing  " + instanceName + ".hit() and stay by typing  " + instanceName + ".stay()")
        }, 2500);
        return;
    }

    dealerBustMessage = function(){
        setTimeout(() => {
            let instanceName = this.instanceName;
            console.log("Dealer busts! Type  " + instanceName + ".bet() to bet and start the next hand. Type  " + instanceName + ".myChips() to see your current chips total");
        }, 1000);
        return;
    }

    showWinMessage = function(){
        setTimeout(() => {
            let instanceName = this.instanceName;
            console.log("You win! Type  " + instanceName + ".bet() to bet and start the next hand. Type  " + instanceName + ".myChips() to see your current chips total");
        }, 1000);
        return;
    }

    showBustMessage = function(){
        setTimeout(() => {
            let instanceName = this.instanceName;
            console.log("You busted! Type  " + instanceName + ".bet() to bet and start the next hand. Type  " + instanceName + ".myChips() to see your current chips total")
        }, 1000);
        return;
    }

    showDealerWinsMessage = function(){
        setTimeout(() => {
            let instanceName = this.instanceName;
            console.log("Dealer wins! Type  " + instanceName + ".bet() to bet and start the next hand. Type  " + instanceName + ".myChips() to see your current chips total")
        }, 1000);
        return;
    }

    showPushMessage = function(){
        setTimeout(() => {
            let instanceName = this.instanceName;
            console.log("Push! Type  " + instanceName + ".bet() to bet and start the next hand. Type  " + instanceName + ".myChips() to see your current chips total")
        }, 1000);
        return;
    }

    showBlackJackMessage = function(){
        setTimeout(() => {
            let instanceName = this.instanceName;
            console.log("Blackjack! Type  " + instanceName + ".bet() to bet and start the next hand. Type  " + instanceName + ".myChips() to see your current chips total")
        }, 2500);
        return;
    }

    addChips = function(blackJack = false){
        let bet = this.currentBet;
        this.playerChips = this.playerChips + (bet * 2);
    }

    endRound = function(){
        this.playingHand = false;
        return;
    }
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
            if(card.suit == "Spades" && card.face == "Ace"){
                card.motorHead = "🤘";
            }
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

let bj = new BlackJack();
bj.startGame();