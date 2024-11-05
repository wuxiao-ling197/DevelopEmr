import { SetMetadata } from '@nestjs/common';

export const RequirePermission = (permission: string) => SetMetadata('permission', permission);
// 11.1 update
// export const RequirePermission = (permission: string | string[]) => SetMetadata('permission', permission);
