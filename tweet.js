const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function initTimeline() {
  const user = await supabase.auth.getUser();
  if(!user.data.user) window.location.href = 'login.html';

  // Fetch all tweets for demo (in production filter by follows)
  const { data: tweets } = await supabase
    .from('tweets')
    .select(`*, users(username, display_name, profile_pic_url)`)
    .order('created_at', { ascending: false });

  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  tweets.forEach(tweet => {
    const div = document.createElement('div');
    div.className = 'tweet-box';
    div.innerHTML = `
      <img src="${tweet.users.profile_pic_url}" class="avatar">
      <div class="tweet-content">
        <strong>${tweet.users.display_name}</strong>
        <span class="handle">@${tweet.users.username}</span><br>
        ${tweet.text}<br>
        <div class="tweet-actions">
          <button onclick="likeTweet('${tweet.id}')">Like</button>
        </div>
      </div>
    `;
    feed.appendChild(div);
  });
}

async function postTweet() {
  const text = document.getElementById('tweet-text').value;
  const user = await supabase.auth.getUser();
  await supabase.from('tweets').insert({ user_id: user.data.user.id, text });
  document.getElementById('tweet-text').value = '';
  initTimeline();
}

async function likeTweet(tweetId) {
  const user = await supabase.auth.getUser();
  await supabase.from('likes').insert({ user_id: user.data.user.id, tweet_id: tweetId });
}

async function loadProfile(username) {
  const { data: user } = await supabase.from('users').select('*').eq('username', username).single();
  document.getElementById('profile-avatar').src = user.profile_pic_url || 'https://via.placeholder.com/80';
  document.getElementById('profile-name').innerText = user.display_name;
  document.getElementById('profile-handle').innerText = '@' + user.username;
  document.getElementById('profile-bio').innerText = user.bio;

  const { data: tweets } = await supabase.from('tweets').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  const container = document.getElementById('profile-tweets');
  container.innerHTML = '';
  tweets.forEach(tweet => {
    const div = document.createElement('div');
    div.className = 'tweet-box';
    div.innerHTML = `${tweet.text}`;
    container.appendChild(div);
  });
}
