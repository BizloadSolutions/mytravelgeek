import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "../config/config.service";

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.keys.API_TOKEN;
    if (!expected) {
      throw new UnauthorizedException("API token is not configured.");
    }

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();

    const raw = request.headers["x-api-token"];
    const provided = Array.isArray(raw) ? raw[0] : raw;

    if (!provided || provided !== expected) {
      throw new UnauthorizedException("Invalid or missing API token.");
    }

    return true;
  }
}
