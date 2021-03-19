/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "fake-indexeddb/auto";
import React from "react";
import Twitter from "twitter";
import { mocked } from "ts-jest/utils";
import { render, screen, waitFor } from "@testing-library/react";
import { App as FrontApp } from "../src/frontend/app";
import "@testing-library/jest-dom";
import { makeServer, makeSetUpTwitterMock } from "./utilForTest";

jest.mock("twitter");
const TwitterMocked = mocked(Twitter, true);

const setUpTwitterMock = makeSetUpTwitterMock(TwitterMocked);

describe("front", () => {
  it("load contents", async () => {
    render(<FrontApp />);
    const loadingElement = screen.getByText("Loading");
    expect(loadingElement).toBeInTheDocument();
    await waitFor(() => {
      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
    });
  });
});

describe("backend", () => {
  const { fetch, server, makeFetchWithCookie } = makeServer({ port: 3000 });
  beforeAll(async () => {
    await server.run();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await server.close();
  });
  it("/api/ping", async () => {
    const result = await fetch("/api/ping");
    expect(result).toEqual({ response: "pong!" });
  });
  it("/api/token/ set and delete", async () => {
    const setResult = await fetch("/api/token/set", {
      method: "POST",
      body: JSON.stringify({
        consumer_token: "consumer_token",
        consumer_token_secret: "consumer_token_secret",
        access_token: "access_token",
        access_token_secret: "access_token_secret",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(setResult).toBeTruthy();
    const deleteResult = await fetch("/api/token/delete", { method: "POST" });
    expect(deleteResult).toBeTruthy();
  });
  describe("with cookie", () => {
    let fetchWithCookie: ReturnType<typeof makeFetchWithCookie>;
    beforeEach(async () => {
      fetchWithCookie = makeFetchWithCookie();
      await fetchWithCookie("/api/token/set", {
        method: "POST",
        body: JSON.stringify({
          access_token: "access_token",
          access_token_secret: "access_token_secret",
          consumer_token: "consumer_token",
          consumer_token_secret: "consumer_token_secret",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
    afterEach(async () => {
      await fetchWithCookie("/api/token/delete", { method: "POST" });
    });
    it("/api/tweet", async () => {
      const sampleListId = "sampleListId";
      const sampleCreatedAt = "sampleCreatedAt";
      const sampleName = "sampleUsername";
      const sampleTwitterid = "sampleUserid";
      const sampleDataid = "sampleDataid";
      const sampleIconUrl = "sampleIconUrl";
      const sampleContent = "sampleContent";
      const sampleIsRetweeted = false;
      const sampleHasMedia = false;
      const sampleBannerUrl = "sampleBannerUrl";
      const sampleDescription = "sampleDescription";
      setUpTwitterMock("lists/statuses", [
        {
          created_at: sampleCreatedAt,
          id_str: sampleDataid,
          full_text: sampleContent,
          retweeted_status: null as any,
          user: {
            profile_image_url_https: sampleIconUrl,
            name: sampleName,
            screen_name: sampleTwitterid,
            profile_banner_url: sampleBannerUrl,
            description: sampleDescription,
          },
          extended_entities: null as any,
        },
      ]);
      const result: TweetColumns[] = await fetchWithCookie(
        `/api/tweet?last_newest_tweet_data_id=000&list_id_str=${sampleListId}`,
      );
      expect(result[result.length - 1]).toEqual({
        tweet: {
          content: sampleContent,
          dataid: sampleDataid,
          createdAt: sampleCreatedAt,
          isRetweeted: sampleIsRetweeted,
          listId: sampleListId,
          hasMedia: sampleHasMedia,
          user: {
            twitterId: sampleTwitterid,
            name: sampleName,
            iconUrl: sampleIconUrl,
            bannerUrl: sampleBannerUrl,
            description: sampleDescription,
          },
        },
      } as TweetColumns);
      const stringInstance = expect.any(String);
      const booleanInstance = expect.any(Boolean);
      result.forEach((e) => {
        expect(e).toMatchObject({
          tweet: {
            dataid: stringInstance,
            user: {
              name: stringInstance,
              twitterId: stringInstance,
              iconUrl: stringInstance,
              bannerUrl: stringInstance,
              description: stringInstance,
            },
            content: stringInstance,
            createdAt: stringInstance,
            listId: sampleListId,
            isRetweeted: booleanInstance,
            hasMedia: booleanInstance,
          },
        } as TweetColumns);
      });
    });
  });
});
