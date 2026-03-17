const IS_PROD = process.env.NODE_ENV === 'production';

export function setRefreshTokenCookie(res, token) {
  res.setHeader('Set-Cookie', [
    `refreshtoken=${token}; HttpOnly; Path=/api/auth; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${IS_PROD ? '; Secure' : ''}`,
  ]);
}

export function clearRefreshTokenCookie(res) {
  res.setHeader('Set-Cookie', [
    `refreshtoken=; HttpOnly; Path=/api/auth; Max-Age=0; SameSite=Strict${IS_PROD ? '; Secure' : ''}`,
  ]);
}
