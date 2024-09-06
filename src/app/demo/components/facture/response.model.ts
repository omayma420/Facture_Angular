// models/response.model.ts

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any; 
  }
