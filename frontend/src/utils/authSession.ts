export function authSession() {
  return sessionStorage.getItem('token');
}