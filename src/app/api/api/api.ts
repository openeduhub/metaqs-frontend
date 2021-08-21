export * from './collections.service';
import { CollectionsService } from './collections.service';
export * from './demo.service';
import { DemoService } from './demo.service';
export * from './healthcheck.service';
import { HealthcheckService } from './healthcheck.service';
export * from './statistics.service';
import { StatisticsService } from './statistics.service';
export const APIS = [CollectionsService, DemoService, HealthcheckService, StatisticsService];
