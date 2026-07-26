// Type declaration for multer (pre-existing missing types)
declare module 'multer' {
  import { Request } from 'express';

  interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }

  interface MulterOptions {
    storage?: any;
    limits?: any;
    fileFilter?: (req: Request, file: MulterFile, cb: any) => void;
  }

  interface MulterInstance {
    single: (name: string) => any;
    array: (name: string, maxCount?: number) => any;
    fields: (fields: any[]) => any;
    none: () => any;
    any: () => any;
  }

  interface MulterStatic {
    (options?: MulterOptions): MulterInstance;
    memoryStorage: () => any;
    diskStorage: (options: any) => any;
  }

  const multer: MulterStatic;
  export default multer;
}
