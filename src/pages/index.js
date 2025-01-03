import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch("http://127.0.0.1:8000/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        });
    }
  }, []);

  const handleGenerate = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setShortURL("Please log in to shorten URLs.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/me/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: inputValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShortURL("http://127.0.0.1:8000/" + data.short);
      } else {
        setShortURL("Invalid URL");
      }
    } catch (error) {
      setShortURL("Invalid URL");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
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
        <article>
          {(() => {
          if (user) {
            return (
              <>
                <p>{user.username}</p>
                <button id="logout" onClick={handleLogout}>Logout</button>
              </>
            );
          } else {
              return (
                <>
                  <Link href="/login">
                  <button id="login">Log in</button>
                  </Link>
                  <Link href="/register">
                  <button id="register">Register</button>
                  </Link>
                </>
              );
            }
          })()}
        </article>
      </header>

      <nav>
        <a href="/history">History</a>
        <a href="/">Main Page</a>
        <a href="/statistic">Statistic</a>
      </nav>

      <main id="main">
        <p class="section_name">Enter the URL</p>
        <input
          type="text"
          placeholder="Enter URL"
          id="search"
          value={inputValue}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <button id="generate" onClick={handleGenerate}>Generate</button>
        {shortURL && (
          <a href={shortURL}>
            {shortURL}
          </a>
        )}
      </main>
    </>
  );
}
