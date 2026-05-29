import { Injectable, Logger } from "@nestjs/common";

export type GraphqlRequest = {
  query: string;
  variables?: Record<string, unknown>;
};

@Injectable()
export class GraphqlClientService {
  private readonly logger = new Logger(GraphqlClientService.name);

  async post<T>(
    endpoint: string,
    accessToken: string,
    body: GraphqlRequest,
  ): Promise<T> {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-token": accessToken,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`GraphQL HTTP ${response.status}: ${text.slice(0, 300)}`);
    }

    let json: { data?: T; errors?: Array<{ message?: string }> };
    try {
      json = JSON.parse(text) as typeof json;
    } catch {
      throw new Error("GraphQL returned invalid JSON.");
    }

    if (json.errors?.length) {
      const message = json.errors.map((e) => e.message).join("; ");
      this.logger.warn(`GraphQL errors: ${message}`);
      throw new Error(message || "GraphQL request failed.");
    }

    if (!json.data) {
      throw new Error("GraphQL response missing data.");
    }

    return json.data;
  }
}
