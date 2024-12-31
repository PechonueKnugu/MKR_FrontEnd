import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

function Register() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [full_name, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value); 
  };

  const register = async () => {
    setErrorMessage("");
    try {
        const response = await fetch("http://127.0.0.1:8000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
                full_name: full_name,
            }),
        });

        if (response.ok) {
            router.push("/login");
        } else {
            const errorData = await response.json();
            if (errorData && errorData.detail) {
              setErrorMessage("Username should have at least 3 characters, password should have at least 8 characters");
            } else {
                setErrorMessage("Registration failed. Please try again.");
            }
        }
    } catch (error) {
        setErrorMessage(error.message);
    }
};

    
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta lang="ua" />
          <meta charSet="utf-8" />
          <title>ShortURL</title>
          <link rel="stylesheet" href="../styles/style.css" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
            rel="stylesheet"
          />
        </Head>
  
        <header>
          <h1 id="logo">ShortURL</h1>
        </header>
  
        <main id="main">
          <p class="section_name">Registration</p>
          <input
            type="text"
            placeholder="Full name"
            id="fullname"
            value={full_name}
            onChange={handleFullNameChange}
            autoComplete="off"
          />
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="off"
          />
          <button id="register" onClick={register}>Register</button>
          <p>{errorMessage}</p>
        </main>
      </>
    );
  }

export default Register;