import {
  Database,
  getAccessToken,
  getAuthenticateLink,
  type GetAuthLinkParam,
  statusHomeTimeline,
  stringQueryToObject,
} from "../deps.ts";

import { decodeHach, encodeHach } from "../util/util.ts";

interface Schema {
  token: string;
  screenName: string;
  accessToken: string;
  accessTokenSecret: string;
}

const oauthConsumerKey = Deno.env.get("OAUTH_CONSUMER_KEY");
const oauthConsumerSecret = Deno.env.get("OAUTH_CONSUMER_SECRET");
const oauthCallback = Deno.env.get("OAUTH_CALLBACK");

const login = async (ctx) => {
  const authParam: GetAuthLinkParam = {
    oauthConsumerKey,
    oauthConsumerSecret,
    oauthCallback,
  };

  const urlResponse = await getAuthenticateLink(authParam);

  await ctx.state.session.set("oauthTokenSecret", urlResponse.oauthTokenSecret);

  ctx.response.redirect(
    urlResponse.url,
  );
};

const db = new Database<Schema>({});

const callback = async (ctx) => {
  const query = ctx.request.url.toString().split("?")[1];
  const oauthTokenSecret = await ctx.state.session.get("oauthTokenSecret");
  const { oauthToken, oauthVerifier } = stringQueryToObject(query, {
    oauthToken: "",
    oauthVerifier: "",
  });

  const accessToken = await getAccessToken({
    oauthConsumerKey,
    oauthConsumerSecret,
    oauthToken: oauthToken.toString(),
    oauthVerifier: oauthVerifier.toString(),
    oauthTokenSecret,
  });

  const token = crypto.randomUUID().replace(/-/g, "");

  await db.insertOne({
    token: token,
    screenName: accessToken.screenName,
    oauthToken: accessToken.oauthToken,
    oauthTokenSecret: accessToken.oauthTokenSecret,
  });

  await ctx.cookies.set("session", encodeHach(token), {
    maxAge: 300,
  });

  await ctx.response.redirect(
    "/home",
  );
};

const getTimeline = async (context) => {
  const sessionToken = await context.cookies.get("session");
  const user = await db.findOne({ token: decodeHach(sessionToken) });

  const twitterParam = {
    consumerKey: oauthConsumerKey,
    consumerSecret: oauthConsumerSecret,
    token: user.oauthToken,
    tokenSecret: user.oauthTokenSecret,
  };

  // HomeTimeLine
  const timeline = await statusHomeTimeline(twitterParam, {
    count: 10,
    trim_user: false,
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  context.response.body = JSON.stringify({ payload: timeline });
};

const getScreenName = async (context) => {
  const sessionToken = await context.cookies.get("session");
  const { screenName } = await db.findOne({ token: decodeHach(sessionToken) });
  if (typeof screenName !== "string") {
    return context.response.status = 404;
  }
  context.response.body = JSON.stringify({ payload: { screenName } });
};

const logout = async (context) => {
  const sessionToken = await context.cookies.get("session");
  if (typeof sessionToken === "string") {
    await db.deleteOne({ token: decodeHach(sessionToken) });
  }

  await context.cookies.set("session", "", {
    maxAge: -1,
  });

  await context.response.redirect(
    "/",
  );
};

export const addCustomRoutes = (router) => {
  router.get("/login", login);
  router.get("/logout", logout);
  router.get("/oauth2/callback", callback);
  router.get("/api/get_timeline", getTimeline);
  router.get("/api/get_screen_name", getScreenName);
};
