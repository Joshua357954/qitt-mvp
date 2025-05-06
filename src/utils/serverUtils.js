// Reusable function to parse and validate multipart/form-data
const parseMultipartFormData = async (formData) => {
  const resourceType = formData.get("resourceType") || "";
  const dataRaw = formData.get("data") || "";
  const files = formData.getAll("files");

  if (!resourceType || !dataRaw) throw new Error("Missing resourceType or data");

  let data;
  try {
    data = JSON.parse(dataRaw);
  } catch {
    throw new Error("Invalid JSON in 'data'");
  }

  if (!data.description) throw new Error("Missing 'description' in data");

  return { resourceType, data, files };
};

// Reusable function to parse and validate application/json
const parseApplicationJson = async (req) => {
  const { resourceType, data } = await req.json();
  if (!resourceType || !data) throw new Error("Missing resourceType or data");
  if (!data.description) throw new Error("Missing 'description' in data");
  return { resourceType, data };
};
