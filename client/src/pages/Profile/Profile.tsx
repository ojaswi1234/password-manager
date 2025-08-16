import React, { useEffect, useState } from 'react'

function Profile() {
  const [name, setName] = useState("");

  useEffect(() => {
    // Fetch user data from API or context
     fetch('http://localhost:3000/name', {
      credentials: 'include', // if using cookies/session
    })
      .then(res => res.json())
      .then(data => setName(data.name))
      .catch(() => setName('Guest'));
  }, []);

  return (
    <div>
      <h1>Welcome to your profile!</h1>
      <p>How are you, {name}? </p>
    </div>
  );
}

export default Profile;