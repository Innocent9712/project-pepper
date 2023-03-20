export const SUPERADMIN = "superadmin"
export const ADMIN = "admin"
export class BaseController {
    public authRoles: string[]
    constructor() {
      this.authRoles = [SUPERADMIN, ADMIN]
    }
}

const baseController = new BaseController();

export default baseController;