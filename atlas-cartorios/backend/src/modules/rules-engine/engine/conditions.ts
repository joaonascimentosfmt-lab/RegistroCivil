export class ConditionEvaluator {
  evaluate(conditions: any, context: Record<string, any>): boolean {
    if (!conditions) return true;

    if (conditions.operator) {
      return this.evaluateOperator(conditions, context);
    }

    if (conditions.and) {
      return conditions.and.every((cond: any) => this.evaluate(cond, context));
    }

    if (conditions.or) {
      return conditions.or.some((cond: any) => this.evaluate(cond, context));
    }

    if (conditions.not) {
      return !this.evaluate(conditions.not, context);
    }

    if (conditions.field) {
      return this.evaluateComparison(conditions, context);
    }

    return true;
  }

  private evaluateOperator(condition: any, context: Record<string, any>): boolean {
    const { operator, field, value } = condition;
    const fieldValue = this.resolveField(field, context);

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'greater_than':
        return Number(fieldValue) > Number(value);
      case 'greater_than_or_equal':
        return Number(fieldValue) >= Number(value);
      case 'less_than':
        return Number(fieldValue) < Number(value);
      case 'less_than_or_equal':
        return Number(fieldValue) <= Number(value);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(fieldValue);
      case 'between':
        return Array.isArray(value) && value.length === 2 && Number(fieldValue) >= Number(value[0]) && Number(fieldValue) <= Number(value[1]);
      case 'regex':
        try {
          return new RegExp(value).test(String(fieldValue));
        } catch {
          return false;
        }
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'not_exists':
        return fieldValue === undefined || fieldValue === null;
      case 'is_empty':
        return fieldValue === '' || fieldValue === null || fieldValue === undefined;
      case 'is_not_empty':
        return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
      default:
        return false;
    }
  }

  private evaluateComparison(condition: any, context: Record<string, any>): boolean {
    return this.evaluateOperator({ operator: 'equals', ...condition }, context);
  }

  private resolveField(field: string, context: Record<string, any>): any {
    if (!field) return undefined;
    const parts = field.split('.');
    let value = context;
    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = value[part];
    }
    return value;
  }
}
