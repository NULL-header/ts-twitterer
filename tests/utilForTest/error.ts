export class FetchError extends TypeError {
  constructor(res: import("node-fetch").Response, json: any) {
    console.log(res);
    super(
      `This is wrong access. The detail is here:\n${JSON.stringify({
        status: `${res.status}`,
        json: `${JSON.stringify(json)}`,
        detail: `${JSON.stringify(res)}`,
      })}`,
    );
  }
}
