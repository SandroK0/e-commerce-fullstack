import config from "./config";

export const GraphQL = async (query, variables = {}) => {
  try {
    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      if (result.errors) {
        throw new Error(result.errors.map((error) => error.message).join(", "));
      }
      return result.data;
    } else {
      throw new Error(
        result.errors ? result.errors[0]?.message : "Unknown error"
      );
    }
  } catch (error) {
    throw error;
  }
};
