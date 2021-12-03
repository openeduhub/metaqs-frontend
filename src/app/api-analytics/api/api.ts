export * from './analytics.service';
import { AnalyticsService } from './analytics.service';
export * from './authenticated.service';
import { AuthenticatedService } from './authenticated.service';
export * from './backgroundTasks.service';
import { BackgroundTasksService } from './backgroundTasks.service';
export * from './healthcheck.service';
import { HealthcheckService } from './healthcheck.service';
export const APIS = [AnalyticsService, AuthenticatedService, BackgroundTasksService, HealthcheckService];
