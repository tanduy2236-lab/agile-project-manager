export const normalizeColumnName = (value) => {
  const sanitized = String(value ?? "")
    .trim()
    .replace(/[\s_]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized || "CUSTOM";
};

export const createColumnStatusKey = (columnName, existingKeys = new Set()) => {
  const normalizedName = normalizeColumnName(columnName)
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "");

  const baseKey = normalizedName || "CUSTOM";

  if (!existingKeys.has(baseKey)) {
    return baseKey;
  }

  let suffix = 2;
  let key = `${baseKey}_${suffix}`;

  while (existingKeys.has(key)) {
    suffix += 1;
    key = `${baseKey}_${suffix}`;
  }

  return key;
};
