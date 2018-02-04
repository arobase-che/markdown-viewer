'use strict';

/* eslint-env browser */
/* exported check */

/*
 * Écrit par Hédy GIRAUDEAU
 *
 */

const check = id => {
  const fieldQCM = document.getElementById(id);

  Array.from(fieldQCM.getElementsByTagName('INPUT')).forEach(input => {
    if (input.type !== 'checkbox') {
      return;
    }

    const label = document.querySelector(`label[for='${input.id}']`);
    if (input.checked) {
      Array.from(label.getElementsByClassName('hiden_block_quote')).forEach(child => {
        child.classList.remove('hiden_block_quote');
      });
    }
    switch (input.className) {
      case '!':
        label.style.color = '#FF0000';
        break;
      case '=':
        label.style.color = '#00BB00';
        break;
      case '~':
        label.style.color = '#FFAA00';
        break;
      default:
        // Empty
    }
  });
};

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

document.addEventListener('DOMContentLoaded', () => {
  const listQCM = Array.from(document.getElementsByClassName('qcm_field'));
  listQCM.forEach(field => {
    let listInput = [];
    Array.from(field.getElementsByTagName('INPUT')).forEach(input => {
      const label = document.querySelector(`label[for='${input.id}']`);
      listInput.push({input, label});
      field.removeChild(input);
      field.removeChild(label);
    });
    listInput = shuffle(listInput);
    Array.from(listInput).forEach(couple => {
      field.insertBefore(couple.label, field.childNodes[0]);
      field.insertBefore(couple.input, couple.label);
    });
  });
}, false);

document.check = check;
