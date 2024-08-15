// models/response.model.ts

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any; // Vous pouvez remplacer `any` par un type plus spécifique si vous savez ce que vous recevez
  }
  