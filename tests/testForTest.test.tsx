/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "fake-indexeddb/auto";
import React from "react";
import Twitter from "twitter";
import { mocked } from "ts-jest/utils";
import { render, screen, waitFor } from "@testing-library/react";
import { GlobalDetail } from "frontend/globalState/GlobalDetail";
// import { App as FrontApp } from "../src/frontend/app";
import "@testing-library/jest-dom";
import { makeServer, makeSetUpTwitterMock } from "./utilForTest";

console.log(GlobalDetail);

jest.mock("twitter");
const TwitterMocked = mocked(Twitter, true);

const setUpTwitterMock = makeSetUpTwitterMock(TwitterMocked);

describe("front", () => {
  describe("Normal", () => {
    it("load contents", async () => {
      // render(<FrontApp />);
      const prepareElement = screen.getByText("preparation");
      expect(prepareElement).toBeInTheDocument();
      await waitFor(() => {
        const loadingElement = screen.getByText("Loading");
        expect(loadingElement).toBeInTheDocument();
      });
      await waitFor(() => {
        const mainElement = screen.getByRole("main");
        expect(mainElement).toBeInTheDocument();
      });
    });
  });
});

describe("backend", () => {
  const { fetch, server } = makeServer({ port: 3000 });
  beforeAll(async () => {
    await server.run();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await server.close();
  });
  describe("Normal", () => {
    it("/api/ping", async () => {
      const result = await fetch("/api/ping");
      expect(result).toEqual({ response: "pong!" });
    });
    it("/api/tweet", async () => {
      const sampleListId = "sampleListId";
      const sampleCreatedAt = "sampleCreatedAt";
      const sampleUsername = "sampleUsername";
      const sampleUserid = "sampleUserid";
      const sampleDataid = "sampleDataid";
      const sampleIconUrl = "sampleIconUrl";
      const sampleContent = "sampleContent";
      const sampleIsRetweeted = false;
      setUpTwitterMock("lists/statuses", [
        {
          created_at: sampleCreatedAt,
          id_str: sampleDataid,
          full_text: sampleContent,
          retweeted_status: null as any,
          user: {
            profile_image_url: sampleIconUrl,
            name: sampleUsername,
            screen_name: sampleUserid,
          },
          extended_entities: null as any,
        },
      ]);
      const result: TweetColumns[] = await fetch(
        `/api/tweet?last_newest_tweet_data_id=000&list_id_str=${sampleListId}`,
      );
      expect(result[result.length - 1]).toEqual({
        content: sampleContent,
        dataid: sampleDataid,
        created_at: sampleCreatedAt,
        userid: sampleUserid,
        username: sampleUsername,
        icon_url: sampleIconUrl,
        is_retweeted: sampleIsRetweeted,
        list_id: sampleListId,
      });
      const stringInstance = expect.any(String);
      const booleanInstance = expect.any(Boolean);
      result.forEach((e) => {
        expect(e).toMatchObject({
          dataid: stringInstance,
          username: stringInstance,
          userid: stringInstance,
          icon_url: stringInstance,
          content: stringInstance,
          created_at: stringInstance,
          list_id: sampleListId,
          is_retweeted: booleanInstance,
        });
      });
    });
  });
  describe("Exception", () => {
    it("sample", async () => {
      const wrongFetchPromise = fetch(
        "/sample/tweet?last_newest_tweet_data_id=111&list_id_str=111",
      );
      await expect(wrongFetchPromise).rejects.toThrow();
    });
  });
});
