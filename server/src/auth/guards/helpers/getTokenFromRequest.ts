import { ExecutionContext } from '@nestjs/common';

export function getTokenFromRequest(context: ExecutionContext) {
  const type = context.getType();
  const prefix = 'Bearer ';
  let header = '';
  if (type === 'rpc') {
    const metadata = context.getArgByIndex(1);
    if (!metadata) {
      return null;
    }
    header = metadata.get('Authorization')[0];
  }

  if (!header || !header.includes(prefix)) {
    return null;
  }
  return header.slice(header.indexOf(' ') + 1);
}
