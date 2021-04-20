
// Muuttujat dokumentista
// Laskimen näppäimet
let buttonsInitial = document.querySelectorAll('button[name="numberButton"]');
let cButton = document.querySelector('.clearAll');
let ceButton = document.querySelector('.clearEntry');
let backspace = document.querySelector('.backspace');
let operators = document.querySelectorAll('button[name="operatorButton"]')
let equalsButton = document.querySelector('.equals');
let decimal = document.querySelector('.decimal');

// currentCalc = näytön yllä oleva info, johon päivittyy laskutoimitus
// output = varsinainen näyttö, johon numerojen painallukset tulostetaan
let currentCalc = document.querySelector('.calculations');
let output = document.querySelector('.calculator-output');

// Muut muuttujat (:D)
// Output storageen tallennetaan näyttöön kirjoitettavat luvut, niitä ei operoida missää vaiheessa vaan siitä siirretään lukuja näytön tekstiin
let outputStorage = [];

// numStorage on array laskettaville luvuille, luetaan näytön tekstistä. Lisäks sinne määritetään operaattori
// numStoragessa on parhaimmillaan kolme arvoa:
// [0] = operaattori
// [1 ja 2 ] = laskettavat arvot, [1] = myös laskettu arvo, eli result, laskun jälkeen
let numStorage = [];

// result == laskutoimituksen arvo
let result = 0;
// numPressed = kertoo onko numeroa painettu, ihan kätevä tietää laskuja varten
let numPressed = false;
// errormessage flagi, erroria mm. nollal jakamisesta
let errorMessage = false;


/******************************************************
**************** FUNKTIOIDEN MÄÄRITYS ****************
******************************************************/


/*************************************************
 Operaattorin haku ja laskutoimituksen valmistelu
 *************************************************/
function getOperator(operator) {
  // errorin poisto jos päällä
  if (errorMessage) {
    errorMessage = false;
    output.innerHTML = 0;
  }
  // Jos laskutoimitus tehty jo kertaalleen voidaan tän avulla jatkaa aiemman tuloksen laskemista
  // Esim aiempi laskutoimitus ollut 5+5 = 10 => seuraavaks + painettaessa toimitus jatkuu 10 + x
  if (numStorage[0] === undefined && numPressed === false) {
    currentCalc.innerHTML = output.innerHTML + " " + operator + " ";
    numStorage[0] = operator;
  }
  // Jos numeroa on painettu tai storagessa on vaadittava määrä laskutoimitukseen
  else if (numPressed === true || numStorage.length == 3) {
    numPressed = false;
    // If else siksi ettei numero mene väärälle paikalle storageen, numero parsetaan näytön tekstistä joka tapauksessa
    if (numStorage[0] === undefined) {
      numStorage[1] = parseFloat(output.innerHTML);
    }
    else {
      numStorage.push(parseFloat(output.innerHTML));
    }
    // currentCalc = näytön yllä oleva pienempi palkki missä näkyy sen hetkinen laskutoimitus, helpoin lisätä suoraan output näytöstä tämäkin
    currentCalc.innerHTML += output.innerHTML + " " + operator + " ";
    // operate funktiossa lopullinen laskutoimitus ja tulostus näytölle
    operate(numStorage[1], numStorage[2]);
    numStorage[0] = operator;
  }
  // Operaattorin mahdollinen vaihto, toimii vain ekalla kerralla koska toinen painallus suorittaa laskun
  else if (numPressed === false) {
    numStorage[1] = parseFloat(output.innerHTML);
    numStorage[0] = operator;
    currentCalc.innerHTML = output.innerHTML + " " + operator + " ";
  }
  outputStorage = [];
}


/*************************************************
              Varsinainen laskufunktio
 *************************************************/
function operate(a,b) {
  // Tarkastus vielä että löytyy tarvittava määrä laskuun, just in case
  if (numStorage.length > 2) {
    // tarkastetaan numStoragesta operaattori, lasketaan a ja b result muuttujaan ja tulostetaan näytölle ratkaisu
    if (numStorage[0] === '+') {
      result = a + b;
      output.innerHTML = a + b;
      numPressed = false;
    }
    else if (numStorage[0] === '-') {
      result = a - b;
      output.innerHTML = a - b;
      numPressed = false;
    }
    else if (numStorage[0] === '/') {
      // estetään nollalla jako
      if (numStorage.includes(0)) {
        output.innerHTML = "Not gonna happen, mate";
        numStorage = [];
        errorMessage = true;
        return;
      }
      result = a / b;
      output.innerHTML = a / b;
      numPressed = false;
    }
    else if (numStorage[0] === '*') {
      result = a * b;
      output.innerHTML = a * b;
      numPressed = false;
    }
    // numStoragen tyhjennys vanhoista luvuista, result laitetaan [1] paikalle, jotta operaattori pääsee [0] paikalle ilman tappelua
    numStorage = [];
    numStorage[1] = result;
    checkOutput();
    return result;
  }
};

