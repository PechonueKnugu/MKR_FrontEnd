import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Statistic() {
  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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
          fetchUserUrls(token);
        });
    }
    else {
      setErrorMessage("Log in to check statistic")
    }
  }, []);

  const fetchUserUrls = (token) => {
    fetch("http://127.0.0.1:8000/api/me/urls", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const urlPromises = data.map((url) =>
          fetch(`http://127.0.0.1:8000/api/me/links/${url.short}/redirects`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((redirects) => ({ ...url, redirects }))
        );
        Promise.all(urlPromises).then((urlsWithRedirects) => {
          setUrls(urlsWithRedirects);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setUrls([]);
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
        <p class="section_name">Statistic</p>
        <ul>
          <p>{errorMessage}</p>
          {urls.map((url) => (
            <li key={url.short}>
              <p>
                <a href={`http://127.0.0.1:8000/${url.short}`}>
                  {`http://127.0.0.1:8000/${url.short}`}
                </a>{" "}
                (Original: <a href={url.url}>{url.url}</a>)
              </p>
              <ul>
                {url.redirects.map((redirect, index) => (
                  <li key={index}>{new Date(redirect).toLocaleString()}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}