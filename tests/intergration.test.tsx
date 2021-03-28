import "fake-indexeddb/auto";
import "jest-localstorage-mock";
import React from "react";
import Twitter from "twitter";
import { mocked } from "ts-jest/utils";
import { App as FrontApp } from "frontend/app";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByText,
  act,
} from "@testing-library/react";
import { db } from "frontend/worker/connect/db";
import { makeServer, makeSetUpTwitterMock } from "./utilForTest";
import "@testing-library/jest-dom";

jest.mock("twitter");
const TwitterMocked = mocked(Twitter, true);

const setUpTwitterMock = makeSetUpTwitterMock(TwitterMocked);

const getArticleFromName = (name: string) =>
  screen.getByRole("article", { name });

const findArticleFromName = (name: string) =>
  screen.findByRole("article", { name });

const queryArticleFromName = (name: string) =>
  screen.queryByRole("article", { name });

const getTabFromName = (name: string) => screen.getByRole("tab", { name });

describe("intergration", () => {
  const { server } = makeServer({ port: 3000 });
  let renderResult: ReturnType<typeof render>;
  beforeAll(async () => {
    await server.run();
  });
  beforeEach(async () => {
    await db.tweets.clear();
    await db.globalData.clear();
    jest.clearAllMocks();
    renderResult = render(<FrontApp />);
    await waitFor(() => {
      screen.getByRole("main");
    });
  });
  afterAll(async () => {
    await server.close();
  });
  it("auth page", () => {
    expect(getArticleFromName("Auth")).toBeInTheDocument();
  });
  it("auth toggle theme", async () => {
    const body = renderResult.container.parentElement as HTMLBodyElement;
    const beforeClassName = body.className;
    fireEvent.click(getTabFromName("Config"));
    const configPage = await findArticleFromName("Config");
    fireEvent.click(getByText(configPage, "HERE"));
    await waitFor(() => {
      const afterClassName = body.className;
      expect(beforeClassName).not.toEqual(afterClassName);
    });
  });
  it("set token", async () => {
    const tokenForm = screen.getByLabelText("tokens");
    const inputs = tokenForm.getElementsByTagName("input");
    act(() => {
      Array.from(inputs).forEach((e) => {
        e.value = "tokens";
      });
    });
    fireEvent.submit(inputs[0]);
    expect(await findArticleFromName("Timeline")).toBeInTheDocument();
  });
  it("show timeline directly", async () => {
    const tokenForm = screen.getByLabelText("tokens");
    const inputs = tokenForm.getElementsByTagName("input");
    act(() => {
      Array.from(inputs).forEach((e) => {
        e.value = "tokens";
      });
    });
    fireEvent.submit(inputs[0]);
    await waitFor(() => {
      expect(queryArticleFromName("Timeline")).not.toBeInTheDocument();
    });
    expect(await findArticleFromName("Timeline")).toBeInTheDocument();
  });
  describe("with cookie", () => {
    beforeEach(async () => {
      const tokenForm = screen.getByLabelText("tokens");
      const inputs = tokenForm.getElementsByTagName("input");
      act(() => {
        Array.from(inputs).forEach((e) => {
          e.value = "tokens";
        });
      });
      fireEvent.submit(inputs[0]);
      await findArticleFromName("Timeline");
    });
    it("changeTab", async () => {
      fireEvent.click(getTabFromName("Config"));
      expect(await findArticleFromName("Config")).toBeInTheDocument();
      expect(queryArticleFromName("Timeline")).toBe(null);

      fireEvent.click(getTabFromName("Data"));
      expect(await findArticleFromName("Data")).toBeInTheDocument();
      expect(queryArticleFromName("Config")).toBe(null);

      fireEvent.click(getTabFromName("Timeline"));
      expect(await findArticleFromName("Timeline")).toBeInTheDocument();
      expect(queryArticleFromName("Data")).toBe(null);
    });
    it("change color mode", async () => {
      const body = renderResult.container.parentElement as HTMLBodyElement;
      const beforeClassName = body.className;
      fireEvent.click(getTabFromName("Config"));
      const configPage = await findArticleFromName("Config");
      fireEvent.click(getByText(configPage, "HERE"));
      await waitFor(() => {
        const afterClassName = body.className;
        expect(beforeClassName).not.toEqual(afterClassName);
      });
    });
  });
});
