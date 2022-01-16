import React, { useEffect, useState } from "react";
import { Helmet } from "helmet";

const Defult = function () {
  return (
    <>
      <Helmet>
        <title>ツイッタータイムライン</title>
      </Helmet>
      <div class="code-example">
        このアプリは、Deno で作成 / 実行されています。<br />
        ログインしてタイムラインを覗いてみましょう。
      </div>
    </>
  );
};

export default Defult;
