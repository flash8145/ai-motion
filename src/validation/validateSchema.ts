import Ajv from "ajv";
import addFormats from "ajv-formats";
import sceneGraphSchema from "../types/scene-graph.schema.json";

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

const validate = ajv.compile(sceneGraphSchema);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a raw JSON object against the scene-graph JSON Schema.
 * Returns structured result with human-readable error messages.
 */
export function validateSchema(data: unknown): ValidationResult {
  const valid = validate(data);
  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors = (validate.errors ?? []).map((err) => {
    const path = err.instancePath || "/";
    const message = err.message ?? "unknown error";
    return `${path}: ${message}`;
  });

  return { valid: false, errors };
}
