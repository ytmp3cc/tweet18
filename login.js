import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ledutjaiqwnadwwvojpg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZHV0amFpcXduYWR3d3ZvanBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNDc5OTUsImV4cCI6MjA3MDcyMzk5NX0.T9LqaQgtGnt2sRthOCzzfqmF7zjyi3A9KEFWLNSmUMM';

const supabase = createClient(supabaseUrl, supabaseKey);

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const message = document.getElementById('message');

loginBtn.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });

  if (error) {
    message.textContent = error.message;
  } else {
    window.location.href = 'profile.html';
  }
});

signupBtn.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value
  });

  if (error) {
    message.textContent = error.message;
  } else {
    message.style.color = 'green';
    message.textContent = 'Signup successful! Check your email for confirmation.';
  }
});
