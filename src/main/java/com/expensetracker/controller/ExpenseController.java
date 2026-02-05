package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for managing expense resources.
 * Handles all HTTP requests related to expense operations.
 */
@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {

  private final ExpenseService expenseService;
    
  /**
   * Retrieves expenses with optional filtering.
   *
   * @param filter optional filter (week, month, 3months)
   * @param startDate optional start date for custom range
   * @param endDate optional end date for custom range
   * @return list of expenses matching the filter criteria
   */
  @GetMapping
  public ResponseEntity<List<ExpenseResponse>> getAllExpenses(
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate startDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate endDate) {
    if (filter != null) {
      return switch (filter.toLowerCase()) {
        case "week" -> ResponseEntity.ok(expenseService.getExpensesPastWeek());
        case "month" -> ResponseEntity.ok(expenseService.getExpensesPastMonth());
        case "3months" -> ResponseEntity.ok(expenseService.getExpensesPast3Months());
        default -> ResponseEntity.ok(expenseService.getAllExpenses());
      };
    } else if (startDate != null && endDate != null) {
      return ResponseEntity.ok(expenseService.getExpensesByDateRange(startDate, endDate));
    }
    return ResponseEntity.ok(expenseService.getAllExpenses());
  }
    
  /**
   * Retrieves a specific expense by ID.
   *
   * @param id the expense ID
   * @return the expense details
   */
  @GetMapping("/{id}")
  public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) {
    return ResponseEntity.ok(expenseService.getExpenseById(id));
  }

  /**
   * Creates a new expense.
   *
   * @param request the expense creation request
   * @return the created expense
   */
  @PostMapping
  public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.createExpense(request));
  }

  /**
   * Updates an existing expense.
   *
   * @param id the expense ID
   * @param request the expense update request
   * @return the updated expense
   */
  @PutMapping("/{id}")
  public ResponseEntity<ExpenseResponse> updateExpense(
      @PathVariable Long id, @Valid @RequestBody ExpenseRequest request) {
    return ResponseEntity.ok(expenseService.updateExpense(id, request));
  }

  /**
   * Deletes an expense.
   *
   * @param id the expense ID
   * @return no content response
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
    expenseService.deleteExpense(id);
    return ResponseEntity.noContent().build();
  }
}
