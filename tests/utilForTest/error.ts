export class FetchError extends TypeError {
  constructor(res: import("node-fetch").Response) {
    console.log(res);
    super(
      `This is wrong access. The detail is here:\n${JSON.stringify({
        status: res.status,
        detail: JSON.stringify(res),
      })}`,
    );
  }
}
