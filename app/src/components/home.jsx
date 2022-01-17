import React, { useEffect, useState } from "react";
import { Helmet } from "helmet";

import Spinner from "./spinner.jsx";

const Links = function ({ screenName }) {
  const [data, setData] = useState([]);
  const [state, setState] = useState(false);

  const updateData = () => {
    setState(false);
    fetch("/api/get_timeline", { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setState(true);
        setData(data.payload);
      }).catch(() => {
        setState(false);
        window.location = "/"
      });
  };

  useEffect(() => {
    updateData();
  }, []);

  return (
    <>
      <Helmet>
        <title>ツイッタータイムライン - home</title>
      </Helmet>

      <div class="row">
        <div class="ten columns">
          {screenName} のタイムライン
        </div>
        <div class="two columns">
          <button onClick={updateData}>
            更新
          </button>
        </div>
      </div>

      <div>
        {state
          ? (
            <table class="u-full-width">
              <thead>
                <tr>
                  <th colspan="2">アカウント</th>
                  <th>ツイート</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  <tr>
                    <td>
                      <img
                        src={c.user.profile_image_url}
                        style={{ "border-radius": "50%" }}
                      />
                    </td>
                    <td>{c.user.name}</td>
                    <td>{c.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
          : <Spinner />}
      </div>
    </>
  );
};

export default Links;
