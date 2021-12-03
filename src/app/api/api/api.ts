export * from './collections.service';
import { CollectionsService } from './collections.service';
export * from './healthcheck.service';
import { HealthcheckService } from './healthcheck.service';
export * from './materials.service';
import { MaterialsService } from './materials.service';
export * from './statistics.service';
import { StatisticsService } from './statistics.service';
export const APIS = [CollectionsService, HealthcheckService, MaterialsService, StatisticsService];
