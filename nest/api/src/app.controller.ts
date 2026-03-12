import { Controller, Get } from "@nestjs/common";
import { initializePg } from "./core/postgres";
import { ApiResponse } from "@nestjs/swagger";
import { ErrorCodesRegistryGenerator } from "./libs/validation/error-codes-registry.generator";
import { ErrorCodesRegistryResponse } from "./libs/validation/exception-filter/error-code-registry.response";

@Controller("/")
export class AppController {

  
	@Get('error-codes-registry')
	@ApiResponse({
		status: 200,
		description: 'Registry of all error codes with descriptions (auto-generated)',
		type: ErrorCodesRegistryResponse,
	})
	errorCodesRegistry(): ErrorCodesRegistryResponse {
		return ErrorCodesRegistryGenerator.generateRegistry()
	}

  

  @Get("/health")
  async health() {
    const result = (await Promise.race([
      initializePg().query("SELECT 1"),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB connection timeout")), 5000)
      )
    ])) as any;
    return {
      status: "ok",
      db: result.rowCount === 1 ? "ok" : null
    };
  }
}
