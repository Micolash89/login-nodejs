
(() => {
    const open2 = document.querySelector('.icon__open2');
    const closed2 = document.querySelector('.icon__closed2');
    const input_password = document.getElementById('password');
    const input_password2 = document.getElementById('password2');
    const input_box_password = document.querySelector('.input-box-password');

    closed2.addEventListener('click', () => {

        input_password2.type = 'text';
        closed2.style.display = 'none';
        open2.style.display = 'inline';

    });

    open2.addEventListener('click', () => {

        input_password2.type = 'password';
        closed2.style.display = 'inline';
        open2.style.display = 'none';

    });

    input_password2.addEventListener('keyup', (e) => {

        if (e.target.value != input_password.value) {
            input_box_password.style.borderColor = 'red';
        } else {
            input_box_password.style.borderColor = 'white';
        }

    });

})();