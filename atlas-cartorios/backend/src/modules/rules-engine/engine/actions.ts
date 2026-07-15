import { Logger } from '@nestjs/common';

export class ActionExecutor {
  private readonly logger = new Logger(ActionExecutor.name);

  async execute(actions: any, context: Record<string, any>): Promise<any[]> {
    const results: any[] = [];

    if (!actions) return results;

    const actionList = Array.isArray(actions) ? actions : [actions];

    for (const action of actionList) {
      const result = await this.executeSingle(action, context);
      results.push(result);
    }

    return results;
  }

  private async executeSingle(action: any, context: Record<string, any>): Promise<any> {
    const { type, params } = action;

    switch (type) {
      case 'set_status':
        return this.setStatus(params, context);
      case 'notify':
        return this.notify(params, context);
      case 'request_siscoaf_analysis':
        return this.requestSiscoafAnalysis(params, context);
      case 'block':
        return this.block(params, context);
      case 'warn':
        return this.warn(params, context);
      case 'set_field':
        return this.setField(params, context);
      case 'log':
        return this.logAction(params, context);
      default:
        this.logger.warn(`Unknown action type: ${type}`);
        return { type, success: false, error: `Unknown action type: ${type}` };
    }
  }

  private async setStatus(params: any, context: Record<string, any>) {
    const { status } = params;
    context._status = status;
    return { type: 'set_status', status, success: true };
  }

  private async notify(params: any, context: Record<string, any>) {
    const { userId, message, title } = params;
    return { type: 'notify', userId, message, title, success: true };
  }

  private async requestSiscoafAnalysis(params: any, context: Record<string, any>) {
    return { type: 'request_siscoaf_analysis', protocolId: context.protocolId, success: true };
  }

  private async block(params: any, context: Record<string, any>) {
    const { reason, field } = params;
    context._blocked = true;
    context._blockReason = reason;
    return { type: 'block', reason, field, success: true };
  }

  private async warn(params: any, context: Record<string, any>) {
    const { message } = params;
    return { type: 'warn', message, success: true };
  }

  private async setField(params: any, context: Record<string, any>) {
    const { field, value } = params;
    context[`_${field}`] = value;
    return { type: 'set_field', field, value, success: true };
  }

  private async logAction(params: any, context: Record<string, any>) {
    const { message } = params;
    this.logger.log(`Rule action log: ${message}`, context);
    return { type: 'log', message, success: true };
  }
}
