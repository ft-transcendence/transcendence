/* AUTH Guards */
import { AuthGuard } from "@nestjs/passport";

// Create RtGuard - used to validate refresh token
export class RtGuard extends AuthGuard('jwt-refresh') {
    constructor() {
        super();
    }
}