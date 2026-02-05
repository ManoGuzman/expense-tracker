package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.exception.InvalidInputException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.exception.UnauthorizedException;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing expense operations.
 * Handles business logic for expense CRUD operations and filtering.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExpenseService {

  private final ExpenseRepository expenseRepository;

  /**
   * Retrieves the currently authenticated user from the security context.
   *
   * @return the current user
   * @throws UnauthorizedException if user is not authenticated
   */
  private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
    if (authentication == null || !authentication.isAuthenticated()) {
      log.error("No authentication found in security context");
      throw new UnauthorizedException("User not authenticated");
    }
    
    Object principal = authentication.getPrincipal();
    if (!(principal instanceof User)) {
      log.error("Principal is not an instance of User: {}", principal.getClass().getName());
      throw new UnauthorizedException("Invalid authentication principal");
    }
    
    return (User) principal;
  }

  /**
   * Maps an Expense entity to an ExpenseResponse DTO.
   *
   * @param expense the expense entity
   * @return the expense response DTO
   */
  private ExpenseResponse mapToResponse(Expense expense) {
    return ExpenseResponse.builder()
        .id(expense.getId())
        .description(expense.getDescription())
        .amount(expense.getAmount())
        .category(expense.getCategory())
        .expenseDate(expense.getExpenseDate())
        .build();
  }
    
  /**
   * Retrieves all expenses for the current user.
   *
   * @return list of all user expenses
   */
  public List<ExpenseResponse> getAllExpenses() {
    User user = getCurrentUser();
    return expenseRepository.findByUserOrderByExpenseDateDesc(user).stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  /**
   * Retrieves expenses within a specific date range.
   *
   * @param startDate the start date
   * @param endDate the end date
   * @return list of expenses within the date range
   * @throws InvalidInputException if dates are invalid
   */
  public List<ExpenseResponse> getExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
    if (startDate == null || endDate == null) {
      log.error("Start date or end date is null");
      throw new InvalidInputException("Start date and end date are required");
    }
    
    if (startDate.isAfter(endDate)) {
      log.error("Start date {} is after end date {}", startDate, endDate);
      throw new InvalidInputException("Start date must be before or equal to end date");
    }
    
    User user = getCurrentUser();
    log.info("Fetching expenses for user {} between {} and {}", user.getEmail(), startDate, endDate);
    
    return expenseRepository.findByUserAndDateRange(user, startDate, endDate).stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }
    
  /**
   * Retrieves expenses from the past week.
   *
   * @return list of expenses from the past week
   */
  public List<ExpenseResponse> getExpensesPastWeek() {
    LocalDate endDate = LocalDate.now();
    LocalDate startDate = endDate.minusWeeks(1);
    return getExpensesByDateRange(startDate, endDate);
  }

  /**
   * Retrieves expenses from the past month.
   *
   * @return list of expenses from the past month
   */
  public List<ExpenseResponse> getExpensesPastMonth() {
    LocalDate endDate = LocalDate.now();
    LocalDate startDate = endDate.minusMonths(1);
    return getExpensesByDateRange(startDate, endDate);
  }

  /**
   * Retrieves expenses from the past 3 months.
   *
   * @return list of expenses from the past 3 months
   */
  public List<ExpenseResponse> getExpensesPast3Months() {
    LocalDate endDate = LocalDate.now();
    LocalDate startDate = endDate.minusMonths(3);
    return getExpensesByDateRange(startDate, endDate);
  }
    
  /**
   * Creates a new expense for the current user.
   *
   * @param request the expense creation request
   * @return the created expense
   */
  @Transactional
  public ExpenseResponse createExpense(ExpenseRequest request) {
    User user = getCurrentUser();
    log.info("Creating expense for user: {}", user.getEmail());

    Expense expense = Expense.builder()
        .description(request.getDescription())
        .amount(request.getAmount())
        .category(request.getCategory())
        .expenseDate(request.getExpenseDate())
        .user(user)
        .build();

    expense = expenseRepository.save(expense);
    log.info("Successfully created expense with ID: {}", expense.getId());
    
    return mapToResponse(expense);
  }

  /**
   * Updates an existing expense.
   *
   * @param id the expense ID
   * @param request the expense update request
   * @return the updated expense
   * @throws ResourceNotFoundException if expense not found
   * @throws UnauthorizedException if user not authorized
   */
  @Transactional
  public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
    User user = getCurrentUser();
    log.info("Updating expense {} for user: {}", id, user.getEmail());

    Expense expense = expenseRepository.findById(id)
        .orElseThrow(() -> {
          log.error("Expense not found with ID: {}", id);
          return new ResourceNotFoundException("Expense not found with ID: " + id);
        });

    if (!expense.getUser().getId().equals(user.getId())) {
      log.error("User {} not authorized to update expense {}", user.getEmail(), id);
      throw new UnauthorizedException("Not authorized to update this expense");
    }

    expense.setDescription(request.getDescription());
    expense.setAmount(request.getAmount());
    expense.setCategory(request.getCategory());
    expense.setExpenseDate(request.getExpenseDate());

    expense = expenseRepository.save(expense);
    log.info("Successfully updated expense with ID: {}", expense.getId());
    
    return mapToResponse(expense);
  }
    
  /**
   * Deletes an expense.
   *
   * @param id the expense ID
   * @throws ResourceNotFoundException if expense not found
   * @throws UnauthorizedException if user not authorized
   */
  @Transactional
  public void deleteExpense(Long id) {
    User user = getCurrentUser();
    log.info("Deleting expense {} for user: {}", id, user.getEmail());

    Expense expense = expenseRepository.findById(id)
        .orElseThrow(() -> {
          log.error("Expense not found with ID: {}", id);
          return new ResourceNotFoundException("Expense not found with ID: " + id);
        });

    if (!expense.getUser().getId().equals(user.getId())) {
      log.error("User {} not authorized to delete expense {}", user.getEmail(), id);
      throw new UnauthorizedException("Not authorized to delete this expense");
    }

    expenseRepository.delete(expense);
    log.info("Successfully deleted expense with ID: {}", id);
  }

  /**
   * Retrieves a specific expense by ID.
   *
   * @param id the expense ID
   * @return the expense details
   * @throws ResourceNotFoundException if expense not found
   * @throws UnauthorizedException if user not authorized
   */
  public ExpenseResponse getExpenseById(Long id) {
    User user = getCurrentUser();
    log.info("Fetching expense {} for user: {}", id, user.getEmail());

    Expense expense = expenseRepository.findById(id)
        .orElseThrow(() -> {
          log.error("Expense not found with ID: {}", id);
          return new ResourceNotFoundException("Expense not found with ID: " + id);
        });

    if (!expense.getUser().getId().equals(user.getId())) {
      log.error("User {} not authorized to view expense {}", user.getEmail(), id);
      throw new UnauthorizedException("Not authorized to view this expense");
    }

    return mapToResponse(expense);
  }
}
