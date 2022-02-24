import React, { useEffect, useState } from "react";
import { Helmet } from "helmet";

import { SWRConfig } from "swr";
import ultraCache from "ultra/cache";
import { Route, useLocation, useRoute } from "wouter";

import Home from "./components/home.jsx";
import Nav from "./components/nav.jsx";
import Default from "./components/default.jsx";
import Spinner from "./components/spinner.jsx";

const Ultra = ({ cache }) => {
  const [data, setData] = useState("");
  const [screenName, setScreenName] = useState("");
  const [match, params] = useRoute("/");
  const [location, setLocation] = useLocation();

  useEffect(() => {
    fetch("/api/get_screen_name", { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setScreenName(data.payload.screenName);
        if (match) setLocation("/home");
      })
      .catch(() => {
        if (!match) setLocation("/");
      });
  }, []);

  return (
    <SWRConfig value={{ provider: () => ultraCache(cache) }}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="UTF-8" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css"
          rel="stylesheet"
        >
        </link>
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://ultrajs.dev/logo.svg"
        />
      </Helmet>
      <div class="container">
        <Nav screenName={screenName} />
        <hr />
        <div>
          <Route path="/">
            <Default />
          </Route>
          <Route path="/home">
            <Home screenName={screenName} />
          </Route>
        </div>
      </div>
    </SWRConfig>
  );
};

export default Ultra;
