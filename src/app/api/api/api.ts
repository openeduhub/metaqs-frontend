export * from './analytics.service';
import { AnalyticsService } from './analytics.service';
export * from './authenticated.service';
import { AuthenticatedService } from './authenticated.service';
export * from './collections.service';
import { CollectionsService } from './collections.service';
export * from './demo.service';
import { DemoService } from './demo.service';
export * from './healthcheck.service';
import { HealthcheckService } from './healthcheck.service';
export * from './materials.service';
import { MaterialsService } from './materials.service';
export * from './spellcheck.service';
import { SpellcheckService } from './spellcheck.service';
export * from './statistics.service';
import { StatisticsService } from './statistics.service';
export const APIS = [AnalyticsService, AuthenticatedService, CollectionsService, DemoService, HealthcheckService, MaterialsService, SpellcheckService, StatisticsService];
