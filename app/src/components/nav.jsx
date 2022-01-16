import React, { useEffect, useState } from "react";

const Nav = function ({ screenName }) {
  return (
    <div class="row">
      <div class="ten columns">
        <h1>ツイッタータイムライン</h1>
      </div>
      <div class="two columns">
        {screenName === ""
          ? <a href="/login" class="button button-light">LOGIN</a>
          : <a href="/logout" class="button button-dark">LOGOUT</a>}
      </div>
    </div>
  );
};

export default Nav;
