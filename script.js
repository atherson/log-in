const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const form = document.getElementById('authForm');

const loadUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
const saveUsers = u => localStorage.setItem('users', JSON.stringify(u));

(() => {
  const users = loadUsers();
  if (!users.some(u => u.isAdmin)) {
    users.push({
      username: 'admin',
      password: 'admin123',
      phone: '0000000000',
      email: 'admin@example.com',
      isAdmin: true,
      signupTime: new Date().toLocaleString('en-GB', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      loginCount: 0,
      lastLogin: null
    });
    saveUsers(users);
  }
})();

function renderLogin() {
  form.innerHTML = `
    <input name="username" placeholder="Username" required />
    <input type="password" name="password" placeholder="Password" required />
    <button type="submit" class="submit">Log In</button>
  `;
}

function renderSignup() {
  form.innerHTML = `
    <input name="username" placeholder="Username" required />
    <input type="password" name="password" placeholder="Password" required />
    <input name="phone" placeholder="Phone" required />
    <input type="email" name="email" placeholder="Email" required />
    <button type="submit" class="submit">Sign Up</button>
  `;
}

loginTab.onclick = () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  renderLogin();
};

signupTab.onclick = () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  renderSignup();
};

form.onsubmit = e => {
  e.preventDefault();
  const data = {};
  new FormData(form).forEach((v, k) => data[k] = v.trim());
  const users = loadUsers();

  if (loginTab.classList.contains('active')) {
    const user = users.find(u => u.username === data.username && u.password === data.password);
    if (!user) return alert('Invalid credentials');

    user.loginCount++;
    user.lastLogin = new Date().toLocaleString('en-GB', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    saveUsers(users);
    sessionStorage.setItem('currentUser', user.username);
    return user.isAdmin ? window.location = 'admin.html' : alert('Logged in successfully!');
  }

  if (users.some(u => u.username === data.username)) return alert('Username taken');

  const newUser = {
    ...data,
    isAdmin: false,
    signupTime: new Date().toLocaleString('en-GB', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }),
    loginCount: 0,
    lastLogin: null
  };

  users.push(newUser);
  saveUsers(users);
  alert('Registration successful! You can now log in.');
  loginTab.click();
};

renderLogin();
