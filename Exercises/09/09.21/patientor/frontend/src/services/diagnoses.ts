import axios from "axios";

import { Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";

const getByCode = async (code: string) => {
  const { data } = await axios.get<Diagnosis>(
    `${apiBaseUrl}/diagnoses/${code}`
  );

  return data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getByCode
}