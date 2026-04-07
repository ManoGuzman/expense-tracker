package com.expensetracker.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Standard error response DTO for API error responses. */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

  private LocalDateTime timestamp;
  private int status;
  private String error;
  private String message;
  private String path;

  public ErrorResponse(String message) {
    this.timestamp = LocalDateTime.now();
    this.message = message;
  }
}
