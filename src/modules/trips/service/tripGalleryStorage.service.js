import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { normalizeCategorySlug } from '@/utils/categoryHelpers';

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

const MIME_EXTENSION_MAP = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
};

function sanitizePathSegment(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getCategoryFolder(category = '') {
  const normalized = normalizeCategorySlug(category) || 'others';
  return sanitizePathSegment(normalized) || 'others';
}

function isRemoteImageUrl(value = '') {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function inferExtensionFromContentType(contentType = '') {
  const type = String(contentType).split(';')[0].trim().toLowerCase();
  return MIME_EXTENSION_MAP[type] || null;
}

function inferExtensionFromUrl(fileUrl = '') {
  try {
    const parsed = new URL(fileUrl);
    const ext = path.extname(parsed.pathname).replace('.', '').toLowerCase();
    if (!ext) return null;

    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }

    return null;
  } catch {
    return null;
  }
}

function inferExtensionFromFileName(fileName = '') {
  const ext = path.extname(String(fileName)).replace('.', '').toLowerCase();
  if (!ext) return null;

  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'].includes(ext)) {
    return ext === 'jpeg' ? 'jpg' : ext;
  }

  return null;
}

async function persistImageBuffer({ imageBuffer, categoryFolder, ext }) {
  if (!imageBuffer.length) {
    throw new Error('La imagen esta vacia.');
  }

  if (imageBuffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(
      `La imagen supera el limite de 15MB (${imageBuffer.length} bytes)`,
    );
  }

  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  const absoluteDir = path.join(
    process.cwd(),
    'public',
    'storage',
    categoryFolder,
  );
  const absoluteFilePath = path.join(absoluteDir, fileName);

  await fs.mkdir(absoluteDir, { recursive: true });
  await fs.writeFile(absoluteFilePath, imageBuffer);

  return `/storage/${categoryFolder}/${fileName}`;
}

async function downloadImageToLocalStorage(fileUrl, categoryFolder) {
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error(
      `No se pudo descargar la imagen (${response.status}) desde ${fileUrl}`,
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const ext =
    inferExtensionFromContentType(contentType) ||
    inferExtensionFromUrl(fileUrl) ||
    'jpg';

  const arrayBuffer = await response.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  return persistImageBuffer({ imageBuffer, categoryFolder, ext });
}

export async function saveBase64ImageToLocalStorage({
  base64Data,
  category,
  fileName,
  mimeType,
}) {
  const data = String(base64Data || '').trim();
  if (!data) {
    throw new Error("El campo 'base64Data' es requerido");
  }

  const categoryFolder = getCategoryFolder(category);
  const normalizedBase64 = data.includes(',') ? data.split(',').pop() : data;
  const imageBuffer = Buffer.from(normalizedBase64, 'base64');

  const ext =
    inferExtensionFromContentType(mimeType) ||
    inferExtensionFromFileName(fileName) ||
    'jpg';

  return persistImageBuffer({ imageBuffer, categoryFolder, ext });
}

function normalizeGalleryItem(item) {
  if (!item) return null;

  if (typeof item === 'string') {
    return { url: item, alt: '' };
  }

  if (typeof item === 'object') {
    return { ...item };
  }

  return null;
}

export async function materializeGalleryInLocalStorage({ gallery, category }) {
  if (!Array.isArray(gallery) || gallery.length === 0) {
    return gallery;
  }

  const categoryFolder = getCategoryFolder(category);
  const downloadCache = new Map();
  const result = [];

  for (const rawItem of gallery) {
    const item = normalizeGalleryItem(rawItem);
    if (!item) continue;

    const currentUrl = String(item.url || '').trim();
    if (!currentUrl) {
      result.push(item);
      continue;
    }

    if (!isRemoteImageUrl(currentUrl)) {
      result.push({ ...item, url: currentUrl });
      continue;
    }

    let localUrl = downloadCache.get(currentUrl);

    if (!localUrl) {
      localUrl = await downloadImageToLocalStorage(currentUrl, categoryFolder);
      downloadCache.set(currentUrl, localUrl);
    }

    result.push({ ...item, url: localUrl });
  }

  return result;
}