/*************************************************
      Tarkastetaan mahtuuko näyttöön tavaraa
 *************************************************/
function checkOutput() {
  if (output.innerHTML.length > 19) {
    output.innerHTML = "Error, out of space";
    return;
  }
  else {
    return;
  }
}

/******************************************************
****************** NAPPIEN FUNKTIOT ******************
******************************************************/

// Desimaali, ei voi lisätä ku yhden
function decimalAdd() {
  if (outputStorage.includes('.')) {
    return;
  }
  // Jos näyttö on tyhjä niin lisää "0."" ennemmin kuin pelkän "."
  else if (outputStorage.length === 0) {
    outputStorage.push('0','.')
    output.innerHTML = outputStorage.join('');
  }
  else {
    outputStorage.push('.');
    output.innerHTML = outputStorage.join('');
  }
}
// = napin toiminta
function equals() {
  // tässäkin errorit pois, muuten toistais erroria ton seuraavan ominaisuuden takia
  if (errorMessage) {
    // errorMessage = false;
    // output.innerHTML = 0;
    errorMessage = false;
    clearAll();
  }
  // Toimii vaan jos numeroa painettu
  else if (numPressed === true) {
    // Jos painaa heti numeron jälkeen niin tämä pyörähtää, eipä siin kummempia
    if (numStorage.length === 0) {
      output.innerHTML = output.innerHTML + " is " + output.innerHTML + "...";
      errorMessage = true;
      outputStorage = [];
      return;
    }
    // tökätään näytöllä oleva numero numStorageen, currentCalc tyhjäks ja suoritetaan lasku
    numStorage.push(parseFloat(output.innerHTML));
    currentCalc.innerHTML = "";
    operate(numStorage[1], numStorage[2])
    result = 0;
    outputStorage = []
  }
}
/****************************
Tyhjemmys napit C, CE ja BS
***************************/

// C eli clear all, tyhjää numStoragen ja näytön
function clearAll() {
  output.innerHTML = "0";
  currentCalc.innerHTML = ""
  outputStorage = [];
  numStorage = [];
}
// CE eli clear entry, tyhjää vain tällä hetkellä näytössä olevan
function clearEntry() {
  output.innerHTML = "0";
  outputStorage = [];
}

// backspace, kattoo et outputStoragessa on tavaraa ja poppaa arrayst viimesen luvun veks, jos ei ni ruudulle nolla, muuten näyttö häviäis :-D.
function backspaceFunc() {
  if (outputStorage.length > 1) {
    outputStorage.pop();
    output.innerHTML = outputStorage.join('');
  }
  else {
    output.innerHTML = "0";
  };
}

/******************************************************
****************** EVENTLISTENERIT ******************
******************************************************/

// Operaattori nappeihin funktiot
for (let i = 0; i < operators.length; i++) {
  operators[i].addEventListener('click', function() {
    if (this.className === "multiply") {
      getOperator('*');
    }
    else if (this.className === "division") {
      getOperator('/');
    }
    else if (this.className === 'minus') {
      getOperator('-');
    }
    else if (this.className === "plus") {
      getOperator('+');
    }
    //}
  });
}

// numero painikkeiden lukeminen ja kirjoittaminen näyttöön
for (let i = 0; i < buttonsInitial.length; i++) {
  buttonsInitial[i].addEventListener('click', function() {
    if (errorMessage) {
      errorMessage = false;
    }
    // katotaan että numerot mahtuu näytölle, 18 alkaa olee aika rajoil
    if (outputStorage.length < 18) {
      if (this.innerHTML === "0") {
        if (outputStorage.length === 0) {
          output.innerHTML = 0;
          numPressed = true;
          return;
        }
        else {
          outputStorage.push(0);
          output.innerHTML = outputStorage.join('');
          numPressed = true;
        }
      }
      // Luetaan napin arvo ja heitetään talteen, arraysta joinilla näyttöön luettavaksi
      outputStorage.push(this.innerHTML);
      output.innerHTML = outputStorage.join('');
      numPressed = true;
    }
    else {
      return;
    }
  });
};

// = nappi
equalsButton.addEventListener('click', equals);

// desimaali namiska
decimal.addEventListener('click', decimalAdd);

// C namiska
cButton.addEventListener('click', clearAll);

// CE namiska
ceButton.addEventListener('click', clearEntry)

// Backspace namiska
backspace.addEventListener('click', backspaceFunc)
