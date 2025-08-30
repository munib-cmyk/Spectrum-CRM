// Login Prompt Functions for CRM Pages
// Shows a login screen instead of redirecting when user is not authenticated

function showLoginPrompt(pageName = 'this page') {
  // Hide main content
  const mainContent = document.querySelector('.page-wrapper');
  const leftSidenav = document.querySelector('.left-sidenav');
  const topbar = document.querySelector('.topbar');
  
  if (mainContent) mainContent.style.display = 'none';
  if (leftSidenav) leftSidenav.style.display = 'none';
  if (topbar) topbar.style.display = 'none';
  
  // Show login prompt
  let loginPrompt = document.getElementById('loginPrompt');
  if (!loginPrompt) {
    loginPrompt = document.createElement('div');
    loginPrompt.id = 'loginPrompt';
    loginPrompt.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; border-radius: 10px; padding: 3rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); text-align: center; max-width: 400px; width: 90%;">
          <img src="assets/images/logo.png" alt="Spectrum CRM" style="max-height: 60px; margin-bottom: 2rem;">
          <h3 style="color: #333; margin-bottom: 1rem; font-weight: 600;">Please Sign In</h3>
          <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
            You need to sign in with your Google account to access ${pageName}.
          </p>
          <button onclick="signInWithGoogle()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; padding: 12px 30px; border-radius: 6px; color: white; font-weight: 500; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            Sign in with Google
          </button>
          <div style="margin-top: 2rem;">
            <a href="index.html" style="color: #666; text-decoration: none; font-size: 14px;">← Back to Welcome Page</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(loginPrompt);
  }
  loginPrompt.style.display = 'block';
}

function hideLoginPrompt() {
  // Show main content
  const mainContent = document.querySelector('.page-wrapper');
  const leftSidenav = document.querySelector('.left-sidenav');
  const topbar = document.querySelector('.topbar');
  
  if (mainContent) mainContent.style.display = 'block';
  if (leftSidenav) leftSidenav.style.display = 'block';
  if (topbar) topbar.style.display = 'block';
  
  // Hide login prompt
  const loginPrompt = document.getElementById('loginPrompt');
  if (loginPrompt) {
    loginPrompt.style.display = 'none';
  }
}
