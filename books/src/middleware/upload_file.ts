import multer from 'multer';

const storage = multer.diskStorage({
    destination(req: any, file: any, cb: Function) {
        cb(null, 'public/img')
    },
    filename(req: any, file: any, cb: Function) {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`)
    }
});

export default multer({storage});

