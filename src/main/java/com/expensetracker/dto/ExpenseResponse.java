package com.expensetracker.dto;

import com.expensetracker.model.ExpenseCategory;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseResponse {
  private Long id;
  private String description;
  private BigDecimal amount;
  private ExpenseCategory category;
  private LocalDate expenseDate;
}
