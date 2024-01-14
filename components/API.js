import * as SecureStore from "expo-secure-store";

async function API(endpoint, method = "GET", body = {}, otherArgs = {}) {
  const data = await SecureStore.getItemAsync("userData");
  const parsedData = JSON.parse(data);
  const apiUrl = `${parsedData.url}/api/${endpoint}`;
  const accessToken = parsedData.token;

  let fetchInit = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${accessToken}`,
    },
    method,
    ...otherArgs,
  };
  if (method !== "GET") {
    fetchInit = { ...fetchInit, body: JSON.stringify(body) };
  }

  const response = await fetch(apiUrl, fetchInit);

  try {
    let json = "";
    try {
      json = await response.json();
    } catch (error) {
      throw new Error(`JSON decoding error: ${error}`);
    }

    return json;
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

export const filterOutEmptyValues = (params, removeEmptyArrays = true) => {
  const filteredParams = {};
  // Filter out empty fields from an object (form data)
  Object.keys(params).forEach((key) => {
    // Empty array ([]) counts as true, so specifically test for it
    // Also, the number 0 may be a valid input but evaluate to false,
    // so just let numbers through
    if (
      (!(
        Array.isArray(params[key]) &&
        params[key].length === 0 &&
        removeEmptyArrays
      ) &&
        params[key]) ||
      typeof key === "number"
    ) {
      filteredParams[key] = params[key];
    }
  });
  return filteredParams;
};

function GET(endpoint, queryParams) {
  let url = endpoint;
  if (queryParams) {
    const filteredQueryParams = filterOutEmptyValues(queryParams);
    const queryString = new URLSearchParams(filteredQueryParams).toString();
    url += `?${queryString}`;
  }
  return API(url, "GET");
}

function POST(endpoint, payload) {
  return API(endpoint, "POST", payload);
}

function PATCH(endpoint, payload) {
  return API(endpoint, "PATCH", payload);
}

function PUT(endpoint, payload) {
  return API(endpoint, "PUT", payload);
}

function DELETE(endpoint, payload) {
  return API(endpoint, "DELETE", payload);
}

export { GET, POST, PUT, PATCH, DELETE, API };
