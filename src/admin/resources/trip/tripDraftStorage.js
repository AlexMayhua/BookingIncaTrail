const TRIP_DRAFT_PREFIX = 'trip-draft:v1';

export const TRIP_DRAFT_STATUS = {
  SAVED: 'saved',
  TEMPORARY: 'temporary',
  SAVING_LOCAL: 'saving-local',
};

export function getTripDraftKey(mode, tripId) {
  if (mode === 'edit' && tripId) {
    return `${TRIP_DRAFT_PREFIX}:edit:${tripId}`;
  }

  return `${TRIP_DRAFT_PREFIX}:create`;
}

export function getTripDraft({ mode, tripId }) {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const rawDraft = storage.getItem(getTripDraftKey(mode, tripId));
  if (!rawDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(rawDraft);

    if (!parsedDraft || typeof parsedDraft !== 'object') {
      return null;
    }

    return {
      mode: parsedDraft.mode || mode,
      tripId: parsedDraft.tripId || tripId || null,
      updatedAt: parsedDraft.updatedAt || null,
      values:
        parsedDraft.values && typeof parsedDraft.values === 'object'
          ? parsedDraft.values
          : {},
    };
  } catch {
    storage.removeItem(getTripDraftKey(mode, tripId));
    return null;
  }
}

export function saveTripDraft({ mode, tripId, values }) {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const draft = {
    mode,
    tripId: tripId || null,
    updatedAt: new Date().toISOString(),
    values: sanitizeTripDraftValues(values),
  };

  try {
    storage.setItem(getTripDraftKey(mode, tripId), JSON.stringify(draft));
  } catch {
    return null;
  }

  return draft;
}

export function clearTripDraft({ mode, tripId }) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(getTripDraftKey(mode, tripId));
  } catch {}
}

export function sanitizeTripDraftValues(values) {
  if (!values || typeof values !== 'object') {
    return {};
  }

  const { gallery, ...restValues } = values;
  return sanitizeValue(restValues) || {};
}

export function hasTripDraftContent(value) {
  if (value == null) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number') {
    return true;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasTripDraftContent(item));
  }

  if (typeof value === 'object') {
    return Object.values(value).some((item) => hasTripDraftContent(item));
  }

  return false;
}

export function formatTripDraftTimestamp(updatedAt) {
  if (!updatedAt) {
    return '';
  }

  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function sanitizeValue(value) {
  if (value == null) {
    return value;
  }

  if (isFileLike(value)) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeValue(item))
      .filter((item) => item !== undefined);
  }

  if (typeof value === 'object') {
    const nextValue = {};

    Object.entries(value).forEach(([key, nestedValue]) => {
      if (key === 'gallery' || key === 'file' || key === 'rawFile') {
        return;
      }

      const sanitizedNestedValue = sanitizeValue(nestedValue);
      if (sanitizedNestedValue !== undefined) {
        nextValue[key] = sanitizedNestedValue;
      }
    });

    return nextValue;
  }

  return value;
}

function isFileLike(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (typeof File !== 'undefined' && value instanceof File) {
    return true;
  }

  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    return true;
  }

  return 'rawFile' in value;
}

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
