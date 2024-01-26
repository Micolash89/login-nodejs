(() => {

    const open = document.querySelector('.icon__open');
    const closed = document.querySelector('.icon__closed');
    const input_password = document.getElementById('password');

    closed.addEventListener('click', () => {

        input_password.type = 'text';
        closed.style.display = 'none';
        open.style.display = 'inline';

    });

    open.addEventListener('click', () => {

        input_password.type = 'password';
        closed.style.display = 'inline';
        open.style.display = 'none';

    });

})();