// Loading animation and theme detection script

document.addEventListener('DOMContentLoaded', function() {
  // Always redirect after a brief delay to show the loading animation
  // Set a timeout for the redirect
  setTimeout(function() {
    redirectToApp();
  }, 1500); // 1.5 seconds delay
  
  // Function to handle redirection logic
  window.redirectToApp = function() {
    // Get the base URL
    const baseUrl = window.location.origin;
    // Get the current path (for handling deep links)
    const currentPath = window.location.pathname;
    
    // If we're on index.html, redirect to the root
    if (currentPath.includes('index.html')) {
      window.location.href = baseUrl + '/';
    } else if (currentPath === '/' || currentPath === '') {
      // Already at root, no need to redirect
      return;
    } else {
      // Preserve the path for deep linking
      window.location.href = baseUrl + currentPath;
    }
  }
  
  // Theme detection
  function updateThemeBasedOnPreference() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('studygenie-theme');
    
    if (savedTheme) {
      // Apply saved theme preference
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }
  
  // Initial theme check
  updateThemeBasedOnPreference();
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeBasedOnPreference);
  
  // Update loading message
  const loadingMessages = [
    'Loading StudyGenie...',
    'Preparing your study assistant...',
    'Getting things ready...',
    'Almost there...',
  ];
  
  const loadingElement = document.querySelector('.loading h1');
  let messageIndex = 0;
  
  // Change loading message every 2 seconds
  if (loadingElement) {
    setInterval(function() {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      loadingElement.textContent = loadingMessages[messageIndex];
    }, 2000);
  }
});