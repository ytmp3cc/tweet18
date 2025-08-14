import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ledutjaiqwnadwwvojpg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZHV0amFpcXduYWR3d3ZvanBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNDc5OTUsImV4cCI6MjA3MDcyMzk5NX0.T9LqaQgtGnt2sRthOCzzfqmF7zjyi3A9KEFWLNSmUMM';

const supabase = createClient(supabaseUrl, supabaseKey);

const userTweets = document.getElementById('user-tweets');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const logoutBtn = document.getElementById('logout-btn');

async function loadProfile() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  profileName.textContent = user.user_metadata.full_name || 'User';
  profileEmail.textContent = '@' + (user.email.split('@')[0] || 'user');

  const { data: tweets, error: tweetsError } = await supabase
    .from('tweets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (tweetsError) return console.error(tweetsError);

  tweets.forEach(tweet => renderTweet(tweet));
}

function renderTweet(tweet) {
  const div = document.createElement('div');
  div.classList.add('tweet');

  div.innerHTML = `
    <img src="https://i.pravatar.cc/48?u=${tweet.id}" class="avatar">
    <div class="content">
      <span class="name">User</span>
      <span class="handle">@user</span>
      <span class="timestamp">${new Date(tweet.created_at).toLocaleTimeString()}</span>
      <div class="text">${tweet.text || tweet.content}</div>
      <div class="actions">
        <button>Reply</button>
        <button>Retweet</button>
        <button>Like</button>
      </div>
    </div>
  `;

  userTweets.appendChild(div);
}

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
});

loadProfile();
