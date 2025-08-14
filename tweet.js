import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ledutjaiqwnadwwvojpg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZHV0amFpcXduYWR3d3ZvanBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNDc5OTUsImV4cCI6MjA3MDcyMzk5NX0.T9LqaQgtGnt2sRthOCzzfqmF7zjyi3A9KEFWLNSmUMM';

const supabase = createClient(supabaseUrl, supabaseKey);

const tweetsContainer = document.getElementById('tweets-container');
const tweetBtn = document.getElementById('tweet-btn');
const tweetText = document.getElementById('tweet-text');

async function loadTweets() {
  const { data: tweets, error } = await supabase
    .from('tweets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error(error);

  tweetsContainer.innerHTML = '';
  tweets.forEach(renderTweet);
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

  tweetsContainer.appendChild(div);
}

tweetBtn.addEventListener('click', async () => {
  const content = tweetText.value.trim();
  if (!content) return;

  const { data, error } = await supabase
    .from('tweets')
    .insert([{ content }]);

  if (error) return console.error(error);

  tweetText.value = '';
  renderTweet(data[0]);
});

// Load tweets on page load
loadTweets();
