class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const fail = (status, code, message, details) => {
  throw new ApiError(status, code, message, details);
};

const requireString = (value, field, { min = 1, max = 160 } = {}) => {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) {
    fail(400, "VALIDATION_ERROR", `${field} must be a text value between ${min} and ${max} characters`, { field });
  }
  return value.trim();
};

const optionalString = (value, field, options = {}) => {
  if (value === undefined || value === null || value === "") return undefined;
  return requireString(value, field, options);
};

const requireNumber = (value, field, { min = -Infinity, max = Infinity } = {}) => {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    fail(400, "VALIDATION_ERROR", `${field} must be a number between ${min} and ${max}`, { field });
  }
  return number;
};

const optionalNumber = (value, field, options = {}) => {
  if (value === undefined || value === null || value === "") return undefined;
  return requireNumber(value, field, options);
};

const optionalBoolean = (value, field) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "boolean") {
    fail(400, "VALIDATION_ERROR", `${field} must be true or false`, { field });
  }
  return value;
};

const optionalDate = (value, field) => {
  if (value === undefined || value === null || value === "") return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    fail(400, "VALIDATION_ERROR", `${field} must be a valid ISO date`, { field });
  }
  return date.toISOString();
};

const optionalEnum = (value, field, allowed) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (!allowed.includes(value)) {
    fail(400, "VALIDATION_ERROR", `${field} must be one of: ${allowed.join(", ")}`, { field, allowed });
  }
  return value;
};

const optionalArray = (value, field, { itemType = "string", max = 25 } = {}) => {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value) || value.length > max || value.some((item) => typeof item !== itemType)) {
    fail(400, "VALIDATION_ERROR", `${field} must be an array of up to ${max} ${itemType} values`, { field });
  }
  return value;
};

const pickDefined = (value) => Object.fromEntries(
  Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)
);

const getPagination = (query) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 25));
  return { page, limit, skip: (page - 1) * limit };
};

const sendError = (res, error) => {
  const status = error instanceof ApiError ? error.status : 500;
  const code = error instanceof ApiError ? error.code : "INTERNAL_ERROR";
  if (!(error instanceof ApiError)) console.error(error);
  return res.status(status).json({
    error: {
      code,
      message: error.message || "An unexpected error occurred",
      ...(error.details ? { details: error.details } : {}),
    },
  });
};

module.exports = {
  ApiError,
  asyncHandler,
  fail,
  requireString,
  optionalString,
  requireNumber,
  optionalNumber,
  optionalBoolean,
  optionalDate,
  optionalEnum,
  optionalArray,
  pickDefined,
  getPagination,
  sendError,
};
