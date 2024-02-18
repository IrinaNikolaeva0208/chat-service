import { ExecutionContext } from '@nestjs/common';

export function getTokenFromRequest(context: ExecutionContext, key: string) {
  const type = context.getType();
  let header = '';
  if (type === 'rpc') {
    const metadata = context.getArgByIndex(1);
    if (!metadata) {
      return null;
    }
    header = metadata.get('Cookie')[0];
  }

  if (!header) {
    return null;
  }

  const end = key === 'accessToken=' ? header.indexOf(';') : header.length;
  return header.slice(header.indexOf(key) + key.length, end);
}
