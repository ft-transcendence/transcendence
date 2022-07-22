/* GLOBAL MODULES */
import { Injectable } from "@nestjs/common";
/* GUARDS */
import { AuthGuard } from "@nestjs/passport";

// Create FortyTwoAuthGuard - used access 42 API
@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42auth') {
    constructor() {
        super();
    }
}