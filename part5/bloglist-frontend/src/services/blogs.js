import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
let config = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

const getAll = async () => {
  const request = await axios.get(baseUrl, config);
  return request.data;
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, newObject) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObject, config);
  return request.data;
};

const deleteBlog = async (id) => {
  const request = await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, create, update, deleteBlog, setToken };
