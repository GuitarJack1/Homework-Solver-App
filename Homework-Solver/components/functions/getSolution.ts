import { WOLFRAM_API_LINK } from "@/constants/SensitiveData";
import axios from "axios";

export function processInput(input: string): string {
  input = input.trim();
  input = input.replaceAll("+", "plus");
  input = input.replaceAll("\\\\", "\\");
  input = input.replaceAll("\\(", "(");
  input = input.replaceAll("\\)", ")");
  input = input.replaceAll("$", "");
  return input;
}

interface ApiResponse {
  [key: string]: any;
}

export type findSolutionReturn = {
  success: boolean;
  pods: any[];
};

export async function findSolution(input: string): Promise<findSolutionReturn> {
  const axiosResponse: any | undefined = await axios.get(
    WOLFRAM_API_LINK + input
  );

  const response = axiosResponse
    ? axiosResponse["data"]["queryresult"]
    : { success: "false", pods: [null] };

  return { success: response["success"], pods: response["pods"] };
}
