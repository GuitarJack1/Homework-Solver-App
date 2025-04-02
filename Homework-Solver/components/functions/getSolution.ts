export function processSolution(input: string): string {
  return input;
}

export function processInput(input: string): string {
  input.replace("+", "plus");
  input.replace("\\\\", "\\");
  return input;
}

export function findSolution(input: string): object {
  return { solution: "x = Skibidi" };
}
