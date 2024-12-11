const url = 'http://localhost:5050/api/users/signup';

const inputProfileImg = document.querySelector('#profile_img');
const inputEmail = document.querySelector('#email');
const inputPassword = document.querySelector('#password');
const inputRePassword = document.querySelector('#rePassword');
const inputNickname = document.querySelector('#nickname');
const emailHelperText = inputEmail.nextElementSibling;
const passwordHelperText = inputPassword.nextElementSibling;
const rePasswordHelperText = inputRePassword.nextElementSibling;
const nicknameHelperText = inputNickname.nextElementSibling;
const profileImgHelperText = document.querySelector('#profile-img-helper-text');
const showProfileImg = document.querySelector('#input-profile-img');
let checkEmail = false;
let checkPassword = false;
let checkRePassword = false;
let checkNickname = false;
let checkProfileImg = false;
let profileImg = null;
let email;
let password;
let nickname;
const signupBtn = document.querySelector('.login-button');

const checkInput = () => {
    if (
        checkEmail &&
        checkPassword &&
        checkRePassword &&
        checkNickname &&
        checkProfileImg
    ) {
        signupBtn.style.backgroundColor = '#7F6AEE';
    } else {
        signupBtn.style.backgroundColor = '#aca0eb';
    }
};

inputProfileImg.addEventListener('change', e => {
    const file = e.target.files[0];

    if (!file) {
        profileImgHelperText.style.display = 'flex';
    } else {
        profileImgHelperText.style.display = 'none';
        checkProfileImg = true;

        const reader = new FileReader();
        reader.onload = () => {
            showProfileImg.src = reader.result;
            showProfileImg.style.display = 'flex';
            showProfileImg.style.width = '100%';
            showProfileImg.style.height = '100%';
        };

        reader.readAsDataURL(file);
    }

    checkInput();
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#$])[A-Za-z\d@$!%*?&#$]{8,20}$/;

inputEmail.addEventListener('change', e => {
    if (e.target.value == '') {
        emailHelperText.style.display = 'flex';
        inputEmail.style.marginBottom = '0px';
        emailHelperText.textContent = '*이메일을 입력해주세요.';
        checkEmail = false;
    } else if (emailRegex.test(e.target.value)) {
        emailHelperText.style.display = 'none';
        inputEmail.style.marginBottom = '16px';
        checkEmail = true;
        email = e.target.value;
    } else {
        emailHelperText.style.display = 'flex';
        inputEmail.style.marginBottom = '0px';
        emailHelperText.textContent =
            '*올바른 이메일 주소 형식을 입력해주세요.';
        checkEmail = false;
    }

    checkInput();
});

inputPassword.addEventListener('change', e => {
    if (e.target.value == '') {
        passwordHelperText.style.display = 'flex';
        inputPassword.style.marginBottom = '0px';
        passwordHelperText.textContent = '*비밀번호를 입력해주세요.';
        checkPassword = false;
    } else if (passwordRegex.test(e.target.value)) {
        passwordHelperText.style.display = 'none';
        inputPassword.style.marginBottom = '16px';
        checkPassword = true;
        password = e.target.value;
    } else {
        passwordHelperText.style.display = 'flex';
        inputPassword.style.marginBottom = '0px';
        passwordHelperText.textContent =
            '*비밀번호는 8자 이상, 20자이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        checkPassword = false;
    }

    checkInput();
});

inputRePassword.addEventListener('change', e => {
    if (e.target.value == '') {
        rePasswordHelperText.style.display = 'flex';
        inputRePassword.style.marginBottom = '0px';
        rePasswordHelperText.textContent = '*비밀번호를 한번더 입력해주세요.';
        checkRePassword = false;
    } else if (password != e.target.value) {
        rePasswordHelperText.style.display = 'flex';
        inputRePassword.style.marginBottom = '0px';
        rePasswordHelperText.textContent = '*비밀번호가 다릅니다.';
        checkRePassword = false;
    } else {
        rePasswordHelperText.style.display = 'none';
        inputRePassword.style.marginBottom = '16px';
        checkRePassword = true;
    }

    checkInput();
});

inputNickname.addEventListener('change', e => {
    if (e.target.value == '') {
        nicknameHelperText.style.display = 'flex';
        inputNickname.style.marginBottom = '0px';
        nicknameHelperText.textContent = '*닉네임을 입력해주세요.';
        checkNickname = false;
    } else if (/\s/.test(e.target.value)) {
        nicknameHelperText.style.display = 'flex';
        inputNickname.style.marginBottom = '0px';
        nicknameHelperText.textContent = '*띄어쓰기를 없애주세요.';
        checkNickname = false;
    } else if (e.target.value.length > 10) {
        nicknameHelperText.style.display = 'flex';
        inputNickname.style.marginBottom = '0px';
        nicknameHelperText.textContent =
            '*닉네임은 최대 10자 까지 작성 가능합니다.';
        checkNickname = false;
    } else {
        nicknameHelperText.style.display = 'none';
        inputNickname.style.marginBottom = '16px';
        checkNickname = true;
        nickname = e.target.value;
    }

    checkInput();
});

signupBtn.addEventListener('click', async event => {
    try {
        const formData = new FormData();
        formData.append('profile_img', profileImg);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('nickname', nickname);

        if (
            checkEmail &&
            checkPassword &&
            checkRePassword &&
            checkNickname &&
            checkProfileImg
        ) {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status == 201) {
                alert(response.data.message);
                window.location.href = '/';
            }
        } else {
            alert('입력값이 유효하지 않습니다!');
        }
    } catch (e) {
        if (e.response.data.message == '이메일이 중복되었습니다.') {
            emailHelperText.style.display = 'flex';
            inputEmail.style.marginBottom = '0px';
            emailHelperText.textContent = '*중복된 이메일 입니다.';
            checkEmail = false;
        } else if (e.response.data.message == '닉네임이 중복되었습니다.') {
            nicknameHelperText.style.display = 'flex';
            inputNickname.style.marginBottom = '0px';
            nicknameHelperText.textContent = '*중복된 닉네임 입니다.';
            checkNickname = false;
        } else {
            alert(e.response.data.message);
        }
    }
});
