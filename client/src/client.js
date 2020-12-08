const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');
  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};

// on user sending a message
const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  sock.emit('message', text);
};

// button listeners
const addButtonListeners = () => {
  ['rock', 'paper', 'scissors'].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
      sock.emit('rpsChoice', id);
    });
  });
};

// welcome player
writeEvent('Welcome to RPS');

// initialize socket.io
const sock = io();
// when there is a messge, we write it
sock.on('message', (text) => {
  writeEvent(text);
});

// event listeners
document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);

addButtonListeners();
