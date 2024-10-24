function showForm(formType) {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
  
    if (formType === 'register') {
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
    } else if (formType === 'login') {
      registerForm.classList.remove('active');
      loginForm.classList.add('active');
    }
  }
  