import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import { Router, useRouter } from "next/router";

function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const login = async () => {
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.access_token);
        router.push("/");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "Login failed. Please try again.");
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
          <p class="section_name">Authorisation</p>
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
          <button id="login" onClick={login}>Log in</button>
          <Link href="/register">
              <button id="register">Register</button>
          </Link>
          <p>{errorMessage}</p>
        </main>
      </>
    );
  }

export default Login;